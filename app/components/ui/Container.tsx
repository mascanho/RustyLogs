import { TimeSeriesChart } from "../charts/TimeSeriesChart";
import Navigation from "./Navigation";

function Container() {
  return (
    <div className="h-[100vh] bg-white dark:bg-slate-950">
      <Navigation />
      <TimeSeriesChart />
    </div>
  );
}

export default Container;
