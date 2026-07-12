import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  Users,
  ShieldCheck,
  UserCheck,
  Lock,
  Unlock,
  AlertCircle,
  Key,
  Trash2,
  Eye,
  Edit2,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Database
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  PageHeader,
  Card,
  KPICard,
  Table,
  Button,
  Input,
  Select,
  Modal,
  ConfirmationDialog,
  StatusBadge
} from "../components";
import userService from "../services/userService";

export const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === "Super Admin";

  // States
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users"); // "users" | "blocked" | "audits"
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    lockedAccounts: 0,
    inactiveUsers: 0,
    todaysLogins: 0,
    todaysFailedAttempts: 0
  });

  // Column Selection / Field Visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    avatar: true,
    fullName: true,
    email: true,
    role: true,
    department: true,
    phoneNumber: true,
    status: true,
    failed_attempts: true,
    account_locked: true,
    lastLogin: true,
    actions: true
  });
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);

  // Filters / Search / Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [lockedFilter, setLockedFilter] = useState("");

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([]);
  const [isAuditLoading, setIsAuditLoading] = useState(false);

  // Modals & Action Targets
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordTargetUser, setPasswordTargetUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  // Confirmation Dialog Targets
  const [deleteTargetUser, setDeleteTargetUser] = useState(null);
  const [lockTargetUser, setLockTargetUser] = useState(null);
  const [unlockTargetUser, setUnlockTargetUser] = useState(null);
  const [lockReason, setLockReason] = useState("Security Override");
  const [unlockReason, setUnlockReason] = useState("Administrative Action");

  // Form Fields
  const [formFields, setFormFields] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Dispatcher",
    department: "Operations",
    phoneNumber: "",
    status: "Active"
  });

  // Fetch Stats & Users
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch Stats
      const statsRes = await userService.getStats();
      if (statsRes.success) {
        setStats(statsRes.data);
      }

      // Fetch Users
      const usersRes = await userService.getUsers();
      if (usersRes.success) {
        setUsers(usersRes.data.results || usersRes.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load user management data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch Audit Logs
  const fetchAuditLogs = useCallback(async () => {
    setIsAuditLoading(true);
    try {
      const res = await userService.getAuditLogs({ includeAuth: "true" });
      if (res.success) {
        setAuditLogs(res.data.results || res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load audit logs.");
    } finally {
      setIsAuditLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (activeTab === "audits") {
      fetchAuditLogs();
    }
  }, [activeTab, fetchAuditLogs]);

  const handleRefresh = () => {
    fetchData();
    if (activeTab === "audits") {
      fetchAuditLogs();
    }
    toast.success(" Roster refreshed.");
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setRoleFilter("");
    setStatusFilter("");
    setLockedFilter("");
    toast.success("Filters reset successfully.");
  };

  // Client Side Filtering & Search
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter ? u.role === roleFilter : true;
      const matchesStatus = statusFilter ? u.status === statusFilter : true;
      const matchesLocked = lockedFilter ? String(u.account_locked) === lockedFilter : true;

      return matchesSearch && matchesRole && matchesStatus && matchesLocked;
    });
  }, [users, searchTerm, roleFilter, statusFilter, lockedFilter]);

  // Blocked/Locked/Inactive Users Subset
  const blockedUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase());
      return (u.account_locked || u.status === "Inactive") && matchesSearch;
    });
  }, [users, searchTerm]);

  // Open creation modal
  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormFields({
      fullName: "",
      email: "",
      password: "",
      role: "Dispatcher",
      department: "Operations",
      phoneNumber: "",
      status: "Active"
    });
    setIsFormModalOpen(true);
  };

  // Open edit modal
  const handleOpenEditModal = (target) => {
    setEditingUser(target);
    setFormFields({
      fullName: target.fullName || "",
      email: target.email || "",
      password: "",
      role: target.role || "Dispatcher",
      department: target.department || "Operations",
      phoneNumber: target.phoneNumber || "",
      status: target.status || "Active"
    });
    setIsFormModalOpen(true);
  };

  // Form Submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formFields.fullName || !formFields.email) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      if (editingUser) {
        const updatePayload = { ...formFields };
        delete updatePayload.password;
        const res = await userService.updateUser(editingUser._id, updatePayload);
        if (res.success) {
          toast.success("User profile updated successfully.");
          setIsFormModalOpen(false);
          fetchData();
        }
      } else {
        if (!formFields.password || formFields.password.length < 6) {
          toast.error("Password must be at least 6 characters long.");
          return;
        }
        const res = await userService.createUser(formFields);
        if (res.success) {
          toast.success("New user created successfully.");
          setIsFormModalOpen(false);
          fetchData();
        }
      }
    } catch (err) {
      toast.error(err.message || "Failed to save user.");
    }
  };

  // Delete User
  const handleDeleteUser = async () => {
    if (!deleteTargetUser) return;
    try {
      const res = await userService.deleteUser(deleteTargetUser._id);
      if (res.success) {
        toast.success("User deleted successfully.");
        setDeleteTargetUser(null);
        fetchData();
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete user.");
    }
  };

  // Status toggle
  const handleToggleStatus = async (target) => {
    const nextStatus = target.status === "Active" ? "Inactive" : "Active";
    try {
      const res = await userService.toggleStatus(target._id, nextStatus);
      if (res.success) {
        toast.success(`User status updated to ${nextStatus}.`);
        fetchData();
      }
    } catch (err) {
      toast.error(err.message || "Failed to update user status.");
    }
  };

  // Manual Lock user
  const handleLockUser = async () => {
    if (!lockTargetUser) return;
    try {
      const res = await userService.lockUser(lockTargetUser._id, lockReason);
      if (res.success) {
        toast.success("User account locked manually.");
        setLockTargetUser(null);
        fetchData();
      }
    } catch (err) {
      toast.error(err.message || "Failed to lock user.");
    }
  };

  // Manual Unlock user
  const handleUnlockUser = async () => {
    if (!unlockTargetUser) return;
    try {
      const res = await userService.unlockUser(unlockTargetUser._id, unlockReason);
      if (res.success) {
        toast.success("User account unlocked successfully.");
        setUnlockTargetUser(null);
        fetchData();
      }
    } catch (err) {
      toast.error(err.message || "Failed to unlock user.");
    }
  };

  // Reset Failed Attempts
  const handleResetAttempts = async (target) => {
    try {
      const res = await userService.resetAttempts(target._id);
      if (res.success) {
        toast.success("Failed attempts counter reset to 0.");
        fetchData();
      }
    } catch (err) {
      toast.error(err.message || "Failed to reset attempts.");
    }
  };

  // Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    try {
      const res = await userService.resetPassword(passwordTargetUser._id, newPassword);
      if (res.success) {
        toast.success("Password reset successfully.");
        setIsPasswordModalOpen(false);
        setPasswordTargetUser(null);
        setNewPassword("");
      }
    } catch (err) {
      toast.error(err.message || "Failed to reset password.");
    }
  };

  // All columns master definition
  const allColumns = useMemo(
    () => [
      {
        id: "avatar",
        header: "Avatar",
        accessorKey: "profileImage",
        cell: ({ getValue, row }) => (
          <img
            src={getValue() || `https://api.dicebear.com/7.x/initials/svg?seed=${row.original.fullName}`}
            alt="Avatar"
            style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border-color)" }}
          />
        )
      },
      {
        id: "fullName",
        header: "Name",
        accessorKey: "fullName",
        cell: ({ getValue }) => <strong style={{ color: "var(--text-primary)" }}>{getValue()}</strong>
      },
      {
        id: "email",
        header: "Email",
        accessorKey: "email"
      },
      {
        id: "role",
        header: "Role",
        accessorKey: "role",
        cell: ({ getValue }) => <span style={{ color: "var(--primary)", fontWeight: 600 }}>{getValue()}</span>
      },
      {
        id: "department",
        header: "Department",
        accessorKey: "department"
      },
      {
        id: "phoneNumber",
        header: "Phone",
        accessorKey: "phoneNumber",
        cell: ({ getValue }) => getValue() || "-"
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => {
          const val = getValue();
          const badgeType = val === "Active" ? "success" : "danger";
          return <StatusBadge status={val} resolvedVariant={badgeType} />;
        }
      },
      {
        id: "failed_attempts",
        header: "Failed Attempts",
        accessorKey: "failed_attempts",
        cell: ({ getValue }) => {
          const val = getValue() || 0;
          return (
            <span style={{ fontWeight: 600, color: val >= 3 ? "var(--danger)" : "var(--text-secondary)" }}>
              {val}
            </span>
          );
        }
      },
      {
        id: "account_locked",
        header: "Locked",
        accessorKey: "account_locked",
        cell: ({ getValue }) => {
          const val = getValue();
          return (
            <StatusBadge
              status={val ? "Locked" : "Active"}
              resolvedVariant={val ? "danger" : "success"}
            />
          );
        }
      },
      {
        id: "lastLogin",
        header: "Last Login",
        accessorKey: "lastLogin",
        cell: ({ getValue }) => {
          const val = getValue();
          return val ? new Date(val).toLocaleString() : "Never";
        }
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const u = row.original;
          return (
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewingUser(u)}
                title="View Full Profile Details"
                style={{ padding: "0.25rem 0.5rem" }}
              >
                <Eye size={14} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenEditModal(u)}
                title="Edit Details"
                disabled={u.role === "Super Admin" && !isSuperAdmin}
                style={{ padding: "0.25rem 0.5rem" }}
              >
                <Edit2 size={14} />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleStatus(u)}
                title={u.status === "Active" ? "Deactivate User" : "Activate User"}
                disabled={u.role === "Super Admin" && !isSuperAdmin}
                style={{ padding: "0.25rem 0.5rem", color: u.status === "Active" ? "var(--warning)" : "var(--success)" }}
              >
                {u.status === "Active" ? <XCircle size={14} /> : <CheckCircle size={14} />}
              </Button>

              {u.account_locked ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUnlockTargetUser(u)}
                  title="Unlock Account (Super Admin Only)"
                  disabled={!isSuperAdmin}
                  style={{ padding: "0.25rem 0.5rem", color: "var(--success)" }}
                >
                  <Unlock size={14} />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLockTargetUser(u)}
                  title="Lock Account manually"
                  style={{ padding: "0.25rem 0.5rem", color: "var(--danger)" }}
                >
                  <Lock size={14} />
                </Button>
              )}

              {u.failed_attempts > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResetAttempts(u)}
                  title="Reset Failed Login attempts to 0"
                  style={{ padding: "0.25rem 0.5rem", color: "var(--info)" }}
                >
                  <RefreshCw size={14} />
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPasswordTargetUser(u);
                  setIsPasswordModalOpen(true);
                }}
                title="Reset Password (Super Admin Only)"
                disabled={!isSuperAdmin}
                style={{ padding: "0.25rem 0.5rem", color: "var(--primary)" }}
              >
                <Key size={14} />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteTargetUser(u)}
                title="Delete User (Super Admin Only)"
                disabled={!isSuperAdmin || u._id === currentUser?._id}
                style={{ padding: "0.25rem 0.5rem", color: "var(--danger)" }}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          );
        }
      }
    ],
    [currentUser, isSuperAdmin]
  );

  // Filter columns dynamically based on visibility selection
  const columns = useMemo(() => {
    return allColumns.filter(c => visibleColumns[c.id]);
  }, [allColumns, visibleColumns]);

  const rolesOptions = [
    { value: "Super Admin", label: "Super Admin" },
    { value: "Fleet Manager", label: "Fleet Manager" },
    { value: "Dispatcher", label: "Dispatcher" },
    { value: "Safety Officer", label: "Safety Officer" },
    { value: "Financial Analyst", label: "Financial Analyst" }
  ];

  const departmentOptions = [
    { value: "IT / Security", label: "IT / Security" },
    { value: "Operations", label: "Operations" },
    { value: "Logistics", label: "Logistics" },
    { value: "Compliance", label: "Compliance" },
    { value: "Finance", label: "Finance" }
  ];

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <PageHeader
        title="Admin User Management"
        subtitle="Manage users, lockouts, reset credentials, and review user audit logs."
        breadcrumbItems={[
          { label: "Home", route: "/dashboard" },
          { label: "User Management", route: "/users" }
        ]}
        action={
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw size={16} />
            </Button>
            {activeTab === "users" && (
              <Button variant="primary" onClick={handleOpenCreateModal}>
                Add New User
              </Button>
            )}
          </div>
        }
      />

      {/* KPI Stats Panel */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1.25rem"
      }}>
        <KPICard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users size={24} style={{ color: "var(--primary)" }} />}
        />
        <KPICard
          title="Active Users"
          value={stats.activeUsers}
          icon={<UserCheck size={24} style={{ color: "var(--success)" }} />}
        />
        <KPICard
          title="Locked Accounts"
          value={stats.lockedAccounts}
          icon={<Lock size={24} style={{ color: "var(--danger)" }} />}
        />
        <KPICard
          title="Inactive Users"
          value={stats.inactiveUsers}
          icon={<XCircle size={24} style={{ color: "var(--text-muted)" }} />}
        />
        <KPICard
          title="Today's Logins"
          value={stats.todaysLogins}
          icon={<CheckCircle size={24} style={{ color: "var(--info)" }} />}
        />
        <KPICard
          title="Failed Logins Today"
          value={stats.todaysFailedAttempts}
          icon={<AlertCircle size={24} style={{ color: "var(--warning)" }} />}
        />
      </div>

      {/* THREE TABS CONTAINER */}
      <div style={{
        display: "flex",
        gap: "0.75rem",
        borderBottom: "1px solid var(--border-color)",
        paddingBottom: "0.75rem",
        marginTop: "0.5rem"
      }}>
        <Button
          variant={activeTab === "users" ? "primary" : "outline"}
          onClick={() => setActiveTab("users")}
          startIcon={<Users size={16} />}
        >
          User Directory
        </Button>
        <Button
          variant={activeTab === "blocked" ? "danger" : "outline"}
          onClick={() => setActiveTab("blocked")}
          startIcon={<Lock size={16} />}
        >
          Blocked Users
        </Button>
        <Button
          variant={activeTab === "audits" ? "secondary" : "outline"}
          onClick={() => setActiveTab("audits")}
          startIcon={<Database size={16} />}
        >
          Audit History
        </Button>
      </div>

      {/* TAB CONTENT: 1. USER DIRECTORY */}
      {activeTab === "users" && (
        <>
          {/* Toolbar filters */}
          <Card title="Database Directory Filters">
            <div style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              alignItems: "flex-end"
            }}>
              <div style={{ flex: 1, minWidth: "220px" }}>
                <Input
                  label="Search Users"
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startIcon={<Search size={18} />}
                />
              </div>
              <div style={{ width: "180px" }}>
                <Select
                  label="Filter by Role"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  placeholder="All Roles"
                  options={[
                    { value: "", label: "All Roles" },
                    ...rolesOptions
                  ]}
                />
              </div>
              <div style={{ width: "150px" }}>
                <Select
                  label="Filter Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  placeholder="All Status"
                  options={[
                    { value: "", label: "All Status" },
                    { value: "Active", label: "Active" },
                    { value: "Inactive", label: "Inactive" }
                  ]}
                />
              </div>
              <div style={{ width: "150px" }}>
                <Select
                  label="Lockout Filter"
                  value={lockedFilter}
                  onChange={(e) => setLockedFilter(e.target.value)}
                  placeholder="All States"
                  options={[
                    { value: "", label: "All States" },
                    { value: "true", label: "Locked" },
                    { value: "false", label: "Unlocked" }
                  ]}
                />
              </div>

              {/* DROPDOWN FOR FIELD SELECTION */}
              <div style={{ position: "relative" }}>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                  startIcon={<Filter size={16} />}
                >
                  Fields
                </Button>
                {showColumnDropdown && (
                  <>
                    <div
                      onClick={() => setShowColumnDropdown(false)}
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 99
                      }}
                    />
                    <div style={{
                      position: "absolute",
                      bottom: "100%",
                      right: 0,
                      zIndex: 100,
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-md)",
                      boxShadow: "var(--shadow-lg)",
                      padding: "0.75rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      minWidth: "180px",
                      marginBottom: "0.5rem"
                    }}>
                      <strong style={{ fontSize: "0.8rem", color: "var(--text-muted)", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.25rem", marginBottom: "0.25rem" }}>
                        Visible Fields
                      </strong>
                      {Object.keys(visibleColumns).map((colKey) => (
                        <label key={colKey} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.825rem", cursor: "pointer", color: "var(--text-primary)", userSelect: "none" }}>
                          <input
                            type="checkbox"
                            checked={visibleColumns[colKey]}
                            onChange={() => setVisibleColumns(prev => ({ ...prev, [colKey]: !prev[colKey] }))}
                            style={{ accentColor: "var(--primary)" }}
                          />
                          <span>
                            {colKey === "fullName" ? "Name" : colKey === "failed_attempts" ? "Failed Attempts" : colKey === "account_locked" ? "Locked" : colKey === "lastLogin" ? "Last Login" : colKey.charAt(0).toUpperCase() + colKey.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <Button variant="secondary" onClick={handleResetFilters}>
                Reset
              </Button>
            </div>
          </Card>

          {/* User Table Card */}
          <Card title="User Accounts Directory">
            <Table
              columns={columns}
              data={filteredUsers}
              isLoading={isLoading}
              showSearch={false}
              emptyTitle="No users found"
              emptyDescription="Try adjusting your filter settings or create a new user profile."
            />
          </Card>
        </>
      )}

      {/* TAB CONTENT: 2. BLOCKED USERS */}
      {activeTab === "blocked" && (
        <Card title="Blocked & Inactive User Accounts" subtitle="Lists only locked profiles and inactive operators requiring administrative resolution.">
          <div style={{ marginBottom: "1rem", maxWidth: "400px" }}>
            <Input
              placeholder="Search blocked users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startIcon={<Search size={18} />}
            />
          </div>
          <Table
            columns={columns}
            data={blockedUsers}
            isLoading={isLoading}
            showSearch={false}
            emptyTitle="No blocked users found"
            emptyDescription="All operator accounts are currently unlocked and active."
          />
        </Card>
      )}

      {/* TAB CONTENT: 3. AUDIT HISTORY */}
      {activeTab === "audits" && (
        <Card
          title="Admin & Security Audit Logs"
          subtitle="Operational history tracking credentials updates, password resets, role updates, and system lockout alerts."
        >
          <Table
            isLoading={isAuditLoading}
            data={auditLogs}
            showSearch={true}
            searchPlaceholder="Filter audit records..."
            columns={[
              {
                header: "Performer",
                accessorKey: "user",
                cell: ({ getValue }) => {
                  const u = getValue();
                  return u ? `${u.fullName} (${u.role})` : "System / Lockout";
                }
              },
              {
                header: "Action",
                accessorKey: "action",
                cell: ({ getValue }) => {
                  const act = getValue();
                  let color = "var(--text-primary)";
                  if (act === "Failed Login" || act === "Account Locked") color = "var(--danger)";
                  if (act === "Successful Login" || act === "Account Unlocked") color = "var(--success)";
                  return <strong style={{ color }}>{act}</strong>;
                }
              },
              {
                header: "Target User",
                accessorKey: "targetUser",
                cell: ({ getValue }) => {
                  const u = getValue();
                  return u ? u.fullName : "-";
                }
              },
              {
                header: "IP",
                accessorKey: "ipAddress",
                cell: ({ getValue }) => getValue() || "Local"
              },
              {
                header: "Browser/Agent",
                accessorKey: "device",
                cell: ({ getValue }) => {
                  const ua = getValue() || "";
                  if (ua.length > 50) return `${ua.substring(0, 50)}...`;
                  return ua || "Internal System";
                }
              },
              {
                header: "Timestamp",
                accessorKey: "timestamp",
                cell: ({ getValue }) => new Date(getValue()).toLocaleString()
              }
            ]}
          />
        </Card>
      )}

      {/* View User Modal */}
      <Modal
        isOpen={!!viewingUser}
        onClose={() => setViewingUser(null)}
        title="User Account Details"
        size="md"
      >
        {viewingUser && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
              <img
                src={viewingUser.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${viewingUser.fullName}`}
                alt="Avatar"
                style={{ width: "64px", height: "64px", borderRadius: "50%", border: "2px solid var(--primary)", objectFit: "cover" }}
              />
              <div>
                <h4 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>{viewingUser.fullName}</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600 }}>{viewingUser.role}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{viewingUser.email}</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.85rem" }}>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Department:</span>
                <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>{viewingUser.department || "Operations"}</p>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Phone Number:</span>
                <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>{viewingUser.phoneNumber || "-"}</p>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Status:</span>
                <p><StatusBadge status={viewingUser.status} resolvedVariant={viewingUser.status === "Active" ? "success" : "danger"} /></p>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Account Lock Status:</span>
                <p><StatusBadge status={viewingUser.account_locked ? "Locked" : "Unlocked"} resolvedVariant={viewingUser.account_locked ? "danger" : "success"} /></p>
              </div>
              {viewingUser.account_locked && (
                <>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Locked At:</span>
                    <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>{new Date(viewingUser.locked_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Unlock Reason / Override:</span>
                    <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>{viewingUser.unlock_reason || "None"}</p>
                  </div>
                </>
              )}
              <div>
                <span style={{ color: "var(--text-muted)" }}>Last Failed Attempt:</span>
                <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                  {viewingUser.last_failed_login ? new Date(viewingUser.last_failed_login).toLocaleString() : "None"}
                </p>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Last Successful Login:</span>
                <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                  {viewingUser.last_successful_login ? new Date(viewingUser.last_successful_login).toLocaleString() : "Never"}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
              <Button variant="secondary" onClick={() => setViewingUser(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Form Modal (Create / Edit) */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingUser ? "Edit User Profile" : "Register New Operational Account"}
        size="md"
      >
        <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <Input
            label="Full Name *"
            placeholder="e.g. John Doe"
            required
            value={formFields.fullName}
            onChange={(e) => setFormFields(prev => ({ ...prev, fullName: e.target.value }))}
          />
          <Input
            label="Email Address *"
            type="email"
            placeholder="e.g. john@transitops.com"
            required
            value={formFields.email}
            disabled={!!editingUser}
            onChange={(e) => setFormFields(prev => ({ ...prev, email: e.target.value }))}
          />

          {!editingUser && (
            <Input
              label="Temporary Password *"
              type="password"
              placeholder="At least 6 characters"
              required
              value={formFields.password}
              onChange={(e) => setFormFields(prev => ({ ...prev, password: e.target.value }))}
            />
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Select
              label="Role Assignment *"
              value={formFields.role}
              onChange={(e) => setFormFields(prev => ({ ...prev, role: e.target.value }))}
              options={rolesOptions.filter(opt => opt.value !== "Super Admin" || isSuperAdmin)}
            />
            <Select
              label="Department"
              value={formFields.department}
              onChange={(e) => setFormFields(prev => ({ ...prev, department: e.target.value }))}
              options={departmentOptions}
            />
          </div>

          <Input
            label="Phone Number"
            placeholder="e.g. +1 555 123 4567"
            value={formFields.phoneNumber}
            onChange={(e) => setFormFields(prev => ({ ...prev, phoneNumber: e.target.value }))}
          />

          <Select
            label="Initial Account Status"
            value={formFields.status}
            onChange={(e) => setFormFields(prev => ({ ...prev, status: e.target.value }))}
            options={[
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" }
            ]}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
            <Button variant="secondary" type="button" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingUser ? "Save Updates" : "Create Account"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Password Reset Modal (Super Admin only) */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setPasswordTargetUser(null);
          setNewPassword("");
        }}
        title="Administrative Password Reset"
        size="sm"
      >
        <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
            You are setting a new password for <strong style={{ color: "var(--text-primary)" }}>{passwordTargetUser?.fullName}</strong>.
          </p>
          <Input
            label="New Password *"
            type="password"
            placeholder="Min 6 characters"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
            <Button variant="secondary" type="button" onClick={() => {
              setIsPasswordModalOpen(false);
              setPasswordTargetUser(null);
              setNewPassword("");
            }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Password
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete User Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!deleteTargetUser}
        onClose={() => setDeleteTargetUser(null)}
        onConfirm={handleDeleteUser}
        title="Delete User Account"
        message={`Are you sure you want to permanently delete ${deleteTargetUser?.fullName}'s profile and access credentials? This action is permanent and cannot be undone.`}
        confirmLabel="Confirm Delete"
        variant="danger"
      />

      {/* Lock User Confirmation Dialog */}
      <Modal
        isOpen={!!lockTargetUser}
        onClose={() => setLockTargetUser(null)}
        title="Manual Account Lockout"
        size="sm"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
            Lock access for <strong style={{ color: "var(--text-primary)" }}>{lockTargetUser?.fullName}</strong>. This will block all active and future user logins instantly.
          </p>
          <Input
            label="Lockout Reason *"
            placeholder="Security Lockout / Investigation..."
            value={lockReason}
            onChange={(e) => setLockReason(e.target.value)}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
            <Button variant="secondary" type="button" onClick={() => setLockTargetUser(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleLockUser}>
              Lock Access
            </Button>
          </div>
        </div>
      </Modal>

      {/* Unlock User Confirmation Dialog */}
      <Modal
        isOpen={!!unlockTargetUser}
        onClose={() => setUnlockTargetUser(null)}
        title="Account Access Unlock Override"
        size="sm"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
            Unlock access for <strong style={{ color: "var(--text-primary)" }}>{unlockTargetUser?.fullName}</strong> and reset their failed login attempts.
          </p>
          <Input
            label="Unlock Reason / Security Log *"
            placeholder="Admin Override / Credentials Reset..."
            value={unlockReason}
            onChange={(e) => setUnlockReason(e.target.value)}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
            <Button variant="secondary" type="button" onClick={() => setUnlockTargetUser(null)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleUnlockUser}>
              Unlock Access
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
