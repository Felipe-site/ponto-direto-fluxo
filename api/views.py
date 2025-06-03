
from rest_framework import viewsets, permissions, status
from produtos.models import Categoria, Produto, Cupom, CupomUsado
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import CategoriaSerializer, ProdutoListSerializer, ProdutoDetailSerializer
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.utils.timezone import now
from .tokens import account_activation_token
from decimal import Decimal

class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class ProdutoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Produto.objects.all()
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'  # Usar slug em vez de ID
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProdutoDetailSerializer
        return ProdutoListSerializer
    
    def get_queryset(self):
        queryset = Produto.objects.all()
        categoria = self.request.query_params.get('categoria', None)
        tag = self.request.query_params.get('tag', None)
        destaque = self.request.query_params.get('destaque', None)
        
        if categoria:
            queryset = queryset.filter(categoria__slug=categoria)
        if tag:
            queryset = queryset.filter(tag=tag)
        if destaque:
            # Converte string 'true' para booleano
            destaque_bool = destaque.lower() == 'true'
            queryset = queryset.filter(destaque=destaque_bool)
            
        return queryset

class RegisterView(generics.CreateAPIView):

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Usuário registrado com sucesso'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk = uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({'message': 'Conta ativada com sucesso!'}, status=status.HTTP_200_OK)
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
    