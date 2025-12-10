from django.urls import path
from .views import api_feedback

urlpatterns = [
    path("api/feedback/", api_feedback, name="api_feedback"),
]