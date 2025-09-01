# Instruções de Setup e Execução Local

Este documento fornece o passo a passo para configurar e rodar o projeto do dashboard na sua máquina local.

---

## Requisitos

Você precisará ter o [Node.js](https://nodejs.org/) (que inclui o `npm`) instalado na sua máquina.

---

## Setup do Projeto (Primeira Vez)

1.  **Clone o Repositório:**
    -   Abra um terminal ou prompt de comando.
    -   Clone o projeto do GitHub para a sua máquina:
        ```bash
        git clone https://github.com/laynes79-droid/clash.git
        ```
    -   Entre na pasta do projeto:
        ```bash
        cd clash
        ```

2.  **Instale as Dependências:**
    -   Dentro da pasta `clash`, rode o seguinte comando para instalar as dependências do servidor (Express, etc.):
        ```bash
        npm install
        ```
    -   Isso criará uma pasta `node_modules` que não deve ser enviada para o GitHub.

3.  **Configure sua Chave da API:**
    -   Na raiz do projeto, crie um novo arquivo chamado `.env`.
    -   Dentro deste arquivo `.env`, adicione a seguinte linha, substituindo `SUA_CHAVE_AQUI` pela sua chave real da Supercell:
        ```
        SUPERCELL_API_KEY=SUA_CHAVE_AQUI
        ```
    -   **Importante:** O arquivo `.gitignore` já está configurado para impedir que este arquivo `.env` seja enviado para o GitHub, mantendo sua chave segura.

4.  **Libere seu IP na Supercell:**
    -   Vá ao portal de desenvolvedores da Supercell.
    -   Edite sua chave de API e adicione o endereço de IP da sua máquina/rede. Você pode descobrir seu IP público pesquisando "meu ip" no Google.

---

## Como Rodar o Dashboard

1.  **Inicie o Servidor Local:**
    -   Com o terminal aberto na pasta do projeto, rode o comando:
        ```bash
        npm start
        ```
    -   Você verá uma mensagem `Servidor do dashboard rodando em http://localhost:3000`.

2.  **Acesse o Dashboard:**
    -   Abra o seu navegador de internet e acesse o seguinte endereço:
        [http://localhost:3000/index.html](http://localhost:3000/index.html)

O dashboard deverá carregar e exibir os dados do clã. Enquanto o terminal estiver com o servidor rodando, o site estará no ar na sua máquina. Para parar o servidor, volte ao terminal e pressione `Ctrl + C`.
