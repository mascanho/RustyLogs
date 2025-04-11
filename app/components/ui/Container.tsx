import { DonutChartA } from "../charts/DonutChartA";
import { TimeSeriesChart } from "../charts/TimeSeriesChart";
import sampleLogData from "../Data/SampleData";
import { LogTable } from "./LogTable";
import Navigation from "./Navigation";

function Container() {
  return (
    <div className=" bg-white dark:bg-slate-950">
      <Navigation />
      <main className="">
        <TimeSeriesChart />
        <section className="flex justify-between gap-2 px-2">
          <DonutChartA />
          <DonutChartA />
          <DonutChartA />
        </section>

        <section className="h-96 overflow-auto">
          <LogTable data={sampleLogData} />
        </section>
      </main>
    </div>
  );
}

export default Container;
