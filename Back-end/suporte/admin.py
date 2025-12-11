from django.contrib import admin
from .models import SupportTicket

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'description')
    list_filter = ('created_at', 'user')
    search_fields = ('user__username', 'description')
    readonly_fields = ('user', 'created_at', 'description')

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
