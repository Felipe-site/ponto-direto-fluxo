from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Pedido, ItemPedido
from produtos.models import Produto, Cupom
from core.services.pagarme import criar_link_pagamento
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from rest_framework.views import APIView
from api.serializers import PedidoSerializer, ProdutoMaterialSerializer
import traceback
from .emails import enviar_email_falha_pagamento, enviar_email_pedido_pago
from decimal import Decimal

from decimal import Decimal
import traceback

@api_view(["POST", "OPTIONS"])
@permission_classes([IsAuthenticated])
def checkout_link(request):
    user = request.user
    data = request.data

    try:
        itens_data = data.get("itens", [])
        subtotal = Decimal(data.get('subtotal', '0.00'))
        desconto = Decimal(data.get('desconto', '0.00'))
        total = Decimal(data.get('total', '0.00'))
        
        cupom_id = data.get("cupom")

        cupom_obj = None
        if cupom_id:
            try:
                cupom_obj = Cupom.objects.get(id=cupom_id)
            except Cupom.DoesNotExist:
                print(f"--- DEBUG ERRO: Cupom com ID {cupom_id} NÃO foi encontrado no banco! ---")
        
        itens = []
        if not itens_data:
            return Response({"erro": "O carrinho não pode estar vazio."}, status=status.HTTP_400_BAD_REQUEST)
            
        for item_data in itens_data:
            produto = Produto.objects.get(id=item_data["produto"])
            item_pedido = ItemPedido.objects.create(
                produto=produto,
                quantidade=item_data["quantidade"]
            )
            itens.append(item_pedido)
        
        pedido = Pedido.objects.create(
            usuario=user,
            subtotal=subtotal,
            desconto=desconto,
            total=total,
            cupom=cupom_obj, 
            status="pendente"
        )
        pedido.itens.set(itens)

        response_pagarme = criar_link_pagamento(pedido, user)

        url_pagamento = response_pagarme.get("url")
        codigo_pagamento = response_pagarme.get("code")

        if not url_pagamento:
            return Response({"erro": "Erro ao gerar URL de pagamento"}, status=500)

        pedido.codigo = codigo_pagamento
        pedido.save()

        return Response({ "url": url_pagamento, "pedido_id": pedido.id }, status=200)
    
    except Exception as e:
        traceback.print_exc()
        return Response({"erro": str(e)}, status=500)
    
@csrf_exempt
def pagarme_webhook(request):
    if request.method != 'POST':
        return JsonResponse({'message': 'Método não permitido'}, status=405)

    try:
        payload = json.loads(request.body)
        print('Webhook recebido:', json.dumps(payload, indent=2))
        event_type = payload.get('type')
        data = payload.get('data', {})

        pedido_code = None
        if event_type.startswith('order.'):
            pedido_code = data.get('code')
        elif event_type.startswith('charge.'):
            if 'order' in data and data['order']:
                pedido_code = data['order'].get('code')

        if not pedido_code:
            return JsonResponse({"error": "Código não encontrado."}, status=400)
            
        try:
            pedido = Pedido.objects.get(codigo=pedido_code)
        except Pedido.DoesNotExist:
            return JsonResponse({'error': f'Pedido com código {pedido_code} não encontrado'}, status=404)
        
        if evento_ja_processado(pedido, event_type):
            return JsonResponse({'status': f'Evento {event_type} para o pedido {pedido.id} já processado'}, status=200)
        
        novo_status = None
        if event_type == 'order.paid':
            novo_status = 'pago'
            print(f"Pedido {pedido.id} PAGO.")
        elif event_type == 'order.payment_failed':
            novo_status = 'falhou'
            print(f"Pedido {pedido.id} FALHOU.")

        elif event_type == 'order.canceled':
            novo_status = 'cancelado'
            print(f"Pedido {pedido.id} CANCELADO.")
            
        elif event_type == 'charge.refunded':
            novo_status = 'reembolso'
            print(f"Pedido {pedido.id} REEMBOLSADO.")

        if novo_status:
            pedido.status = novo_status
            pedido.save()
            print(f"Pedido {pedido.id} atualizado para {pedido.status.upper()}.")

            if pedido.status == 'pago':
                enviar_email_pedido_pago(pedido)
            elif pedido.status == 'falhou':
                enviar_email_falha_pagamento(pedido)
            
        else:
            print(f"Webhook '{event_type}' recebido, nenhuma ação configurada.")

        return JsonResponse({'status': 'Webhook processado com sucesso.'}, status=200)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Payload JSON inválido.'}, status=400)        
    except Exception as e:
        import traceback
        print("Erro interno: ")
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)
    
def evento_ja_processado(pedido, event_type):
    if (event_type == 'order.paid' and pedido.status == 'pago') or \
       (event_type == 'order.payment_failed' and pedido.status == 'falhou') or \
       (event_type == 'order.canceled' and pedido.status == 'cancelado') or \
       (event_type == 'charge.refunded' and pedido.status == 'reembolso'):
        print(f"Ignorando evento duplicado '{event_type}' para o pedido {pedido.id}.")
        return True
    return False
        
class MeusMateriaisView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pedidos_pagos = Pedido.objects.filter(usuario=request.user, status='pago')

        produtos_comprados = set()
        for pedido in pedidos_pagos:
            for item in pedido.itens.all():
                produto = item.produto
                produtos_comprados.add(produto)

                if produto.is_combo:
                    for produto_incluso in produto.produtos_inclusos.all():
                        produtos_comprados.add(produto_incluso)

        serializer = ProdutoMaterialSerializer(list(produtos_comprados), many=True, context={'request': request})

        return Response(serializer.data)

class VerificarStatusPedidoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pedido_id):
        try:
            pedido = Pedido.objects.get(id=pedido_id, usuario=request.user)
            return Response({'status': pedido.status})
        except Pedido.DoesNotExist:
            return Response({'erro': 'Pedido não encontrado ou não pertence a este usuário.'}, status=status.HTTP_404_NOT_FOUND)