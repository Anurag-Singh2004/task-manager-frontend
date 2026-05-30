import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import CreateTaskModal from "../components/Tasks/CreateTaskModal";
import TaskCard from "../components/Tasks/TaskCard";
import {useAuth} from "../context/AuthContext";
import AddMemberModal from "../components/Projects/AddMemberModal";
import CategoryModal from "../components/Projects/CategoryModal";

function ProjectView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {currentUser} = useAuth();

  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [projectRes, tasksRes, categoriesRes] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get(`/projects/${id}/tasks`),
          api.get(`/projects/${id}/categories`),
        ]);
        setProject(projectRes.data.data);
        setTasks(tasksRes.data.data);
        setCategories(categoriesRes.data.data);
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

  function handleMemberAdded(updatedProject) {
    setProject(updatedProject);
  }

  function handleCategoryAdded(newCategory){
    setCategories(prev=>[...prev, newCategory])
  }

  if (isLoading)
    return <p style={{ color: "white", padding: 32 }}>⏳ Loading...</p>;
  if (error) return <p style={{ color: "#fca5a5", padding: 32 }}>❌ {error}</p>;


  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    const matchesStatus =
      statusFilter == "all" || task.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const todoTasks = filteredTasks.filter((task) => task.status === "todo");
  const inProgressTasks = filteredTasks.filter((task) => task.status === "in-progress");
  const doneTasks = filteredTasks.filter((task) => task.status === "done");


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
        <div style={styles.navRight}>
          {project.owner?._id === currentUser._id && (
            <button
              onClick={() => setIsMemberModalOpen(true)}
              style={styles.addMemberBtn}
            >
              + Add Member
            </button>
          )}
          <button
            onClick={() => setIsTaskModalOpen(true)}
            style={styles.addTaskBtn}
          >
            + Add Task
          </button>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            style={styles.categoryBtn}
          >
          +  Categories
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        {/* Search */}
        <input
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          style={styles.select}
        >
          <option value="all">All Priorities</option>
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.select}
        >
          <option value="all">All Statuses</option>
          <option value="todo">📋 Todo</option>
          <option value="in-progress">⚙️ In Progress</option>
          <option value="done">✅ Done</option>
        </select>
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

      <AddMemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        onMemberAdded={handleMemberAdded}
        projectId={id}
      />

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onTaskCreated={handleTaskCreated}
        projectId={id}
        categories={categories}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        projectId={id}
        onCategoryAdded={handleCategoryAdded}
        canManage={project.owner?._id === currentUser._id}
      />
    </div>
  );
}

const styles = {
  addMemberBtn: {
    background: "transparent",
    border: "1px solid #334155",
    color: "#94a3b8",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  },
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
  navRight: {
    display: "flex",
    gap: 12,
    alignItems: "center",
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
  filters: {
    display: "flex",
    gap: 12,
    padding: "16px 32px",
    background: "#1e293b",
    borderBottom: "1px solid #334155",
  },
  searchInput: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: 8,
    padding: "8px 14px",
    color: "#e2e8f0",
    fontSize: 14,
    outline: "none",
    flex: 1,
  },
  select: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: 8,
    padding: "8px 14px",
    color: "#e2e8f0",
    fontSize: 14,
    cursor: "pointer",
  },
  categoryBtn: {
    background: "transparent",
    border: "1px solid #334155",
    color: "#94a3b8",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  },
};

export default ProjectView;
