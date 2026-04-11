import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 

function PublicRoute({ children }) {
  // Already logged in? No need to see login/register
  // Send them to dashboard instead
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  return children;
}
export default PublicRoute;
