from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse

def index(request):
    try:
        return render(request, 'index.html')
    except Exception as e:
        if settings.DEBUG:
            return HttpResponse(f"Erro ao carregar o frontend (Verifique TEMPLATES e STATIC_ROOT): {e}", status=500)
        return HttpResponse("Erro interno do servidor ao carregar a página.", status=500)