"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Heart, Home, Plus, X, Download } from "lucide-react";
import { deleteBloodPressure } from "@/_actions/delete-bood-pressure";
import { LogoutButton } from "./logout";
import { exportTableToPDF } from "@/utils/exportPDF";

interface Measurement {
  id: string;
  userId: string;
  systolic: number;
  diastolic: number;
  pulse: number | null;
  measuredAt: Date;
  notes: string | null;
}

interface DashboardContentProps {
  getMeasurements: Measurement[];
}

export function DashboardContent({ getMeasurements }: DashboardContentProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>();

  // 🔹 Filtra medições por mês usando string YYYY-MM
  const filteredMeasurements = selectedMonth
    ? getMeasurements.filter((m) =>
        m.measuredAt.toISOString().startsWith(selectedMonth),
      )
    : getMeasurements;

  async function deletar(id: string) {
    await deleteBloodPressure(id);
  }
  return (
    <div className="mx-auto max-w-5xl p-4 space-y-6">
      {/* HEADER */}
      <header className="flex flex-col items-center justify-between lg:flex-row gap-2 h-20 ">
        <div className="flex items-center gap-2">
          <Heart className="text-primary" />
          <h1 className="text-xl lg:text-2xl font-semibold">
            Medições de Pressão
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            href={"/"}
            className="flex items-center bg-neutral-900 px-3 py-1 rounded-md text-white"
          >
            <Home />
          </Link>
          <Link
            href={"/dashboard/blood-charts"}
            className="flex items-center bg-neutral-900 px-3 py-1 rounded-md text-white"
          >
            Gráfico
          </Link>
          <Link
            href={"/dashboard/new"}
            className="flex items-center bg-neutral-900 px-3 py-1 rounded-md"
          >
            <Plus size={24} className="text-white" />
          </Link>

          <LogoutButton />
        </div>
      </header>

      {/* FILTRO POR MÊS */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center justify-center gap-2 w-full max-w-xs">
          <label htmlFor="month-filter" className="text-sm">
            Filtrar por mês
          </label>
          <Input
            id="month-filter"
            type="month"
            value={selectedMonth ?? ""}
            onChange={(e) => setSelectedMonth(e.target.value || undefined)}
            className="text-base"
          />
        </div>
        <Button
          onClick={() => exportTableToPDF(filteredMeasurements)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={filteredMeasurements.length === 0}
        >
          <Download size={18} className="mr-2" />
          Baixar PDF
        </Button>
      </div>

      {/* TABELA DESKTOP / TABLET */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>Sistólica</TableHead>
              <TableHead>Diastólica</TableHead>
              <TableHead>Pulso</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredMeasurements.length > 0 ? (
              filteredMeasurements.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    {m.measuredAt.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {`${m.measuredAt.getHours()}:${m.measuredAt.getMinutes().toString().padStart(2, "0")}`}
                  </TableCell>
                  <TableCell className="font-medium">{m.systolic}</TableCell>
                  <TableCell className="font-medium">{m.diastolic}</TableCell>
                  <TableCell>{m.pulse ?? "-"}</TableCell>
                  <TableCell>{m.notes ?? "-"}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600"
                      onClick={() => deletar(m.id)}
                    >
                      <X />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  Nenhuma medição registrada neste mês.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* CARDS MOBILE / IDOSOS */}
      <div className="space-y-4 md:hidden">
        {filteredMeasurements.length > 0 ? (
          filteredMeasurements.map((m) => (
            <Card key={m.id}>
              <CardContent className="p-4 space-y-2 text-base">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data</span>
                  <span>
                    {m.measuredAt.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between ">
                  <span className="text-muted-foreground">Hora</span>
                  <span>{`${m.measuredAt.getHours()}:${m.measuredAt.getMinutes().toString().padStart(2, "0")}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sistólica</span>
                  <strong>{m.systolic}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Diastólica</span>
                  <strong>{m.diastolic}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Pulso</span>
                  <span>{m.pulse ?? "-"}</span>
                </div>
                {m.notes && (
                  <div className="pt-2 text-muted-foreground">{m.notes}</div>
                )}
                <div className="flex mt-2">
                  <Button
                    variant="destructive"
                    className="w-full text-white font-bold"
                    onClick={() => deletar(m.id)}
                  >
                    <X size={24} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            Nenhuma medição registrada neste mês.
          </p>
        )}
      </div>
    </div>
  );
}
