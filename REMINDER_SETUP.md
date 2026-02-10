# 📱 Guia de Configuração - Reminders via Twilio WhatsApp

## 🚀 Quick Start

### 1. Instale Twilio SDK

```bash
npm install twilio
```

### 2. Configure Variáveis de Ambiente

Adicione ao seu `.env.local`:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155552671
WEBHOOK_SECRET=seu_webhook_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Obtenha Credenciais Twilio

1. Crie conta em: https://www.twilio.com/console
2. Vá para: **Messaging → Try it out → Send a WhatsApp message**
3. Copie seu `Account SID` e `Auth Token`
4. Pegue o número Twilio fornecido (formato: +14155552671)

## 📊 Uso do Webhook

### Enviar Reminders AGORA

```bash
curl -X POST http://localhost:3000/api/webhooks/send-reminder
```

### Enviar para Horário Específico

```bash
# Busca usuários com reminderTime="08:30" e envia
curl -X POST "http://localhost:3000/api/webhooks/send-reminder?time=08:30"
```

### Modo Teste (sem enviar)

```bash
curl "http://localhost:3000/api/webhooks/send-reminder?test=true"
# Exemplo de resposta:
# {
#   "status": "ok",
#   "currentTime": "08:30",
#   "usersReadyToRemind": 3,
#   "users": [
#     { "id": "...", "name": "João", "email": "joao@email.com", ... }
#   ]
# }
```

### Health Check

```bash
curl http://localhost:3000/api/webhooks/send-reminder
```

## ⏰ Agendamento Automático

### Opção 1: Node-Cron (Recomendado para Dev)

```bash
npm install node-cron --save-dev
npx tsx src/utils/reminder-scheduler.ts
```

O script executa a cada 5 minutos e envia reminders para usuários com `reminderEnabled=true`.

### Opção 2: Cron do Sistema (Linux/Mac)

```bash
# Editar crontab
crontab -e

# Adicionar linha para executar a cada 5 minutos
*/5 * * * * curl -X POST "http://localhost:3000/api/webhooks/send-reminder"
```

### Opção 3: GitHub Actions (Produção)

Crie `.github/workflows/send-reminders.yml`:

```yaml
name: Send WhatsApp Reminders

on:
  schedule:
    - cron: "*/5 * * * *" # A cada 5 minutos
  workflow_dispatch:

jobs:
  send-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger reminder webhook
        run: |
          curl -X POST \
            https://seu-app.vercel.app/api/webhooks/send-reminder \
            -H "Content-Type: application/json"
```

### Opção 4: Vercel Cron (Se usar Vercel)

Edite `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/webhooks/send-reminder",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

## 📝 Detalhes do Webhook

### Request

- **Método**: POST
- **URL**: `/api/webhooks/send-reminder`
- **Query Params**:
  - `time=HH:MM` (opcional): Envia só para esse horário específico
  - `test=true` (em GET): Modo teste sem enviar

### Response (Sucesso)

```json
{
  "success": true,
  "targetTime": "08:30",
  "totalUsers": 2,
  "results": [
    {
      "userId": "user123",
      "email": "joao@email.com",
      "phone": "+5511987654321",
      "status": "success",
      "messageSid": "SMxxxxxxxxxxxxxxxx"
    }
  ]
}
```

### Response (Erro)

```json
{
  "success": false,
  "error": "Variáveis de ambiente Twilio não configuradas"
}
```

## 🔐 Segurança

### Validar Requisições (Opcional)

Adicione validação no webhook para aceitar só chamadas autorizadas:

```typescript
// No início do handler
const secret = request.headers.get("X-Webhook-Secret");
if (secret !== process.env.WEBHOOK_SECRET) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

### Proteger com IP Whitelist

Se usar serviço externo (cron), adicione whitelist de IPs.

## 📋 Fluxo de Dados

```
1. Usuário define "reminderTime" (ex: 08:30) no app
2. Sistema salva em User.reminderTime
3. Webhook executa a cada X minutos (cron)
4. Busca usuários com reminderEnabled=true e reminderTime=agora
5. Valida telefonse em E.164 (+5511987654321)
6. Envia via Twilio WhatsApp API
7. Loga resultado (SID, erros, etc)
```

## ✅ Checklist de Implementação

- [ ] Instalar Twilio SDK
- [ ] Adicionar variáveis de ambiente
- [ ] Fazer teste com `?test=true`
- [ ] Fazer teste com um número real
- [ ] Configurar agendamento automático (cron)
- [ ] Testar resposta STOP do usuário (opcional)
- [ ] Adicionar logging/monitoramento
- [ ] Testar em produção

## 🐛 Troubleshooting

### "Variáveis de ambiente não configuradas"

- Verifique `.env.local` tem TWILIO_ACCOUNT_SID, AUTH_TOKEN e WHATSAPP_NUMBER
- Reinicie o servidor Next.js

### "Número de telefone inválido"

- Certifique que números estão em E.164 (+55 + DDD + número)
- Ex: +5511987654321 (São Paulo)

### "Message failed to send"

- Verifique seu número Twilio está em sandbox (precisa aprovar números para teste)
- Credenciais expiradas? Reneove em console.twilio.com

### "401 Unauthorized"

- Credenciais Twilio incorretas
- Token expirado

## 📚 Links Úteis

- Docs Twilio: https://www.twilio.com/docs/whatsapp/api
- Dashboard Twilio: https://console.twilio.com
- Sandbox WhatsApp: https://console.twilio.com/messaging
- Prisma Docs: https://www.prisma.io/docs
