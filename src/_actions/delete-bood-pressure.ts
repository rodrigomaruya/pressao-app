"use server";

import { prisma } from "@/utils/prisma";
import { auth } from "@/utils/auth";
import { revalidatePath } from "next/cache";

export async function deleteBloodPressure(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  if (!id) {
    throw new Error("Id não encontrado");
  }
  try {
    await prisma.measurement.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/dashboard");

    return {
      data: {
        message: "Deletado com sucesso.",
      },
    };
  } catch (error) {
    throw new Error("Falha ao deletar");
  }
}
