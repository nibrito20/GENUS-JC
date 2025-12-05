from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import deploy_views
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),
    path('webhook/deploy/', deploy_views.deploy_webhook, name='deploy_webhook'),
    path('jornal/', include('jornal.urls')), 
    path('avaliacoes/', include('aval.urls')),
    path('', views.index, name='index'), 
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)