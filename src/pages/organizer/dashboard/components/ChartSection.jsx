import { useState } from "react";

import { ChartCard, Skeleton } from "./DashboardUI";
import { PIE_COLORS, BAR_COLOR, LINE_COLOR } from "../dashboardConstants";

function ChartToggle({ active, onChange }) {
  return (
    <div className="chart-toggle">
      {["bar", "line"].map((type) => (
        <button
          key={type}
          type="button"
          className={`chart-toggle__btn ${active === type ? "active" : ""}`}
          onClick={() => onChange(type)}
        >
          {type === "bar" ? "Category" : "Monthly"}
        </button>
      ))}
    </div>
  );
}

function EmptyChart() {
  return <div className="simple-chart__empty">No data</div>;
}

function EventsByCategoryChart({ data }) {
  const maxTotal = Math.max(...data.map((item) => Number(item.total) || 0), 1);

  if (!data.length) {
    return <EmptyChart />;
  }

  return (
    <div className="simple-bar-chart" aria-label="Events by category">
      {data.map((item) => {
        const total = Number(item.total) || 0;
        return (
          <div className="simple-bar-chart__item" key={item.category}>
            <div className="simple-bar-chart__track">
              <span
                className="simple-bar-chart__bar"
                style={{
                  height: `${Math.max((total / maxTotal) * 100, 6)}%`,
                  background: BAR_COLOR,
                }}
              />
            </div>
            <strong>{total}</strong>
            <span>{item.category}</span>
          </div>
        );
      })}
    </div>
  );
}

function RegistrationsPerMonthChart({ data }) {
  const maxTotal = Math.max(...data.map((item) => Number(item.total) || 0), 1);

  if (!data.length) {
    return <EmptyChart />;
  }

  return (
    <div className="simple-line-chart" aria-label="Registrations per month">
      {data.map((item) => {
        const total = Number(item.total) || 0;
        return (
          <div className="simple-line-chart__row" key={item.month}>
            <span className="simple-line-chart__label">{item.month}</span>
            <div className="simple-line-chart__track">
              <span
                className="simple-line-chart__bar"
                style={{
                  width: `${Math.max((total / maxTotal) * 100, 4)}%`,
                  background: LINE_COLOR,
                }}
              />
            </div>
            <strong>{total}</strong>
          </div>
        );
      })}
    </div>
  );
}

function EventsByStatusChart({ data }) {
  const totalEvents = data.reduce((sum, item) => sum + (Number(item.total) || 0), 0);

  if (!data.length) {
    return <EmptyChart />;
  }

  return (
    <>
      <div className="simple-donut" aria-label="Events by status">
        <span>{totalEvents}</span>
        <small>Total</small>
      </div>

      <div className="pie-legend">
        {data.map((item, index) => (
          <div key={item.status} className="pie-legend__item">
            <span
              className="pie-legend__dot"
              style={{ background: PIE_COLORS[index % PIE_COLORS.length] }}
            />
            <span className="pie-legend__label">{item.status}</span>
            <span className="pie-legend__val">{item.total}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default function ChartSection({ charts, loading }) {
  const [activeChart, setActiveChart] = useState("bar");

  const mainTitle = activeChart === "bar"
    ? "Events by category"
    : "Registrations by month";

  return (
    <section className="dash__charts">
      <ChartCard
        title={mainTitle}
        action={<ChartToggle active={activeChart} onChange={setActiveChart} />}
      >
        {loading ? (
          <Skeleton h={260} r={10} />
        ) : activeChart === "bar" ? (
          <EventsByCategoryChart data={charts.events_by_category ?? []} />
        ) : (
          <RegistrationsPerMonthChart data={charts.registrations_per_month ?? []} />
        )}
      </ChartCard>

      <ChartCard title="Event status">
        {loading ? (
          <Skeleton h={220} r={10} />
        ) : (
          <EventsByStatusChart data={charts.events_by_status ?? []} />
        )}
      </ChartCard>
    </section>
  );
}
