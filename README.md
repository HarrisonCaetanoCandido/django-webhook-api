# 💬 WhatsApp Webhook API + Interface Frontend

Este projeto consiste em uma aplicação fullstack para **consumir eventos de um Webhook de WhatsApp** (simulado) e interagir com eles através de uma interface React/Next.js.

- 📦 **Backend**: Django REST Framework com Poetry e Python 3.13.
- 🌐 **Frontend**: Next.js com React 20.11.1 e TypeScript com a finalidade de simular requisições como `curl` ou Postman, usando uma interface intuitiva no navegador.
- 🗃️ Banco de dados: SQLite (não versionado no repositório).

---

## ⚙️ Requisitos

### Backend
- Python 3.13
- [Poetry](https://python-poetry.org/docs/#installation)

### Frontend
- Node.js 20.11.1
- npm 10.2.4

---

## 🚀 Como executar o projeto localmente

### Clone do repo

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
```

### Build do Backend
```bash
cd backend
pip install poetry
poetry install
python manage.py migrate
python manage.py runserver

# Criação e migração do banco de dados
python manage.py migrate

# Executa o servidor backend (localhost:8000)
python manage.py runserver
```

### Build do Frontend
```bash
cd ../frontend
npm install
npm run dev
```
