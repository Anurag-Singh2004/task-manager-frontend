import { useNavigate } from "react-router-dom";

function ProjectCard({project}){
  const navigate = useNavigate();

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>📁 {project.title}</h3>
      <p style={styles.desc}>{project.description || "No description"}</p>

      <p style={styles.members}>👥 {project.members.length} members</p>

      <button
        onClick={() => navigate(`/projects/${project._id}`)}
        style={styles.btn}
      >
        Open →
      </button>
    </div>
  );
}

const styles = {
  card: {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 12,
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: "#e2e8f0",
    margin: 0,
  },
  desc: {
    fontSize: 14,
    color: "#64748b",
    margin: 0,
  },
  members: {
    fontSize: 13,
    color: "#94a3b8",
    margin: 0,
  },
  btn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
    marginTop: "auto",
  },
};

export default ProjectCard;