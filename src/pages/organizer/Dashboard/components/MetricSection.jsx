
import { MetricCard, Skeleton } from "./DashboardUI";
import { METRIC_CONFIG } from "../dashboardConstants";

export default function MetricSection({ metrics, loading }) {
  return (
    <section className="dash__metrics">
      {METRIC_CONFIG.map(({ label, key, icon, accent }) =>
        loading ? (
          <div key={key} className="metric-card metric-card--skeleton">
            <Skeleton h={80} />
          </div>
        ) : (
          <MetricCard
            key={key}
            label={label}
            value={metrics[key]}
            iconKey={icon}
            accent={accent}
          />
        )
      )}
    </section>
  );
}