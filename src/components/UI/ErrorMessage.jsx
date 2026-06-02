function ErrorMessage({ message, onRetry }) {
  return (
    <div style={styles.container}>
      <p style={styles.icon}>😵</p>
      <p style={styles.message}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} style={styles.retryBtn}>
          🔄 Try Again
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 60,
    gap: 16,
  },
  icon: {
    fontSize: 48,
    margin: 0,
  },
  message: {
    color: "#fca5a5",
    fontSize: 15,
    margin: 0,
  },
  retryBtn: {
    background: "#2563eb",
    border: "none",
    color: "#fff",
    borderRadius: 8,
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  },
};

export default ErrorMessage;