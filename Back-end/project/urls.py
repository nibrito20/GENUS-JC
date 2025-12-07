from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import deploy_views
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('webhook/deploy/', deploy_views.deploy_webhook, name='deploy_webhook'),
    path('', include('jornal.urls')), 
    path('avaliacoes/', include('aval.urls')),
    # path('', views.index, name='index'), 
]

# Servir arquivos de mídia em desenvolvimento (quando não usar Cloudinary)
if settings.DEBUG and not hasattr(settings, 'DEFAULT_FILE_STORAGE'):
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)