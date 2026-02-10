import { auth } from "@/utils/auth";
import { prisma } from "@/utils/prisma";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/_components/settings-form";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: "Configurações - Pressão App",
  description: "Configure suas informações pessoais e lembretes",
};

export default async function SettingPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      dateOfBirth: true,
      reminderTime: true,
      reminderEnabled: true,
    },
  });

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Configurações
            </h1>
            <Link
              href={"/dashboard"}
              className="bg-neutral-900 text-white hover:opacity-75 flex items-center rounded-md px-2"
            >
              Dashboard
            </Link>
          </div>
          <p className="text-gray-600 text-lg">
            Configure suas informações pessoais e preferências de lembretes
          </p>
        </div>

        {/* Card com Formulário */}
        <Card className="bg-white shadow-lg border-0">
          <div className="p-6 md:p-8">
            <SettingsForm user={{ ...user, name: user.name ?? undefined }} />
          </div>
        </Card>

        {/* Info Box */}
        <Card className="mt-6 bg-green-50 border-green-200">
          <div className="p-4">
            <h3 className="font-semibold text-green-900 mb-2">💡 Dica</h3>
            <p className="text-sm text-green-800">
              Seus dados são salvos de forma segura e utilizados apenas para
              enviar lembretes e melhorar seu acompanhamento de pressão
              arterial.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
