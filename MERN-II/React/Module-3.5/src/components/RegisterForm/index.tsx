import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterFormValues } from "@/schemas/auth";

interface RegisterFormProps {
  onSuccess?: (data: RegisterFormValues) => void;
  onSwitchToLogin?: () => void;
}


export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Uncontrolled file input — useRef reads value imperatively on submit
  const avatarRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, touchedFields },
    watch,
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    mode: "onTouched", // show errors after field is touched (blurred)

  });

  // Watch password field to show real-time strength indicator
  const passwordValue = watch("password", "");

  const getPasswordStrength = (pwd: string): { level: number; label: string } => {
    let level = 0;
    if (pwd.length >= 8) level++;
    if (/[A-Z]/.test(pwd)) level++;
    if (/[0-9]/.test(pwd)) level++;
    if (/[^a-zA-Z0-9]/.test(pwd)) level++;
    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    return { level, label: labels[level] ?? "" };
  };

  const strength = getPasswordStrength(passwordValue);

  const handleAvatarChange = () => {
    const file = avatarRef.current?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // In Module 6 this becomes a Server Action call
      await new Promise((resolve) => setTimeout(resolve, 1200)); // simulate API

      // Read uncontrolled file input imperatively
      const avatarFile = avatarRef.current?.files?.[0];
      console.log("Form submitted:", { ...data, avatarFile });

      setSubmitStatus("success");
      onSuccess?.(data);
      reset();
      setAvatarPreview(null);
    } catch {
      setSubmitStatus("error");
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="form-success">
        <span className="form-success-icon" aria-hidden="true">✓</span>
        <h3 className="form-success-title">Account created!</h3>
        <p className="form-success-sub">You can now log in with your credentials.</p>
        <button
          className="btn-link"
          onClick={() => { setSubmitStatus("idle"); onSwitchToLogin?.(); }}
        >
          Go to Login →
        </button>
      </div>
    );
  }

  return (
    <form className="register-form" onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} noValidate>
      <h2 className="form-title">Create Account</h2>
      <p className="form-subtitle">Join thousands of happy shoppers</p>

      {/* ── Avatar upload (UNCONTROLLED — useRef) ── */}
      <div className="form-avatar-row">
        <div className="avatar-preview">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar preview" className="avatar-img" />
          ) : (
            <span className="avatar-placeholder" aria-hidden="true">◈</span>
          )}
        </div>
        <div className="avatar-upload">
          <label htmlFor="avatar-input" className="btn-upload">
            {avatarPreview ? "Change photo" : "Upload photo"}
          </label>
          {/* This is an UNCONTROLLED input — no value prop, read via ref */}
          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            ref={avatarRef}
            onChange={handleAvatarChange}
            className="visually-hidden"
            aria-label="Upload profile photo"
          />
          <p className="avatar-hint">Optional · JPG, PNG, WebP · max 2MB</p>
        </div>
      </div>

      {/* ── Name ── */}
      <div className={`form-field ${errors.name ? "form-field--error" : touchedFields.name ? "form-field--valid" : ""}`}>
        <label htmlFor="name" className="form-label">Full Name</label>
        <input
          id="name"
          type="text"
          className="form-input"
          placeholder="Fahad Ali"
          autoComplete="name"
          {...register("name")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="form-error" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* ── Email ── */}
      <div className={`form-field ${errors.email ? "form-field--error" : touchedFields.email ? "form-field--valid" : ""}`}>
        <label htmlFor="email" className="form-label">Email Address</label>
        <input
          id="email"
          type="email"
          className="form-input"
          placeholder="fahad@example.com"
          autoComplete="email"
          {...register("email")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="form-error" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* ── Password ── */}
      <div className={`form-field ${errors.password ? "form-field--error" : touchedFields.password ? "form-field--valid" : ""}`}>
        <label htmlFor="password" className="form-label">Password</label>
        <div className="input-with-toggle">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="form-input"
            placeholder="Min 8 chars with a number"
            autoComplete="new-password"
            {...register("password")}
            aria-invalid={!!errors.password}
            aria-describedby="password-strength password-error"
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

        {/* Password strength indicator */}
        {passwordValue.length > 0 && (
          <div className="strength-bar" aria-label={`Password strength: ${strength.label}`}>
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className={`strength-segment ${
                n <= strength.level && strength.level > 0
                  ? `strength--${(["", "weak", "fair", "good", "strong"] as const)[strength.level] ?? ""}`
                  : ""
              }`}
              />
            ))}
            <span className="strength-label">{strength.label}</span>
          </div>
        )}

        {errors.password && (
          <p id="password-error" className="form-error" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* ── Confirm Password ── */}
      <div className={`form-field ${errors.confirmPassword ? "form-field--error" : touchedFields.confirmPassword ? "form-field--valid" : ""}`}>
        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
        <div className="input-with-toggle">
          <input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            className="form-input"
            placeholder="Repeat your password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
          />
          <button
            type="button"
            className="input-toggle"
            onClick={() => { setShowConfirm((v) => !v); }}
            aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirm ? "🙈" : "👁"}
          </button>
        </div>
        {errors.confirmPassword && (
          <p id="confirm-error" className="form-error" role="alert">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* ── Error banner ── */}
      {submitStatus === "error" && (
        <div className="form-banner form-banner--error" role="alert">
          Something went wrong. Please try again.
        </div>
      )}

      {/* ── Submit — disabled while form is INVALID or while SUBMITTING ── */}
      <button
        type="submit"
        className="btn-submit"
        disabled={!isValid || isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <span className="btn-spinner" aria-hidden="true" />
        ) : (
          "Create Account"
        )}
      </button>

      <p className="form-switch">
        Already have an account?{" "}
        <button type="button" className="btn-link" onClick={onSwitchToLogin}>
          Log in
        </button>
      </p>
    </form>
  );
}
