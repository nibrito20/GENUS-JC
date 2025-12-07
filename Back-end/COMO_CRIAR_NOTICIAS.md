# 📰 Como Criar Notícias - GENUS-JC

Este guia mostra as diferentes formas de criar notícias no sistema.

---

## 🎯 Método 1: Django Admin (Recomendado - Mais Fácil)

O Django Admin é a forma mais simples e direta de criar notícias.

### Passo 1: Acessar o Django Admin

1. Acesse: `https://jc-backend-ah3z.onrender.com/admin/`
2. Faça login com suas credenciais de superusuário

### Passo 2: Criar uma Notícia

1. No painel do admin, encontre a seção **"Jornal"**
2. Clique em **"Noticias"** → **"Add Noticia"** (ou **"Adicionar Noticia"**)
3. Preencha o formulário:

   - **Título:** Título da notícia (obrigatório)
   - **Imagem:** Faça upload de uma imagem (opcional)
   - **Resumo:** Resumo breve da notícia (obrigatório)
   - **Detalhes:** Conteúdo completo da notícia (obrigatório)
   - **Data:** Data e hora da publicação (padrão: agora)
   - **Reporter:** Nome do repórter/autor (obrigatório)
   - **Gêneros:** Selecione um ou mais gêneros (obrigatório)

4. Clique em **"Save"** (Salvar)

### Passo 3: Verificar

A notícia será criada automaticamente com um **slug** único baseado no título.

---

## 🌐 Método 2: Página HTML Admin Secreto

Existe uma página HTML com formulário para criar notícias.

### Passo 1: Acessar a Página

1. Acesse: `https://jc-backend-ah3z.onrender.com/admin-secreto/criar/`
2. **⚠️ Requer login!** Você precisa estar autenticado

### Passo 2: Preencher o Formulário

Preencha todos os campos:
- Título
- Imagem (opcional)
- Resumo
- Detalhes
- Data
- Reporter
- Gêneros (selecione pelo menos um)

### Passo 3: Salvar

Clique em **"Salvar"** e a notícia será criada.

---

## 🔧 Método 3: Criar Superusuário (Se ainda não tiver)

Se você não tem acesso ao admin, precisa criar um superusuário primeiro.

### Opção A: Via Terminal/SSH no Render

1. No Render, vá em seu serviço → **Shell**
2. Execute:

```bash
python manage.py createsuperuser
```

3. Siga as instruções para criar o usuário

### Opção B: Via Script Python

Crie um script temporário para criar o superusuário:

```python
# create_superuser.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

from django.contrib.auth.models import User

# Cria ou atualiza o superusuário
user, created = User.objects.get_or_create(
    username='admin',
    defaults={
        'email': 'admin@example.com',
        'is_staff': True,
        'is_superuser': True
    }
)

if created:
    user.set_password('sua-senha-aqui')
    user.save()
    print("Superusuário criado com sucesso!")
else:
    print("Superusuário já existe!")
```

Execute:
```bash
python create_superuser.py
```

---

## 📋 Campos da Notícia

### Campos Obrigatórios:
- **Título** (`titulo`) - Máximo 200 caracteres
- **Resumo** (`resumo`) - Texto breve
- **Detalhes** (`detalhes`) - Conteúdo completo
- **Reporter** (`reporter`) - Nome do autor
- **Gêneros** (`generos`) - Pelo menos um gênero deve ser selecionado

### Campos Opcionais:
- **Imagem** (`imagem`) - Upload de imagem
- **Data** (`data`) - Se não informado, usa a data/hora atual

### Campos Automáticos:
- **Slug** (`slug`) - Gerado automaticamente a partir do título
- **ID** - Gerado automaticamente

---

## 🎨 Criar Gêneros (Se necessário)

Antes de criar notícias, você pode precisar criar gêneros.

### Via Django Admin:

1. Acesse: `https://jc-backend-ah3z.onrender.com/admin/`
2. Vá em **"Jornal"** → **"Generos"** → **"Add Genero"**
3. Digite o nome do gênero
4. Salve

### Via Página Admin Secreto:

1. Acesse: `https://jc-backend-ah3z.onrender.com/admin-secreto/popular-generos/`
2. Esta página cria gêneros padrão automaticamente

---

## 🔍 Verificar Notícias Criadas

### Via Django Admin:
- Acesse: `https://jc-backend-ah3z.onrender.com/admin/jornal/noticia/`
- Veja todas as notícias em formato de lista

### Via API:
- Acesse: `https://jc-backend-ah3z.onrender.com/api/noticias/`
- Retorna JSON com todas as notícias

### Via Frontend:
- Acesse: `https://molest-jc.web.app/`
- As notícias aparecerão na página inicial

---

## 🛠️ Troubleshooting

### Erro: "You don't have permission to access this page"

**Causa:** Você não está logado ou não é superusuário.

**Solução:**
1. Faça login no admin
2. Ou crie um superusuário (veja Método 3)

### Erro: "This field is required" ao criar notícia

**Causa:** Algum campo obrigatório não foi preenchido.

**Solução:**
- Verifique se preencheu todos os campos obrigatórios
- Especialmente: Título, Resumo, Detalhes, Reporter e Gêneros

### Erro: "No genres available"

**Causa:** Não existem gêneros cadastrados.

**Solução:**
1. Crie gêneros primeiro (veja seção "Criar Gêneros")
2. Ou use a página: `/admin-secreto/popular-generos/`

### A notícia não aparece no frontend

**Causa:** Pode ser cache ou problema de build.

**Solução:**
1. Verifique se a notícia foi criada no admin
2. Limpe o cache do navegador
3. Verifique se o frontend está fazendo requisições corretas

---

## 📝 Exemplo de Notícia Completa

```
Título: "Nova Tecnologia Revoluciona o Mercado"
Imagem: [upload de imagem]
Resumo: "Uma nova tecnologia promete transformar completamente o mercado de tecnologia."
Detalhes: "Em um anúncio surpreendente, uma empresa revelou uma nova tecnologia que promete revolucionar o mercado. A tecnologia, que foi desenvolvida ao longo de 5 anos, oferece soluções inovadoras para problemas antigos..."
Data: 2025-01-20 10:00
Reporter: "João Silva"
Gêneros: [✓] Tecnologia, [✓] Negócios
```

---

## 🚀 Dicas

1. **Use o Django Admin** - É a forma mais fácil e confiável
2. **Crie gêneros primeiro** - Facilita a organização
3. **Use imagens** - Melhora a apresentação no frontend
4. **Slug automático** - O sistema gera automaticamente URLs amigáveis
5. **Data padrão** - Se não informar, usa a data/hora atual

---

## 🔗 Links Úteis

- **Django Admin:** `https://jc-backend-ah3z.onrender.com/admin/`
- **Admin Secreto (Criar):** `https://jc-backend-ah3z.onrender.com/admin-secreto/criar/`
- **Admin Secreto (Lista):** `https://jc-backend-ah3z.onrender.com/admin-secreto/`
- **API Notícias:** `https://jc-backend-ah3z.onrender.com/api/noticias/`
- **Frontend:** `https://molest-jc.web.app/`

---

**Pronto!** Agora você sabe como criar notícias no sistema! 🎉

