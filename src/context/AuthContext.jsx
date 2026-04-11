import  {createContext, useContext, useState} from 'react';
import api from '../utils/api';

//Create the context
const AuthContext = createContext(null);

//Create the provider
export function AuthProvider({children}){
  const [currentUser, setCurrentUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //Register
  async function register(name, email, password) {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      //save token
      setAccessToken(res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      // Fetch current user info
      // We'll add this once we know the user endpoint
      // For now store basic info
      setCurrentUser({ name, email });

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Registration failed",
      };
    } finally {
      setIsLoading(false);
    }
  }

  //Login
  async function login(email, password) {
    setIsLoading(true);
    try {
      const res = api.post("/auth/login", {
        email,
        password,
      });
      setAccessToken(res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      setCurrentUser({ email });
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Login failed",
      };
    } finally {
      setIsLoading(false);
    }
  }

  //Logout
  async function logout() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      // Tell server to invalidate the refresh token
      api.post("/auth/logout", { refreshToken });
    } catch (err) {
      // Even if server call fails — still log out locally
      console.error("Logout error:", err);
    } finally {
      setAccessToken(null);
      setCurrentUser(null);
      localStorage.removeItem("refreshToken");
    }
  }

  // ── What goes in the backpack ──────────
  const value = {
    currentUser,
    accessToken,
    isLoading,
    login,
    logout,
    register,
    isAuthenticated: !!accessToken, // true if token exists
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

//  Custom hook to USE the context
// Instead of writing useContext(AuthContext) every time
// we write useAuth() — cleaner! 

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}




