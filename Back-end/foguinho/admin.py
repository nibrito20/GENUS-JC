from django.contrib import admin
from .models import ArvoreAcesso

# Registra o model correto do app foguinho
@admin.register(ArvoreAcesso)
class ArvoreAcessoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'sequencia_atual', 'ultimo_acesso')
    list_filter = ('ultimo_acesso',)
    search_fields = ('usuario__username',)