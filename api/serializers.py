
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from produtos.models import Categoria, Produto, DetalhesProduto
from taggit.serializers import (TagListSerializerField, TaggitSerializer)
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.mail import EmailMessage
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.urls import reverse
from .tokens import account_activation_token


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class DetalhesProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalhesProduto
        exclude = ('produto',)

class ProdutoListSerializer(serializers.ModelSerializer, TaggitSerializer):
    categoria_nome = serializers.ReadOnlyField(source='categoria.nome')
    preco_parcelado = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    categoria_slug = serializers.ReadOnlyField(source='categoria.slug')
    tags = TagListSerializerField()

    class Meta:
        model = Produto
        fields = ('id', 'titulo', 'slug', 'descricao', 'descricao_curta', 'preco', 
                  'parcelas', 'preco_parcelado', 'preco_antigo', 'imagem', 'categoria', 
                  'categoria_nome', 'tag', 'categoria_slug', 'tags', 'detalhes')

class ProdutoDetailSerializer(serializers.ModelSerializer, TaggitSerializer):
    categoria_nome = serializers.ReadOnlyField(source='categoria.nome')
    detalhes = DetalhesProdutoSerializer(read_only=True)
    preco_parcelado = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    tags = TagListSerializerField()

    class Meta:
        model = Produto
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este e-mail já está em uso.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        user.is_active = False
        user.save()

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = account_activation_token.make_token(user)
        activation_link = f"http://localhost:8000/api/activate/{uid}/{token}/"

        email_subject = "Ative sua conta no Direto no Ponto"
        email_body = f"Olá {user.username}, \n\nClique no link abaixo para ativar sua conta:\n{activation_link}"

        email = EmailMessage(subject=email_subject, body=email_body, to=[user.email])
        email.send()

        return user
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        login_input = attrs.get("username")
        password = attrs.get("password")

        try:
            user_obj = User.objects.get(email=login_input)
            username = user_obj.username
        except User.DoesNotExist:
            username = login_input

        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError("Usuário ou senha inválidos.")
        
        data = super().validate({"username": username, "password": password})
        return data
