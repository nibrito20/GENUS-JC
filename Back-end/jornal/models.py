from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.utils.text import slugify
from django.db.models.signals import post_save
from django.dispatch import receiver

class Genero(models.Model):
    nome = models.CharField(max_length=100, unique=True, verbose_name="Gênero")

    class Meta:
        verbose_name = "Gênero"
        verbose_name_plural = "Gêneros"
        ordering = ['nome']

    def __str__(self):
        return self.nome


class Noticia(models.Model):
    titulo = models.CharField(max_length=200, null=False)
    imagem = models.ImageField(upload_to='noticias/', blank=True, null=True)
    resumo = models.TextField(null=False)
    detalhes = models.TextField(null=False)
    data = models.DateTimeField("Postado em: ", default=timezone.now)
    reporter = models.CharField(max_length=200, null=False)
    
    generos = models.ManyToManyField(
        Genero,
        related_name="noticias",
        verbose_name="Gêneros"
    )
    
    slug = models.SlugField(max_length=200, unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug or self.slug == "":
            original_slug = slugify(self.titulo)
            novo_slug = original_slug
            contador = 1
            
            while Noticia.objects.filter(slug=novo_slug).exclude(id=self.id).exists():
                novo_slug = f'{original_slug}-{contador}'
                contador += 1
            
            self.slug = novo_slug
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.titulo} : [{self.resumo}]"
    
    def strcompleta(self):
        return f"{self.titulo} feito por: {self.reporter} no dia {self.data}"
    
    def recente(self):
        return self.data >= timezone.now() - timezone.timedelta(days=1)
    
    def noticia(self):
        return f"{self.detalhes}"
    

class Comentarios(models.Model):
    noticia = models.ForeignKey(Noticia, on_delete=models.CASCADE)
    texto = models.TextField(null=False)
    likes = models.IntegerField(default=0)
    data = models.DateTimeField("Postado em: ", default=timezone.now)
    usuario = models.CharField(max_length=200, null=False)

    def __str__(self):
        return f"[{self.noticia}] : {self.texto}"

class Favoritos(models.Model): 
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    noticia = models.ForeignKey(Noticia, on_delete=models.CASCADE)
    adicionado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.usuario.username} - {self.noticia.titulo}'

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
   
    foto = models.ImageField(upload_to='perfis/', blank=True, null=True)
    generos_favoritos = models.ManyToManyField(Genero, blank=True, related_name="perfis_favoritos")

    def __str__(self):
        return f'Perfil de {self.user.username}'

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()