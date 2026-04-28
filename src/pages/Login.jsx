import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  // ── State ──────────────────────────────────────────────
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ── Hooks ──────────────────────────────────────────────
  const { login } = useAuth();
  const navigate = useNavigate();

  // ── Handlers ───────────────────────────────────────────
  function handleChange(e) {
    // ← fixed camelCase
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  }

  // ── UI ─────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.logo}>⚛️ Task Manager</h1>
          <p style={styles.subtitle}>Welcome back!</p>
        </div>

        {/* Error */}
        {error && <div style={styles.error}>❌ {error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="anurag@gmail.com"
              style={styles.input}
              disabled={isLoading}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={styles.input}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.button,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Link to register */}
        <p style={styles.bottomText}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register here →
          </Link>
        </p>
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f172a",
    padding: 20,
  },
  card: {
    background: "#1e293b",
    borderRadius: 16,
    padding: 40,
    width: "100%",
    maxWidth: 420,
    border: "1px solid #334155",
  },
  header: {
    textAlign: "center",
    marginBottom: 32,
  },
  logo: {
    fontSize: 28,
    fontWeight: 800,
    color: "#e2e8f0",
    margin: "0 0 8px",
  },
  subtitle: {
    color: "#64748b",
    fontSize: 15,
    margin: 0,
  },
  error: {
    background: "#450a0a",
    border: "1px solid #dc2626",
    color: "#fca5a5",
    padding: "12px 16px",
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: 8,
    padding: "12px 14px",
    color: "#e2e8f0",
    fontSize: 15,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: 8,
    padding: "14px",
    fontSize: 15,
    fontWeight: 700,
    marginTop: 8,
    width: "100%",
    transition: "opacity 0.2s",
  },
  bottomText: {
    textAlign: "center",
    color: "#64748b",
    fontSize: 14,
    marginTop: 24,
    marginBottom: 0,
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: 600,
  },
};

export default Login;
