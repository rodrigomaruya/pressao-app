import { getMyBloodPressureMeasurements } from "@/_actions/get-my-blood-pressure-measurements";
import { DashboardContent } from "@/_components/dashboardContent";

export default async function Dashboard() {
  const getMeasurements = await getMyBloodPressureMeasurements();

  return <DashboardContent getMeasurements={getMeasurements} />;
}
