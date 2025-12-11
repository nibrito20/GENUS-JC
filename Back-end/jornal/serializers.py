from rest_framework import serializers
from .models import Noticia, Genero, Favoritos, Profile, Comentarios
from django.contrib.auth.models import User


class GeneroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genero
        fields = ['id', 'nome']


class NoticiaSerializer(serializers.ModelSerializer):
    generos = GeneroSerializer(many=True, read_only=True)
    imagem_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Noticia
        fields = ['id', 'titulo', 'resumo', 'detalhes', 'imagem', 'imagem_url', 'data', 'reporter', 'slug', 'generos']
    
    def get_imagem_url(self, obj):
        # Se imagem é uma URL, retorna diretamente
        if obj.imagem:
            return obj.imagem
        return None


class ComentariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentarios
        fields = ['id', 'noticia', 'texto', 'likes', 'data', 'usuario']


class FavoritosSerializer(serializers.ModelSerializer):
    noticia = NoticiaSerializer(read_only=True)
    noticia_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Favoritos
        fields = ['id', 'noticia', 'noticia_id', 'adicionado']


class ProfileSerializer(serializers.ModelSerializer):
    generos_favoritos = GeneroSerializer(many=True, read_only=True)
    foto_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Profile
        fields = ['id', 'foto', 'foto_url', 'generos_favoritos', 'telefone', 'data_nascimento']
    
    def get_foto_url(self, obj):
        request = self.context.get('request')
        if obj.foto:
            url = obj.foto.url
            if request:
                return request.build_absolute_uri(url)
            return url
        return None


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']
