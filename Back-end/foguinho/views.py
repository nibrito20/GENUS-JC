from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from datetime import timedelta
from .models import ArvoreAcesso

def atualizar_sequencia_login(usuario):
    if not usuario.is_authenticated:
        return 0
        
    arvore, _ = ArvoreAcesso.objects.get_or_create(usuario=usuario)
    hoje = timezone.now().date()
    ontem = hoje - timedelta(days=1)

    if arvore.ultimo_acesso not in [ontem, hoje]:
        arvore.sequencia_atual = 0
        arvore.save()
    
    return arvore.sequencia_atual

def registrar_leitura_noticia(usuario):
    if not usuario.is_authenticated:
        return

    hoje = timezone.now().date()
    arvore, created = ArvoreAcesso.objects.get_or_create(usuario=usuario)

    if arvore.ultimo_acesso == hoje:
        pass
    elif arvore.ultimo_acesso == hoje - timedelta(days=1):
        arvore.sequencia_atual += 1
    else:
        arvore.sequencia_atual = 1

    arvore.ultimo_acesso = hoje
    arvore.save()

@login_required
def gamificacao(request):
    sequencia = atualizar_sequencia_login(request.user)
    
    meta_nivel = 7
    dias_restantes = meta_nivel - (sequencia % meta_nivel)

    if dias_restantes == 7 and sequencia > 0:
        dias_restantes = 0

    context = {
        'sequencia': sequencia,
        'dias_restantes': dias_restantes,
    }
    return render(request, 'gamificacao.html', context)