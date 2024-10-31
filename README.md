# Roleta virtual e jogo Genius

Guia para configurar a aplicação localmente, incluindo a configuração do Supabase local e Docker.

## Pré-requisitos

Certifique-se de ter os seguintes softwares instalados em sua máquina:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [pnpm](https://pnpm.io/) (gerenciador de pacotes)
- [Docker](https://www.docker.com/)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

## Configuração do Ambiente

1. Clone o repositório:

   ```sh
   git clone https://github.com/Phygital-Live-Marketing-LTDA/just-live-ca-rir2024.git
   cd /just-live-ca-rir2024
   ```

## Configuração do Supabase Local e aplicação

1. 1. Inicie o Supabase localmente:

```sh
npx supabase start
```

2. Cole os seguintes os valores que irão aparecer no terminal no arquivo `.env`

- Em `NEXT_PUBLIC_SUPABASE_URL` = `API URL`
- Em `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `anon key`

3. Agora rode o comando `pnpm db:reset` ou `npm db:reset`

- Isso vai adicionar as tabelas e a seed inicial

4. Instale as dependências com `pnpm install` ou `npm install`

5. Inicie a aplicação com `pnpm dev` ou `npm dev` e abra em http://localhost:3000

## Sincronizando com a nuvem

- Rode o comando `npm run db:push`
- Se houver um erro "must be the owner of the table...":
  - vá na página do projeto do supabase online e escreva o seguinte comando na aba de "SQL Editor" `ALTER TABLE "nome_da_tabela OWNER TO postgres"`

### Feito para Phygital Solutions por Douglas Yokomizo
