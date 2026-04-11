import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Register() {
  //State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //Hooks
  const { register } = useAuth();
  const navigate = useNavigate();

  //Handlers
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // clear error when user starts typing again
  }

  async function handleSubmit(e) {
    e.preventDefault();

    //validation
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setIsLoading(true); //disable button

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
    );
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
      setIsLoading(false); //re-enable button
    }
  }
  //UI
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/*Header*/}
        <div style={styles.header}>
          <h1 style={styles.logo}>⚛️ Task Manager</h1>
          <p style={styles.subtitle}>Create your account</p>
        </div>
        {/* Error message */}
        {error && <div style={styles.error}>❌ {error}</div>}
        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Anurag Singh"
              style={styles.input}
              disabled={isLoading}
            />
          </div>

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
              placeholder="Min 6 characters"
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
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Link to login */}
        <p style={styles.loginText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login here →
          </Link>
        </p>
      </div>
    </div>
  );
}
//styles
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
    transition: "opacity 0.2s",
    width: "100%",
  },
  loginText: {
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

export default Register;
