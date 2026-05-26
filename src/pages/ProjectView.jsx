import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import CreateTaskModal from "../components/Tasks/CreateTaskModal";
import TaskCard from "../components/Tasks/TaskCard";

function ProjectView() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  if (isLoading)
    return <p style={{ color: "white", padding: 32 }}>⏳ Loading...</p>;
  if (error) return <p style={{ color: "#fca5a5", padding: 32 }}>❌ {error}</p>;

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  return (
    <div style={{ color: "white", padding: 32 }}>
      <button onClick={() => setIsTaskModalOpen(true)}>+ Add Task</button>
      <button onClick={() => navigate("/dashboard")}>← Back</button>
      <h1>{project?.title}</h1>

      {/* Kanban Board */}
      <div style={{ display: "flex", gap: 24 }}>
        {/* Column 1 */}
        <div>
          <h3>TO DO ({todoTasks.length})</h3>
          {todoTasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>

        {/* Column 2 */}
        <div>
          <h3>IN PROGRESS ({inProgressTasks.length})</h3>
          {inProgressTasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>

        {/* Column 3 */}
        <div>
          <h3>DONE ({doneTasks.length})</h3>
          {doneTasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
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

export default ProjectView;
