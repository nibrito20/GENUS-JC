from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import feedbackModel

@csrf_exempt
def api_feedback(request):
    if request.method == "POST":
        estrelas = request.POST.get("estrelas")
        detalhes = request.POST.get("detalhes")

        if not estrelas or not detalhes:
            return JsonResponse({"success": False, "error": "Campos incompletos."}, status=400)

        # Usuário
        if request.user.is_authenticated:
            user = request.user.username
        else:
            user = "Visitante"

        fb = feedbackModel.objects.create(
            titulo="Feedback do usuário",
            detalhes=detalhes,
            data=timezone.now(),
            user=user,
            estrelas=int(estrelas)
        )

        return JsonResponse({"success": True, "id": fb.id}, status=201)

    return JsonResponse({"error": "Método não permitido"}, status=405)
