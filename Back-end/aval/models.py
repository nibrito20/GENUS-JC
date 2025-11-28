from django.db import models
from django.utils import timezone
import datetime

class feedbackModel(models.Model):
    titulo = models.CharField(max_length=200, null=False)
    detalhes = models.TextField(null=False)
    data = models.DateTimeField("Postado em:")
    user = models.CharField(max_length=200, null=False)
    estrelas = models.IntegerField(default=0, null=False)

    def __str__(self):
        return f"{self.titulo} ({self.detalhes})"

    def strcompleta(self):
        return f"{self.titulo} feito por: {self.user} no dia {self.data}"

    def recente(self):
        return self.data >= timezone.now() - datetime.timedelta(days=1)
    
    def str(self):
        return f"{self.estrelas}"

class SiteFeedback(models.Model):
    nome = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    mensagem = models.TextField()
    data_criacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Feedback do Site"
        verbose_name_plural = "Feedbacks do Site"

    def __str__(self):
        return f"Feedback de {self.nome or 'Anônimo'} em {self.data_criacao.strftime('%d/%m/%Y')}"