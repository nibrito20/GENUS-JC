from rest_framework import serializers
from .models import SupportTicket

class SupportTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicket
        fields = ['id', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        """
        Associa o usuário autenticado ao ticket de suporte.
        """
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
