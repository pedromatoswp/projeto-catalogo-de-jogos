# 🎮 Projeto Catálogo de Jogos

Bem-vindo ao repositório oficial do **Catálogo de Jogos**, um projeto Full-Stack desenvolvido como Projeto Integrador para o curso técnico!

## 🚀 Sobre o Projeto

Este projeto é um sistema completo de gestão de biblioteca de jogos (CRUD) com integração a banco de dados relacional. Nosso objetivo principal foi sair da zona de conforto e aprender tecnologias modernas que o mercado de trabalho exige hoje.

### ✨ Funcionalidades Principais
- **Listagem Dinâmica:** Explore uma grade moderna de jogos.
- **Integração Real com Banco de Dados:** Criar, Ler, Atualizar e Deletar jogos de forma persistente.
- **Filtro de Busca:** Encontre jogos rapidamente por título ou gênero.
- **Relacionamentos (SQL):** Jogos conectados diretamente a tabelas de "Estúdios" desenvolvedores.
- **Segurança UX:** Modais de confirmação de exclusão e tratamento de erros visuais (como queda de conexão do servidor).

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** Next.js, React, Tailwind CSS e Framer Motion (para animações fluidas).
- **Backend:** Next.js API Routes (Serverless).
- **Banco de Dados:** Supabase (PostgreSQL na nuvem).
- **Linguagem:** TypeScript (TSX).

---

## 👥 Nossa Equipe (O Squad)

Trabalhamos de forma colaborativa simulando o mercado de trabalho real, utilizando repositórios e branches no Git.

| **Nome** | **Área de Atuação** |
| :--- | :--- |
| **Daniel** | Banco de Dados (Modelagem, Queries, Supabase) |
| **Aron** | Backend (API, Rotas, Conexão com Banco) |
| **Guilherme** | Frontend (Interfaces, Criação de Componentes) |
| **Pedro Garcia** | Frontend (UI/UX, Animações e Responsividade) |
| **Pedro Matos** | Frontend (Integração da Tela Principal e GitHub) |
| **Kaluanã** | Documentação, Explicações e Tratamento de Erros (QA) |

---

## ⚙️ Como rodar o projeto na sua máquina

Para rodar este projeto localmente, siga os passos abaixo:

1. Clone o repositório:
```bash
git clone https://github.com/pedromatoswp/projeto-catalogo-de-jogos.git
```

2. Entre na pasta do projeto:
```bash
cd projeto-catalogo-de-jogos
```

3. Instale as dependências:
```bash
npm install
```

4. Rode o servidor de desenvolvimento:
```bash
npm run dev
```

5. Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado!

*(Observação: É necessário configurar um banco de dados no Supabase e adicionar as credenciais no arquivo `.env.local` para que os dados carreguem corretamente).*






Crie uma documentação técnica organizada em formato de workspace do Notion para meu projeto web.
A estrutura deve funcionar como um guia completo de customização do site, permitindo alterar facilmente partes específicas do projeto.

Inclua:

Explicação da estrutura de pastas do projeto
Onde ficam os arquivos principais (index.html, componentes, páginas, estilos, assets, etc.)
Como alterar:
cores do site
fontes
tamanhos
espaçamentos
animações
responsividade
navbar
footer
botões
cards
formulários
Explicações de CSS e HTML linha por linha quando necessário
Exemplos práticos mostrando:
código original
código alterado
resultado esperado
Sessão explicando como editar componentes sem quebrar o projeto
Como adicionar novas seções ao site
Como modificar layouts
Como trocar imagens e ícones
Como alterar variáveis globais de estilo
Como customizar temas dark/light
Guia para manutenção futura
Boas práticas de organização de código
Tabela com:
elemento
arquivo responsável
classe/id
função visual
Comentários explicativos em cada trecho de código
Estrutura visual limpa e profissional no estilo documentação de desenvolvedor

Também quero:

blocos de código bem organizados
títulos hierárquicos
checklists
callouts de atenção
área para anotações futuras
seção de bugs conhecidos
seção de melhorias futuras

O objetivo é que qualquer pessoa consiga modificar o site facilmente, até mesmo alterando apenas uma linha de CSS ou HTML sem se perder no projeto.
