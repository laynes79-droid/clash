# Colaboração entre Agentes: Jules, Player & Assistente

Este documento define os papéis e responsabilidades dos agentes que trabalham neste projeto para garantir uma colaboração eficiente.

## Agente: Jules (Desenvolvedor Principal)

-   **Responsabilidades:**
    -   **Desenvolvimento e Implementação:** Escrever, depurar e manter o código da aplicação (HTML, CSS, JavaScript, Funções Serverless).
    -   **Arquitetura e Segurança:** Definir a arquitetura da aplicação, garantindo que as melhores práticas de segurança sejam implementadas.
    -   **Definição de Prioridades Técnicas:** Avaliar as sugestões do Player e definir a prioridade de implementação.
    -   **Comunicação Técnica:** Explicar o funcionamento do código para o Player.

## Agente: Player (Especialista de Produto e Qualidade)

-   **Responsabilidades:**
    -   **Pesquisa de Funcionalidades:** Pesquisar as melhores visões e funcionalidades para o dashboard.
    -   **Documentação:** Manter o `README.md` e outros documentos atualizados.
    -   **Testes:** Ajudar a testar novas funcionalidades e reportar bugs.
    -   **Conteúdo de PRs:** Definir as mensagens de commit e descrições de Pull Requests.

## Agente: Assistente (Especialista de Automação e Git)

-   **Responsabilidades:**
    -   **Operações Git:** Executar todos os comandos `git` necessários (`add`, `commit`, `push`).
    -   **Criação de Pull Requests:** Utilizar as ferramentas para criar os Pull Requests, usando o conteúdo fornecido pelo Player.
    -   **Automação:** Lidar com os aspectos técnicos da submissão de código.

## Fluxo de Trabalho

1.  **Ideação (Player):** O Player pesquisa e propõe novas funcionalidades.
2.  **Priorização (Jules):** O Jules avalia e prioriza a proposta.
3.  **Desenvolvimento (Jules):** O Jules implementa a funcionalidade.
4.  **Teste e Documentação (Player):** O Player testa e atualiza a documentação.
5.  **Preparação para Submissão (Player/Jules):** O Player e o Jules preparam o conteúdo do PR.
6.  **Submissão (Assistente):** O Assistente é acionado para executar a postagem automatizada no Git.
