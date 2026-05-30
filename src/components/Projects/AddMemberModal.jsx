import { useState } from "react";
import api from "../../utils/api";

function AddMemberModal({ isOpen, onClose, onMemberAdded, projectId }){
    const [email,setEmail] = useState('');
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e){
        e.preventDefault();
        if(!email.trim()){
            setError("Email is required");
            return;
        }
        setIsLoading(true);
        try{
            const res = await api.post(`/projects/${projectId}/members`, { email: email.trim().toLowerCase() })
            onMemberAdded(res.data.data);
            setEmail('');
            onClose();
        }catch(err){
             setError(err.response?.data?.error || "Failed to add member");
        }finally{
            setIsLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          {/* Header */}
          <div style={styles.header}>
            <h2 style={styles.title}>Add Member</h2>
            <button onClick={onClose} style={styles.closeBtn}>
              ✕
            </button>
          </div>

          {/* Error */}
          {error && <div style={styles.error}>❌ {error}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Member Email</label>
              <input
                type="email"
                placeholder="member@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                style={styles.input}
                disabled={isLoading}
              />
            </div>

            {/* Buttons */}
            <div style={styles.buttons}>
              <button
                type="button"
                onClick={onClose}
                style={styles.cancelBtn}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  ...styles.addBtn,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                {isLoading ? "Adding..." : "Add Member →"}
              </button>
            </div>
          </form>
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
    fontFamily: "inherit",
  },
  buttons: {
    display: "flex",
    gap: 12,
    justifyContent: "flex-end",
  },
  cancelBtn: {
    background: "transparent",
    border: "1px solid #334155",
    color: "#94a3b8",
    borderRadius: 8,
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
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

export default AddMemberModal;