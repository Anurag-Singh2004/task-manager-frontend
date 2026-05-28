import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import CreateTaskModal from "../components/Tasks/CreateTaskModal";
import TaskCard from "../components/Tasks/TaskCard";
import {useAuth} from "../context/AuthContext"

function ProjectView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {currentUser} = useAuth();

  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [projectRes, tasksRes] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get(`/projects/${id}/tasks`),
        ]);
        setProject(projectRes.data.data);
        setTasks(tasksRes.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  function handleTaskCreated(newTask) {
    setTasks((prev) => [...prev, newTask]);
  }

  function handleStatusChange(taskId, newStatus) {
    setTasks(prev=> prev.map(task=> task._id === taskId ? {...task, status: newStatus} : task));
  }

  function handleTaskDeleted(taskId) {
    setTasks((prev) => prev.filter((task) => task._id !== taskId));
  }

  if (isLoading)
    return <p style={{ color: "white", padding: 32 }}>⏳ Loading...</p>;
  if (error) return <p style={{ color: "#fca5a5", padding: 32 }}>❌ {error}</p>;

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.navLeft}>
          <button onClick={() => navigate("/dashboard")} style={styles.backBtn}>
            ← Back
          </button>
          <h1 style={styles.projectTitle}>{project?.title}</h1>
        </div>
        <button
          onClick={() => setIsTaskModalOpen(true)}
          style={styles.addTaskBtn}
        >
          + Add Task
        </button>
      </div>

      {/* Kanban Board */}
      <div style={styles.board}>
        {/* TO DO Column */}
        <div style={styles.column}>
          <div style={styles.columnHeader}>
            <span style={styles.columnTitle}>TO DO</span>
            <span style={styles.columnCount}>{todoTasks.length}</span>
          </div>
          <div style={styles.columnBody}>
            {todoTasks.length === 0 && (
              <p style={styles.empty}>No tasks here!</p>
            )}
            {todoTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                projectId={id}
                onStatusChange={handleStatusChange}
                canDelete={project.owner?._id === currentUser._id}
                onTaskDeleted={handleTaskDeleted}
              />
            ))}
          </div>
        </div>

        {/* IN PROGRESS Column */}
        <div style={styles.column}>
          <div style={styles.columnHeader}>
            <span style={styles.columnTitle}>IN PROGRESS</span>
            <span style={styles.columnCount}>{inProgressTasks.length}</span>
          </div>
          <div style={styles.columnBody}>
            {inProgressTasks.length === 0 && (
              <p style={styles.empty}>No tasks here!</p>
            )}
            {inProgressTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                projectId={id}
                onStatusChange={handleStatusChange}
                canDelete={project.owner?._id === currentUser._id}
                onTaskDeleted={handleTaskDeleted}
              />
            ))}
          </div>
        </div>

        {/* DONE Column */}
        <div style={styles.column}>
          <div style={styles.columnHeader}>
            <span style={styles.columnTitle}>DONE</span>
            <span style={styles.columnCount}>{doneTasks.length}</span>
          </div>
          <div style={styles.columnBody}>
            {doneTasks.length === 0 && (
              <p style={styles.empty}>No tasks here!</p>
            )}
            {doneTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                projectId={id}
                onStatusChange={handleStatusChange}
                canDelete={project.owner?._id === currentUser._id}
                onTaskDeleted={handleTaskDeleted}
              />
            ))}
          </div>
        </div>
      </div>

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onTaskCreated={handleTaskCreated}
        projectId={id}
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
  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  backBtn: {
    background: "transparent",
    border: "1px solid #334155",
    color: "#94a3b8",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: "#e2e8f0",
    margin: 0,
  },
  addTaskBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  },
  board: {
    display: "flex",
    gap: 24,
    padding: 32,
    alignItems: "flex-start",
  },
  column: {
    flex: 1,
    background: "#1e293b",
    borderRadius: 12,
    border: "1px solid #334155",
    minHeight: 500,
  },
  columnHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #334155",
  },
  columnTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  columnCount: {
    background: "#334155",
    color: "#94a3b8",
    borderRadius: 999,
    padding: "2px 10px",
    fontSize: 12,
    fontWeight: 700,
  },
  columnBody: {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  empty: {
    color: "#334155",
    fontSize: 14,
    textAlign: "center",
    padding: "20px 0",
  },
};

export default ProjectView;
