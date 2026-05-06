import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

function Dashboard() {
  const { currentUser } = useAuth();

  useEffect(() => {
    // Test API call — fetch projects
    async function test() {
      try {
        const res = await api.get("/projects");
        console.log("Projects response:", res.data);
      } catch (err) {
        console.log("Error:", err.response?.status, err.response?.data);
      }
    }
    test();
  }, []);
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {currentUser?.email}</p>
    </div>
  );
}

export default Dashboard;
