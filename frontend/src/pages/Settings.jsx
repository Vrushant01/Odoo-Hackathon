import React from "react";
import PageHeader from "../components/PageHeader/PageHeader";
import Card from "../components/Card/Card";

export const Settings = () => {
  const breadcrumbs = [
    { label: "Home", route: "/dashboard" },
    { label: "Settings", route: "/settings" }
  ];

  return (
    <div className="fade-in">
      <PageHeader
        title="Settings"
        subtitle="Manage user permissions, profiles, and platform configurations"
        breadcrumbItems={breadcrumbs}
      />
      <Card title="Settings Module Placeholder">
        <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
          Platform rules, unit measurements, security keys, and timezone rules will be loaded here.
        </p>
      </Card>
    </div>
  );
};

export default Settings;
