from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import SiteFeedbackForm  

# Create your views here.

def feedback_view(request):
    if request.method == 'POST':
        form = SiteFeedbackForm(request.POST)
        if form.is_valid():
            form.save() 
            
            messages.success(request, 'Obrigado! Seu feedback foi enviado com sucesso.')
            
            return redirect('jornal:index') 
    else:
        form = SiteFeedbackForm()

    context = {
        'form': form
    }
    return render(request, 'feedback.html', context)