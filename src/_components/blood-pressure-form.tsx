"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowLeft, Heart } from "lucide-react";
import { createBloodPressureMeasurement } from "@/_actions/create-blood-pressure-measurement";
import { SubmitButton } from "./submit-button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export function BloodPressureForm() {
  const formRef = useRef<HTMLFormElement>(null);
  async function handleSubmit(formData: FormData) {
    const data = {
      systolic: formData.get("systolic") as string,
      diastolic: formData.get("diastolic") as string,
      pulse: formData.get("pulse") as string,
      notes: formData.get("notes") as string,
    };

    const result = await createBloodPressureMeasurement(data);

    if (result.success) {
      toast.success(result.message);
      formRef.current?.reset();
    } else {
      toast.error("Falha ao cadastrar nova medição");
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-4 space-y-6">
      <header className="flex flex-col lg:flex-row items-center justify-between gap-2 h-20 py-4">
        <div className="flex items-center gap-2">
          <Heart className="text-primary" />
          <h1 className="lg:text-2xl text-xl font-semibold">
            Medições de Pressão
          </h1>
        </div>

        <nav className="flex items-center gap-1">
          <Link
            href="/dashboard"
            className="flex items-center bg-neutral-900 px-3 py-1 rounded-md text-white"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/setting"
            className="flex items-center bg-neutral-900 px-3 py-1 rounded-md text-white"
          >
            Configurações
          </Link>
        </nav>
      </header>
      <Separator />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 mt-4">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="size-5 text-primary" />
              Registrar pressão
            </CardTitle>
            <CardDescription>
              Sistólica (máxima) e diastólica (mínima) em mmHg. Pulso opcional.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(new FormData(e.currentTarget));
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systolic">Sistólica (mmHg)</Label>
                  <Input
                    name="systolic"
                    type="number"
                    min={1}
                    max={300}
                    placeholder="120"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diastolic">Diastólica (mmHg)</Label>
                  <Input
                    name="diastolic"
                    type="number"
                    min={1}
                    max={200}
                    placeholder="80"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pulse">Pulso (opcional)</Label>
                <Input
                  name="pulse"
                  type="number"
                  min={1}
                  max={200}
                  placeholder="72"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Input
                  name="notes"
                  type="text"
                  placeholder="Ex.: após café, manhã"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <SubmitButton />
                <Link
                  href="/dashboard"
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  Cancelar
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
        <p className="max-w-xl mx-auto mb-4 text-sm text-muted-foreground mt-4 text-center">
          Registre sua pressão arterial (sistólica e diastólica em mmHg).
          Opcional: pulso e observação. Os dados ficam no seu histórico para
          acompanhamento.
        </p>
      </main>
    </div>
  );
}
