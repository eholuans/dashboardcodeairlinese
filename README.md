# Dashboard Admin - CODE AIRLINE

Este é um arquivo README para o sistema de dashboard administrativo da CODE AIRLINE, que permite visualizar, inserir e excluir voos.

## Estrutura do Projeto

O projeto segue uma estrutura MVC (Model-View-Controller) com as seguintes pastas:

- `config/`: Configurações do sistema, incluindo conexão com o banco de dados
- `models/`: Modelos para interação com o banco de dados
- `views/`: Templates Handlebars para renderização das páginas
- `public/`: Arquivos estáticos (CSS, JavaScript, imagens)
- `routes/`: Rotas da aplicação

## Funcionalidades Implementadas

1. **Dashboard Principal**
   - Visão geral com estatísticas de voos
   - Gráficos de movimentação de passageiros
   - Distribuição de voos por período do dia
   - Estatísticas de bagagens

2. **Gestão de Voos**
   - Listagem completa de voos com filtros
   - Visualização detalhada com status colorido
   - Filtros por origem, destino e status

3. **Inserção de Voos**
   - Formulário completo para cadastro de novos voos
   - Validação de dados no frontend e backend
   - Seleção de companhias aéreas, aeroportos e status

4. **Exclusão de Voos**
   - Modal de confirmação para evitar exclusões acidentais
   - Exclusão segura com feedback visual

## Tecnologias Utilizadas

- Node.js com Express
- Handlebars como template engine
- MySQL para banco de dados
- Chart.js para gráficos
- CSS puro para estilização

## Como Executar

1. Configure as variáveis de ambiente no arquivo `.env` na pasta `config/`
2. Instale as dependências: `npm install`
3. Inicie o servidor: `node app.js`
4. Acesse: `http://localhost:3001`

## Banco de Dados

O sistema utiliza o banco de dados "aeroporto" com as seguintes tabelas principais:
- voo
- companhia_aerea
- aeroporto
- passageiro
- bagagem

## Screenshots

O sistema foi desenvolvido seguindo fielmente o layout fornecido, com interface responsiva e moderna.
