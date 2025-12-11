from django.urls import path
from . import views

app_name = 'suporte'

urlpatterns = [
    path('submit/', views.submit_support_ticket, name='submit_support_ticket'),
]
