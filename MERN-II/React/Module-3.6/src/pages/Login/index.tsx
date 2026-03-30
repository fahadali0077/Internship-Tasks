import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { LoginSchema, type LoginFormValues } from "@/schemas/auth";

/**
 * LoginPage — "/login"
 *
 * MENTAL MODEL — redirect after login:
 *   When ProtectedRoute redirects here, it passes `state: { from: location }`.
 *   After successful login we navigate to location.state.from (the page they
 *   tried to visit) or fall back to "/products".
 *
 *   useLocation().state is typed as `unknown` — we cast carefully.
 */
export function LoginPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in, redirect away immediately
  if (isAuthenticated) {
    return <Navigate to="/products" replace />;
  }

  // Where to go after login — defaults to /products
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/products";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginFormValues) => {
    setSubmitError(null);
    try {
      await login(data.email, data.password);
      void navigate(from, { replace: true });
    } catch {
      setSubmitError("Invalid credentials. Try any email and password.");
    }
  };

  return (
    <div className="auth-page">
      <form
        className="auth-form"
        onSubmit={(e) => { void handleSubmit(onSubmit)(e); }}
        noValidate
      >
        <div className="auth-form-header">
          <span className="auth-logo-mark" aria-hidden="true">◈</span>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">
            {from !== "/products"
              ? `Log in to continue to ${from}`
              : "Sign in to your account"}
          </p>
        </div>

        {/* Email */}
        <div className={`form-field ${errors.email ? "form-field--error" : touchedFields.email ? "form-field--valid" : ""}`}>
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="email"
            className="form-input"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="form-error" role="alert">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className={`form-field ${errors.password ? "form-field--error" : touchedFields.password ? "form-field--valid" : ""}`}>
          <label htmlFor="password" className="form-label">Password</label>
          <div className="input-with-toggle">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="form-input"
              placeholder="Your password"
              autoComplete="current-password"
              {...register("password")}
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              className="input-toggle"
              onClick={() => { setShowPassword((v) => !v); }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
          {errors.password && (
            <p className="form-error" role="alert">{errors.password.message}</p>
          )}
        </div>

        {/* Submit error */}
        {submitError && (
          <div className="form-banner form-banner--error" role="alert">
            {submitError}
          </div>
        )}

        {/* Hint */}
        <p className="auth-hint">
          💡 Enter any email and password — all credentials are accepted in this mock.
        </p>

        <button
          type="submit"
          className="btn-submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting
            ? <span className="btn-spinner" aria-hidden="true" />
            : "Sign In"}
        </button>

        <p className="form-switch">
          No account?{" "}
          <Link to="/register" className="btn-link">
            Create one →
          </Link>
        </p>
      </form>
    </div>
  );
}
