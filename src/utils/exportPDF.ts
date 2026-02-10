import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface Measurement {
  id: string;
  userId: string;
  systolic: number;
  diastolic: number;
  pulse: number | null;
  measuredAt: Date;
  notes: string | null;
}

export function exportTableToPDF(measurements: Measurement[]) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Adiciona título
  doc.setFontSize(16);
  doc.text("Relatório de Medições de Pressão Arterial", 14, 15);

  // Adiciona data de geração
  doc.setFontSize(10);
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 25);

  // Prepara dados para a tabela
  const tableData = measurements.map((m) => [
    m.measuredAt.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    m.systolic.toString(),
    m.diastolic.toString(),
    m.pulse ?? "-",
    m.notes ?? "-",
  ]);

  // Cria a tabela
  autoTable(doc, {
    head: [["Data", "Sistólica", "Diastólica", "Pulso", "Observações"]],
    body: tableData,
    startY: 35,
    theme: "grid",
    headStyles: {
      fillColor: [51, 51, 51],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      textColor: [0, 0, 0],
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    columnStyles: {
      0: { halign: "center" },
      1: { halign: "center" },
      2: { halign: "center" },
      3: { halign: "center" },
    },
    margin: { top: 35, right: 14, bottom: 14, left: 14 },
  });

  // Faz o download
  doc.save(`medidas-pressao-${new Date().toISOString().split("T")[0]}.pdf`);
}
