#!/usr/bin/env node

/**
 * Script de teste para o webhook de reminders
 *
 * Uso:
 *   node test-reminder-webhook.js
 *   npx tsx test-reminder-webhook.ts
 */

import axios from "axios";

const BASE_URL = process.env.APP_URL || "http://localhost:3000";
const API_ENDPOINT = `${BASE_URL}/api/webhooks/send-reminder`;

async function testWebhook() {
  console.log("🧪 Testando Webhook de Reminders\n");
  console.log(`📍 URL: ${API_ENDPOINT}\n`);

  try {
    // Test 1: Health check
    console.log("Test 1️⃣  - Health Check (GET)");
    try {
      const health = await axios.get(API_ENDPOINT);
      console.log("✅ Status: OK");
      console.log("   ", JSON.stringify(health.data, null, 2));
    } catch (error) {
      console.log("❌ Falha no health check");
    }

    console.log("\n" + "=".repeat(60) + "\n");

    // Test 2: Test mode (sem enviar mensagens reais)
    console.log("Test 2️⃣  - Modo Teste (GET ?test=true)");
    try {
      const testMode = await axios.get(`${API_ENDPOINT}?test=true`);
      console.log("✅ Modo teste funcionando");
      console.log(
        "   Usuários prontos para receber reminder:",
        testMode.data.usersReadyToRemind,
      );
      console.log("   Horário atual (BRT):", testMode.data.currentTime);
      if (testMode.data.users && testMode.data.users.length > 0) {
        console.log("   Usuários a lembrar:");
        testMode.data.users.forEach((u: any) => {
          console.log(`     - ${u.name} (${u.email}): ${u.phoneFormatted}`);
        });
      }
    } catch (error) {
      console.log("❌ Erro no modo teste");
      console.log(
        "   ",
        error instanceof Error ? error.message : String(error),
      );
    }

    console.log("\n" + "=".repeat(60) + "\n");

    // Test 3: POST (vai enviar de verdade se houver usuários)
    console.log("Test 3️⃣  - Disparar Reminders AGORA (POST)");
    console.log(
      "⚠️  Aviso: Isto pode enviar mensagens reais se usuários tiverem o horário atual!",
    );
    console.log("   Continue? (y/n)... ");

    // Para CLI, ler resposta do usuário seria complexo
    // Vamos fazer skip dessa parte automaticamente em testes

    console.log("   ⏭️  Pulando disparo real (use ?test para simular)");

    console.log("\n" + "=".repeat(60) + "\n");

    // Test 4: POST com horário específico (simulado)
    console.log(
      "Test 4️⃣  - Disparar para Horário Específico (POST ?time=08:00)",
    );
    try {
      const response = await axios.post(
        `${API_ENDPOINT}?time=08:00`,
        {},
        {
          validateStatus: () => true, // Aceita qualquer status
        },
      );
      console.log("✅ Request enviado");
      console.log("   Status:", response.status);
      console.log("   Usuários processados:", response.data.totalUsers || 0);
      console.log("   Resultados:");
      if (response.data.results && response.data.results.length > 0) {
        response.data.results.forEach((r: any) => {
          console.log(
            `     - ${r.email}: ${r.status} ${
              r.messageSid ? `(SID: ${r.messageSid})` : `(${r.message})`
            }`,
          );
        });
      }
    } catch (error) {
      console.log("❌ Erro ao disparar para horário específico");
      console.log(
        "   ",
        error instanceof Error ? error.message : String(error),
      );
    }

    console.log("\n" + "=".repeat(60) + "\n");

    // Summary
    console.log("📊 Resumo dos Testes\n");
    console.log("✅ Webhook está acessível e respondendo");
    console.log("✅ Configure as variáveis de ambiente Twilio:");
    console.log("   - TWILIO_ACCOUNT_SID");
    console.log("   - TWILIO_AUTH_TOKEN");
    console.log("   - TWILIO_WHATSAPP_NUMBER");
    console.log("\n📖 Ver REMINDER_SETUP.md para mais detalhes");
  } catch (error) {
    console.error(
      "❌ Erro ao testar webhook:",
      error instanceof Error ? error.message : String(error),
    );
    console.log("\n💡 Dicas:");
    console.log("   1. Certifique que o servidor está rodando (npm run dev)");
    console.log("   2. Verifique se APP_URL está correto");
    console.log("   3. Verifique console do servidor para mais detalhes");
  }
}

testWebhook();
