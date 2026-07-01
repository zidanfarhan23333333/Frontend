import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

// Sesuai app.js: auth → /auth/..., user → /user/..., admin → /admin/...
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

// Attach Bearer token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session saat app pertama load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    if (token && stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // ── Login ──────────────────────────────────────────────────
  // POST /auth/login  →  { email, password }
  // Response: { success, data: { user, token } }
  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      const { data: res } = await api.post("/auth/login", { email, password });

      // ApiResponse.success membungkus di res.data
      const { user: userData, token } = res.data ?? res;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return userData; // caller pakai userData.role untuk redirect
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Register ───────────────────────────────────────────────
  // POST /auth/register  →  { nama, email, password, role }
  // Response: { success, data: { user_id, nama, email, role, created_at } }
  const register = useCallback(async (formData, role = "user") => {
    setLoading(true);
    try {
      const { data: res } = await api.post("/auth/register", {
        ...formData,
        role,
      });
      return res.data ?? res;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Logout ─────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  // ── Update user (partial) + sync ke localStorage ────────────
  // Bisa dipanggil dengan object atau updater function:
  //   updateUser({ foto: "..." })
  //   updateUser((prev) => ({ ...prev, foto: "..." }))
  const updateUser = useCallback((updater) => {
    setUser((prev) => {
      const updated =
        typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        api,
        setUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
