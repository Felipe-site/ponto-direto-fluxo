
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (CategoriaViewSet, ProdutoViewSet, RegisterView, 
                    MinhaContaView, CustomTokenObtainPairView, ActivationAccountView,
                    verificar_cupom, CriarPedidoView, reenviar_confirmacao)
from aprovados.views import AprovadoViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet)
router.register(r'produtos', ProdutoViewSet)
router.register(r'aprovados', AprovadoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', MinhaContaView.as_view(), name='me'),
    path('activate/<uidb64>/<token>/', ActivationAccountView.as_view(), name='account_activate'),
    path('verificar-cupom/', verificar_cupom, name='verificar_cupom'),
    path('pedidos/', CriarPedidoView.as_view(), name='criar-pedido'),
    path('reenviar-confirmacao/', reenviar_confirmacao),
]
