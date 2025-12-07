# 👤 Estrutura de Usuário - GENUS-JC

Este documento explica onde estão localizados os modelos, APIs e funcionalidades relacionadas a usuários no sistema.

---

## 📁 Localização

**Tudo relacionado a usuário está no app `jornal/`** - não há um app separado `usuario/`.

---

## 🗄️ Modelos (Models)

### Localização: `jornal/models.py`

#### 1. **User (Django Padrão)**
- **Modelo:** `django.contrib.auth.models.User` (importado)
- **Campos padrão:** username, email, password, first_name, last_name, etc.
- **Uso:** Autenticação e dados básicos do usuário

#### 2. **Profile (Modelo Customizado)**
- **Localização:** `jornal/models.py` (linhas 81-88)
- **Campos:**
  - `user` - OneToOneField com User
  - `foto` - ImageField (foto de perfil)
  - `generos_favoritos` - ManyToManyField com Genero
- **Criação automática:** Criado automaticamente quando um User é criado (via signal)

```python
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    foto = models.ImageField(upload_to='perfis/', blank=True, null=True)
    generos_favoritos = models.ManyToManyField(Genero, blank=True, related_name="perfis_favoritos")
```

---

## 🔌 APIs (Views)

### Localização: `jornal/views.py`

#### 1. **Autenticação**

##### `api_login` (linha 54)
- **URL:** `/api/login/`
- **Método:** POST
- **Função:** Fazer login do usuário
- **Parâmetros:** `email`, `password`

##### `api_logout` (linha 46)
- **URL:** `/api/logout/`
- **Método:** POST
- **Função:** Fazer logout do usuário

##### `api_register` (linha 71)
- **URL:** `/api/register/`
- **Método:** POST
- **Função:** Criar nova conta de usuário
- **Parâmetros:** `email`, `password`, `password2`

#### 2. **Dados do Usuário**

##### `api_user` (linha 365)
- **URL:** `/api/user/`
- **Método:** GET
- **Função:** Obter dados do usuário logado
- **Retorna:** Dados do usuário + profile

##### `update_user` (linha 511)
- **URL:** `/api/user/update/`
- **Método:** POST
- **Função:** Atualizar dados do usuário
- **Parâmetros:** `username`, `email`, `telefone`, `nascimento`

##### `auth_status` (linha 360)
- **URL:** `/auth-status/`
- **Método:** GET
- **Função:** Verificar se usuário está autenticado

#### 3. **Perfil**

##### `api_update_profile_generos` (linha 488)
- **URL:** `/api/profile/generos/`
- **Método:** POST
- **Função:** Atualizar gêneros favoritos do perfil
- **Parâmetros:** `genero_ids` (array)

---

## 📡 Serializers

### Localização: `jornal/serializers.py`

#### 1. **UserSerializer** (linha 60)
```python
class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']
```

#### 2. **ProfileSerializer** (linha 42)
```python
class ProfileSerializer(serializers.ModelSerializer):
    generos_favoritos = GeneroSerializer(many=True, read_only=True)
    foto_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Profile
        fields = ['id', 'foto', 'foto_url', 'generos_favoritos']
```

---

## 🔗 URLs

### Localização: `jornal/urls.py`

```python
# Autenticação
path("api/login/", views.api_login, name="api_login"),
path("api/logout/", views.api_logout, name="api_logout"),
path("api/register/", views.api_register, name="api_register"),
path("auth-status/", auth_status, name="auth_status"),

# Dados do usuário
path("api/user/", views.api_user, name="api_user"),
path("api/user/update/", views.update_user, name="update_user"),

# Perfil
path("api/profile/generos/", views.api_update_profile_generos, name="api_update_profile_generos"),
```

---

## 🎯 Relacionamentos

### User → Profile
- **Tipo:** OneToOne (1 usuário = 1 perfil)
- **Acesso:** `user.profile`
- **Criação:** Automática via signal quando User é criado

### User → Favoritos
- **Tipo:** ForeignKey (1 usuário = muitos favoritos)
- **Acesso:** `Favoritos.objects.filter(usuario=user)`
- **Modelo:** `jornal/models.py` (linha 73)

### Profile → Generos
- **Tipo:** ManyToMany (1 perfil = muitos gêneros favoritos)
- **Acesso:** `user.profile.generos_favoritos.all()`
- **Modelo:** `jornal/models.py` (linha 85)

---

## 📋 Resumo da Estrutura

```
jornal/
├── models.py          # Profile model (linha 81)
├── views.py           # Todas as APIs de usuário
├── serializers.py     # UserSerializer e ProfileSerializer
├── urls.py            # Rotas das APIs
└── admin.py           # Configuração do admin (ProfileAdmin)
```

---

## 🔍 Como Acessar

### No código Python:
```python
from django.contrib.auth.models import User
from jornal.models import Profile

# Obter usuário
user = User.objects.get(username='exemplo')

# Acessar perfil
profile = user.profile

# Acessar gêneros favoritos
generos = user.profile.generos_favoritos.all()
```

### Via API:
```bash
# Login
POST /api/login/
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}

# Obter dados do usuário
GET /api/user/

# Atualizar perfil
POST /api/user/update/
{
  "username": "novo_nome",
  "email": "novo@email.com"
}
```

---

## ⚠️ Observações Importantes

1. **Não há app `usuario/`** - Tudo está em `jornal/`
2. **User é do Django** - Usa `django.contrib.auth.models.User`
3. **Profile é customizado** - Está em `jornal/models.py`
4. **Criação automática** - Profile é criado automaticamente via signal
5. **Relacionamento** - User e Profile estão ligados via OneToOneField

---

## 🛠️ Admin

O Profile está registrado no Django Admin em `jornal/admin.py` (linha 17):

```python
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user',)
    filter_horizontal = ('generos_favoritos',)
```

---

**Tudo relacionado a usuário está centralizado no app `jornal/`!** 🎯

