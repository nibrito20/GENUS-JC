# Guia de Contribuição

Obrigado por seu interesse em contribuir com o projeto **GENUS**! Este guia foi criado para ajudar a entender como colaborar de forma clara, simples e eficiente.

---

## Sobre o Projeto

O **GENUS** é uma solução desenvolvida para o **Jornal do Commercio (JC)** com o objetivo de melhorar a experiência do usuário, aumentar o engajamento e promover maior personalização de conteúdo.

A aplicação é composta por:

* **Frontend**: React
* **Backend**: Django / Python
* **Banco de Dados**: SQLite
* **Versionamento**: Git e GitHub

---

## Pré-requisitos

Antes de começar, garanta que você tenha instalado:

* **Git** (controle de versão)
* **Python 3.10+** (backend Django)
* **pip** (gerenciador de pacotes Python)
* **Node.js + NPM** (frontend React)
* **SQLite** (já incluso na maioria dos sistemas)

Após instalar, verifique:

```bash
git --version
python --version
pip --version
node --version
npm --version
```

---

## Como Contribuir

### 1. Faça um Fork do Repositório

No GitHub, clique em **Fork** para criar uma cópia do projeto no seu perfil.

### 2. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/genus.git
cd genus
```

### 3. Crie uma Branch

Use um nome descritivo para sua branch.

```bash
git checkout -b feature/nome-da-feature
```

### 4. Instale Dependências

#### Backend (Django)

```bash
cd backend
pip install -r requirements.txt
```

#### Frontend (React)

```bash
cd frontend
npm install
```

### 5. Execute o Projeto

#### Backend

```bash
python manage.py runserver
```

#### Frontend

```bash
npm start
```

---

## Padrões de Código

### Frontend (React)

* Utilize componentes funcionais.
* Prefira hooks ao invés de classes.
* Mantenha a estrutura organizada em pastas (components, pages, services...).

### Backend (Django)

* Nomeie funções e variáveis de forma clara.
* Siga a estrutura de apps e views do Django.
* Utilize serializers e views bem modularizadas.

### Commits

Siga um padrão simples e compreensível:

```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: altera documentação
style: ajustes de formatação
refactor: melhora código sem mudar comportamento
```

---

## Issues & Planejamento

Antes de iniciar uma contribuição:

1. Verifique se já existe uma **issue** relacionada.
2. Caso não exista, abra uma nova descrevendo:

   * O problema
   * A solução proposta
   * Impacto esperado

Mantenha o **Issue Tracker** sempre atualizado.

---

## Pull Requests

Quando sua alteração estiver pronta:

1. Faça o commit e push:

```bash
git add .
git commit -m "feat: descrição do que foi feito"
git push origin feature/nome-da-feature
```

2. Abra um **Pull Request** no GitHub.

3. Descreva claramente:

   * O que foi alterado
   * Motivação
   * Screenshots (se aplicável)
   * Como testar

4. Aguarde revisão. Ajustes podem ser solicitados.

---

## Deploy

* O link do deploy atualizado deve ser mantido na documentação principal.
* Certifique-se de que o frontend e backend estejam sincronizados antes do deploy.

---

## 🤝 Código de Conduta

Ao contribuir, lembre-se de:

* Respeitar o tempo e trabalho dos outros.
* Ser claro e objetivo.
* Contribuir para um ambiente colaborativo e profissional.

---

## Dúvidas?

Abra uma issue com a tag **question** ou entre em contato com os mantenedores do projeto por email.

Obrigado por contribuir com o GENUS!
