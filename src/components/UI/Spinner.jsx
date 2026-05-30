function Spinner({message = 'Loading...'}){
    return (
      <div style={styles.container}>
        <div style={styles.spinner} />
        <p style={styles.message}>{message}</p>
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
  spinner: {
    width: 40,
    height: 40,
    border: "4px solid #334155",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  message: {
    color: "#64748b",
    fontSize: 15,
  },
};

export default Spinner;