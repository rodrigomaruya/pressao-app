# 🚀 Webhook de Reminders via Twilio WhatsApp - Implementação Completa

Criei um webhook completo para enviar lembretes de medição de pressão via WhatsApp usando Twilio.

## 📁 Arquivos Criados

1. **[src/app/api/webhooks/send-reminder/route.ts](src/app/api/webhooks/send-reminder/route.ts)**
   - Rota de API com POST e GET handlers
   - Busca usuários com `reminderEnabled=true` e `reminderTime` matching
   - Envia mensagens via Twilio WhatsApp API
   - Inclui validação de telefone em E.164
   - Logging completo de sucesso/erro

2. **[src/utils/reminder-scheduler.ts](src/utils/reminder-scheduler.ts)**
   - Script para agendar reminders automaticamente com node-cron
   - Pode ser usado em desenvolvimento

3. **[REMINDER_SETUP.md](REMINDER_SETUP.md)**
   - Guia completo de configuração
   - Múltiplas opções de agendamento (cron, GitHub Actions, Vercel)
   - Exemplos de uso com curl

4. **[.env.twilio.example](.env.twilio.example)**
   - Template com variáveis de ambiente necessárias

5. **[test-reminder-webhook.ts](test-reminder-webhook.ts)**
   - Script de teste automatizado

## ⚡ Quick Start (3 passos)

### 1. Instalar Twilio (já feito ✅)

```bash
npm install twilio
```

### 2. Adicionar ao `.env.local`

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155552671
WEBHOOK_SECRET=seu_webhook_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Como obter:**

- Crie conta em https://www.twilio.com/console
- Vá para Messaging → Try it out → Send a WhatsApp message
- Copie Account SID e Auth Token
- Use o número Twilio fornecido

### 3. Testar

```bash
# Modo teste (sem enviar mensagens)
curl "http://localhost:3000/api/webhooks/send-reminder?test=true"

# Disparar reminders AGORA
curl -X POST http://localhost:3000/api/webhooks/send-reminder
```

## 🔄 Fluxo

```
┌──────────────────────┐
│   Usuário            │
│  - reminderTime: 08:30 │
│  - reminderEnabled: true │
│  - phone: +5511987654321 │
└──────────────┬───────┘
               │
               ▼
┌──────────────────────────┐
│  Webhook Cron/Scheduler  │ ← Executa a cada 5 mins
│  (GitHub Actions, Cron)  │
└──────────────┬───────────┘
               │ POST
               ▼
┌──────────────────────────────────────┐
│  /api/webhooks/send-reminder         │
│  - Busca users com reminderTime≈now  │
│  - Valida phones em E.164            │
│  - Envia via Twilio WhatsApp         │
└──────────────┬──────────────────────┘
               │
               ▼
        Twilio API
               │
               ▼
        WhatsApp do Usuário
```

## 📊 Exemplos de Uso

### Teste Rápido (sem enviar)

```bash
curl "http://localhost:3000/api/webhooks/send-reminder?test=true"
```

**Resposta:**

```json
{
  "status": "ok",
  "currentTime": "14:30",
  "usersReadyToRemind": 2,
  "users": [
    {
      "id": "user123",
      "name": "João",
      "email": "joao@email.com",
      "phone": "+5511987654321",
      "phoneFormatted": "+5511987654321"
    }
  ]
}
```

### Disparar para Horário Específico

```bash
curl -X POST "http://localhost:3000/api/webhooks/send-reminder?time=08:30"
```

**Resposta (sucesso):**

```json
{
  "success": true,
  "targetTime": "08:30",
  "totalUsers": 1,
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

## ⏰ Agendamento (Escolha uma opção)

### Opção 1: Node-Cron (Desenvolvimento)

```bash
npx tsx src/utils/reminder-scheduler.ts
```

Executa a cada 5 minutos enquanto o script rodar.

### Opção 2: Cron do Sistema (Linux/Mac/WSL)

```bash
crontab -e
# Adicione:
*/5 * * * * curl -X POST http://localhost:3000/api/webhooks/send-reminder
```

### Opção 3: GitHub Actions (Produção - Recomendado)

Crie `.github/workflows/send-reminders.yml`:

```yaml
name: Send WhatsApp Reminders

on:
  schedule:
    - cron: "*/5 * * * *"

jobs:
  send-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger reminder webhook
        run: |
          curl -X POST https://seu-app.vercel.app/api/webhooks/send-reminder
        env:
          WEBHOOK_SECRET: ${{ secrets.WEBHOOK_SECRET }}
```

### Opção 4: Vercel Crons

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

## 🔐 Segurança (Opcional)

Para proteger o webhook (recomendado em produção):

```typescript
// No início do handler
const secret = request.headers.get("X-Webhook-Secret");
if (secret !== process.env.WEBHOOK_SECRET) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

Chamadas autorizadas:

```bash
curl -X POST \
  http://localhost:3000/api/webhooks/send-reminder \
  -H "X-Webhook-Secret: seu_webhook_secret"
```

## 📝 Mensagem Enviada

```
Olá João! 👋

É a hora de medir sua pressão arterial. 📊

Acesse o app e registre sua medição agora!

Digite STOP para não receber mais lembretes.
```

## 🐛 Troubleshooting

| Problema                     | Solução                                                                    |
| ---------------------------- | -------------------------------------------------------------------------- |
| "Variáveis não configuradas" | Verifique `.env.local` tem TWILIO_ACCOUNT_SID, AUTH_TOKEN, WHATSAPP_NUMBER |
| "Número inválido"            | Use E.164: +55 + DDD + número (ex: +5511987654321)                         |
| "Message failed"             | Verifique credenciais e que número está aprovado no sandbox Twilio         |
| Nenhum usuário encontrado    | Confirme usuário tem `reminderEnabled=true` em banco                       |

## ✅ Checklist

- [ ] Variáveis Twilio adicionadas ao `.env.local`
- [ ] Testado com `?test=true`
- [ ] Testado com um número real
- [ ] Agendamento configurado (cron/GitHub Actions/etc)
- [ ] Script rodando em produção
- [ ] Logs sendo monitorados

## 📚 Próximos Passos

1. **Integrar com Settings Form**: Usuário já pode definir `reminderTime` em settings
2. **Logar Reminders**: Criar tabela `ReminderLog` para histórico de envios
3. **Responder a STOP**: Implementar webhook de inbound SMS para desabilitar reminders
4. **Dashboard**: Mostrar status de último reminder enviado

## 🔗 Links

- [Documentação Twilio WhatsApp](https://www.twilio.com/docs/whatsapp/api)
- [Twilio Console](https://console.twilio.com)
- [Node-Cron Docs](https://github.com/node-cron/node-cron)
