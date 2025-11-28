from django.urls import path
from . import views

app_name = 'aval' 

urlpatterns = [
    path('feedback/', views.feedback_view, name='feedback'),
]