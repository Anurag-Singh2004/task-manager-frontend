import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({children}){
  const { isAuthenticated } = useAuth();

  // Not logged in? Send to login page
  // Replace=true means /login replaces current
  // history entry (back button won't go back
  // to dashboard when not logged in)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // Logged in? Render whatever is inside
  return children;
}
export default ProtectedRoute