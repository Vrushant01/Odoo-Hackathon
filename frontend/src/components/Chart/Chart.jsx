import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import styles from "./Chart.module.css";

// Custom Tooltip component matching layout styles
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltipContainer}>
        {label && <p className={styles.tooltipLabel}>{label}</p>}
        <ul className={styles.tooltipList}>
          {payload.map((item, idx) => (
            <li key={idx} className={styles.tooltipItem}>
              <span
                className={styles.tooltipIndicator}
                style={{ backgroundColor: item.color || item.payload.color }}
              />
              <span style={{ color: "var(--text-secondary)" }}>{item.name}:</span>
              <span className={styles.tooltipValue}>
                {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return null;
};

export const Chart = ({
  type = "line", // 'line' | 'bar' | 'area' | 'pie'
  data = [],
  xKey = "name",
  series = [], // [{ key, color, name }]
  height = 300,
  className = ""
}) => {
  const gridColor = "var(--border-color)";
  const textColor = "var(--text-secondary)";

  const renderChartContent = () => {
    switch (type) {
      case "area":
        return (
          <AreaChart data={data}>
            <defs>
              {series.map((s, index) => (
                <linearGradient key={index} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color || "var(--primary)"} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={s.color || "var(--primary)"} stopOpacity={0.0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey={xKey} stroke={textColor} fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke={textColor} fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            {series.map((s, index) => (
              <Area
                key={index}
                type="monotone"
                dataKey={s.key}
                name={s.name || s.key}
                stroke={s.color || "var(--primary)"}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#grad-${s.key})`}
              />
            ))}
          </AreaChart>
        );

      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey={xKey} stroke={textColor} fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke={textColor} fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--bg-tertiary)", opacity: 0.4 }} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            {series.map((s, index) => (
              <Bar
                key={index}
                dataKey={s.key}
                name={s.name || s.key}
                fill={s.color || "var(--primary)"}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case "pie":
        return (
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || "var(--primary)"} />
              ))}
            </Pie>
          </PieChart>
        );

      case "line":
      default:
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey={xKey} stroke={textColor} fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke={textColor} fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            {series.map((s, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={s.key}
                name={s.name || s.key}
                stroke={s.color || "var(--primary)"}
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 1.5, stroke: "var(--bg-secondary)" }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <div className={className} style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChartContent()}
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
