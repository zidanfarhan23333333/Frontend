# SportCoach — Sistem Rekomendasi Pelatih Olahraga

Frontend production-ready untuk **Sistem Rekomendasi Pelatih Olahraga berbasis AHP**.

## 🚀 Cara Menjalankan

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Jalankan development server
```bash
npm run dev
```
Akses di: **http://localhost:5173**

---

## 🔑 Demo Login

| Role    | Email                | Password |
|---------|----------------------|----------|
| Admin   | admin@gmail.com      | 123456   |
| Pelatih | pelatih@gmail.com    | 123456   |
| User    | user@gmail.com       | 123456   |

---

## 📁 Struktur Folder

```
src/
├── components/
│   ├── charts/       # Recharts: BookingLine, CaborPie, AHPBobot, RankingBar
│   ├── coach/        # CoachCard, RankingCard
│   ├── layout/       # Navbar, Sidebar, DashboardLayout
│   └── ui/           # Avatar, Badges, LoadingSpinner, Modal, Pagination, Skeleton, StatsCard, ThemeToggle
├── context/
│   ├── AuthContext.jsx   # Auth state + dummy login
│   └── ThemeContext.jsx  # Dark/Light mode
├── data/
│   └── dummy.js          # Semua dummy data
├── lib/
│   └── api.js            # Axios instance + interceptors
├── pages/
│   ├── admin/            # Dashboard, Pelatih, Verifikasi, Cabor, Ranking, Pemesanan
│   ├── pelatih/          # Dashboard, Profil, Jadwal, Status
│   ├── public/           # Landing, Login, Register, PelatihRegister, Rekomendasi, Tentang
│   └── user/             # Dashboard, CariPelatih, Detail, Booking, Riwayat
└── routes/
    └── guards.jsx        # ProtectedRoute, RoleRoute, GuestRoute
```

---

## 🎨 Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS** (custom design system)
- **React Router DOM v6** (protected routes)
- **Framer Motion** (animasi)
- **Recharts** (charts)
- **React Hot Toast** (notifikasi)
- **Zustand** (siap digunakan)
- **Axios** (siap untuk integrasi backend)

---

## 🔗 Integrasi Backend

Edit `src/lib/api.js` dan set environment variable:

```env
VITE_API_URL=http://localhost:5000/api
```

Ganti dummy data di `src/data/dummy.js` dengan API calls via `src/lib/api.js`.

---

## 🌐 Routing Lengkap

| Path                  | Role       |
|-----------------------|------------|
| `/`                   | Public     |
| `/login`              | Guest only |
| `/register`           | Guest only |
| `/pelatih/register`   | Guest only |
| `/rekomendasi`        | Public     |
| `/tentang`            | Public     |
| `/admin/dashboard`    | Admin      |
| `/admin/pelatih`      | Admin      |
| `/admin/verifikasi`   | Admin      |
| `/admin/cabor`        | Admin      |
| `/admin/ranking`      | Admin      |
| `/admin/pemesanan`    | Admin      |
| `/pelatih/dashboard`  | Pelatih    |
| `/pelatih/profil`     | Pelatih    |
| `/pelatih/jadwal`     | Pelatih    |
| `/pelatih/status`     | Pelatih    |
| `/user/dashboard`     | User       |
| `/user/cari-pelatih`  | User       |
| `/user/detail/:id`    | User/Auth  |
| `/user/booking/:id`   | User       |
| `/user/riwayat`       | User       |
