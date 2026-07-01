import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ProtectedRoute, RoleRoute, GuestRoute } from "./routes/guards";

// Public pages
import LandingPage from "./pages/public/LandingPage";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";
import PelatihRegisterPage from "./pages/public/PelatihRegisterPage";
import RekomendasiPage from "./pages/public/RekomendasiPage";
import TentangPage from "./pages/public/TentangPage";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPelatih from "./pages/admin/AdminPelatih";
import AdminVerifikasi from "./pages/admin/AdminVerifikasi";
import { AdminCabor } from "./pages/admin/AdminCabor";
import AdminRanking from "./pages/admin/AdminRanking";
import AdminPemesanan from "./pages/admin/AdminPemesanan";

// Pelatih pages
import PelatihDashboard from "./pages/pelatih/PelatihDashboard";
import {
  PelatihProfil,
  PelatihJadwal,
  PelatihStatus,
} from "./pages/pelatih/PelatihPages";

// User pages
import UserLayout from "./components/layout/UserLayout";
import {
  UserDashboard,
  UserCariPelatih,
  UserDetailPelatih,
  UserBooking,
  UserRiwayat,
  UserFavorit,
} from "./pages/user/UserPages";

// ✅ Halaman baru: edit profil & ganti password user
import { UserProfil, UserGantiPassword } from "./pages/user/userProfilPages";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              className: "font-sans text-sm font-semibold",
              style: { borderRadius: "12px", padding: "12px 16px" },
              success: { iconTheme: { primary: "#10B981", secondary: "#fff" } },
              error: { iconTheme: { primary: "#EF4444", secondary: "#fff" } },
            }}
          />
          <Routes>
            {/* ===== PUBLIC ===== */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/tentang" element={<TentangPage />} />
            <Route path="/rekomendasi" element={<RekomendasiPage />} />

            <Route
              path="/login"
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <RegisterPage />
                </GuestRoute>
              }
            />
            <Route
              path="/pelatih/register"
              element={
                <GuestRoute>
                  <PelatihRegisterPage />
                </GuestRoute>
              }
            />

            {/* ===== ADMIN ===== */}
            <Route
              path="/admin/dashboard"
              element={
                <RoleRoute roles={["admin"]}>
                  <AdminDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/admin/pelatih"
              element={
                <RoleRoute roles={["admin"]}>
                  <AdminPelatih />
                </RoleRoute>
              }
            />
            <Route
              path="/admin/verifikasi"
              element={
                <RoleRoute roles={["admin"]}>
                  <AdminVerifikasi />
                </RoleRoute>
              }
            />
            <Route
              path="/admin/cabor"
              element={
                <RoleRoute roles={["admin"]}>
                  <AdminCabor />
                </RoleRoute>
              }
            />
            <Route
              path="/admin/ranking"
              element={
                <RoleRoute roles={["admin"]}>
                  <AdminRanking />
                </RoleRoute>
              }
            />
            <Route
              path="/admin/pemesanan"
              element={
                <RoleRoute roles={["admin"]}>
                  <AdminPemesanan />
                </RoleRoute>
              }
            />

            {/* ===== PELATIH ===== */}
            <Route
              path="/pelatih/dashboard"
              element={
                <RoleRoute roles={["pelatih"]}>
                  <PelatihDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/pelatih/profil"
              element={
                <RoleRoute roles={["pelatih"]}>
                  <PelatihProfil />
                </RoleRoute>
              }
            />
            <Route
              path="/pelatih/jadwal"
              element={
                <RoleRoute roles={["pelatih"]}>
                  <PelatihJadwal />
                </RoleRoute>
              }
            />
            <Route
              path="/pelatih/status"
              element={
                <RoleRoute roles={["pelatih"]}>
                  <PelatihStatus />
                </RoleRoute>
              }
            />

            {/* ===== USER ===== */}
            <Route
              path="/user"
              element={
                <RoleRoute roles={["user"]}>
                  <UserLayout />
                </RoleRoute>
              }
            >
              <Route
                index
                element={<Navigate to="/user/dashboard" replace />}
              />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="cari-pelatih" element={<UserCariPelatih />} />
              <Route path="detail/:id" element={<UserDetailPelatih />} />
              <Route path="booking/:id" element={<UserBooking />} />
              <Route path="riwayat" element={<UserRiwayat />} />
              <Route path="favorit" element={<UserFavorit />} />
              {/* ✅ Route baru */}
              <Route path="profil" element={<UserProfil />} />
              <Route path="ganti-password" element={<UserGantiPassword />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
