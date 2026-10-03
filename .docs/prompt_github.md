Atue como um **Arquiteto de Software e Engenheiro DevOps**, com foco em preparar este projeto para ser versionado e publicado no GitHub de forma segura, limpa e reproduzível.

Seu objetivo é **analisar o projeto atual, corrigir o que for necessário, preparar o repositório Git e deixar tudo pronto para o primeiro commit e push**.

> **Importante:** o `git commit` e o `git push` NÃO devem ser executados por você. Ao final, entregue esses dois comandos prontos para que eu copie e execute manualmente.

---

# 1. Analise inicial do projeto

Antes de alterar qualquer coisa:

* Analise a estrutura completa do projeto.
* Identifique a stack, linguagem, framework, gerenciador de pacotes e ferramentas utilizadas.
* Identifique os arquivos de configuração relevantes.
* Verifique se já existe um repositório Git.
* Verifique se já existem `.gitignore`, `README`, arquivos `.env`, `.env.example` ou configurações equivalentes.
* Identifique arquivos gerados automaticamente, caches, logs, builds, dependências instaladas e arquivos temporários.
* Preserve a arquitetura e o funcionamento atual do projeto. Não faça refatorações ou mudanças de comportamento que não sejam necessárias para a preparação do repositório.

Antes de executar comandos destrutivos ou remover arquivos, avalie se o arquivo realmente é descartável. **Não exclua código-fonte ou arquivos de configuração importantes.**

---

# 2. Leia as informações do GitHub

Leia o arquivo:

`meu_git.txt`

Utilize as informações encontradas nele para configurar o repositório.

O arquivo deverá conter, quando aplicável:

```text
usuario: ...
email: ...
repositorio: ...
```

Interprete:

* `usuario` → nome do usuário no GitHub
* `email` → e-mail para `git config user.email`
* `repositorio` → URL do repositório remoto

**Não invente valores caso alguma informação esteja ausente ou inválida.**

Se `meu_git.txt` contiver informações sensíveis, não copie seu conteúdo para o README, código, `.env.example` ou qualquer outro arquivo que será versionado.

---

# 3. Segurança e proteção de segredos

Faça uma verificação cuidadosa antes de preparar o primeiro commit.

Procure por:

* API keys
* tokens
* senhas
* secrets
* credenciais de banco de dados
* chaves privadas
* JWT secrets
* tokens OAuth
* credenciais de serviços externos
* URLs de conexão contendo usuário/senha
* certificados ou arquivos privados
* valores sensíveis hardcoded no código

Verifique também arquivos como:

* `.env`
* `.env.local`
* `.env.development`
* `.env.production`
* arquivos de configuração
* scripts
* arquivos JSON/YAML/TOML de configuração

### Se encontrar um segredo:

**Pare antes de preparar o commit e informe claramente:**

1. qual arquivo contém o possível segredo;
2. qual tipo de informação sensível foi identificado;
3. se o valor precisa ser removido ou substituído;
4. qual variável de ambiente deve ser utilizada;
5. como essa variável deverá aparecer no `.env.example`.

Nunca coloque o segredo real no `.env.example`.

Se um segredo já estiver no histórico Git existente, informe que simplesmente removê-lo do arquivo atual não é suficiente e explique que o histórico precisará ser tratado antes da publicação.

**Nunca revele o valor completo de um segredo na resposta.**

---

# 4. Criar ou corrigir o `.gitignore`

Crie ou atualize o `.gitignore` de acordo com a stack identificada.

O `.gitignore` deve impedir o versionamento de arquivos como:

* `.env` e variantes com credenciais;
* logs;
* caches;
* dependências instaladas, quando aplicável;
* diretórios de build;
* arquivos temporários;
* arquivos do sistema operacional;
* arquivos de IDE/editor;
* cobertura de testes;
* artefatos gerados automaticamente;
* credenciais e chaves privadas.

Não utilize um `.gitignore` genérico sem verificar a stack real do projeto.

**Importante:** não ignore arquivos necessários para que outra pessoa consiga instalar, executar, testar ou fazer build do projeto.

Por exemplo, não ignore automaticamente arquivos como:

* `package.json`;
* lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, etc.);
* arquivos de configuração necessários;
* código-fonte;
* migrations;
* schemas;
* documentação.

Depois de criar ou atualizar o `.gitignore`, valide se os arquivos sensíveis realmente estão sendo ignorados.

---

# 5. Variáveis de ambiente

Se o projeto utilizar variáveis de ambiente:

* mantenha os arquivos reais `.env` fora do Git;
* crie ou atualize `.env.example`;
* documente as variáveis necessárias;
* utilize nomes das variáveis sem valores secretos;
* inclua valores de exemplo seguros quando apropriado.

O `.env.example` deve permitir que outro desenvolvedor entenda quais variáveis precisam ser configuradas para executar o projeto.

Não copie valores reais de `.env` para `.env.example`.

---

# 6. Dependências e configuração do projeto

Identifique o gerenciador de dependências utilizado e examine os arquivos correspondentes.

Por exemplo:

* `package.json`
* `package-lock.json`
* `pnpm-lock.yaml`
* `yarn.lock`
* `requirements.txt`
* `pyproject.toml`
* `go.mod`
* `Cargo.toml`
* ou equivalente da stack identificada.

Verifique:

* dependências ausentes;
* dependências declaradas incorretamente;
* scripts de execução;
* scripts de build;
* scripts de teste;
* configuração necessária para produção;
* inconsistências entre manifesto e lockfile.

Não atualize dependências para versões novas apenas por atualização. Faça alterações somente quando forem necessárias para corrigir um problema identificado ou preparar corretamente o projeto.

---

# 7. Validação técnica

Antes de considerar o projeto pronto, execute as verificações disponíveis e compatíveis com a stack.

Quando existirem:

* lint;
* testes;
* type-check;
* build;
* validação de configuração;
* verificação de dependências.

Corrija problemas diretamente relacionados à preparação do projeto quando isso puder ser feito com segurança.

Se encontrar um erro que não possa ser corrigido com segurança, **não o ignore**. Informe:

* comando executado;
* erro encontrado;
* provável causa;
* se impede ou não o commit;
* ação recomendada.

Não declare o projeto como "pronto" se uma validação essencial estiver falhando.

---

# 8. README.md

Crie ou atualize um `README.md` profissional e objetivo.

O README deve conter, quando aplicável:

1. Nome do projeto;
2. Descrição;
3. Principais funcionalidades;
4. Stack/tecnologias utilizadas;
5. Pré-requisitos;
6. Instalação;
7. Configuração das variáveis de ambiente;
8. Como executar em desenvolvimento;
9. Como executar testes;
10. Como gerar build;
11. Como executar em produção, se aplicável;
12. Estrutura resumida do projeto;
13. Informações adicionais relevantes.

Não coloque:

* tokens;
* senhas;
* API keys;
* credenciais;
* dados privados;
* conteúdo sensível de `meu_git.txt`.

Baseie o README no projeto real. **Não invente funcionalidades ou comandos que não existam.**

---

# 9. Inicialização e configuração do Git

Depois que as etapas anteriores estiverem concluídas, prepare o repositório Git.

Se ainda não existir um repositório:

```bash
git init
```

Configure o usuário local do repositório usando os dados de `meu_git.txt`:

```bash
git config user.name "nome_usuario_github"
git config user.email "email_usuario_github"
```

Configure o remote:

```bash
git remote add origin "repositorio.git"
```

Se o remote `origin` já existir, **não adicione outro**. Verifique o endereço atual e, se necessário, atualize-o somente quando estiver claro que ele deve apontar para o repositório informado em `meu_git.txt`.

Utilize:

```bash
git remote -v
```

para validar a configuração.

---

# 10. Preparação do primeiro commit

Antes de adicionar os arquivos ao stage:

```bash
git status
```

Verifique cuidadosamente o resultado.

Depois:

```bash
git add .
```

Em seguida, **verifique novamente o que foi colocado no stage**.

Use comandos apropriados, como:

```bash
git status
```

e:

```bash
git diff --cached --stat
```

Quando necessário, examine os arquivos staged individualmente.

### Regra de segurança

Se arquivos sensíveis, credenciais, `.env`, chaves privadas ou artefatos que deveriam estar ignorados aparecerem no stage:

1. não prossiga;
2. corrija o `.gitignore` ou remova o arquivo do stage;
3. repita a validação.

O objetivo é garantir que o primeiro commit não contenha informações que não deveriam ser públicas.

---

# 11. Branch principal

Garanta que a branch principal seja chamada `main`:

```bash
git branch -M main
```

Não faça push automaticamente.

---

# 12. Comandos que NÃO devem ser executados

Você **não deve executar**:

```bash
git commit
```

nem:

```bash
git push
```

Esses dois comandos serão executados manualmente pelo usuário.

Também não faça `git push --force` ou qualquer operação destrutiva no remoto.

---

# 13. Comandos finais para o usuário

Somente quando todas as validações estiverem concluídas e o stage estiver correto, apresente ao usuário os dois comandos finais.

O primeiro deve ser:

```bash
git commit -m "..."
```

Escolha uma mensagem de commit curta e descritiva com base nas alterações realmente realizadas.

O segundo deve ser:

```bash
git push origin main
```

Não execute esses comandos.

---

# 14. Relatório final

Ao terminar, apresente um resumo objetivo contendo:

### Projeto

* stack identificada;
* principais ajustes realizados;
* arquivos criados ou modificados.

### Segurança

* resultado da verificação de segredos;
* situação do `.gitignore`;
* situação do `.env.example`, quando aplicável.

### Validação

* testes executados;
* lint/type-check/build executados;
* resultado de cada validação.

### Git

* branch atual;
* usuário/e-mail configurados;
* remote configurado;
* situação do stage.

### Pendências

Liste claramente qualquer problema que ainda exija intervenção manual.

### Comandos finais

Apresente separadamente e em bloco de código os dois comandos que o usuário deverá copiar e executar manualmente:

```bash
git commit -m "mensagem sugerida"
git push origin main
```

**Não execute esses dois comandos.**

---

## Regras gerais

* Trabalhe sobre o projeto existente.
* Seja conservador com alterações.
* Não apague arquivos sem necessidade.
* Não invente informações.
* Não invente comandos de instalação ou execução.
* Não exponha segredos.
* Não coloque credenciais no README.
* Não coloque segredos no `.env.example`.
* Não faça `git push`.
* Não faça `git commit`.
* Não use `--force` no Git.
* Sempre valide o stage antes de considerar o projeto pronto.
* Se houver um problema crítico de segurança, interrompa a preparação do commit e informe o usuário claramente.
* Se alguma informação necessária estiver ausente em `meu_git.txt`, informe exatamente o que está faltando.
* Ao final, o projeto deve estar **preparado para o commit**, mas o commit e o push devem permanecer sob execução manual do usuário.
