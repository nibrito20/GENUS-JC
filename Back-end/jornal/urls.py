from django.urls import path
from . import views
from foguinho import views as foguinho_views  # Importa as views do app foguinho
from jornal.views import hello_api  # integração com react
from django.urls import path  # integração com react
from .views import auth_status  # integração com react

app_name = 'jornal'

urlpatterns = [
    path("api/user/update/", views.update_user, name="update_user"),

    # --- Auth Views ---
    path("api/login/", views.api_login, name="api_login"),
    path("api/logout/", views.api_logout, name="api_logout"),
    path("api/register/", views.api_register, name="api_register"),
    path("auth-status/", auth_status, name="auth_status"),
    path("api/user/", views.api_user, name="api_user"),

    # --- API REST Views (React) ---
    path("api/noticias/", views.api_noticias, name="api_noticias"),
    path("api/noticias/<slug:slug>/", views.api_noticia_detalhe, name="api_noticia_detalhe"),

    path("api/favoritos/", views.api_favoritos, name="api_favoritos"),
    path("api/favoritos/<int:noticia_id>/remover/", views.api_remover_favorito, name="api_remover_favorito"),
    path("api/generos/", views.api_generos, name="api_generos"),
    path("api/profile/generos/", views.api_update_profile_generos, name="api_update_profile_generos"),

    # --- Páginas HTML (Legacy) ---
    path("api/hello/", hello_api),
    path('noticia/<slug:slug>/', views.pagina_noticias, name='pagina_noticias'),
    path('configuracoes/', views.configuracoes_conta, name='configuracoes_conta'),
    path('register/', views.register, name='register'),
    path("noticia/<slug:slug>/comentario/", views.ComentarioInsert.as_view(), name="inserir_comentario"),

    path('favoritos/', views.ver_favoritos, name='favoritos'),
    path('favorito/toggle/<int:noticia_id>/', views.toggle_favorito, name='toggle_favorito'),

    path('filtrar/', views.filtrar_por_genero, name='filtrar_por_genero'),

    path('adicionar-noticia/', views.add_aos_fav, name="add"),
    path('favoritos/adicionar/<int:noticia_id>/', views.add_aos_fav, name='add_aos_fav'),
    path('favoritos/remover/<int:noticia_id>/', views.remover_dos_favoritos, name='remover_dos_favoritos'),

    path('', views.index, name='index'),

    path('admin-secreto/', views.admin_secreto_lista, name='admin_secreto_lista'),
    path('admin-secreto/criar/', views.admin_secreto_criar, name='admin_secreto_criar'),
    path('admin-secreto/editar/<int:noticia_id>/', views.admin_secreto_editar, name='admin_secreto_editar'),
    path('admin-secreto/apagar/<int:noticia_id>/', views.admin_secreto_apagar, name='admin_secreto_apagar'),
    path('admin-secreto/popular-generos/', views.admin_secreto_popular_generos, name='admin_secreto_popular_generos'),

    path('api/gamificacao/', foguinho_views.gamificacao_api, name='gamificacao_api'),
]
