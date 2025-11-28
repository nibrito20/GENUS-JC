from django.db.models import Q
from django.shortcuts import render, get_object_or_404, redirect
from .models import Noticia, Favoritos, Genero, Profile
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import JsonResponse
from django.utils import timezone
from datetime import timedelta
from django.http import JsonResponse    #integracao com react

from foguinho.views import atualizar_sequencia_login, registrar_leitura_noticia
from .forms import NoticiaForm

def lista_de_noticias(request):
    noticias = Noticia.objects.all().order_by('-data')
    return render(request, 'index.html', { 'noticias': noticias})

def pagina_noticias(request, slug):
    noticia = get_object_or_404(Noticia, slug=slug)
    
    is_favorito = False
    if request.user.is_authenticated:
        is_favorito = Favoritos.objects.filter(usuario=request.user, noticia=noticia).exists()
        registrar_leitura_noticia(request.user)
        
    generos_da_noticia = noticia.generos.exclude(
        nome__in=['Brasil', 'Geral']
    )
    
    if not generos_da_noticia.exists():
        generos_da_noticia = noticia.generos.all()

    noticias_relacionadas = Noticia.objects.filter(
        generos__in=generos_da_noticia
    ).exclude(
        id=noticia.id
    ).distinct().order_by('-data')[:3]
        
    context = {
        'noticia': noticia,
        'is_favorito': is_favorito,
        'noticias_relacionadas': noticias_relacionadas
    }
    return render(request, 'pagina-noticia.html', context)

def index(request):
    query = request.GET.get('q') 
    
    if query and query == "superuserlegalmentelegal":
        return redirect('jornal:admin_secreto_lista')

    noticias_recomendadas = []
    sequencia_dias = 0

    if request.user.is_authenticated:
        sequencia_dias = atualizar_sequencia_login(request.user)
    
    if query:
        noticias = Noticia.objects.filter(
            Q(titulo__icontains=query) |
            Q(resumo__icontains=query) |
            Q(detalhes__icontains=query)
        ).distinct().order_by('-data')
    else:
        noticias = Noticia.objects.all().order_by('-data')[:8]

    if request.user.is_authenticated and not query:
        try:
            profile = request.user.profile
            generos_favoritos = profile.generos_favoritos.all()

            if generos_favoritos.exists():
                noticias_recomendadas = Noticia.objects.filter(
                    generos__in=generos_favoritos
                ).distinct().order_by('-data')[:8]

        except Profile.DoesNotExist:
            noticias_recomendadas = []
            
    contexto = {
        'noticias': noticias,
        'noticias_recomendadas': noticias_recomendadas,
        'query': query,
        'sequencia_dias': sequencia_dias,
    }
    return render(request, 'index.html', contexto)

@login_required
def ver_favoritos(request):
    favoritos_itens = Favoritos.objects.filter(usuario=request.user).order_by('-adicionado')
    noticias_favoritas = [item.noticia for item in favoritos_itens]
    context = {
        'favoritos': noticias_favoritas
    }
    return render(request, 'favoritos.html', context)

@login_required
def add_aos_fav(request, noticia_id):
    noticia = get_object_or_404(Noticia, pk=noticia_id)
    if not Favoritos.objects.filter(usuario=request.user, noticia=noticia).exists():
        Favoritos.objects.create(usuario=request.user, noticia=noticia)
    return redirect('jornal:index') 

@login_required
def remover_dos_favoritos(request, noticia_id):
    if request.method == 'POST':
        noticia = get_object_or_404(Noticia, id=noticia_id)
        try:
            favoritos_itens = Favoritos.objects.get(usuario=request.user, noticia=noticia)
            favoritos_itens.delete()
        except Favoritos.DoesNotExist:
            pass 
    return redirect('jornal:favoritos')

def register(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')

        if password != password2:
            messages.error(request, 'As senhas não coincidem.')
            return render(request, 'registration/register.html')

        if User.objects.filter(username=email).exists():
            messages.error(request, 'Este email já está cadastrado.')
            return render(request, 'registration/register.html')
        
        user = User.objects.create_user(username=email, email=email, password=password)
        user.save()
        
        login(request, user)
        
        atualizar_sequencia_login(user) 
        
        return redirect('jornal:index')
    
    return render(request, 'registration/register.html')


@login_required
def configuracoes_conta(request):
    profile = request.user.profile
    
    if request.method == 'POST':
        tipo_form = request.POST.get('tipo_form')

        if tipo_form == 'foto':
            if request.POST.get('remover_foto'):
                profile.foto = None
                profile.save()
            elif 'foto' in request.FILES:
                profile.foto = request.FILES['foto']
                profile.save()
        
        elif tipo_form == 'generos':
            generos_selecionados_nomes = request.POST.getlist('genres')
            generos_objs = Genero.objects.filter(nome__in=generos_selecionados_nomes)
            profile.generos_favoritos.set(generos_objs)

        return redirect('jornal:configuracoes_conta')

    all_genres = Genero.objects.all()
    generos_salvos = profile.generos_favoritos.all()
    
    context = {
        'all_genres': all_genres,
        'generos_salvos': generos_salvos
    }
    return render(request, 'configuracoes.html', context)

@login_required
def toggle_favorito(request, noticia_id):
    if request.method == 'POST':
        noticia = get_object_or_404(Noticia, id=noticia_id)
        
        favorito, created = Favoritos.objects.get_or_create(usuario=request.user, noticia=noticia)
        
        if created:
            return JsonResponse({'status': 'added'})
        else:
            favorito.delete()
            return JsonResponse({'status': 'removed'})
    
    return JsonResponse({'status': 'error'}, status=400)

def filtrar_por_genero(request):
    all_genres = Genero.objects.all().order_by('nome')
    selected_genres_names = request.GET.getlist('genres')
    
    noticias_filtradas = []
    titulo_pagina = "Filtrar Notícias por Gênero"
    search_error = None
    form_submitted = 'genres' in request.GET

    if form_submitted:
        if not selected_genres_names:
            search_error = "Por favor, selecione pelo menos 1 gênero."
        elif len(selected_genres_names) > 2:
            search_error = "Você só pode selecionar até 2 gêneros."
        else:
            
            noticias_filtradas = Noticia.objects.all()
            for genre_name in selected_genres_names:
                noticias_filtradas = noticias_filtradas.filter(generos__nome=genre_name)
            
            noticias_filtradas = noticias_filtradas.distinct().order_by('-data')
            
            titulo_pagina = f"Resultados para: {', '.join(selected_genres_names)}"

    context = {
        'all_genres': all_genres,
        'noticias': noticias_filtradas,
        'selected_genres_names': selected_genres_names,
        'titulo_pagina': titulo_pagina,
        'search_error': search_error,
        'form_submitted': form_submitted,
    }
    
    return render(request, 'filtrar_noticias.html', context)

@login_required
def admin_secreto_lista(request):
    noticias = Noticia.objects.all().order_by('-data')
    return render(request, 'admin_secreto_lista.html', {'noticias': noticias})

@login_required
def admin_secreto_criar(request):
    if request.method == 'POST':
        form = NoticiaForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Notícia criada com sucesso!')
            return redirect('jornal:admin_secreto_lista')
    else:
        form = NoticiaForm(initial={'data': timezone.localtime(timezone.now())})
    
    return render(request, 'admin_secreto_form.html', {'form': form, 'tipo': 'Criar'})

@login_required
def admin_secreto_editar(request, noticia_id):
    noticia = get_object_or_404(Noticia, id=noticia_id)
    
    if request.method == 'POST':
        form = NoticiaForm(request.POST, request.FILES, instance=noticia)
        if form.is_valid():
            form.save()
            messages.success(request, 'Notícia atualizada com sucesso!')
            return redirect('jornal:admin_secreto_lista')
    else:
        form = NoticiaForm(instance=noticia)
    
    return render(request, 'admin_secreto_form.html', {'form': form, 'noticia': noticia, 'tipo': 'Editar'})

@login_required
def admin_secreto_apagar(request, noticia_id):
    noticia = get_object_or_404(Noticia, id=noticia_id)
    
    if request.method == 'POST':
        noticia.delete()
        messages.success(request, 'Notícia apagada com sucesso!')
        return redirect('jornal:admin_secreto_lista')
    
    return render(request, 'admin_secreto_apagar_confirm.html', {'noticia': noticia})

@login_required
def admin_secreto_popular_generos(request):
    if request.method == 'POST':
        
        LISTA_GENEROS = [
            "Economia & Negócios",
            "Política",
            "Opinião",
            "Geral",
            "Brasil",
            "Internacional",
            "Esportes",
            "Cultura",
        ]
        
        Genero.objects.filter(nome__in=["a", "b"]).delete()
        
        for nome_genero in LISTA_GENEROS:
            Genero.objects.get_or_create(nome=nome_genero)
        
        messages.success(request, 'Gêneros atualizados! "a" e "b" removidos e os 8 gêneros padrão foram criados.')
    
    return redirect('jornal:admin_secreto_lista')

def hello_api(request):
    return JsonResponse({"mensagem": "Olá do Django!"}) #integracao com react