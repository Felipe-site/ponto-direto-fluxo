from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, AreaInteresse, Endereco

class AreaInteresseSerializer(serializers.ModelSerializer):
    class Meta:
        model = AreaInteresse
        fields = ['id', 'nome', 'slug']

class ProfileSerializer(serializers.ModelSerializer):
    areas_interesse = AreaInteresseSerializer(many=True, read_only=True)
    areas_interesse_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=AreaInteresse.objects.all(), source='areas_interesse', write_only=True
    )

    class Meta:
        model = Profile
        fields = ['telefone', 'formacao', 
                  'concurso_desejado', 'aprovacoes', 
                  'bio', 'areas_interesse', 'areas_interesse_ids', 
                  'signup_method']

class UserProfileSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = [
            'username', 'first_name', 
            'last_name', 'email', 
            'profile'
            ]
        
    def validate_username(self, value):
        
        if User.objects.filter(username=value).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError("Este nome de usuário já existe!")
        return value
    
    def update(self, instance, validated_data):

        profile_data = validated_data.pop('profile', {})
        profile = instance.profile

        areas_interesse_data = profile_data.pop('areas_interesse', None)

        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        for attr, value in profile_data.items():
            setattr(profile, attr, value)

        if areas_interesse_data is not None:
            profile.areas_interesse.set(areas_interesse_data)

        profile.telefone = profile_data.get('telefone', profile.telefone)
        profile.formacao = profile_data.get('formacao', profile.formacao)
        profile.concurso_desejado = profile_data.get('concurso_desejado', profile.concurso_desejado)
        profile.aprovacoes = profile_data.get('aprovacoes', profile.aprovacoes)
        profile.bio = profile_data.get('bio', profile.bio)
        profile.save()



        return instance
    
class EnderecoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Endereco
        exclude = ('usuario',)