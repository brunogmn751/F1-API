# F1 API

API REST em Node.js e Express com dados de pilotos e equipes de uma temporada de Fórmula 1. Permite consultar a classificação, cadastrar, editar e remover pilotos. A pontuação das equipes é calculada a partir dos pilotos.

## Tecnologias

- Node.js (ES Modules)
- Express 5
- Joi, para validar os dados de entrada
- Helmet, para os cabeçalhos de segurança HTTP

## Como rodar

Requer Node.js instalado.

```bash
git clone https://github.com/brunogmn751/F1-API.git
cd F1-API
npm install
npm run dev
```

A API fica disponível em `http://localhost:3000`.

Os dados ficam em memória, em `data.js`. Qualquer alteração se perde quando o servidor reinicia.

## Endpoints

Todas as rotas começam com `/api/v1`.

### Pilotos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/drivers` | Lista os pilotos, ordenados por pontos |
| GET | `/drivers/standings/:position` | Retorna o piloto na posição informada |
| GET | `/drivers/:id` | Retorna um piloto pelo ID |
| POST | `/drivers` | Cadastra um piloto |
| PUT | `/drivers/:id` | Atualiza um ou mais campos de um piloto |
| DELETE | `/drivers/:id` | Remove um piloto e retorna a lista atualizada |

### Equipes

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/teams` | Lista as equipes, ordenadas pela soma dos pontos dos pilotos |
| GET | `/teams/standings/:position` | Retorna a equipe na posição informada |

## Exemplos

Consultar o segundo colocado:

```bash
curl http://localhost:3000/api/v1/drivers/standings/2
```

Cadastrar um piloto:

```bash
curl -X POST http://localhost:3000/api/v1/drivers \
  -H "Content-Type: application/json" \
  -d '{"name": "Novo Piloto", "team": "Ferrari", "points": 10}'
```

Campos aceitos:

| Campo | Tipo | Regra |
|-------|------|-------|
| `name` | texto | Obrigatório no POST, mínimo de 3 caracteres |
| `team` | texto | Obrigatório no POST, mínimo de 3 caracteres |
| `points` | número | Opcional, de 0 a 1000. No POST, o padrão é 0 |

## Erros

Dados inválidos ou posição fora da classificação retornam `400`. Um ID inexistente retorna `404`.

## Estrutura

```
app.js              Configuração do Express e tratamento de erros
data.js             Dados dos pilotos e cálculo da classificação das equipes
inputValidation.js  Schemas de validação com Joi
routes/
  drivers.js        Rotas de pilotos
  teams.js          Rotas de equipes
```

## Autor

Bruno Azevedo: [GitHub](https://github.com/brunogmn751) | [LinkedIn](https://www.linkedin.com/in/bruno-azvd/)
