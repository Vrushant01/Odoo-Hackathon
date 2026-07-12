import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Truck, Eye, EyeOff, AlertCircle } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import styles from "./Login.module.css";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "Please select a role")
});

const ROLE_DEMOS = [
  { role: "Fleet Manager", email: "manager@transitops.com", password: "password" },
  { role: "Dispatcher", email: "dispatcher@transitops.com", password: "password" },
  { role: "Safety Officer", email: "safety@transitops.com", password: "password" },
  { role: "Financial Analyst", email: "finance@transitops.com", password: "password" }
];

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Redirection target after logging in
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: ""
    }
  });

  const selectedRole = watch("role");

  // Autofills specific role credentials for quick hackathon/demo review
  const handleRoleQuickSelect = (demo) => {
    setValue("role", demo.role, { shouldValidate: true });
    setValue("email", demo.email, { shouldValidate: true });
    setValue("password", demo.password, { shouldValidate: true });
    setErrorMsg("");
  };

  const onSubmit = async (data) => {
    setErrorMsg("");
    setLoading(true);
    try {
      await login(data.email, data.password, data.role, rememberMe);
      toast.success(`Welcome back, ${data.role}!`);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || "Login failed. Please check your credentials.");
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info("A password reset link has been sent to your email (Mock).", {
      description: "In production, this will trigger an email notification."
    });
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.logoIcon}>
            <Truck size={36} strokeWidth={2.5} />
          </div>
          <h2 className={styles.title}>TransitOps</h2>
          <p className={styles.subtitle}>Smart Transport Operations Platform</p>
        </div>

        {errorMsg && (
          <div className={styles.errorAlert}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Demo Role Fillers */}
        <div>
          <p className={styles.roleSelectorLabel}>Quick Login as Demo Role:</p>
          <div className={styles.roleGrid}>
            {ROLE_DEMOS.map((demo) => (
              <button
                key={demo.role}
                type="button"
                className={`${styles.roleButton} ${
                  selectedRole === demo.role ? styles.roleActive : ""
                }`}
                onClick={() => handleRoleQuickSelect(demo)}
              >
                {demo.role}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* Email input */}
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. manager@transitops.com"
            error={errors.email?.message}
            disabled={loading}
            {...register("email")}
          />

          {/* Password input */}
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            error={errors.password?.message}
            disabled={loading}
            endIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            onEndIconClick={() => setShowPassword(!showPassword)}
            {...register("password")}
          />

          {/* Hidden Role input monitored by quick-select buttons */}
          <input type="hidden" {...register("role")} />
          {errors.role && (
            <span style={{ fontSize: "0.8rem", color: "var(--danger)", marginTop: "-0.5rem", fontWeight: 500 }}>
              {errors.role.message}
            </span>
          )}

          {/* Remember Me and Forgot Password row */}
          <div className={styles.row}>
            <label className={styles.rememberMe}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              className={styles.forgotPassword}
              onClick={handleForgotPassword}
              disabled={loading}
            >
              Forgot Password?
            </button>
          </div>

          <Button type="submit" variant="primary" fullWidth loading={loading}>
            Sign In to Platform
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
