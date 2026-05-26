function TaskCard({ task }) {
  function getPriorityColor(priority) {
    if (priority === "high") return "#dc2626";
    if (priority === "medium") return "#f59e0b";
    return "#22c55e";
  }

  return (
    <div style={styles.card}>
        
      {/*Priority Badge*/}
      <span
        style={{
          ...styles.badge,
          background: getPriorityColor(task.priority),
        }}
      >
        {task.priority}
      </span>

      {/* Title */}
      <p style={styles.title}>{task.title}</p>

      {/* Description */}
      {task.description && (<p style={styles.description}>{task.description}</p>)}

      {/* Due Date */}
      {task.dueDate && (
        <p style={styles.dueDate}>
          📅 {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: 12,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    cursor: "pointer",
  },
  badge: {
    color: "#fff",
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 999,
    textTransform: "uppercase",
    alignSelf: "flex-start",
  },
  title: {
    color: "#e2e8f0",
    fontSize: 15,
    fontWeight: 600,
    margin: 0,
  },
  description: {
    color: "#64748b",
    fontSize: 13,
    margin: 0,
  },
  dueDate: {
    color: "#94a3b8",
    fontSize: 12,
    margin: 0,
  },
};

export default TaskCard;