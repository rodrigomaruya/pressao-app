#!/usr/bin/env node

/**
 * Script para criar/atualizar usuário de teste para o webhook
 *
 * Uso:
 *   npx tsx create-test-user.ts
 *   npx tsx create-test-user.ts --phone=+5511987654321 --time=08:30
 */

import { prisma } from "./src/utils/prisma";

async function createTestUser() {
  try {
    console.log("🧪 Criando usuário de teste para webhook de reminders...\n");

    // Pega argumentos da CLI
    const args = process.argv.slice(2);
    const phoneArg = args.find((a) => a.startsWith("--phone="))?.split("=")[1];
    const timeArg = args.find((a) => a.startsWith("--time="))?.split("=")[1];

    const testPhone = phoneArg || "+5511987654321"; // Substitua pelo seu número real
    const testTime = timeArg || "14:00"; // Horário do reminder

    console.log("📊 Configuração:");
    console.log(`   Email: test-reminder@exemplo.com`);
    console.log(`   Telefone: ${testPhone}`);
    console.log(`   Horário Reminder: ${testTime}`);
    console.log(`   Reminder Habilitado: true\n`);

    // Upsert usuário de teste
    const user = await prisma.user.upsert({
      where: { email: "test-reminder@exemplo.com" },
      update: {
        phone: testPhone,
        reminderTime: testTime,
        reminderEnabled: true,
        name: "Usuário Teste",
      },
      create: {
        email: "test-reminder@exemplo.com",
        phone: testPhone,
        reminderTime: testTime,
        reminderEnabled: true,
        name: "Usuário Teste",
      },
    });

    console.log("✅ Usuário criado/atualizado com sucesso!\n");
    console.log("📝 Detalhes:");
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Telefone: ${user.phone}`);
    console.log(`   Horário Reminder: ${user.reminderTime}`);
    console.log(`   Habilitado: ${user.reminderEnabled}\n`);

    console.log("🚀 Próximos passos:");
    console.log(
      `   1. Aguarde até ${testTime} (hora local) ou use:
          curl -X POST "http://localhost:3000/api/webhooks/send-reminder?time=${testTime}"`,
    );
    console.log(
      `   2. Verifique se recebe mensagem no WhatsApp do número ${testPhone}`,
    );
    console.log(
      `   3. Use ?test=true para modo simulação sem enviar:
          curl "http://localhost:3000/api/webhooks/send-reminder?test=true"`,
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Erro:",
      error instanceof Error ? error.message : String(error),
    );
    console.log("\n💡 Dicas:");
    console.log("   - Use formato E.164: +55 + DDD + número");
    console.log("   - Ex: +5511987654321 (São Paulo)");
    console.log("   - Horário em formato 24h: HH:MM");
    process.exit(1);
  }
}

createTestUser();
