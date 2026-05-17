// src/pages/organizer/dashboard/components/ChartSection.jsx

import { useState } from "react";
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

import { ChartCard, CustomTooltip, Skeleton } from "./DashboardUI";
import { PIE_COLORS, BAR_COLOR, LINE_COLOR } from "../dashboardConstants";

// ── Toggle button giữa Bar và Line ───────────────────────────────
function ChartToggle({ active, onChange }) {
  return (
    <div className="chart-toggle">
      {["bar", "line"].map((type) => (
        <button
          key={type}
          className={`chart-toggle__btn ${active === type ? "active" : ""}`}
          onClick={() => onChange(type)}
        >
          {type === "bar" ? "Danh mục" : "Theo tháng"}
        </button>
      ))}
    </div>
  );
}

// ── Bar chart — events by category ───────────────────────────────
function EventsByCategoryChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barSize={32}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="category" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} domain={[0, 'dataMax + 1']}/>
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="total" name="Sự kiện" fill={BAR_COLOR} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Line chart — registrations per month ─────────────────────────
function RegistrationsPerMonthChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone" dataKey="total" name="Đăng ký"
          stroke={LINE_COLOR} strokeWidth={2.5}
          dot={{ r: 4, fill: LINE_COLOR }} activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ── Donut chart — events by status ───────────────────────────────
function EventsByStatusChart({ data }) {
  return (
    <>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total" nameKey="status"
            cx="50%" cy="50%"
            innerRadius={55} outerRadius={85}
            paddingAngle={3}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(val, name) => [val, name]} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="pie-legend">
        {data.map((item, i) => (
          <div key={i} className="pie-legend__item">
            <span className="pie-legend__dot" style={{ background: PIE_COLORS[i] }} />
            <span className="pie-legend__label">{item.status}</span>
            <span className="pie-legend__val">{item.total}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Export ChartSection ───────────────────────────────────────────
export default function ChartSection({ charts, loading }) {
  const [activeChart, setActiveChart] = useState("bar");

  const mainTitle = activeChart === "bar"
    ? "Sự kiện theo danh mục"
    : "Đăng ký theo tháng";

  return (
    <section className="dash__charts">

      {/* Main chart — bar hoặc line */}
      <ChartCard
        title={mainTitle}
        action={
          <ChartToggle active={activeChart} onChange={setActiveChart} />
        }
      >
        {loading ? (
          <Skeleton h={260} r={10} />
        ) : activeChart === "bar" ? (
          <EventsByCategoryChart data={charts.events_by_category ?? []} />
        ) : (
          <RegistrationsPerMonthChart data={charts.registrations_per_month ?? []} />
        )}
      </ChartCard>

      {/* Side chart — donut */}
      <ChartCard title="Trạng thái sự kiện">
        {loading ? (
          <Skeleton h={220} r={10} />
        ) : (
          <EventsByStatusChart data={charts.events_by_status ?? []} />
        )}
      </ChartCard>

    </section>
  );
}