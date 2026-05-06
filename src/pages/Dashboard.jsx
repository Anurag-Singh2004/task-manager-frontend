import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

function Dashboard() {
  const { currentUser, logout } = useAuth();

  useEffect(()=>{
    async function fetchProjects(){
      try{
        const res = await api.get('/projects');
        console.log("Projects:", res.data);
      }catch(err){
        console.log("Error:", err);
      }
    }
    fetchProjects();
  },[]);

  async function handleLogout(){
    await logout();
    // isAuthenticated becomes false
    // ProtectedRoute kicks in
    // Redirects to /login automatically
  }
  return (
    <div style={styles.page}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.logo}>⚛️ Task Manager</h1>
        <div style={styles.navRight}>
          <span style={styles.email}>
            👤 {currentUser?.email}
          </span>
          <button
            onClick={handleLogout}
            style={styles.logoutBtn}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <h2 style={styles.title}>My Projects</h2>
        <p style={styles.subtitle}>
          Projects will appear here soon! 🚀
        </p>
      </div>

    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#e2e8f0",
  },
  navbar: {
    background: "#1e293b",
    borderBottom: "1px solid #334155",
    padding: "16px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: 20,
    fontWeight: 800,
    color: "#e2e8f0",
    margin: 0,
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  email: {
    color: "#64748b",
    fontSize: 14,
  },
  logoutBtn: {
    background: "#dc2626",
    color: "#ffffff",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  },
  content: {
    padding: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    marginBottom: 8,
  },
  subtitle: {
    color: "#64748b",
  },
};

export default Dashboard;
