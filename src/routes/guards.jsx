import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <LoadingSpinner full />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children ?? <Outlet />;
};

export const RoleRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner full />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  // ✅ FIX: normalize role agar case-insensitive
  const userRole = user.role?.toLowerCase?.() ?? "";
  const normalizedRoles = roles.map((r) => r.toLowerCase());

  if (!normalizedRoles.includes(userRole)) {
    const redirect =
      userRole === "admin"
        ? "/admin/dashboard"
        : userRole === "pelatih"
          ? "/pelatih/dashboard"
          : "/user/dashboard";
    return <Navigate to={redirect} replace />;
  }

  return children ?? <Outlet />;
};

export const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner full />;
  if (user) {
    const userRole = user.role?.toLowerCase?.() ?? "";
    const redirect =
      userRole === "admin"
        ? "/admin/dashboard"
        : userRole === "pelatih"
          ? "/pelatih/dashboard"
          : "/user/dashboard";
    return <Navigate to={redirect} replace />;
  }

  return children ?? <Outlet />;
};
