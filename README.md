# TaskPulse ⚡ — Lista de Tarefas & Produtividade

Aplicação moderna e responsiva de gestão de tarefas e produtividade pessoal e profissional, com persistência direta no **Supabase (PostgreSQL)** e sincronização offline com LocalStorage.

---

## 🚀 Principais Funcionalidades

- **CRUD Completo de Tarefas:** Criação, edição, conclusão com celebração e exclusão de tarefas.
- **Categorização Personalizada:** Organização por Trabalho, Pessoal, Estudos, Saúde, Finanças ou novas categorias customizadas.
- **Níveis de Prioridade:** Classificação visual por prioridade (Baixa, Média, Alta).
- **Datas de Vencimento:** Acompanhamento de prazos com status de tarefas atrasadas, para hoje e futuras.
- **Múltiplas Visualizações:**
  - 📋 **Lista de Tarefas:** Filtros por status (Todas, Pendentes, Concluídas), busca textual e ordenação dinâmica.
  - 📊 **Painel de Análises:** Métricas de conclusão, taxas de produtividade e distribuição por categoria.
  - 📅 **Calendário Interativo:** Visualização mensal com marcação de tarefas por data.
- **Persistência em Nuvem com Supabase:** Integração com PostgreSQL via cliente oficial `@supabase/supabase-js`.
- **Modo Offline Resiliente:** Fallback automático para `localStorage` caso a conexão esteja indisponível.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 8](https://vite.dev/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Banco de Dados & Backend:** [Supabase](https://supabase.com/) (PostgreSQL & Row Level Security)
- **Ícones & Efeitos:** [Lucide React](https://lucide.dev/) & [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Linter:** [Oxlint](https://oxc.rs/)

---

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18.x ou superior recomendada)
- [npm](https://www.npmjs.com/) (ou yarn / pnpm)
- Conta e projeto configurado no [Supabase](https://supabase.com/) (opcional para modo local)

---

## ⚙️ Instalação e Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/professortoniati/atg2619-lista-tarefas.git
cd atg2619-lista-tarefas
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie o arquivo de exemplo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Preencha as variáveis no arquivo `.env` com as credenciais do seu projeto Supabase:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_publica_anon_aqui
```

---

## 🗄️ Estrutura do Banco de Dados (Supabase)

Caso deseje criar as tabelas no Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'Trabalho',
    priority TEXT NOT NULL DEFAULT 'media' CHECK (priority IN ('alta', 'media', 'baixa', 'low', 'medium', 'high', 'urgent')),
    due_date TEXT,
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acesso publico de categorias" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso publico de tarefas" ON public.tasks FOR ALL USING (true) WITH CHECK (true);
```

---

## 💻 Como Executar

### Modo Desenvolvimento:
```bash
npm run dev
```
Acesse a aplicação no navegador em `http://localhost:5173`.

### Executar Verificação de Lint:
```bash
npm run lint
```

### Gerar Build de Produção:
```bash
npm run build
```

### Pré-visualizar Build de Produção:
```bash
npm run preview
```

---

## 📁 Estrutura do Projeto

```text
├── .docs/                 # Documentação e especificações do projeto
├── public/                # Arquivos estáticos
├── src/
│   ├── assets/            # Imagens e assets estáticos
│   ├── components/        # Componentes reutilizáveis de interface
│   │   ├── AnalyticsView.tsx
│   │   ├── CalendarView.tsx
│   │   ├── ConfirmModal.tsx
│   │   ├── LogoutModal.tsx
│   │   ├── Navbar.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskFormModal.tsx
│   │   ├── TasksView.tsx
│   │   └── ToastContainer.tsx
│   ├── services/          # Serviços de API e armazenamento
│   │   ├── storageService.ts   # LocalStorage fallback
│   │   ├── supabaseClient.ts   # Cliente oficial Supabase
│   │   └── taskService.ts      # Camada de abstração de tarefas
│   ├── types/             # Definições TypeScript
│   │   └── index.ts
│   ├── utils/             # Utilitários, constantes e helpers
│   │   └── constants.ts
│   ├── App.tsx            # Componente raiz da aplicação
│   ├── index.css          # Estilos globais e tokens Tailwind
│   └── main.tsx           # Ponto de entrada React
├── .env.example           # Exemplo de configuração de variáveis de ambiente
├── .gitignore             # Arquivos e pastas ignorados pelo Git
├── index.html             # HTML base
├── package.json           # Manifesto de dependências e scripts
├── tsconfig.json          # Configurações do TypeScript
└── vite.config.ts         # Configurações do Vite
```

---

## 📄 Licença

Distribuído sob a licença MIT. Consulte o arquivo de licença para mais informações.
