import os
import hmac
import hashlib
from django.http import HttpResponse, HttpResponseForbidden
from subprocess import Popen
from django.views.decorators.csrf import csrf_exempt

REPO_PATH = '/home/genuss/GENUS-JC/'
WSGI_PATH = '/var/www/genuss_pythonanywhere_com_wsgi.py'
WEBHOOK_SECRET = os.environ.get('GITHUB_WEBHOOK_SECRET', 'NO_SECRET_FOUND')
@csrf_exempt
def deploy_webhook(request):
    """View que recebe o webhook do GitHub e executa os comandos de deploy."""

    if request.method == 'POST':

        github_signature = request.headers.get('X-Hub-Signature-256')
        if github_signature and github_signature.startswith('sha256='):
            signature = github_signature.split('=')[1]
        else:
            return HttpResponseForbidden('Assinatura do GitHub ausente.')
        
        key = WEBHOOK_SECRET.encode()
        body = request.body
        hashed = hmac.new(key, body, hashlib.sha256).hexdigest()

        if not hmac.compare_digest(signature, hashed):
            return HttpResponseForbidden('Assinatura Inválida.')

        cmd = (
            f"cd {REPO_PATH} && "
            f"git pull origin main && "
            f"python manage.py collectstatic --noinput && "
            f"python manage.py migrate --noinput && "
            f"touch {WSGI_PATH}"
        )
        
        try:
            Popen(cmd, shell=True)
            return HttpResponse('Deploy iniciado com sucesso!', status=202)
        except Exception as e:
            return HttpResponse(f'Erro ao iniciar deploy: {e}', status=500)
    
    return HttpResponse('Acesso negado. Use o método POST.', status=403)