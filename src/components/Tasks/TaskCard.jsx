import {useState} from "react";
import api from "../../utils/api";

function TaskCard({ task, projectId, onStatusChange, canDelete, onTaskDeleted }) {

  const [isUpdating, setIsUpdating] = useState(false);

  function getPriorityColor(priority) {
    if (priority === "high") return "#dc2626";
    if (priority === "medium") return "#f59e0b";
    return "#22c55e";
  }

  async function handleStatusChange(newStatus) {
    setIsUpdating(true);
    try{
        await api.patch(`/projects/${projectId}/tasks/${task._id}/status`, {status: newStatus});
        onStatusChange(task._id, newStatus);
    }catch(err){
        console.error('Status update failed', err);
  }finally{
        setIsUpdating(false);
    }
  }

  async function handleDelete(){
    if(!window.confirm('Are you sure you want to delete this task')) return;
    setIsUpdating(true);
    try{
      await api.delete(`/projects/${projectId}/tasks/${task._id}`)
      onTaskDeleted(task._id)
    }catch(err){
      console.error('Delete failed :',err)
    }finally{
      setIsUpdating(false)
    }
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
      {task.description && <p style={styles.description}>{task.description}</p>}

      {/* Due Date */}
      {task.dueDate && (
        <p style={styles.dueDate}>
          📅 {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}

      {/* Status Buttons */}
      <div style={styles.statusButtons}>
        {task.status !== "todo" && (
          <button
            onClick={() => handleStatusChange("todo")}
            disabled={isUpdating}
            style={styles.statusBtn}
          >
            Todo
          </button>
        )}
        {task.status !== "in-progress" && (
          <button
            onClick={() => handleStatusChange("in-progress")}
            disabled={isUpdating}
            style={styles.statusBtn}
          >
            In Progress
          </button>
        )}
        {task.status !== "done" && (
          <button
            onClick={() => handleStatusChange("done")}
            disabled={isUpdating}
            style={{ ...styles.statusBtn, background: "#16a34a" }}
          >
            Done ✓
          </button>
        )}
        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={isUpdating}
            style={{
              ...styles.statusBtn,
              background: "transparent",
              border: "1px solid #dc2626",
              color: "#dc2626",
              marginTop: 4,
            }}
          >
            🗑️ Delete
          </button>
        )}
      </div>
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
  statusButtons: {
    display: "flex",
    gap: 6,
    marginTop: 8,
    flexWrap: "wrap",
  },
  statusBtn: {
    background: "#334155",
    border: "none",
    color: "#e2e8f0",
    borderRadius: 6,
    padding: "4px 10px",
    fontSize: 12,
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default TaskCard;