import { NextRequest, NextResponse } from "next/server";
import { Twilio } from "twilio";
import { prisma } from "@/utils/prisma";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFromNumber = process.env.TWILIO_WHATSAPP_NUMBER; // ex: whatsapp:+14155552671

if (!accountSid || !authToken || !whatsappFromNumber) {
  throw new Error(
    "Variáveis de ambiente Twilio não configuradas (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER)",
  );
}

const client = new Twilio(accountSid, authToken);

/**
 * Valida e formata número para E.164 (ex: +5511987654321)
 */
function formatPhoneToE164(phone: string | null | undefined): string | null {
  if (!phone) return null;

  // Remove caracteres especiais
  const cleaned = phone.replace(/\D/g, "");

  // Se não começa com +55 (código Brasil) ou 55, assume Brasil
  let formatted = cleaned;
  if (!formatted.startsWith("55")) {
    formatted = "55" + formatted;
  }

  return "+" + formatted;
}

/**
 * POST /api/webhooks/send-reminder
 * Envia lembretes de medição de pressão via WhatsApp
 *
 * Query params:
 * - ?time=HH:MM (opcional) - só envia para usuários com esse horário
 */
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const specificTime = searchParams.get("time");

    // Busca hora atual (BRT: UTC-3)
    const now = new Date();
    const brazilTime = new Date(
      now.toLocaleString("en-US", {
        timeZone: "America/Sao_Paulo",
      }),
    );

    const currentHour = String(brazilTime.getHours()).padStart(2, "0");
    const currentMinute = String(brazilTime.getMinutes()).padStart(2, "0");
    const currentTime = `${currentHour}:${currentMinute}`;

    // Se especificado time na query, usa aquele; senão usa a hora atual
    const targetTime = specificTime || currentTime;

    console.log(
      `[REMINDER WEBHOOK] Procurando usuários com horário: ${targetTime}`,
    );

    // Busca usuários com reminder habilitado e com esse horário
    const usersToRemind = await prisma.user.findMany({
      where: {
        reminderEnabled: true,
        reminderTime: targetTime,
        phone: {
          not: null,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });

    console.log(
      `[REMINDER WEBHOOK] ${usersToRemind.length} usuário(s) encontrado(s)`,
    );

    const results = [];

    // Envia mensagem para cada usuário
    for (const user of usersToRemind) {
      try {
        const phoneE164 = formatPhoneToE164(user.phone);

        if (!phoneE164) {
          console.warn(
            `[REMINDER WEBHOOK] Telefone inválido para usuário ${user.id}`,
          );
          results.push({
            userId: user.id,
            email: user.email,
            status: "error",
            message: "Telefone inválido",
          });
          continue;
        }

        // Envia mensagem via WhatsApp
        const message = await client.messages.create({
          from: whatsappFromNumber,
          to: `whatsapp:${phoneE164}`,
          body: `Olá ${user.name || ""}! 👋\n\nÉ a hora de medir sua pressão arterial. 📊\n\nAcesse o app e registre sua medição agora!\n\nDigite STOP para não receber mais lembretes.`,
        });

        console.log(
          `[REMINDER WEBHOOK] Mensagem enviada para ${user.email}: SID ${message.sid}`,
        );

        results.push({
          userId: user.id,
          email: user.email,
          phone: phoneE164,
          status: "success",
          messageSid: message.sid,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error(
          `[REMINDER WEBHOOK] Erro ao enviar para ${user.email}:`,
          errorMessage,
        );

        results.push({
          userId: user.id,
          email: user.email,
          status: "error",
          message: errorMessage,
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        targetTime,
        totalUsers: usersToRemind.length,
        results,
      },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[REMINDER WEBHOOK] Erro geral:", errorMessage);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/webhooks/send-reminder
 * Health check e informações do webhook
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const testMode = searchParams.get("test") === "true";

    if (testMode) {
      // Modo teste: simula o envio sem chamar Twilio
      const now = new Date();
      const brazilTime = new Date(
        now.toLocaleString("en-US", {
          timeZone: "America/Sao_Paulo",
        }),
      );

      const currentHour = String(brazilTime.getHours()).padStart(2, "0");
      const currentMinute = String(brazilTime.getMinutes()).padStart(2, "0");
      const currentTime = `${currentHour}:${currentMinute}`;

      const users = await prisma.user.findMany({
        where: {
          reminderEnabled: true,
          reminderTime: currentTime,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      });

      return NextResponse.json({
        status: "ok",
        message: "Webhook de lembretes está funcionando",
        brazilTime: brazilTime.toISOString(),
        currentTime,
        testMode: true,
        usersReadyToRemind: users.length,
        users: users.map(
          (u: {
            id: string;
            name: string | null;
            email: string;
            phone: string | null;
          }) => ({
            ...u,
            phoneFormatted: formatPhoneToE164(u.phone),
          }),
        ),
      });
    }

    return NextResponse.json({
      status: "ok",
      message: "Webhook de lembretes está funcionando",
      usage: {
        post: "POST /api/webhooks/send-reminder - Envia lembretes agora",
        postWithTime:
          "POST /api/webhooks/send-reminder?time=HH:MM - Envia para um horário específico",
        testMode: "GET /api/webhooks/send-reminder?test=true - Modo teste",
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        status: "error",
        message: errorMessage,
      },
      { status: 500 },
    );
  }
}
