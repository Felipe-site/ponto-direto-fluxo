# core/services/pagarme_checkout.py

import requests # type: ignore
from django.conf import settings
import base64
from decouple import config
from decimal import Decimal
from accounts.models import Endereco, Profile

def criar_link_pagamento(pedido, usuario):
    url = config('PAGARME_API_URL')
    
    api_key = settings.PAGARME_API_KEY
    encoded_api_key = base64.b64encode(f"{api_key}:".encode()).decode()
    
    headers = {
        "Authorization": f"Basic {encoded_api_key}",
        "Content-Type": "application/json"
    }

    itens = []

    if pedido.desconto > 0:
        print(f"Aplicando desconto de R$ {pedido.desconto} distribuído entre os itens.")
        desconto_restante = Decimal(pedido.desconto)

        for item in pedido.itens.all():
            preco_item_original = Decimal(item.produto.preco) * item.quantidade
            desconto_neste_item = min(preco_item_original, desconto_restante)
            preco_final_item = preco_item_original - desconto_neste_item

            itens.append({
                "name": item.produto.titulo,
                "description": item.produto.titulo,
                "amount": int(preco_final_item * 100),
                "default_quantity": 1
            })
            desconto_restante -= desconto_neste_item
    
    else:
        print("Nenhum desconto a ser aplicado. Enviando preços cheios.")
        for item in pedido.itens.all():
            itens.append({
                "name": item.produto.titulo,
                "description": item.produto.titulo,
                "amount": int(item.produto.preco * 100 * item.quantidade),
                "default_quantity": 1
            })

    total_in_cents = int(pedido.total * 100)

    soma_itens_calculada = sum(item['amount'] for item in itens)
    if abs(soma_itens_calculada - total_in_cents) > 1:
        print(f"Alerta de arredondamento: Soma dos itens ({soma_itens_calculada}) != Total do pedido ({total_in_cents}). Usando a soma dos itens.")
        total_in_cents = soma_itens_calculada
    
    max_installments = 8
    installments_options = [
        {
         "number": i,
         "total": total_in_cents
        }
        for i in range(1, max_installments + 1)
    ]

    profile = Profile.objects.filter(user=usuario).first()
    endereco_salvo = Endereco.objects.filter(usuario=usuario).first()

    customer_data = {
        "name": usuario.get_full_name() or usuario.username,
        "email": usuario.email
    }

    if profile and profile.telefone:
        if len(profile.telefone) >= 10:
            customer_data['phones'] = {
                "mobile_phone": {
                    "country_code": "55",
                    "area_code": profile.telefone[:2],
                    "number": profile.telefone[2:]
                }
            }
    
    if endereco_salvo:
        customer_data['address'] = {
            "line_1": f"{endereco_salvo.rua}, {endereco_salvo.numero}",
            "line_2": endereco_salvo.complemento or "",
            "zip_code": endereco_salvo.cep.replace('-', ''),
            "city": endereco_salvo.cidade,
            "state": endereco_salvo.estado,
            "country": endereco_salvo.pais
        }

    body = {
        "type": "order",
        "name": f"Pedido #{pedido.id}",
        "payment_settings": {
            "accepted_payment_methods": ["credit_card", "boleto", "pix"],
            
            # --- Regras para Cartão de Crédito ---
            "credit_card_settings": {
                "operation_type": "auth_and_capture",
                "installments": installments_options
            },
            
            # --- Regras para Boleto ---
            "boleto_settings": {
                "due_in": 7 # Vencimento em 7 dias
            },
            
            # --- Regras para PIX ---
            "pix_settings": {
                "expires_in": 3600 # Expira em 1 hora (3600 segundos)
            }
        },
        "cart_settings": {
            "items": itens
        },
        "charges": [
            {
                "amount": total_in_cents,
                "payment_method": "checkout",
                "checkout": {
                    "expires_in": 3600,
                    "billing_address_editable": False,
                    "customer_editable": False,
                    "skip_checkout_success_page": False,
                    "success_url": "https://www.diretonoponto.com.br/pagamento/sucesso"
                }
            }
        ],
        "customer_settings": {
            "customer": customer_data
        }
    }
    """
    print("✅ Iniciando criação do link Pagar.me (Endpoint 'sdx-api')...")
    print(f"🔗 URL: {url}")
    print(f"📦 Body: {body}")
    """
    response = requests.post(url, headers=headers, json=body)
   # print("📩 Status Code:", response.status_code)
   # print("📩 Response Text:", response.text)
    response_data = response.json()

    if response.ok:
        checkout_url = response_data.get("url")
        codigo = response_data.get("order_code")

        if not checkout_url or not codigo:
            raise Exception("Erro: resposta do Pagar.me não contém 'url' ou 'code'.")
       # print(f"🎉 SUCESSO! LINK GERADO! URL DO CHECKOUT: {checkout_url}")
       # print(f"Código do link: {codigo}")
       # print(f"Body: {body}")

        return {
            "url": checkout_url,
            "code": codigo
        }
    
    else:
       # print("❌ ERRO NA CRIAÇÃO DO LINK PAGAR.ME:")
       # print(f"STATUS CODE: {response.status_code}")
       # print(f"RESPOSTA DO SERVIDOR: {response.text}")
        raise Exception(f"Erro ao criar link: {response.status_code} - {response.text}")