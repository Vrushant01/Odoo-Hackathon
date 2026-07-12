import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import Card from "../Card/Card";

export const FuelCharts = ({ chartsData }) => {
  if (!chartsData) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
        Loading charts parameters...
      </div>
    );
  }

  const { monthlyFuelUsage = [], fuelCostTrend = [], fuelEfficiencyTrend = [] } = chartsData;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* Usage Bar Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
        
        {/* Monthly Fuel Usage */}
        <Card title="Monthly Fuel Consumption" subtitle="Refueling volumes (Liters) & costs ($) monthly trend">
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyFuelUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }} />
                <Legend />
                <Bar dataKey="volume" name="Volume (L)" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cost" name="Cost ($)" fill="var(--success)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Cost per Liter Trend */}
        <Card title="Fuel Cost Per Liter" subtitle="Average price per liter fluctuation trend">
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={fuelCostTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} domain={["auto", "auto"]} />
                <Tooltip contentStyle={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }} />
                <Legend />
                <Line type="monotone" dataKey="price" name="Price per Liter ($)" stroke="var(--warning)" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

      {/* Fuel Efficiency bar */}
      <Card title="Vehicle Fuel Efficiency" subtitle="Miles per Gallon (mpg) comparison across grounded fleet units">
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={fuelEfficiencyTrend} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis type="number" stroke="var(--text-muted)" fontSize={12} />
              <YAxis dataKey="vehicle" type="category" stroke="var(--text-muted)" fontSize={10} width={130} />
              <Tooltip contentStyle={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }} />
              <Legend />
              <Bar dataKey="efficiency" name="Efficiency (mpg)" fill="var(--primary)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

    </div>
  );
};

export default FuelCharts;
