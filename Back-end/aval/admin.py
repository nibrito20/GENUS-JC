from django.contrib import admin
from .models import SiteFeedback, feedbackModel 

@admin.register(SiteFeedback)
class SiteFeedbackAdmin(admin.ModelAdmin):
    list_display = ('nome', 'data_criacao', 'email') 
    list_filter = ('data_criacao',) 
    search_fields = ('nome', 'email', 'mensagem') 
    readonly_fields = ('nome', 'email', 'mensagem', 'data_criacao') 

@admin.register(feedbackModel)
class FeedbackModelAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'user', 'data', 'estrelas')
    list_filter = ('data', 'estrelas')
    search_fields = ('titulo', 'user', 'detalhes')