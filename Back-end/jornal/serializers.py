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
    nome_usuario = serializers.SerializerMethodField()
    foto_usuario = serializers.SerializerMethodField()
    
    class Meta:
        model = Comentarios
        fields = ['id', 'noticia', 'texto', 'likes', 'data', 'usuario', 'nome_usuario', 'foto_usuario']
    
    def get_nome_usuario(self, obj):
        # Tenta buscar o usuário pelo username
        try:
            user = User.objects.get(username=obj.usuario)
            if user.first_name or user.last_name:
                nome_completo = f"{user.first_name} {user.last_name}".strip()
                return nome_completo if nome_completo else user.username
            return user.username
        except User.DoesNotExist:
            return obj.usuario
    
    def get_foto_usuario(self, obj):
        # Busca a foto do perfil do usuário que comentou
        try:
            user = User.objects.get(username=obj.usuario)
            if hasattr(user, 'profile'):
                profile = user.profile
                # Prioriza foto_url (URL externa)
                if profile.foto_url:
                    return profile.foto_url
                # Se não tiver foto_url, retorna a URL do upload
                request = self.context.get('request')
                if profile.foto:
                    url = profile.foto.url
                    if request:
                        return request.build_absolute_uri(url)
                    return url
        except (User.DoesNotExist, AttributeError):
            pass
        return None


class FavoritosSerializer(serializers.ModelSerializer):
    noticia = NoticiaSerializer(read_only=True)
    noticia_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Favoritos
        fields = ['id', 'noticia', 'noticia_id', 'adicionado']


class ProfileSerializer(serializers.ModelSerializer):
    generos_favoritos = GeneroSerializer(many=True, read_only=True)
    foto_url_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Profile
        fields = ['id', 'nome', 'foto', 'foto_url', 'foto_url_display', 'generos_favoritos', 'telefone', 'data_nascimento']
    
    def get_foto_url_display(self, obj):
        """Retorna a URL da foto para exibição (prioriza foto_url, depois foto upload)"""
        # Prioriza foto_url (URL externa)
        if obj.foto_url:
            return obj.foto_url
        
        # Se não tiver foto_url, retorna a URL do upload
        request = self.context.get('request')
        if obj.foto:
            url = obj.foto.url
            if request:
                return request.build_absolute_uri(url)
            return url
        return None


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    nome = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'nome', 'profile']
    
    def get_nome(self, obj):
        """Retorna o nome do profile ou combina first_name + last_name como fallback"""
        if hasattr(obj, 'profile') and obj.profile.nome:
            return obj.profile.nome
        nome_completo = f"{obj.first_name or ''} {obj.last_name or ''}".strip()
        return nome_completo if nome_completo else None
