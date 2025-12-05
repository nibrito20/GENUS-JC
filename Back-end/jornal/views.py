from django.db.models import Q
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import JsonResponse
from django.utils import timezone
from datetime import timedelta

from rest_framework.decorators import (
    api_view, authentication_classes, permission_classes
)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import NotFound

# Models e Forms
from .models import Noticia, Favoritos, Genero, Profile, Comentarios
from .forms import NoticiaForm
from .serializers import (
    NoticiaSerializer, FavoritosSerializer, UserSerializer, GeneroSerializer
)

# Funções externas
from foguinho.views import atualizar_sequencia_login, registrar_leitura_noticia


# ==========================================================
#   Autenticação sem CSRF (para o React)
# ==========================================================

class SemCSRF(SessionAuthentication):
    def enforce_csrf(self, request):
        return


# ==========================================================
#   LOGIN / LOGOUT / REGISTER API PARA REACT
# ==========================================================

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
        return Response({"error": "As senhas não coincidem."}, status=400)

    if User.objects.filter(username=email).exists():
        return Response({"error": "Este email já está cadastrado."}, status=400)

    user = User.objects.create_user(username=email, email=email, password=password)
    user.save()

    return Response({"message": "Usuário criado com sucesso!"}, status=201)


# ==========================================================
#   PÁGINAS HTML NORMAIS DO DJANGO
# ==========================================================

def lista_de_noticias(request):
    noticias = Noticia.objects.all().order_by('-data')
    return render(request, 'index.html', {'noticias': noticias})


def pagina_noticias(request, slug):
    noticia = get_object_or_404(Noticia, slug=slug)

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

    return render(request, 'pagina-noticia.html', {
        'noticia': noticia,
        'is_favorito': is_favorito,
        'noticias_relacionadas': noticias_relacionadas
    })


def index(request):
    query = request.GET.get('q')
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
            generos_favoritos = request.user.profile.generos_favoritos.all()
            if generos_favoritos.exists():
                noticias_recomendadas = Noticia.objects.filter(
                    generos__in=generos_favoritos
                ).distinct().order_by('-data')[:8]
        except Profile.DoesNotExist:
            pass

    return render(request, 'index.html', {
        'noticias': noticias,
        'noticias_recomendadas': noticias_recomendadas,
        'query': query,
        'sequencia_dias': sequencia_dias,
    })


@login_required
def ver_favoritos(request):
    favs = Favoritos.objects.filter(usuario=request.user).order_by('-adicionado')
    return render(request, 'favoritos.html', {
        'favoritos': [f.noticia for f in favs]
    })


@login_required
def add_aos_fav(request, noticia_id):
    noticia = get_object_or_404(Noticia, pk=noticia_id)
    Favoritos.objects.get_or_create(usuario=request.user, noticia=noticia)
    return redirect('jornal:index')


@login_required
def remover_dos_favoritos(request, noticia_id):
    if request.method == 'POST':
        try:
            Favoritos.objects.get(usuario=request.user, noticia_id=noticia_id).delete()
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
            elif 'foto' in request.FILES:
                profile.foto = request.FILES['foto']
            profile.save()

        elif tipo_form == 'generos':
            generos_nomes = request.POST.getlist('genres')
            generos = Genero.objects.filter(nome__in=generos_nomes)
            profile.generos_favoritos.set(generos)

        return redirect('jornal:configuracoes_conta')

    return render(request, 'configuracoes.html', {
        'all_genres': Genero.objects.all(),
        'generos_salvos': profile.generos_favoritos.all()
    })


# ==========================================================
#   TOGGLE FAVORITO (ESSA É A QUE VOCÊ DISSE QUE SUMIU)
# ==========================================================

@login_required
def toggle_favorito(request, noticia_id):
    if request.method == 'POST':
        noticia = get_object_or_404(Noticia, id=noticia_id)
        favorito, created = Favoritos.objects.get_or_create(usuario=request.user, noticia=noticia)
        if not created:
            favorito.delete()
            return JsonResponse({'status': 'removed'})
        return JsonResponse({'status': 'added'})
    return JsonResponse({'status': 'error'}, status=400)


# ==========================================================
#   FILTRAR POR GÊNERO
# ==========================================================

def filtrar_por_genero(request):
    all_genres = Genero.objects.all().order_by('nome')
    selected = request.GET.getlist('genres')

    form_submitted = 'genres' in request.GET
    search_error = None
    noticias_filtradas = []
    titulo_pagina = "Filtrar Notícias por Gênero"

    if form_submitted:
        if not selected:
            search_error = "Por favor, selecione pelo menos 1 gênero."
        elif len(selected) > 2:
            search_error = "Você só pode selecionar até 2 gêneros."
        else:
            noticias_filtradas = Noticia.objects.all()
            for g in selected:
                noticias_filtradas = noticias_filtradas.filter(generos__nome=g)
            noticias_filtradas = noticias_filtradas.distinct().order_by('-data')
            titulo_pagina = f"Resultados para: {', '.join(selected)}"

    return render(request, 'filtrar_noticias.html', {
        'all_genres': all_genres,
        'noticias': noticias_filtradas,
        'selected_genres_names': selected,
        'titulo_pagina': titulo_pagina,
        'search_error': search_error,
        'form_submitted': form_submitted,
    })


# ==========================================================
#   ADMIN SECRETO
# ==========================================================

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

        for g in LISTA_GENEROS:
            Genero.objects.get_or_create(nome=g)

        messages.success(request, 'Gêneros atualizados!')
    return redirect('jornal:admin_secreto_lista')


# ==========================================================
#   API — USUÁRIO, NOTÍCIAS, FAVORITOS E GÊNEROS
# ==========================================================

def hello_api(request):
    return JsonResponse({"mensagem": "Olá do Django!"})


@api_view(["GET"])
def auth_status(request):
    return Response({"authenticated": request.user.is_authenticated})


@api_view(["GET"])
def api_user(request):
    if not request.user.is_authenticated:
        return Response({"authenticated": False}, status=401)

    serializer = UserSerializer(request.user, context={'request': request})
    return Response({
        "authenticated": True,
        "user": serializer.data
    })


@api_view(["GET"])
def api_noticias(request):
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

    total = noticias.count()
    noticias = noticias.order_by(ordenacao)[offset:offset + limite]

    serializer = NoticiaSerializer(noticias, many=True, context={'request': request})

    return Response({
        "total": total,
        "offset": offset,
        "limite": limite,
        "noticias": serializer.data
    })


@api_view(["GET"])
def api_noticia_detalhe(request, slug):
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

    relacionadas = Noticia.objects.filter(
        generos__in=generos_da_noticia
    ).exclude(id=noticia.id).distinct().order_by('-data')[:3]

    return Response({
        "noticia": NoticiaSerializer(noticia, context={'request': request}).data,
        "is_favorito": is_favorito,
        "noticias_relacionadas": NoticiaSerializer(relacionadas, many=True, context={'request': request}).data
    })


@api_view(["GET", "POST"])
@authentication_classes([SemCSRF])
@permission_classes([])
def api_favoritos(request):
    if not request.user.is_authenticated:
        return Response({"error": "Usuário não autenticado"}, status=401)

    if request.method == "GET":
        favoritos = Favoritos.objects.filter(usuario=request.user).order_by('-adicionado')
        serializer = FavoritosSerializer(favoritos, many=True, context={'request': request})
        return Response({"favoritos": serializer.data})

    noticia_id = request.data.get('noticia_id')
    if not noticia_id:
        return Response({"error": "noticia_id é obrigatório"}, status=400)

    try:
        noticia = Noticia.objects.get(id=noticia_id)
    except Noticia.DoesNotExist:
        return Response({"error": "Notícia não encontrada"}, status=404)

    favorito, created = Favoritos.objects.get_or_create(usuario=request.user, noticia=noticia)
    if created:
        return Response({"message": "Adicionado aos favoritos", "status": "added"}, status=201)
    else:
        return Response({"message": "Já está nos favoritos"}, status=200)


@api_view(["DELETE"])
@authentication_classes([SemCSRF])
@permission_classes([])
def api_remover_favorito(request, noticia_id):
    if not request.user.is_authenticated:
        return Response({"error": "Usuário não autenticado"}, status=401)

    try:
        favorito = Favoritos.objects.get(usuario=request.user, noticia_id=noticia_id)
        favorito.delete()
        return Response({"message": "Removido dos favoritos", "status": "removed"})
    except Favoritos.DoesNotExist:
        return Response({"error": "Notícia não estava nos favoritos"}, status=404)


@api_view(["GET"])
def api_generos(request):
    generos = Genero.objects.all().order_by('nome')
    return Response({"generos": GeneroSerializer(generos, many=True).data})


@api_view(["POST"])
@authentication_classes([SemCSRF])
@permission_classes([])
def api_update_profile_generos(request):
    if not request.user.is_authenticated:
        return Response({"error": "Usuário não autenticado"}, status=401)

    genero_ids = request.data.get('genero_ids')
    if genero_ids is None:
        return Response({"error": "genero_ids é obrigatório"}, status=400)

    try:
        generos = Genero.objects.filter(id__in=genero_ids)
        profile = request.user.profile
        profile.generos_favoritos.set(generos)
        return Response({"message": "Preferências atualizadas"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
@login_required
def update_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método inválido"}, status=400)

    try:
        data = json.loads(request.body.decode())
    except:
        return JsonResponse({"error": "JSON inválido"}, status=400)

    user = request.user

    # Atualizar campos permitidos
    user.username = data.get("username", user.username)
    user.email = data.get("email", user.email)

    # Campos extras — telefone, nascimento (se existirem no model Profile)
    profile = None
    try:
        profile = user.profile
        profile.telefone = data.get("telefone", profile.telefone)
        profile.nascimento = data.get("nascimento", profile.nascimento)
        profile.save()
    except:
        pass  # Se não existir Profile, ignora

    user.save()

    return JsonResponse({
        "message": "Dados atualizados com sucesso!",
        "user": {
            "username": user.username,
            "email": user.email,
        }
    })
