import { useState } from "react";
import api from "../../utils/api";

function CategoryModal({
  isOpen,
  onClose,
  categories,
  projectId,
  onCategoryAdded,
  canManage,
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#2563eb");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if(!name.trim()){
        setError("Category name is required");
        return;
    }
    setIsLoading(true);
    try{
        const res = await api.post(`/projects/${projectId}/categories`, { name, color });
        onCategoryAdded(res.data.data);
        setName('');
        setColor('#256eb');
        setError('');
    }catch(err){
        setError(err.response?.data?.error || "Failed to create category");
    }finally{
        setIsLoading(false);
    }
  }

  if(!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Categories</h2>
          <button onClick={onClose} style={styles.closeBtn}>
            ✕
          </button>
        </div>

        {/* Existing Categories */}
        <div style={styles.categoryList}>
          {categories.length === 0 && (
            <p style={styles.empty}>No categories yet!</p>
          )}
          {categories.map((cat) => (
            <div key={cat._id} style={styles.categoryItem}>
              <span
                style={{
                  ...styles.colorDot,
                  background: cat.color,
                }}
              />
              <span style={styles.categoryName}>{cat.name}</span>
            </div>
          ))}
        </div>

        {/* Create New Category — owner only */}
        {canManage && (
          <>
            <div style={styles.divider} />
            <p style={styles.subtitle}>Add New Category</p>

            {error && <div style={styles.error}>❌ {error}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Name */}
              <div style={styles.field}>
                <label style={styles.label}>Name</label>
                <input
                  placeholder="Bug Fix"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  style={styles.input}
                  disabled={isLoading}
                />
              </div>

              {/* Color */}
              <div style={styles.field}>
                <label style={styles.label}>Color</label>
                <div style={styles.colorRow}>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={styles.colorPicker}
                    disabled={isLoading}
                  />
                  <span style={styles.colorValue}>{color}</span>
                </div>
              </div>

              {/* Buttons */}
              <div style={styles.buttons}>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    ...styles.addBtn,
                    opacity: isLoading ? 0.7 : 1,
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {isLoading ? "Adding..." : "+ Add Category"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#1e293b",
    borderRadius: 16,
    padding: 32,
    width: "100%",
    maxWidth: 440,
    border: "1px solid #334155",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 800,
    color: "#e2e8f0",
    margin: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#64748b",
    fontSize: 20,
    cursor: "pointer",
    padding: 4,
  },
  categoryList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 8,
  },
  categoryItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 12px",
    background: "#0f172a",
    borderRadius: 8,
    border: "1px solid #334155",
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    flexShrink: 0,
  },
  categoryName: {
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: 500,
  },
  empty: {
    color: "#64748b",
    fontSize: 14,
    textAlign: "center",
    padding: "12px 0",
  },
  divider: {
    height: 1,
    background: "#334155",
    margin: "20px 0",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 16,
  },
  error: {
    background: "#450a0a",
    border: "1px solid #dc2626",
    color: "#fca5a5",
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 16,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
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
    fontFamily: "inherit",
  },
  colorRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  colorPicker: {
    width: 48,
    height: 40,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    background: "none",
  },
  colorValue: {
    color: "#64748b",
    fontSize: 14,
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  addBtn: {
    background: "#2563eb",
    border: "none",
    color: "#fff",
    borderRadius: 8,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 700,
  },
};

export default CategoryModal;