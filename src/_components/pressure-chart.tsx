"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Measurement = {
  id: string;
  systolic: number;
  diastolic: number;
  measuredAt: Date;
};

function getColorSystolic(value: number) {
  if (value < 90) return "#2563eb"; // baixa
  if (value <= 120) return "#16a34a"; // normal
  return "#dc2626"; // alta
}
function getColorDiastolic(value: number) {
  if (value < 60) return "#2563eb"; // baixa
  if (value <= 80) return "#16a34a"; // normal
  return "#dc2626"; // alta
}

export function BloodPressureBarChart({ data }: { data: Measurement[] }) {
  const chartData = data.map((m) => ({
    timeLabel: m.measuredAt.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    date: m.measuredAt.toLocaleDateString("pt-BR"),

    systolic: m.systolic,
    diastolic: m.diastolic,
    colorSystolic: getColorSystolic(m.systolic),
    colorDiastolic: getColorDiastolic(m.diastolic),
  }));

  return (
    <div className="flex flex-col gap-3 lg:flex-row w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">
            Pressão Sistólica por Medição(máxima)
          </CardTitle>
        </CardHeader>

        <CardContent className="h-75">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="timeLabel" />
              <YAxis domain={[60, 180]} />
              <Tooltip
                formatter={(value) =>
                  typeof value === "number" ? `${value} mmHg` : "-"
                }
                labelFormatter={(label, payload) => {
                  const date = payload?.[0]?.payload?.date;
                  return `${date} • ${label}hs`;
                }}
              />

              <Bar dataKey="systolic" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.colorSystolic} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legenda simples e fixa */}
        </CardContent>
        <div className="mt-4 flex flex-wrap gap-4 text-sm justify-center">
          <LegendItem color="#2563eb" label="Baixa (< 90)" />
          <LegendItem color="#16a34a" label="Normal (90–119)" />
          <LegendItem color="#dc2626" label="Alta (≥ 120)" />
        </div>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">
            Pressão Diastólica por Medição(minima)
          </CardTitle>
        </CardHeader>

        <CardContent className="h-75">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="timeLabel" />

              <YAxis domain={[60, 180]} />
              <Tooltip
                formatter={(value) =>
                  typeof value === "number" ? `${value} mmHg` : "-"
                }
                labelFormatter={(label, payload) => {
                  const date = payload?.[0]?.payload?.date;
                  return `${date} • ${label}hs`;
                }}
              />

              <Bar dataKey="diastolic" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.colorDiastolic} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legenda simples e fixa */}
        </CardContent>
        <div className="mt-4 flex flex-wrap gap-4 text-sm justify-center">
          <LegendItem color="#2563eb" label="Baixa (< 60)" />
          <LegendItem color="#16a34a" label="Normal (60–79)" />
          <LegendItem color="#dc2626" label="Alta (≥ 80)" />
        </div>
      </Card>
    </div>
  );
}

export function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-3 w-3 rounded" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}
