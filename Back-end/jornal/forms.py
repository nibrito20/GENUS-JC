from django import forms
from .models import Noticia, Genero

class NoticiaForm(forms.ModelForm):
    generos = forms.ModelMultipleChoiceField(
        queryset=Genero.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=True
    )

    class Meta:
        model = Noticia
        fields = ['titulo', 'imagem', 'resumo', 'detalhes', 'data', 'reporter', 'generos']
        widgets = {
            'titulo': forms.TextInput(attrs={'class': 'form-control'}),
            'imagem': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'resumo': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'detalhes': forms.Textarea(attrs={'class': 'form-control', 'rows': 10}),
            'data': forms.DateTimeInput(attrs={'class': 'form-control', 'type': 'datetime-local'}, format='%Y-%m-%dT%H:%M'),
            'reporter': forms.TextInput(attrs={'class': 'form-control'}),
        }