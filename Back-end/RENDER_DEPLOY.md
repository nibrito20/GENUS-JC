# 🚀 Guia de Deploy no Render - GENUS-JC Backend

Este guia te ajudará a fazer deploy do backend Django com PostgreSQL no Render.

---

## 📋 Pré-requisitos

- [x] Conta no [Render](https://render.com/) (gratuita)
- [x] Repositório no GitHub com o código
- [x] Banco de dados PostgreSQL (Neon ou Render PostgreSQL)
- [x] String de conexão do PostgreSQL pronta

---

## 🔧 Passo 1: Preparar o Repositório

Certifique-se de que todas as mudanças estão commitadas:

```bash
git add .
git commit -m "Configuração para deploy no Render com PostgreSQL"
git push origin main
```

---

## 🌐 Passo 2: Criar Web Service no Render

1. Acesse [Render Dashboard](https://dashboard.render.com/)
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub (se ainda não conectou)
4. Selecione o repositório `genusJc` (ou o nome do seu repositório)

---

## ⚙️ Passo 3: Configurar o Serviço

Configure os seguintes campos no Render:

### Configurações Básicas:

- **Name:** `genus-jc-backend` (ou outro nome de sua preferência)
- **Region:** Escolha a região mais próxima (ex: `Oregon (US West)`)
- **Branch:** `main` (ou sua branch principal)
- **Root Directory:** `GENUS-JC/Back-end`
- **Runtime:** `Python 3`
- **Build Command:** `chmod +x build.sh && ./build.sh`
- **Start Command:** `chmod +x start.sh && ./start.sh`

### ⚠️ Importante:
- O **Root Directory** deve apontar para `GENUS-JC/Back-end` (ajuste conforme sua estrutura)
- O Render usa a variável `$PORT` automaticamente, que já está configurada no `start.sh`

---

## 🔐 Passo 4: Configurar Variáveis de Ambiente

No painel do Render, vá em **Environment** e adicione as seguintes variáveis:

### Variáveis Obrigatórias:

```env
# Django
SECRET_KEY=sua-chave-secreta-super-longa-e-aleatoria-aqui-gerada-aleatoriamente
DEBUG=False
ALLOWED_HOSTS=genus-jc-backend.onrender.com,localhost,127.0.0.1

# Database - String de conexão do PostgreSQL (Neon)
DATABASE_URL=postgresql://neondb_owner:npg_eQFOMrbo9aZ7@ep-solitary-bonus-a40ccywi-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# CORS - URLs do frontend (atualize depois do deploy do frontend)
CORS_ALLOWED_ORIGINS=https://seu-app.firebaseapp.com,https://seu-app.web.app
CSRF_TRUSTED_ORIGINS=https://seu-app.firebaseapp.com,https://seu-app.web.app
```

### 📝 Como gerar SECRET_KEY:

Você pode gerar uma nova SECRET_KEY usando Python:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Ou use este comando online:
```bash
python manage.py shell -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

---

## 🗄️ Passo 5: Configurar Banco de Dados

### Opção A: Usar Neon (já configurado)

Se você já tem o banco no Neon, apenas adicione a variável `DATABASE_URL` no Render (como mostrado acima).

### Opção B: Criar PostgreSQL no Render

1. No Render Dashboard, clique em **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name:** `genus-jc-db`
   - **Database:** `genus_jc`
   - **User:** (será gerado automaticamente)
   - **Region:** Mesma região do seu Web Service
3. Após criar, copie a **Internal Database URL** ou **External Database URL**
4. Adicione como `DATABASE_URL` nas variáveis de ambiente do Web Service

---

## 🚀 Passo 6: Fazer Deploy

1. Clique em **"Create Web Service"**
2. O Render começará a fazer o build automaticamente
3. Acompanhe os logs para verificar se tudo está funcionando

### O que acontece durante o build:

1. Instala as dependências (`pip install -r requirements.txt`)
2. Executa as migrações (`python manage.py migrate`)
3. Coleta arquivos estáticos (`python manage.py collectstatic`)
4. Inicia o servidor com Gunicorn

---

## ✅ Passo 7: Verificar o Deploy

Após o deploy, você verá uma URL como:
```
https://genus-jc-backend.onrender.com
```

### Testes:

1. Acesse: `https://genus-jc-backend.onrender.com/admin/`
   - Deve mostrar a página de login do Django Admin

2. Verifique os logs no Render:
   - Vá em **Logs** no painel do serviço
   - Procure por erros

3. Teste a API:
   - Acesse seus endpoints da API
   - Verifique se o CORS está funcionando

---

## 🔄 Passo 8: Atualizar CORS após Deploy do Frontend

Depois que você fizer deploy do frontend no Firebase, volte ao Render e atualize:

```env
CORS_ALLOWED_ORIGINS=https://seu-projeto.firebaseapp.com,https://seu-projeto.web.app
CSRF_TRUSTED_ORIGINS=https://seu-projeto.firebaseapp.com,https://seu-projeto.web.app
```

Depois, faça um **Manual Deploy** no Render (ou aguarde o auto-deploy se configurou).

---

## 🛠️ Troubleshooting

### Erro: "DATABASE_URL environment variable is not set"

- Verifique se a variável `DATABASE_URL` está configurada no Render
- Certifique-se de que não há espaços extras na string de conexão

### Erro: "ModuleNotFoundError: No module named 'dotenv'"

- Verifique se `python-dotenv==1.0.0` está no `requirements.txt`
- O Render instala automaticamente, mas pode precisar de um rebuild

### Erro: "Connection refused" ou problemas de conexão com o banco

- Verifique se a string de conexão está correta
- Se usar Neon, certifique-se de que o banco está acessível publicamente
- Verifique se o SSL está configurado corretamente (`sslmode=require`)

### Erro: "Static files not found"

- O `build.sh` já executa `collectstatic`, mas verifique os logs
- Certifique-se de que `STATIC_ROOT` está configurado no `settings.py`

### Erro: "ALLOWED_HOSTS"

- Adicione o domínio do Render (`*.onrender.com`) ao `ALLOWED_HOSTS`
- Ou use a variável de ambiente `ALLOWED_HOSTS` no Render

### O deploy fica "Building" por muito tempo

- Verifique os logs para ver onde está travando
- Pode ser problema de dependências ou timeout
- Tente fazer um rebuild manual

---

## 📝 Checklist de Deploy

- [ ] Repositório no GitHub atualizado
- [ ] Web Service criado no Render
- [ ] Root Directory configurado corretamente (`GENUS-JC/Back-end`)
- [ ] Build Command configurado (`chmod +x build.sh && ./build.sh`)
- [ ] Start Command configurado (`chmod +x start.sh && ./start.sh`)
- [ ] Variável `SECRET_KEY` configurada
- [ ] Variável `DEBUG=False` configurada
- [ ] Variável `ALLOWED_HOSTS` configurada
- [ ] Variável `DATABASE_URL` configurada com string do PostgreSQL
- [ ] Variáveis `CORS_ALLOWED_ORIGINS` e `CSRF_TRUSTED_ORIGINS` configuradas
- [ ] Deploy executado com sucesso
- [ ] Migrações executadas (verificar logs)
- [ ] Admin do Django acessível
- [ ] API respondendo corretamente

---

## 🔗 Links Úteis

- [Documentação Render](https://render.com/docs)
- [Render Python Guide](https://render.com/docs/deploy-django)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)

---

## 💡 Dicas

1. **Auto-Deploy**: O Render detecta automaticamente pushes para a branch configurada
2. **Logs**: Sempre verifique os logs quando houver problemas
3. **Variáveis de Ambiente**: Nunca commite informações sensíveis (use variáveis de ambiente)
4. **Backup**: Configure backups regulares do banco de dados
5. **Monitoramento**: Use os recursos de monitoramento do Render para acompanhar performance

---

**Pronto!** Seu backend está deployado no Render! 🎉

