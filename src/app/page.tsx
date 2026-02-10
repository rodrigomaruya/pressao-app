import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import {
  Activity,
  Heart,
  BarChart3,
  LayoutDashboard,
  LayoutDashboardIcon,
} from "lucide-react";
import { auth } from "@/utils/auth";
export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <span className="font-semibold text-foreground">Pressão</span>
          <div className="flex items-center gap-2">
            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className=" flex flex-col justify-center items-center text-white h-8 w-8 bg-neutral-900 rounded-full p-1"
                >
                  <LayoutDashboard />
                </Link>
                <Avatar>
                  <AvatarImage
                    src={session?.user?.image || undefined}
                    className="hover:opacity-75"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 md:py-20 min-h-[calc(100vh-200px)]">
        <section className="space-y-4 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Controle sua pressão arterial com simplicidade
          </h1>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Acompanhe medições, veja gráficos e receba lembretes. Tudo em um só
            lugar para cuidar da sua saúde.
          </p>
        </section>

        <section className="mt-16 grid gap-6 sm:grid-cols-3">
          <Card className="border-border/80">
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Activity className="size-5" />
              </div>
              <CardTitle className="text-base">Medir com frequência</CardTitle>
              <CardDescription>
                Registrar pressão sistólica e diastólica ajuda a identificar
                tendências e manter o controle.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/80">
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BarChart3 className="size-5" />
              </div>
              <CardTitle className="text-base">Acompanhar no tempo</CardTitle>
              <CardDescription>
                Gráficos simples mostram como sua pressão varia e facilitam a
                conversa com o médico.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/80">
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Heart className="size-5" />
              </div>
              <CardTitle className="text-base">Lembretes opcionais</CardTitle>
              <CardDescription>
                Configure um horário para não esquecer de medir e manter a
                rotina de cuidados.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>
        {!session?.user && (
          <section className="mt-20 rounded-xl border border-border bg-card p-8 text-center shadow-sm md:p-12">
            <h2 className="text-xl font-semibold text-foreground md:text-2xl">
              Comece a registrar suas medições
            </h2>
            <p className="mt-2 text-muted-foreground">
              Faça login com sua conta Google para acessar o dashboard e o
              histórico.
            </p>
            <div className="mt-6 flex justify-center">
              <GoogleSignInButton />
            </div>
          </section>
        )}
      </main>

      <footer className="mt-20 border-t border-border py-6">
        <div className="mx-auto max-w-4xl px-4 text-center text-sm text-muted-foreground">
          Apenas para acompanhamento. Consulte sempre um médico para diagnóstico
          e tratamento.
        </div>
      </footer>
    </div>
  );
}
