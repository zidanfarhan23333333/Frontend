import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ProtectedRoute, RoleRoute, GuestRoute } from './routes/guards'

// Public pages
import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'
import PelatihRegisterPage from './pages/public/PelatihRegisterPage'
import RekomendasiPage from './pages/public/RekomendasiPage'
import TentangPage from './pages/public/TentangPage'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminPelatih from './pages/admin/AdminPelatih'
import AdminVerifikasi from './pages/admin/AdminVerifikasi'
import { AdminCabor } from './pages/admin/AdminCabor'
import AdminRanking from './pages/admin/AdminRanking'
import AdminPemesanan from './pages/admin/AdminPemesanan'

// Pelatih pages
import PelatihDashboard from './pages/pelatih/PelatihDashboard'
import { PelatihProfil, PelatihJadwal, PelatihStatus } from './pages/pelatih/PelatihPages'

// User pages
import {
  UserDashboard, UserCariPelatih, UserDetailPelatih,
  UserBooking, UserRiwayat, UserFavorit,
} from './pages/user/UserPages'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'font-sans text-sm font-semibold',
              style: { borderRadius: '12px', padding: '12px 16px' },
              success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
            }}
          />
          <Routes>
            {/* ===== PUBLIC ===== */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/tentang" element={<TentangPage />} />
            <Route path="/rekomendasi" element={<RekomendasiPage />} />

            <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
            <Route path="/pelatih/register" element={<GuestRoute><PelatihRegisterPage /></GuestRoute>} />

            {/* ===== ADMIN ===== */}
            <Route path="/admin/dashboard" element={<RoleRoute roles={['admin']}><AdminDashboard /></RoleRoute>} />
            <Route path="/admin/pelatih" element={<RoleRoute roles={['admin']}><AdminPelatih /></RoleRoute>} />
            <Route path="/admin/verifikasi" element={<RoleRoute roles={['admin']}><AdminVerifikasi /></RoleRoute>} />
            <Route path="/admin/cabor" element={<RoleRoute roles={['admin']}><AdminCabor /></RoleRoute>} />
            <Route path="/admin/ranking" element={<RoleRoute roles={['admin']}><AdminRanking /></RoleRoute>} />
            <Route path="/admin/pemesanan" element={<RoleRoute roles={['admin']}><AdminPemesanan /></RoleRoute>} />

            {/* ===== PELATIH ===== */}
            <Route path="/pelatih/dashboard" element={<RoleRoute roles={['pelatih']}><PelatihDashboard /></RoleRoute>} />
            <Route path="/pelatih/profil" element={<RoleRoute roles={['pelatih']}><PelatihProfil /></RoleRoute>} />
            <Route path="/pelatih/jadwal" element={<RoleRoute roles={['pelatih']}><PelatihJadwal /></RoleRoute>} />
            <Route path="/pelatih/status" element={<RoleRoute roles={['pelatih']}><PelatihStatus /></RoleRoute>} />

            {/* ===== USER ===== */}
            <Route path="/user/dashboard" element={<RoleRoute roles={['user']}><UserDashboard /></RoleRoute>} />
            <Route path="/user/cari-pelatih" element={<RoleRoute roles={['user']}><UserCariPelatih /></RoleRoute>} />
            <Route path="/user/detail/:id" element={<ProtectedRoute><UserDetailPelatih /></ProtectedRoute>} />
            <Route path="/user/booking/:id" element={<RoleRoute roles={['user']}><UserBooking /></RoleRoute>} />
            <Route path="/user/riwayat" element={<RoleRoute roles={['user']}><UserRiwayat /></RoleRoute>} />
            <Route path="/user/favorit" element={<RoleRoute roles={['user']}><UserFavorit /></RoleRoute>} />

            {/* Fallback */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
