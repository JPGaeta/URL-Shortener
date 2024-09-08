# URL-Shortener

# API Encurtadora de URLs

Este projeto é uma API robusta e eficiente para encurtar URLs. A API fornece uma maneira rápida e segura de encurtar URLs longas, tornando-as mais gerenciáveis e compartilháveis.

## Tecnologias utilizadas

- NestJS,
- TypeScript
- Express
- Prisma
- PostgreSQL

## Características Principais

- **Cadastro de Usuários**: Permite que os usuários se registrem e mantenham suas próprias URLs encurtadas.
- **Autenticação de Usuários com JWT**: Implementa a autenticação JWT para garantir a segurança e a integridade dos dados do usuário.
- **Cadastro de URLs**: Os usuários podem encurtar qualquer URL, com ou sem estar autenticados. As URLs encurtadas são únicas e persistentes.
- **Alteração do Destino da URL**: Os usuários têm a capacidade de alterar o destino de suas URLs encurtadas a qualquer momento.
- **Deleção da URL**: As URLs encurtadas podem ser excluídas pelos usuários a qualquer momento, proporcionando controle total sobre suas URLs.

Este projeto é perfeito para quem deseja um serviço de encurtamento de URL personalizado e seguro.

## Formas de Instalação/Utilização do Projeto

### 1. Acessar o Link da API Hospedada na Cloud

Você pode acessar a API diretamente através do link abaixo:

[URL-Shortener-API](http://68.183.154.173:5000/)

> **Importante:** Este link será desativado em breve por motivos de segurança.

### 2. Utilizando Docker

Para utilizar o Docker, siga os passos abaixo:

1.  Crie o arquivo `docker.env` baseado no `docker.env.example`.
2.  Execute o comando:
    ```sh
    docker compose build
    ```
3.  Depois do build, execute:
    ```sh
    docker compose up
    ```
    Isso irá gerar o banco de dados, construir o projeto e deixá-lo pronto para uso local.

### 3. Clonando o Repositório

Para clonar o repositório e rodar o projeto localmente, siga os passos abaixo:

1.  Clone o repositório e crie o arquivo `.env` baseado no `.env.example`.
2.  Certifique-se de ter o Node.js 20 e o Yarn instalados na sua máquina, além do PostgreSQL rodando localmente ou em cloud.
3.  Instale as dependências:

    ```sh
    yarn install
    ```

4.  Gere os arquivos Prisma:

    ```sh
    npx prisma generate
    ```

5.  Execute as migrações do Prisma:

    ```sh
    npx prisma migrate dev
    ```

    > **Nota:** Execute `npx prisma migrate deploy` em ambientes de produção.

6.  Para rodar o projeto em desenvolvimento:

    ```sh
    yarn start:dev
    ```

    Para rodar o projeto em produção:

    ```sh
    yarn build
    yarn start:prod
    ```

# Como o projeto funciona

Este projeto possui uma documentação completa das rotas disponíveis na URL "/docs". Esta documentação inclui todos os parâmetros, corpos de solicitação e autenticações necessárias para cada rota.

## Uso Sem Autenticação

1.  **Criação de Link Curto**: Utilize a rota de criação de link curto, passando a URL destino desejada. Você receberá a URL encurtada como retorno.

2.  **Redirecionamento**: Insira a URL encurtada retornada em seu navegador preferido para ser redirecionado para a URL destino.

## Uso Com Autenticação

1.  **Criação de Conta**: Utilize a rota de SignUp para criar sua conta.

2.  **Login**: Faça login no sistema com as credenciais cadastradas para receber seu token de autenticação.

3.  **Uso do Token**: Envie seu token no cabeçalho de autorização ("Authorization: Bearer {token}") nas rotas que requerem autenticação.

4.  **Criação de Link Curto**: Quando criar um novo link curto enquanto autenticado, este link será automaticamente associado à sua conta.

5.  **Visualização de Links Curtos**: Utilize a rota get para receber todos os links curtos que pertencem à sua conta.

6.  **Atualização de URL Destino**: Utilize a rota de atualização para alterar a URL destino de um link curto existente.

7.  **Exclusão de Link**: Se precisar excluir um link curto, utilize a rota de exclusão.

# Diferenciais do Projeto

Este projeto possui uma série de características que o destacam:

- **Versões do NodeJS**: O projeto define e assegura quais versões do NodeJS são aceitas, garantindo a compatibilidade e a estabilidade.
- **Git Tags para Versões de Release**: Utilizamos Git tags para definir versões de release, facilitando o rastreamento de mudanças e melhorias.
- **Deploy em Cloud Provider**: O projeto é implantado em um provedor de cloud e o link é disponibilizado no README para acesso fácil.
- **Docker-Compose**: Utilizamos Docker-Compose para facilitar a configuração e inicialização do ambiente completo localmente.
- **Testes Unitários**: O projeto possui testes unitários para garantir que todas as partes do código funcionem como esperado.
- **Documentação da API**: A API está completamente documentada com OPEN API ou Swagger, facilitando o entendimento e uso da API.
- **Validação de Entrada**: Implementamos validação de entrada em todos os lugares necessários para garantir a segurança e a integridade dos dados.
- **Hooks de Pré-Commit ou Pré-Push**: Configuramos hooks de pré-commit ou pré-push para garantir a qualidade do código antes de qualquer commit ou push.
- **GitHub Actions**: Utilizamos GitHub Actions para automatizar a execução de lint e testes, garantindo a qualidade contínua do código.
