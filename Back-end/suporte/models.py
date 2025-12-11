from django.db import models
from django.contrib.auth.models import User

class SupportTicket(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Usuário")
    description = models.TextField(verbose_name="Descrição do Problema")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Data de Envio")

    def __str__(self):
        return f"Ticket de {self.user.username} - {self.created_at.strftime('%d/%m/%Y %H:%M')}"

    class Meta:
        verbose_name = "Ticket de Suporte"
        verbose_name_plural = "Tickets de Suporte"
        ordering = ['-created_at']
