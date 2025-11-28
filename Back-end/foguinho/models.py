from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class ArvoreAcesso(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    sequencia_atual = models.IntegerField(default=0)
    ultimo_acesso = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.usuario.username} - {self.sequencia_atual} dias"