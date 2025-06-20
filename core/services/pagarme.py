# core/services/pagarme_checkout.py

import requests # type: ignore
from django.conf import settings
import base64

def criar_link_pagamento(pedido, usuario):
    url = "https://sdx-api.pagar.me/core/v5/paymentlinks"
    
    api_key = settings.PAGARME_API_KEY_TEST
    encoded_api_key = base64.b64encode(f"{api_key}:".encode()).decode()
    
    headers = {
        "Authorization": f"Basic {encoded_api_key}",
        "Content-Type": "application/json"
    }

    total_in_cents = int(pedido.total * 100)

    if pedido.desconto > 0 and pedido.cupom:
        itens.append({
            "name": f"Desconto ({pedido.cupom.codigo})",
            "description": "Desconto aplicado",
            "amount": -int(pedido.desconto * 100),
            "default_quantity": 1
        })
    
    itens = [
        {
            "name": item.produto.titulo,
            "description": item.produto.titulo,
            "amount": int(item.produto.preco * 100) - int(pedido.desconto * 100),
            "default_quantity": item.quantidade
        }
        for item in pedido.itens.all()
    ]

    

    # Precisamos do valor total em centavos para o parcelamento

    max_installments = 8
    installments_options = [
        {
         "number": i,
         "total": total_in_cents
        }
        for i in range(1, max_installments + 1)
    ]

    # --- BODY COM TODAS AS REGRAS DE NEGÓCIO PREENCHIDAS ---
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
                    "success_url": "http://localhost:8080/pagamento/sucesso"
                }
            }
        ],
        "customer_settings": {
            "customer": {
                "name": usuario.get_full_name() or usuario.username,
                "email": usuario.email
            }
        }
    }

    print("✅ Iniciando criação do link Pagar.me (Endpoint 'sdx-api')...")
    print(f"🔗 URL: {url}")
    print(f"📦 Body: {body}")

    response = requests.post(url, headers=headers, json=body)
    print("📩 Status Code:", response.status_code)
    print("📩 Response Text:", response.text)
    response_data = response.json()

    if response.ok:
        checkout_url = response_data.get("url")
        codigo = response_data.get("order_code")

        if not checkout_url or not codigo:
            raise Exception("Erro: resposta do Pagar.me não contém 'url' ou 'code'.")
        print(f"🎉 SUCESSO! LINK GERADO! URL DO CHECKOUT: {checkout_url}")
        print(f"Código do link: {codigo}")
        print(f"Body: {body}")

        return {
            "url": checkout_url,
            "code": codigo
        }
    
    else:
        print("❌ ERRO NA CRIAÇÃO DO LINK PAGAR.ME:")
        print(f"STATUS CODE: {response.status_code}")
        print(f"RESPOSTA DO SERVIDOR: {response.text}")
        raise Exception(f"Erro ao criar link: {response.status_code} - {response.text}")