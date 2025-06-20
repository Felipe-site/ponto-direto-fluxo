import os, io, zipfile
from django.utils.text import slugify
from django.http import FileResponse, Http404, HttpResponse
from django.conf import settings
from django.utils.text import slugify
from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets
from .models import Categoria, Produto, Cupom
from api.serializers import CategoriaSerializer, ProdutoListSerializer, ProdutoDetailSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from pedidos.models import Pedido

def servir_amostra_pdf(request, nome_arquivo):
    caminho = os.path.join(settings.MEDIA_ROOT, 'amostras', nome_arquivo)

    if not os.path.exists(caminho):
        raise Http404('Arquivo não encontrado.')
    
    response = FileResponse(open(caminho, 'rb'), content_type='application/pdf')
    response['Content-Disposition'] = f'inline; filename="{nome_arquivo}"'
    response['X-Frame-Options'] = 'ALLOWALL'
    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def servir_arquivo_completo(request, produto_id):
    produto = get_object_or_404(Produto, pk=produto_id)

    comprou = Pedido.objects.filter(
        usuario=request.user,
        status='pago',
        itens__produto=produto
    ).exists()

    if not comprou:
        if not Pedido.objects.filter(usuario=request.user, status='pago', itens__produto=produto).exists():
            return Response({"erro": "Acesso negado. Você não comprou este material."}, status=403)
    
    if not produto.arquivo_produto:
        raise Http404("Arquivo não encontrado para este produto.")
    
    arquivo = produto.arquivo_produto
    _nome_original, extensao = os.path.splitext(arquivo.name)
    nome_seguro = f"{slugify(produto.titulo)}{extensao}"

    response = HttpResponse(arquivo.read(), content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{nome_seguro}"'

    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def servir_combo_zip(request, produto_id):
    combo = get_object_or_404(Produto, pk=produto_id, is_combo=True)

    comprou = Pedido.objects.filter(
        usuario = request.user,
        status='pago',
        itens__produto=combo
    ).exists()

    if not comprou:
        return Response({"erro": "Acesso negado. Você não comprou este combo."}, status=403)
    
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for produto_incluso in combo.produtos_inclusos.all():
            if produto_incluso.arquivo_produto:
                _nome, extensao = os.path.splitext(produto_incluso.arquivo_produto.name)
                nome_seguro = f"{slugify(produto_incluso.titulo)}{extensao}"
                zip_file.writestr(nome_seguro, produto_incluso.arquivo_produto.read())

    buffer.seek(0)
    nome_zip = f"{slugify(combo.titulo)}.zip"
    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{nome_zip}"'

    return response