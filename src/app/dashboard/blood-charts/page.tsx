import { getMyBloodPressureMeasurements } from "@/_actions/get-my-blood-pressure-measurements";
import {
  BloodPressureBarChart,
  LegendItem,
} from "@/_components/pressure-chart";
import { Heart, Plus } from "lucide-react";
import Link from "next/link";

export default async function BloodCharts() {
  const getMeasurements = await getMyBloodPressureMeasurements();

  return (
    <div className="w-full max-w-5xl p-2 mx-auto">
      <header className="flex flex-col mb-4 items-center lg:flex-row justify-between gap-2 h-20">
        <div className="flex items-center gap-2">
          <Heart className="text-primary" />
          <h1 className="text-xl lg:text-2xl font-semibold">
            Gráfico Medições de Pressão
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            href={"/dashboard/"}
            className="bg-neutral-900 px-3 py-1 rounded-md text-white"
          >
            Dashboard
          </Link>
          <Link
            href={"/dashboard/new"}
            className="bg-neutral-900 px-3 py-1 rounded-md"
          >
            <Plus size={24} className="text-white" />
          </Link>
        </div>
      </header>
      <BloodPressureBarChart data={getMeasurements} />
    </div>
  );
}
