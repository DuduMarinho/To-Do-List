# 📋 Lista de Tarefas - Sistema Full-Stack

Um sistema completo de gerenciamento de tarefas desenvolvido com **Node.js + Express** no backend e **React + TypeScript** no frontend.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** + **Express**
- **TypeScript**
- **MongoDB** com **Mongoose**
- **JWT** para autenticação
- **Joi** para validação de dados
- **bcryptjs** para hash de senhas

### Frontend
- **React 18** + **TypeScript**
- **Vite** como bundler
- **TailwindCSS** para estilização
- **React Router** para roteamento
- **React Hook Form** para formulários
- **Axios** para requisições HTTP
- **React Hot Toast** para notificações

## 📋 Funcionalidades

### Autenticação
- ✅ Registro de usuário
- ✅ Login com JWT
- ✅ Proteção de rotas
- ✅ Logout

### Gerenciamento de Tarefas
- ✅ Criar tarefas com título, descrição e prioridade
- ✅ Listar tarefas do usuário
- ✅ Editar tarefas existentes
- ✅ Marcar tarefas como concluídas/pendentes
- ✅ Deletar tarefas individuais
- ✅ Deletar todas as tarefas concluídas
- ✅ Filtrar por status e prioridade
- ✅ Buscar tarefas por texto
- ✅ Paginação

### Interface
- ✅ Design responsivo (mobile-first)
- ✅ Interface moderna com TailwindCSS
- ✅ Feedback visual com toasts
- ✅ Loading states
- ✅ Validação de formulários em tempo real

## 🛠️ Como Executar o Projeto

### Pré-requisitos
- **Node.js** (versão 16 ou superior)
- **MongoDB** (local ou MongoDB Atlas)
- **npm** ou **yarn**

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd To-Do-List
```

### 2. Configurar Backend

```bash
# Entrar no diretório do backend
cd backend

# Instalar dependências
npm install

# Criar arquivo .env (copie o .env.example)
cp .env.example .env
```

**Configure as variáveis de ambiente no arquivo `.env`:**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/todolist

# JWT Configuration
JWT_SECRET=sua_chave_secreta_muito_segura_aqui
JWT_EXPIRES_IN=24h

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

```bash
# Executar em modo desenvolvimento
npm run dev

# Ou compilar e executar
npm run build
npm start
```

### 3. Configurar Frontend

```bash
# Abrir novo terminal e entrar no diretório do frontend
cd frontend

# Instalar dependências
npm install

# Criar arquivo .env (opcional, já tem valores padrão)
echo "VITE_API_URL=http://localhost:5000/api/v1" > .env

# Executar em modo desenvolvimento
npm run dev
```

### 4. Acessar a aplicação

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## 📡 Endpoints da API

### Autenticação
```
POST /api/v1/auth/register - Registrar usuário
POST /api/v1/auth/login    - Login
GET  /api/v1/auth/me       - Dados do usuário atual
```

### Tarefas (rotas protegidas)
```
GET    /api/v1/tasks              - Listar tarefas
POST   /api/v1/tasks              - Criar tarefa
GET    /api/v1/tasks/:id          - Obter tarefa por ID
PUT    /api/v1/tasks/:id          - Atualizar tarefa
DELETE /api/v1/tasks/:id          - Deletar tarefa
DELETE /api/v1/tasks/completed/all - Deletar tarefas concluídas
```

### Filtros de Busca
```
GET /api/v1/tasks?status=pendente&priority=alta&search=texto&page=1&limit=10
```

## 🗂️ Estrutura do Projeto

```
To-Do-List/
├── backend/                  # API Node.js + Express
│   ├── src/
│   │   ├── config/           # Configurações (DB, env)
│   │   ├── controllers/      # Lógica das rotas
│   │   ├── models/           # Schemas do MongoDB
│   │   ├── routes/           # Definição das rotas
│   │   ├── middlewares/      # Autenticação, validação
│   │   ├── utils/            # Funções utilitárias
│   │   ├── app.ts            # Configuração do Express
│   │   └── server.ts         # Inicialização do servidor
│   ├── .env                  # Variáveis de ambiente
│   └── package.json
│
├── frontend/                 # Aplicação React
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   │   ├── UI/           # Componentes base (Button, Modal)
│   │   │   └── PrivateRoute.tsx
│   │   ├── contexts/         # Contextos do React
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── services/         # Serviços de API
│   │   ├── types/            # Tipos TypeScript
│   │   ├── utils/            # Funções utilitárias
│   │   ├── styles/           # Estilos globais
│   │   ├── App.tsx           # Componente principal
│   │   └── main.tsx          # Ponto de entrada
│   └── package.json
│
└── README.md
```

## 🎨 Design e UX

- **Mobile-First**: Interface otimizada para dispositivos móveis
- **Responsive**: Adapta-se perfeitamente a diferentes tamanhos de tela
- **Acessibilidade**: Componentes semânticos e navegação por teclado
- **Feedback Visual**: Loading states, toasts e validações em tempo real
- **Paleta de Cores**: Sistema de cores consistente com TailwindCSS

## 🔒 Segurança

- **Autenticação JWT**: Tokens seguros com expiração
- **Hash de Senhas**: bcryptjs com salt rounds altos
- **Validação de Dados**: Joi no backend + React Hook Form no frontend
- **CORS Configurado**: Apenas origens permitidas
- **Headers de Segurança**: Helmet.js para proteção adicional

## 🚀 Deploy

### Backend (Heroku/Railway)
1. Configure as variáveis de ambiente
2. Use MongoDB Atlas para produção
3. Configure CORS para o domínio do frontend

### Frontend (Vercel/Netlify)
1. Configure a variável `VITE_API_URL` para a URL da API
2. Build e deploy automático

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ usando as melhores práticas de desenvolvimento Full-Stack** 