import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login';
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to /dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Public routes — anyone can visit */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected route — we'll add auth check in Phase 2 */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Catch all — unknown URLs go to /dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
