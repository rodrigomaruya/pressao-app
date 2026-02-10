"use server";

import { prisma } from "@/utils/prisma";
import { auth } from "@/utils/auth"; // ou next-auth, clerk, etc

export async function getMyBloodPressureMeasurements() {
  // 1. Autenticação (obrigatória)
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado");
  }

  // 2. Busca no banco
  const measurements = await prisma.measurement.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      measuredAt: "desc",
    },
  });

  return measurements;
}
