import React from "react";
import { useNavigate } from "react-router-dom";
import { MetricCard, Skeleton, Icon } from "./DashboardUI";
import { METRIC_CONFIG, ICONS } from "../dashboardConstants";

export default function MetricSection({ metrics, loading }) {
  const navigate = useNavigate();

  return (
    <section className="dash__metrics">
      {METRIC_CONFIG.map(({ label, key, icon, accent }) => {
        const card = loading ? (
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
        );

        if (key === "waitlist_count") {
          return (
            <React.Fragment key={key}>
              {card}
              <div 
                className="metric-card metric-card--action"
                onClick={() => navigate("/organizer/pending-registrations")}
                style={{ 
                  cursor: "pointer", 
                  background: "var(--c-amber-lt)", 
                  border: "1px solid var(--c-amber)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--c-amber)",
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "var(--c-amber)";
                  e.currentTarget.style.color = "white";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "var(--c-amber-lt)";
                  e.currentTarget.style.color = "var(--c-amber)";
                }}
              >
                <div style={{ textAlign: "center", fontWeight: "600", fontSize: "14px" }}>
                  Phê duyệt<br />đăng ký →
                </div>
              </div>
            </React.Fragment>
          );
        }

        return card;
      })}
    </section>
  );
}