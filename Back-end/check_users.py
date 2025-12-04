import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

from django.contrib.auth.models import User

print("Usuarios no banco de dados:")
users = User.objects.all()
for u in users:
    print(f"  Username: {u.username}, Email: {u.email}")

print("\nTentando autenticar com email='aaa', password='aaa':")
from django.contrib.auth import authenticate
user = authenticate(username='aaa', password='aaa')
if user:
    print(f"  ✓ Autenticação bem-sucedida! User ID: {user.id}")
else:
    print(f"  ✗ Autenticação falhou!")
