from django.core.mail import send_mail
from django.conf import settings

def enviar_email_pedido_pago(pedido):
    nomes_produtos = ", ".join([item.produto.titulo for item in pedido.itens.all()])

    assunto = f"✅ Seu pedido foi aprovado! - Direto no Ponto"
    mensagem = f"""

Olá, {pedido.usuario.username}!

Boas notícias! O pagamento do seu pedido #{pedido.id} foi confirmado com sucesso.

Produtos(s) adquiridos(s): {nomes_produtos}

Você já pode acessar seus materiais completos na sua área de alunos em nosso site.

Acesse agora: https://ponto-direto-fluxo.vercel.app/area-do-aluno

Bons estudos!

Atenciosamente,
Equipe Direto no Ponto
"""
    remetente = settings.DEFAULT_FROM_EMAIL
    destinatario = [pedido.usuario.username]

    try:
        send_mail(assunto, mensagem, remetente, destinatario, fail_silently=False)
        print(f"E-mail de SUCESSO (pedido pago) SIMULADO para {pedido.usuario.email}")
    except Exception as e:
        print(f"Erro ao tentar enviar e-mail de sucesso: {e}")

def enviar_email_falha_pagamento(pedido):

    assunto = f"❌ Problema no pagamento do seu pedido #{pedido.id}"
    mensagem = f"""

Olá, {pedido.usuario.username}.

Houve um problema ao processar o pagamento para o seu pedido #{pedido.id}.

Isso pode ter acontecido por falta de limite, dados incorretos ou uma recusa do banco emissor.
Não se preocupe, nenhum valor foi cobrado.

Você pode tentar realizar a compra novamente a qualquer momento.

Se precisar de ajuda, estamos à disposição.

Atenciosamente,
Equipe Direto no Ponto
"""
    remetente = settings.DEFAULT_FROM_EMAIL
    destinatario = [pedido.usuario.email]

    try:
        send_mail(assunto, mensagem, remetente, destinatario, fail_silently=False)
        print(f"E-mail de FALHA no pagamento SIMULADO para {pedido.usuario.email}")
    except Exception as e:
        print(f"Erro ao tentar enviar e-mail de falha: {e}")