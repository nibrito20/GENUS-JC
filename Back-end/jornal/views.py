from django.db.models import Q
from django.shortcuts import render, get_object_or_404, redirect
from .models import Noticia, Favoritos, Genero, Profile, Comentarios
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import JsonResponse
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import logout

# --- DRF (para o React) ---
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import NotFound

# Suas outras views
from foguinho.views import atualizar_sequencia_login, registrar_leitura_noticia
from .forms import NoticiaForm
from .serializers import NoticiaSerializer, FavoritosSerializer, UserSerializer, GeneroSerializer



class SemCSRF(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # desabilita CSRF apenas nesta rota

@api_view(["POST"])
@authentication_classes([SemCSRF])
@permission_classes([])
def api_logout(request):
    logout(request)
    return Response({"message": "Logout realizado com sucesso!"})

@api_view(["POST"])
@authentication_classes([SemCSRF])
@permission_classes([])
def api_login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(username=email, password=password)

    if user is None:
        return Response({"error": "Email ou senha incorretos."},
                        status=status.HTTP_400_BAD_REQUEST)

    login(request, user)
    return Response({"message": "Login realizado com sucesso!"})

@api_view(["POST"])
@authentication_classes([SemCSRF])
@permission_classes([])
def api_register(request):
    email = request.data.get("email")
    password = request.data.get("password")
    password2 = request.data.get("password2")

    if password != password2:
        return Response({"error": "As senhas não coincidem."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=email).exists():
        return Response({"error": "Este email já está cadastrado."}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=email, email=email, password=password)
    user.save()

    return Response({"message": "Usuário criado com sucesso!"}, status=status.HTTP_201_CREATED)

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

@api_view(["GET"])
def auth_status(request):
    return Response({"authenticated": request.user.is_authenticated})


# ===== ENDPOINTS API REST PARA REACT =====

@api_view(["GET"])
def api_user(request):
    """Retorna dados do usuário autenticado"""
    if not request.user.is_authenticated:
        return Response({"authenticated": False}, status=status.HTTP_401_UNAUTHORIZED)
    
    serializer = UserSerializer(request.user, context={'request': request})
    return Response({
        "authenticated": True,
        "user": serializer.data
    })


@api_view(["GET"])
def api_noticias(request):
    """Lista todas as notícias com paginação e filtros"""
    query = request.GET.get('q')
    genero = request.GET.get('genero')
    ordenacao = request.GET.get('ordenacao', '-data')
    limite = int(request.GET.get('limite', 20))
    offset = int(request.GET.get('offset', 0))
    
    noticias = Noticia.objects.all()
    
    if query:
        noticias = noticias.filter(
            Q(titulo__icontains=query) |
            Q(resumo__icontains=query) |
            Q(detalhes__icontains=query)
        ).distinct()
    
    if genero:
        noticias = noticias.filter(generos__nome=genero).distinct()
    
    noticias = noticias.order_by(ordenacao)
    total = noticias.count()
    noticias = noticias[offset:offset + limite]
    
    serializer = NoticiaSerializer(noticias, many=True, context={'request': request})
    
    return Response({
        "total": total,
        "offset": offset,
        "limite": limite,
        "noticias": serializer.data
    })


@api_view(["GET"])
def api_noticia_detalhe(request, slug):
    """Retorna uma notícia específica com notícias relacionadas"""
    try:
        noticia = Noticia.objects.get(slug=slug)
    except Noticia.DoesNotExist:
        raise NotFound("Notícia não encontrada")
    
    is_favorito = False
    if request.user.is_authenticated:
        is_favorito = Favoritos.objects.filter(usuario=request.user, noticia=noticia).exists()
        registrar_leitura_noticia(request.user)
    
    generos_da_noticia = noticia.generos.exclude(nome__in=['Brasil', 'Geral'])
    if not generos_da_noticia.exists():
        generos_da_noticia = noticia.generos.all()
    
    noticias_relacionadas = Noticia.objects.filter(
        generos__in=generos_da_noticia
    ).exclude(id=noticia.id).distinct().order_by('-data')[:3]
    
    serializer = NoticiaSerializer(noticia, context={'request': request})
    serializer_relacionadas = NoticiaSerializer(noticias_relacionadas, many=True, context={'request': request})
    
    return Response({
        "noticia": serializer.data,
        "is_favorito": is_favorito,
        "noticias_relacionadas": serializer_relacionadas.data
    })


@api_view(["GET", "POST"])
@authentication_classes([SemCSRF])
@permission_classes([])
def api_favoritos(request):
    """Lista favoritos do usuário (GET) ou adiciona novo favorito (POST)"""
    if not request.user.is_authenticated:
        return Response({"error": "Usuário não autenticado"}, status=status.HTTP_401_UNAUTHORIZED)
    
    if request.method == "GET":
        favoritos = Favoritos.objects.filter(usuario=request.user).order_by('-adicionado')
        serializer = FavoritosSerializer(favoritos, many=True, context={'request': request})
        return Response({"favoritos": serializer.data})
    
    elif request.method == "POST":
        noticia_id = request.data.get('noticia_id')
        
        if not noticia_id:
            return Response({"error": "noticia_id é obrigatório"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            noticia = Noticia.objects.get(id=noticia_id)
        except Noticia.DoesNotExist:
            return Response({"error": "Notícia não encontrada"}, status=status.HTTP_404_NOT_FOUND)
        
        favorito, created = Favoritos.objects.get_or_create(usuario=request.user, noticia=noticia)
        
        if created:
            return Response({"message": "Notícia adicionada aos favoritos", "status": "added"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "Notícia já está nos favoritos"}, status=status.HTTP_200_OK)


@api_view(["DELETE"])
@authentication_classes([SemCSRF])
@permission_classes([])
def api_remover_favorito(request, noticia_id):
    """Remove uma notícia dos favoritos"""
    if not request.user.is_authenticated:
        return Response({"error": "Usuário não autenticado"}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        noticia = Noticia.objects.get(id=noticia_id)
    except Noticia.DoesNotExist:
        return Response({"error": "Notícia não encontrada"}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        favorito = Favoritos.objects.get(usuario=request.user, noticia=noticia)
        favorito.delete()
        return Response({"message": "Removido dos favoritos", "status": "removed"})
    except Favoritos.DoesNotExist:
        return Response({"error": "Notícia não estava nos favoritos"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
def api_generos(request):
    """Lista todos os gêneros"""
    generos = Genero.objects.all().order_by('nome')
    serializer = GeneroSerializer(generos, many=True)
    return Response({"generos": serializer.data})


@api_view(["POST"])
@authentication_classes([SemCSRF])
@permission_classes([])
def api_update_profile_generos(request):
    """Atualiza os gêneros favoritos do usuário autenticado (recebe lista de ids)
    Exemplo de body: { "genero_ids": [1,2,3] }
    """
    if not request.user.is_authenticated:
        return Response({"error": "Usuário não autenticado"}, status=status.HTTP_401_UNAUTHORIZED)

    genero_ids = request.data.get('genero_ids')
    if genero_ids is None:
        return Response({"error": "genero_ids é obrigatório"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        generos = Genero.objects.filter(id__in=genero_ids)
        profile = request.user.profile
        profile.generos_favoritos.set(generos)
        profile.save()
        return Response({"message": "Preferências atualizadas"})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)