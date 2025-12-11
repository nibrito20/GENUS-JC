# jornal/views.py (corrigido / pronto para deploy)
from django.db.models import Q
from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, Http404, JsonResponse
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.utils import timezone
from datetime import timedelta
from django.views import View
from django.urls import reverse
from django.utils.text import slugify
from django.template import TemplateDoesNotExist

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
    NoticiaSerializer, FavoritosSerializer, UserSerializer, GeneroSerializer, ComentariosSerializer
)

# Funções externas
from foguinho.views import atualizar_sequencia_login, registrar_leitura_noticia


# ==========================================================
#   Autenticação sem CSRF (para o React)
# ==========================================================
class SemCSRF(SessionAuthentication):
    def enforce_csrf(self, request):
        # desativa verificação CSRF para endpoints que usam Session auth via fetch do React
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

    if not email or not password:
        return Response({"error": "Email e senha são obrigatórios."},
                        status=status.HTTP_400_BAD_REQUEST)

    # Buscar usuário pelo email
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "Email ou senha incorretos."},
                        status=status.HTTP_400_BAD_REQUEST)
    except User.MultipleObjectsReturned:
        # Se houver múltiplos usuários com o mesmo email, pegar o primeiro
        user = User.objects.filter(email=email).first()

    # Autenticar usando o username do usuário encontrado
    user = authenticate(username=user.username, password=password)

    if user is None:
        return Response({"error": "Email ou senha incorretos."},
                        status=status.HTTP_400_BAD_REQUEST)

    login(request, user)
    # ao logar com session auth, o cookie de sessão será enviado automaticamente
    return Response({"message": "Login realizado com sucesso!"})


@api_view(["POST"])
@authentication_classes([SemCSRF])
@permission_classes([])
def api_register(request):
    nome = request.data.get("nome")
    email = request.data.get("email")
    data_nascimento = request.data.get("data_nascimento")
    telefone = request.data.get("telefone")
    password = request.data.get("password")
    password2 = request.data.get("password2")

    # Validações
    if not nome or not email or not password:
        return Response({"error": "Nome, email e senha são obrigatórios."}, status=400)

    if password != password2:
        return Response({"error": "As senhas não coincidem."}, status=400)

    if User.objects.filter(username=email).exists() or User.objects.filter(email=email).exists():
        return Response({"error": "Este email já está cadastrado."}, status=400)

    # Criar usuário
    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=nome.split()[0] if nome else "",
        last_name=" ".join(nome.split()[1:]) if nome and len(nome.split()) > 1 else ""
    )
    user.save()

    # Atualizar perfil com dados adicionais
    try:
        profile = user.profile
        if data_nascimento:
            from datetime import datetime
            try:
                profile.data_nascimento = datetime.strptime(data_nascimento, "%Y-%m-%d").date()
            except ValueError:
                pass  # Ignora se formato inválido
        if telefone:
            profile.telefone = telefone
        profile.save()
    except Profile.DoesNotExist:
        pass

    # Fazer login automático após registro (importante para Safari/iOS)
    login(request, user)

    return Response({"message": "Usuário criado com sucesso!"}, status=201)


# ==========================================================
#   PÁGINAS HTML (legacy) — com fallback JSON para deploy API-only
# ==========================================================
def lista_de_noticias(request):
    noticias = Noticia.objects.all().order_by('-data')
    try:
        return render(request, 'index.html', {'noticias': noticias})
    except TemplateDoesNotExist:
        # fallback JSON quando template não existe (deploy API-only)
        serializer = NoticiaSerializer(noticias, many=True, context={'request': request})
        return JsonResponse({"noticias": serializer.data}, safe=False)


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

    try:
        return render(request, 'pagina-noticia.html', {
            'noticia': noticia,
            'is_favorito': is_favorito,
            'noticias_relacionadas': noticias_relacionadas
        })
    except TemplateDoesNotExist:
        # fallback JSON
        noticia_ser = NoticiaSerializer(noticia, context={'request': request}).data
        relacionadas_ser = NoticiaSerializer(noticias_relacionadas, many=True, context={'request': request}).data
        return JsonResponse({
            "noticia": noticia_ser,
            "is_favorito": is_favorito,
            "noticias_relacionadas": relacionadas_ser
        })


def index(request):
    query = request.GET.get('q')
    noticias_recomendadas = []
    sequencia_dias = 0

    if request.user.is_authenticated:
        try:
            sequencia_dias = atualizar_sequencia_login(request.user)
        except Exception:
            # proteger caso a função externa falhe
            sequencia_dias = 0

    if query:
        noticias = Noticia.objects.filter(
            Q(titulo__icontains=query) |
            Q(resumo__icontains=query) |
            Q(detalhes__icontains=query) |
            Q(reporter_icontains=query)
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

    try:
        return render(request, 'index.html', {
            'noticias': noticias,
            'noticias_recomendadas': noticias_recomendadas,
            'query': query,
            'sequencia_dias': sequencia_dias,
        })
    except TemplateDoesNotExist:
        # fallback JSON quando template não existe (útil para front React separado)
        serializer = NoticiaSerializer(noticias, many=True, context={'request': request})
        recom_serializer = NoticiaSerializer(noticias_recomendadas, many=True, context={'request': request})
        return JsonResponse({
            "noticias": serializer.data,
            "noticias_recomendadas": recom_serializer.data,
            "query": query,
            "sequencia_dias": sequencia_dias
        }, safe=False)


# ==========================================================
# Páginas protegidas (favoritos, add, remove)
# ==========================================================
@login_required
def ver_favoritos(request):
    favs = Favoritos.objects.filter(usuario=request.user).order_by('-adicionado')
    try:
        return render(request, 'favoritos.html', {
            'favoritos': [f.noticia for f in favs]
        })
    except TemplateDoesNotExist:
        serializer = FavoritosSerializer(favs, many=True, context={'request': request})
        return JsonResponse({"favoritos": serializer.data})


@login_required
def add_aos_fav(request, noticia_id):
    noticia = get_object_or_404(Noticia, pk=noticia_id)
    Favoritos.objects.get_or_create(usuario=request.user, noticia=noticia)
    # para chamadas API, preferimos resposta simples
    if request.is_ajax() or request.headers.get('Accept') == 'application/json':
        return JsonResponse({"message": "Adicionado aos favoritos"})
    return redirect('jornal:index')


@login_required
def remover_dos_favoritos(request, noticia_id):
    if request.method == 'POST':
        try:
            Favoritos.objects.get(usuario=request.user, noticia_id=noticia_id).delete()
        except Favoritos.DoesNotExist:
            pass
    return redirect('jornal:favoritos')


# ==========================================================
# Comentários (class view)
# ==========================================================
@method_decorator(login_required, name='dispatch')
class ComentarioInsert(View):
    def get(self, request, slug):
        noticia = get_object_or_404(Noticia, slug=slug)
        contexto = {'noticia': noticia}
        try:
            return render(request, 'jornal/comentario.html', contexto)
        except TemplateDoesNotExist:
            return JsonResponse({"error": "Template de comentário não encontrado", "noticia": noticia.id})

    def post(self, request, slug):
        noticia = get_object_or_404(Noticia, slug=slug)

        usuario = request.user.username if request.user.is_authenticated else 'anonimo'
        texto = request.POST.get('texto')

        if not texto:
            return redirect('inserir_comentario', slug=noticia.slug)

        noticia.comentarios_set.create(texto=texto, usuario=usuario)
        return redirect('detalhe_noticia', slug=noticia.slug)


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
        try:
            atualizar_sequencia_login(user)
        except Exception:
            pass
        return redirect('jornal:index')

    try:
        return render(request, 'registration/register.html')
    except TemplateDoesNotExist:
        return JsonResponse({"error": "Template de registro não encontrado"})


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

    try:
        return render(request, 'configuracoes.html', {
            'all_genres': Genero.objects.all(),
            'generos_salvos': profile.generos_favoritos.all()
        })
    except TemplateDoesNotExist:
        # fallback JSON
        generos = GeneroSerializer(Genero.objects.all(), many=True).data
        generos_salvos = GeneroSerializer(profile.generos_favoritos.all(), many=True).data
        return JsonResponse({
            "all_genres": generos,
            "generos_salvos": generos_salvos
        })


# ==========================================================
#   TOGGLE FAVORITO (web legacy)
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

    try:
        return render(request, 'filtrar_noticias.html', {
            'all_genres': all_genres,
            'noticias': noticias_filtradas,
            'selected_genres_names': selected,
            'titulo_pagina': titulo_pagina,
            'search_error': search_error,
            'form_submitted': form_submitted,
        })
    except TemplateDoesNotExist:
        serializer = NoticiaSerializer(noticias_filtradas, many=True, context={'request': request})
        return JsonResponse({
            "all_genres": [g.nome for g in all_genres],
            "noticias": serializer.data,
            "selected_genres_names": selected,
            "titulo_pagina": titulo_pagina,
            "search_error": search_error,
            "form_submitted": form_submitted,
        })


# ==========================================================
#   ADMIN SECRETO (legacy)
# ==========================================================
@login_required
def admin_secreto_lista(request):
    noticias = Noticia.objects.all().order_by('-data')
    try:
        return render(request, 'admin_secreto_lista.html', {'noticias': noticias})
    except TemplateDoesNotExist:
        serializer = NoticiaSerializer(noticias, many=True, context={'request': request})
        return JsonResponse({"noticias": serializer.data})


@login_required
def admin_secreto_criar(request):
    if request.method == 'POST':
        form = NoticiaForm(request.POST)  # Removido request.FILES - agora usa URL
        if form.is_valid():
            form.save()
            messages.success(request, 'Notícia criada com sucesso!')
            return redirect('jornal:admin_secreto_lista')
    else:
        form = NoticiaForm(initial={'data': timezone.localtime(timezone.now())})

    try:
        return render(request, 'admin_secreto_form.html', {'form': form, 'tipo': 'Criar'})
    except TemplateDoesNotExist:
        return JsonResponse({"error": "Template admin_secreto_form não encontrado"})


@login_required
def admin_secreto_editar(request, noticia_id):
    noticia = get_object_or_404(Noticia, id=noticia_id)
    if request.method == 'POST':
        form = NoticiaForm(request.POST, instance=noticia)  # Removido request.FILES - agora usa URL
        if form.is_valid():
            form.save()
            messages.success(request, 'Notícia atualizada com sucesso!')
            return redirect('jornal:admin_secreto_lista')
    else:
        form = NoticiaForm(instance=noticia)
    try:
        return render(request, 'admin_secreto_form.html', {'form': form, 'noticia': noticia, 'tipo': 'Editar'})
    except TemplateDoesNotExist:
        return JsonResponse({"error": "Template admin_secreto_form não encontrado"})


@login_required
def admin_secreto_apagar(request, noticia_id):
    noticia = get_object_or_404(Noticia, id=noticia_id)
    if request.method == 'POST':
        noticia.delete()
        messages.success(request, 'Notícia apagada com sucesso!')
        return redirect('jornal:admin_secreto_lista')
    try:
        return render(request, 'admin_secreto_apagar_confirm.html', {'noticia': noticia})
    except TemplateDoesNotExist:
        return JsonResponse({"error": "Template admin_secreto_apagar_confirm não encontrado"})


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
    reporter = request.GET.get('reporter')
    ordenacao = request.GET.get('ordenacao', '-data')
    limite = int(request.GET.get('limite', 20))
    offset = int(request.GET.get('offset', 0))

    noticias = Noticia.objects.all()

    if query:
        noticias = noticias.filter(
            Q(titulo__icontains=query) |
            Q(resumo__icontains=query) |
            Q(detalhes__icontains=query) |
            Q(reporter__icontains=query)
        ).distinct()

    if genero:
        noticias = noticias.filter(generos__nome=genero).distinct()

    if reporter:
        noticias = noticias.filter(reporter__icontains=reporter).distinct()

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
        try:
            registrar_leitura_noticia(request.user)
        except Exception:
            pass

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
    generos_data = GeneroSerializer(generos, many=True).data
    
    # Se usuário estiver autenticado, marcar quais gêneros estão selecionados
    if request.user.is_authenticated:
        try:
            generos_favoritos_ids = set(
                request.user.profile.generos_favoritos.values_list('id', flat=True)
            )
            for genero in generos_data:
                genero['selected'] = genero['id'] in generos_favoritos_ids
        except Profile.DoesNotExist:
            for genero in generos_data:
                genero['selected'] = False
    else:
        # Se não estiver autenticado, nenhum está selecionado
        for genero in generos_data:
            genero['selected'] = False
    
    return Response({"generos": generos_data})


# =========================
# COMENTÁRIOS API
# =========================

@api_view(["GET"])
def api_comentarios_noticia(request, slug):
    """Lista todos os comentários de uma notícia"""
    try:
        noticia = Noticia.objects.get(slug=slug)
    except Noticia.DoesNotExist:
        raise NotFound("Notícia não encontrada")
    
    comentarios = Comentarios.objects.filter(noticia=noticia).order_by('-data')
    serializer = ComentariosSerializer(comentarios, many=True, context={'request': request})
    return Response({"comentarios": serializer.data})


@api_view(["POST"])
@authentication_classes([SemCSRF])
@permission_classes([])
def api_criar_comentario(request, slug):
    """Cria um novo comentário em uma notícia"""
    if not request.user.is_authenticated:
        return Response({"error": "Usuário não autenticado"}, status=401)
    
    try:
        noticia = Noticia.objects.get(slug=slug)
    except Noticia.DoesNotExist:
        raise NotFound("Notícia não encontrada")
    
    texto = request.data.get('texto')
    if not texto or not texto.strip():
        return Response({"error": "O texto do comentário é obrigatório"}, status=400)
    
    # Criar comentário com o username do usuário autenticado
    comentario = Comentarios.objects.create(
        noticia=noticia,
        texto=texto.strip(),
        usuario=request.user.username
    )
    
    serializer = ComentariosSerializer(comentario, context={'request': request})
    return Response(serializer.data, status=201)


@api_view(["POST"])
@authentication_classes([SemCSRF])
@permission_classes([])
def api_curtir_comentario(request, comentario_id):
    """Curtir/descurtir um comentário"""
    if not request.user.is_authenticated:
        return Response({"error": "Usuário não autenticado"}, status=401)
    
    try:
        comentario = Comentarios.objects.get(id=comentario_id)
    except Comentarios.DoesNotExist:
        raise NotFound("Comentário não encontrado")
    
    # Incrementa likes (implementação simples - pode ser melhorada com modelo de likes)
    comentario.likes += 1
    comentario.save()
    
    serializer = ComentariosSerializer(comentario, context={'request': request})
    return Response(serializer.data)


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


# Update user (legacy)
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import update_session_auth_hash

@csrf_exempt
@login_required
def update_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método inválido"}, status=400)

    try:
        data = json.loads(request.body.decode())
    except Exception as e:
        return JsonResponse({"error": f"JSON inválido: {str(e)}"}, status=400)

    user = request.user

    try:
        # Atualizar campos permitidos: username, email, first_name e last_name
        if "username" in data:
            user.username = data["username"]
        if "email" in data:
            user.email = data["email"]
        if "first_name" in data:
            user.first_name = data["first_name"]
        if "last_name" in data:
            user.last_name = data["last_name"]

        # Atualizar senha se fornecida
        if "password" in data and data["password"]:
            if len(data["password"]) < 8:
                return JsonResponse({"error": "A senha deve ter pelo menos 8 caracteres."}, status=400)
            user.set_password(data["password"])
            # Manter sessão ativa após alterar senha
            update_session_auth_hash(request, user)

        # NÃO permitir alterar telefone e data_nascimento (permanecem inalterados)
        # Esses campos só podem ser definidos no registro
        
        # Atualizar foto_url do perfil se fornecida
        if "foto_url" in data:
            try:
                profile = user.profile
            except Profile.DoesNotExist:
                profile = Profile.objects.create(user=user)
            
            # Tratar foto_url: se for string vazia, definir como None
            foto_url_value = data["foto_url"]
            if foto_url_value and isinstance(foto_url_value, str) and foto_url_value.strip():
                foto_url_clean = foto_url_value.strip()
                # Validar se é uma URL válida (básico - deve começar com http:// ou https://)
                if foto_url_clean.startswith(('http://', 'https://')):
                    # Verificar se a URL não excede o limite do campo
                    if len(foto_url_clean) > 2000:
                        return JsonResponse({"error": "A URL da foto é muito longa (máximo 2000 caracteres)"}, status=400)
                    try:
                        profile.foto_url = foto_url_clean
                        profile.save()
                    except Exception as e:
                        # Se houver erro de validação do Django, retornar mensagem mais clara
                        return JsonResponse({"error": f"URL inválida: {str(e)}"}, status=400)
                else:
                    return JsonResponse({"error": "A URL da foto deve começar com http:// ou https://"}, status=400)
            else:
                profile.foto_url = None
                profile.save()

        user.save()

        return JsonResponse({
            "message": "Dados atualizados com sucesso!",
            "user": {
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
        })
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"Erro ao atualizar usuário: {str(e)}")
        print(f"Traceback: {error_trace}")
        return JsonResponse({"error": f"Erro ao atualizar dados: {str(e)}"}, status=500)

from rest_framework.decorators import api_view
from rest_framework.response import Response
