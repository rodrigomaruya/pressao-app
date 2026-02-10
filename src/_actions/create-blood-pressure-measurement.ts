"use server";

import { prisma } from "@/utils/prisma";
import { auth } from "@/utils/auth";
import { revalidatePath } from "next/cache";

interface Props {
  systolic: string;
  diastolic: string;
  pulse: string;
  notes: string;
}

export async function createBloodPressureMeasurement(data: Props) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  const systolic = Number(data.systolic);
  const diastolic = Number(data.diastolic);
  const pulseRaw = data.pulse;
  const notes = data.notes;

  const pulse =
    pulseRaw && pulseRaw.toString() !== "" ? Number(pulseRaw) : null;

  // validações médicas
  if (
    !Number.isInteger(systolic) ||
    !Number.isInteger(diastolic) ||
    systolic <= diastolic
  ) {
    throw new Error("Valores de pressão inválidos");
  }

  await prisma.measurement.create({
    data: {
      systolic,
      diastolic,
      pulse,
      notes,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  return {
    success: true,
    message: "Registrado com sucesso.",
  };
}
