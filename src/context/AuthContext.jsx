import  {createContext, useContext, useState, useEffect} from 'react';
import api from '../utils/api';
import { tokenStore } from '../utils/tokenStore';
import axios from 'axios';

//Create the context
const AuthContext = createContext(null);

//Helper
function decodeToken(token){
  try{
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload)); 
  }catch{
    return null;
  }
}

//Create the provider
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //when user refreshes the page, he has to login again since accesstoken was getting stored in memory(context state) so i added this useEffect so when app loads, check localStorage for refreshToken and silently get a new accessToken
  useEffect(() => {
    async function restoreSession() {
      const refreshToken = localStorage.getItem("refreshToken");
      // No refresh token → user never logged in
      // or already logged out → do nothing
      if (!refreshToken) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken },
        );
        const newToken = res.data.accessToken;

        // Restore session silently
        tokenStore.setToken(newToken);
        setAccessToken(newToken);

        // Decode token to get user info
        const decoded = decodeToken(newToken);
        const savedEmail = localStorage.getItem("userEmail"); // ← restore
        const savedName = localStorage.getItem("userName"); // ← restore

        setCurrentUser({
          _id: decoded?.id,
          email: savedEmail || "", // ← from localStorage
          name: savedName || "", // ← from localStorage
        });
      } catch {
        // refreshToken expired → clear everything
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userEmail"); // ← clear on failure
        localStorage.removeItem("userName"); // ← clear on failure
        tokenStore.clearToken();
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  //Register
  async function register(name, email, password) {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      const decoded = decodeToken(res.data.accessToken);
      //save token
      setAccessToken(res.data.accessToken);
      tokenStore.setToken(res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem('userEmail', email);
      localStorage.setItem("userName", name);

      // Fetch current user info
      // We'll add this once we know the user endpoint
      // For now store basic info
      setCurrentUser({
        _id: decoded?.id,
        email: email, // ← from form
        name: name, // ← from form
      });

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
      const res = await api.post("/auth/login", {
        email,
        password,
      });
      const decoded = decodeToken(res.data.accessToken);
      setAccessToken(res.data.accessToken);
      tokenStore.setToken(res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("userEmail", email);
      setCurrentUser({
        _id: decoded?.id,
        email: email,
      });
      return { success: true };
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
      await api.post("/auth/logout", { refreshToken });
    } catch (err) {
      // Even if server call fails — still log out locally
      console.error("Logout error:", err);
    } finally {
      setAccessToken(null);
      tokenStore.clearToken();
      setCurrentUser(null);
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
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




