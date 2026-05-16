import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import ProjectCard from "../components/Projects/ProjectCard";
import CreateProjectModal from "../components/Projects/CreateProjectModal";

function Dashboard() {
  const { currentUser, logout } = useAuth();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true);
        const res = await api.get("/projects");
        setProjects(res.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjects();
  }, []);

  async function handleLogout() {
    await logout();
  }

  function handleProjectCreated(newProject) {
    setProjects((prev) => [...prev, newProject]);
  }

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <h1 style={styles.logo}>⚛️ Task Manager</h1>
        <div style={styles.navRight}>
          <span style={styles.email}>👤 {currentUser?.email}</span>
          <button onClick={() => setIsOpen(true)} style={styles.newProjectBtn}>
            + New Project
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.header}>
          <h2 style={styles.title}>My Projects</h2>
        </div>

        {isLoading && <p style={styles.loading}>⏳ Loading projects...</p>}

        {error && <p style={styles.errorMsg}>❌ {error}</p>}

        {!isLoading && !error && projects.length === 0 && (
          <p style={styles.empty}>No projects yet! Create your first one. 🚀</p>
        )}

        <div style={styles.grid}>
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </div>
      <CreateProjectModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
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
    maxWidth: 1200,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 20,
  },
  loading: {
    color: "#64748b",
    fontSize: 16,
    textAlign: "center",
    padding: 40,
  },
  errorMsg: {
    color: "#fca5a5",
    fontSize: 16,
    textAlign: "center",
    padding: 40,
  },
  empty: {
    color: "#64748b",
    fontSize: 16,
    textAlign: "center",
    padding: 40,
  },
  newProjectBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  },
};

export default Dashboard;
