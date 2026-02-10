"use server";

import { auth } from "@/utils/auth";
import { prisma } from "@/utils/prisma";
import { revalidatePath } from "next/cache";

interface UpdateUserSettingsInput {
  name?: string;
  dateOfBirth?: string;
  phone?: string;
  reminderTime?: string;
  reminderEnabled?: boolean;
}

export async function updateUserSettings(data: UpdateUserSettingsInput) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { error: "Não autenticado" };
    }

    const updateData: any = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.dateOfBirth) {
      updateData.dateOfBirth = new Date(data.dateOfBirth);
    }

    if (data.phone !== undefined) {
      updateData.phone = data.phone;
    }

    if (data.reminderTime !== undefined) {
      updateData.reminderTime = data.reminderTime;
    }

    if (data.reminderEnabled !== undefined) {
      updateData.reminderEnabled = data.reminderEnabled;
    }

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
    });

    revalidatePath("/setting");
    revalidatePath("/dashboard");

    return { success: true, user };
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error);
    return { error: "Erro ao atualizar configurações" };
  }
}
