
from rest_framework import viewsets, permissions, status
from produtos.models import Categoria, Produto, Cupom, CupomUsado
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics, status
from django.contrib.auth.models import User
from .serializers import CategoriaSerializer, ProdutoListSerializer, ProdutoDetailSerializer, RegisterSerializer, CustomTokenObtainPairSerializer, PedidoSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_str, force_bytes
from django.core.mail import EmailMessage
from django.utils.timezone import now
from django.views.decorators.csrf import csrf_exempt
from .tokens import account_activation_token
from decimal import Decimal
import json, requests, os # type: ignore
from django.db.models import Q
from django.conf import settings
from django.http import HttpResponseRedirect
from google.oauth2 import id_token #type: ignore
from google.auth.transport import requests as google_requests #type: ignore
from rest_framework_simplejwt.tokens import RefreshToken
import traceback
from urllib.parse import urlencode
from accounts.models import Profile
from django_filters.rest_framework import CharFilter, FilterSet #type: ignore
from rest_framework import filters

class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    filterset_fields = ['destaque_rodape']

class ProdutoFilter(FilterSet):
    q = CharFilter(method='filtro_geral', label='Busca geral')
    categoria = CharFilter(field_name='categorias__slug', lookup_expr='exact')

    class Meta:
        model = Produto
        fields = ['categoria', 'tipo', 'tag', 'destaque']
    
    def filtro_geral(self, queryset, name, value):
        return queryset.filter(
            Q(titulo__icontains=value) |
            Q(concurso__icontains=value) |
            Q(tags__name__icontains=value) |
            Q(categorias__nome__icontains=value)
        ).distinct()

class ProdutoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Produto.objects.filter(ativo=True).prefetch_related('categorias')
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    filterset_class = ProdutoFilter
    ordering_fields = ['data_criacao', 'preco', 'titulo']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProdutoDetailSerializer
        return ProdutoListSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        recaptcha_token = request.data.get('recaptcha_token')

        if not recaptcha_token:
            return Response({'erro': 'Token do reCAPTCHA ausente.'}, status=status.HTTP_400_BAD_REQUEST)
        
        secret_key = settings.RECAPTCHA_SECRET_KEY

        if not secret_key:
            return Response({'erro': 'A chave secreta do reCAPTCHA não está configurada no servidor.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        recaptcha_response = requests.post(
            'https://www.google.com/recaptcha/api/siteverify',
            data = {
                'secret': secret_key,
                'response': recaptcha_token
            }
        ).json()

        if not recaptcha_response.get('success'):
            print("Erro reCAPTCHA:", recaptcha_response.get("error_codes"))
            return Response({'erro': 'Falha na verificação do reCAPTCHA.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer_data = request.data.copy()
        serializer_data.pop('recaptcha_token', None)

        serializer = self.get_serializer(data=serializer_data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        
        Profile.objects.create(user=user, signup_method='site')

        headers = self.get_success_headers(serializer.data)
        return Response(
            {'message': 'Usuário registrado com sucesso. Verifique seu e-mail para ativar a conta.'},
            status=status.HTTP_201_CREATED,
            headers=headers
        )

class MinhaContaView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'email': user.email,
        })   
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class ActivationAccountView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk = uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            redirect_url = f'http://localhost:8080/auth/callback?access_token={access_token}&refresh_token={refresh_token}'

            return HttpResponseRedirect(redirect_to=redirect_url)
        else:
            return Response({'error': 'Link inválido ou expirado.'}, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['POST'])
@permission_classes([AllowAny])
def verificar_cupom(request):
    codigo = request.data.get('codigo')
    total = Decimal(request.data.get('total', 0))
    user = request.user if request.user.is_authenticated else None

    try:
        cupom = Cupom.objects.get(codigo__iexact=codigo, ativo=True)
        if not cupom.is_valido():
            return Response({"valido": False, "erro": "Cupom expirado."})
        
        if cupom.uso_minimo and total < cupom.uso_minimo:
            return Response({"valido": False, "erro": "Valor mínimo não atingido"})
        
        if cupom.uso_maximo and cupom.total_usos() >= cupom.uso_maximo:
            return Response({"valido": False, "erro": "Cupom esgotado."})
        
        if user and CupomUsado.objects.filter(cupom=cupom, usuario=user).exists():
            return Response({"valido": False, "erro": "Você já usou este cupom."})
        
        if cupom.tipo == 'percentual':
            desconto = (total * cupom.valor/100).quantize(Decimal("0.01"))
        else:
            desconto = min(cupom.valor, total)

        return Response({
            "valido": True,
            "codigo": cupom.codigo,
            "tipo": cupom.tipo,
            "valor": float(cupom.valor),
            "desconto": float(desconto)
        })
    except Cupom.DoesNotExist:
        return Response({"valido": False, "erro": "Cupom inválido."})
    
class CriarPedidoView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = PedidoSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            pedido = serializer.save()
            return Response({'success': True, 'pedido_id': pedido.id}, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)  # ⬅️ Isto vai mostrar o erro no terminal
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def reenviar_confirmacao(request):
    email = request.data.get("email")
    try:
        user = User.objects.get(email=email)
        if user.is_active:
            return Response({"error:" "Conta já está ativa."}, status=400)
        
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = account_activation_token.make_token(user)
        activation_link = f"http://localhost:8000/api/activate/{uid}/{token}/"

        email_subject = "Ative sua conta no Direto no Ponto"
        email_body = f"Olá {user.username}, \n\n Clique no link abaixo para ativar sua conta: \n{activation_link}"

        email = EmailMessage(subject=email_subject, body=email_body, to=[user.email])
        email.send()

        return Response({"message": "E-mail de ativação reenviado com sucesso!"})
    except User.DoesNotExist:
        return Response({"error": "Usuário não encontrado."}, status=404)

"""
@api_view(['GET'])
@permission_classes([AllowAny])
def google_auth_start_view(request):

    auth_params = {
        'client_id': settings.GOOGLE_OAUTH2_CLIENT_ID,
        'redirect_uri': 'http://localhost:8000/api/auth/google/callback/',
        'response_type': 'code',
        'scope': 'openid profile email',
        'access_type': 'offline'
    }
    google_auth_url = 'https://accounts.google.com/o/oauth2/v2/auth?' + urlencode(auth_params)

    return HttpResponseRedirect(google_auth_url)

@api_view(['GET'])
@permission_classes([AllowAny])
def google_auth_callback_view(request):
    
    auth_code = request.GET.get('code')
    if not auth_code:
        return HttpResponseRedirect('http://localhost:8080/login?error=google_auth_failed')
    
    try:
        token_url = "https://oauth2.googleapis.com/token"
        '''
        client_id_debug = settings.GOOGLE_OAUTH2_CLIENT_ID
        client_secret_debug = settings.GOOGLE_OAUTH2_CLIENT_SECRET
        
        print("--- DEBUG GOOGLE AUTH ---")
        print(f"Client ID: {client_id_debug}")
        print(f"Client Secret: {client_secret_debug}... (escondido por segurança)") # Mostra só o início
        print(f"Auth Code: {auth_code}")
        print("-------------------------")
        '''
        data = {
            'code': auth_code,
            'client_id': settings.GOOGLE_OAUTH2_CLIENT_ID,
            'client_secret': settings.GOOGLE_OAUTH2_CLIENT_SECRET,
            'redirect_uri': 'http://localhost:8000/api/auth/google/callback/',
            'grant_type': 'authorization_code'
        }
        response = requests.post(token_url, data=data)
        response.raise_for_status()
        token_data = response.json()

        id_info = id_token.verify_oauth2_token(
            token_data['id_token'], google_requests.Request(), settings.GOOGLE_OAUTH2_CLIENT_ID
        )

        email = id_info.get('email')
        nome = id_info.get('given_name', email.split('@')[0])
        sobrenome = id_info.get('family_name', '')

        try:
            user = User.objects.get(email=email)
            print(f"Usuário encontrado com e-mail {email}. Realizando login.")

            if not user.is_active:
                user.is_active=True
                user.save()
        except User.DoesNotExist:
            print(f"Nenhum usuário encontrado com e-mail {email}. Criando nova conta.")
            user=User.objects.create_user(
                username=email,
                email=email,
                first_name=nome,
                last_name=sobrenome,
                is_active=True
            )

            user.set_unusable_password()
            user.save()
        
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        redirect_url = f'http://localhost:8080/auth/callback?access_token={access_token}&refresh_token={refresh_token}'
        return HttpResponseRedirect(redirect_to=redirect_url)
    
    except Exception as e:
        traceback.print_exc()
        return HttpResponseRedirect('http://localhost:8080/login?error=google_auth_failed')
"""

@api_view(['POST'])
@permission_classes([AllowAny])
def google_login_view(request):
    
    access_token = request.data.get('access_token')
    if not access_token:
        return Response({'error': 'Token de acesso do Google não fornecido.'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user_info_url = 'https://www.googleapis.com/oauth2/v3/userinfo'
        headers = {'Authorization': f'Bearer {access_token}'}
        user_info_response = requests.get(user_info_url, headers=headers)
        user_info_response.raise_for_status()
        id_info = user_info_response.json()

        email = id_info.get('email')
        nome = id_info.get('given_name', '')
        sobrenome = id_info.get('family_name', '')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            user = User.objects.create_user(
                username=email, email=email, first_name=nome, last_name=sobrenome, is_active=True
            )
            user.set_unusable_password()
            user.save()
            Profile.objects.create(user=user, signup_method='google')
            
                    
        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh_token': str(refresh),
            'access_token': str(refresh.access_token),
        })
    
    except Exception as e:
        traceback.print_exc()
        return Response({'error': 'Token do Google inválido ou falha na autenticação.'}, status=status.HTTP_400_BAD_REQUEST)
