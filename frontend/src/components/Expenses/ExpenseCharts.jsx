import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import Card from "../Card/Card";

export const ExpenseCharts = ({ chartsData }) => {
  if (!chartsData) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
        Loading charts parameters...
      </div>
    );
  }

  const {
    monthlyExpenseTrend = [],
    expenseCategoryDistribution = [],
    vehicleOperationalCost = [],
    tripOperationalCost = []
  } = chartsData;

  const COLORS = [
    "var(--primary)",
    "var(--success)",
    "var(--warning)",
    "var(--danger)",
    "var(--info)"
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* Monthly and Category distribution grids */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
        
        {/* Monthly Expense Trend */}
        <Card title="Monthly Spending Trend" subtitle="Total operational costs ($) monthly trend">
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyExpenseTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }} />
                <Legend />
                <Bar dataKey="amount" name="Expenses ($)" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Expense Category Distribution */}
        <Card title="Cost Category Share" subtitle="Category breakdown distribution percentage">
          <div style={{ width: "100%", height: 260, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseCategoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseCategoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

      {/* Vehicle and Trip comparison grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
        
        {/* Vehicle Cost */}
        <Card title="Operational Cost Per Vehicle" subtitle="Servicing & fuel expenses aggregated per vehicle">
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={vehicleOperationalCost}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={9} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }} />
                <Legend />
                <Bar dataKey="cost" name="Aggregated Cost ($)" fill="var(--warning)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Trip Cost */}
        <Card title="Operational Cost Per Trip" subtitle="Servicing & tolls expenses aggregated per trip ID">
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={tripOperationalCost}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }} />
                <Legend />
                <Bar dataKey="cost" name="Aggregated Cost ($)" fill="var(--success)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

    </div>
  );
};

export default ExpenseCharts;
