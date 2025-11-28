from django import forms
from .models import SiteFeedback  

class SiteFeedbackForm(forms.ModelForm):
    class Meta:
        model = SiteFeedback
        fields = ['nome', 'email', 'mensagem']
        widgets = {
            'mensagem': forms.Textarea(attrs={'rows': 5, 'placeholder': 'Deixe seu feedback, sugestão ou relate um erro...'}),
        }
        labels = {
            'nome': 'Seu Nome (opcional)',
            'email': 'Seu Email (opcional)',
            'mensagem': 'Sua Mensagem'
        }