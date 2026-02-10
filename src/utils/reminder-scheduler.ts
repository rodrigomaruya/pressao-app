/**
 * Script para agendar reminders automaticamente
 *
 * Opções de uso:
 * 1. NODE-CRON (recomendado para desenvolvimento):
 *    npm install node-cron
 *    tsx src/utils/reminder-scheduler.ts
 *
 * 2. CRON SISTEMA (Linux/Mac):
 *    0 8 * * * curl -X POST https://seu-app.com/api/webhooks/send-reminder
 *
 * 3. GITHUB ACTIONS:
 *    Ver arquivo workflow no README
 */

import axios from "axios";

const WEBHOOK_URL = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/send-reminder`
  : "http://localhost:3000/api/webhooks/send-reminder";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "seu-webhook-secret";

/**
 * Dispara o webhook de reminders
 */
export async function triggerReminder(time?: string) {
  try {
    const url = time ? `${WEBHOOK_URL}?time=${time}` : WEBHOOK_URL;

    const response = await axios.post(
      url,
      {},
      {
        headers: {
          "X-Webhook-Secret": WEBHOOK_SECRET,
        },
      },
    );

    console.log("[REMINDER TRIGGER] Sucesso:", response.data);
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[REMINDER TRIGGER] Erro:", errorMessage);
    throw error;
  }
}

/**
 * Inicia scheduler com node-cron
 * Executar: tsx src/utils/reminder-scheduler.ts
 */
export async function startReminderScheduler() {
  try {
    // Tenta importar node-cron (opcional)
    const cron = await import("node-cron");

    console.log("[SCHEDULER] Iniciando agendador de reminders...");

    // Agendar para todos os horários de lembretes salvos no banco
    // Para simplicidade, vamos executar a cada 5 minutos
    cron.schedule("*/5 * * * *", async () => {
      console.log(
        `[SCHEDULER] Verificando reminders em ${new Date().toLocaleString(
          "pt-BR",
          { timeZone: "America/Sao_Paulo" },
        )}`,
      );
      await triggerReminder();
    });

    console.log("[SCHEDULER] Agendador iniciado com sucesso ✅");
    console.log("[SCHEDULER] Verificando reminders a cada 5 minutos");
  } catch (error) {
    console.error(
      "[SCHEDULER] Erro ao iniciar agendador:",
      error instanceof Error ? error.message : String(error),
    );
    console.log(
      "[SCHEDULER] Instale node-cron: npm install node-cron --save-dev",
    );
  }
}

// Se executado como script direto
if (require.main === module) {
  startReminderScheduler().catch(console.error);
}
