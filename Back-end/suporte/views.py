from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import SupportTicket
from .serializers import SupportTicketSerializer
from jornal.views import SemCSRF

@api_view(['POST'])
@authentication_classes([SemCSRF])
@permission_classes([IsAuthenticated])
def submit_support_ticket(request):
    """
    Cria um novo ticket de suporte para o usuário autenticado.
    """
    serializer = SupportTicketSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
