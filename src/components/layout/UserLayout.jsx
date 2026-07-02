import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiHome,
  HiMagnifyingGlass,
  HiCalendarDays,
  HiHeart,
  HiArrowLeftOnRectangle,
  HiBars3,
  HiBell,
  HiChevronDown,
  HiCog6Tooth,
  HiQuestionMarkCircle,
  HiUser,
  HiKey,
  HiCheckCircle,
  HiClock,
  HiXCircle,
} from "react-icons/hi2";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../ui/Avatar";
import LOGOSF from "../assets/logosf.png";
import clsx from "clsx";
import toast from "react-hot-toast";

const navItems = [
  { to: "/user/dashboard", icon: HiHome, label: "Beranda", group: "MAIN" },
  {
    to: "/user/cari-pelatih",
    icon: HiMagnifyingGlass,
    label: "Cari Pelatih",
    group: "MAIN",
  },
  {
    to: "/user/riwayat",
    icon: HiCalendarDays,
    label: "Jadwal Riwayat",
    group: "MAIN",
  },
  { to: "/user/favorit", icon: HiHeart, label: "Favorit", group: "MAIN" },
];

// SESUDAH (benar):
function fotoUrl(foto) {
  if (!foto) return null;
  if (foto.startsWith("http")) return foto; // Cloudinary URL → pakai langsung
  return `http://localhost:3000${foto}`; // path lokal → tambah base URL
}

// ─── Notification Panel ──────────────────────────────────────────────────────
function NotifPanel({ open, onClose, api }) {
  const [notif, setNotif] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    api
      .get("/api/notifikasi?limit=10")
      .then((res) => setNotif(res.data.data || []))
      .catch(() => setNotif([]))
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  const statusIcon = {
    konfirmasi: { icon: HiCheckCircle, cls: "text-emerald-500" },
    pending: { icon: HiClock, cls: "text-amber-500" },
    dibatalkan: { icon: HiXCircle, cls: "text-red-500" },
    selesai: { icon: HiCheckCircle, cls: "text-slate-400" },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-12 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl z-50 overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Notifikasi</h3>
            {notif.length > 0 && (
              <span className="text-[11px] bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full">
                {notif.length} terbaru
              </span>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
              </div>
            ) : notif.length === 0 ? (
              <div className="py-10 text-center">
                <HiBell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Belum ada notifikasi</p>
              </div>
            ) : (
              notif.map((n) => {
                const s = statusIcon[n.status] || statusIcon.pending;
                return (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
                  >
                    <s.icon
                      className={clsx("w-5 h-5 flex-shrink-0 mt-0.5", s.cls)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-slate-700 leading-snug">
                        {n.title}
                      </p>
                      {n.cabor && (
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {n.cabor}
                        </p>
                      )}
                      <p className="text-[10px] text-slate-300 mt-1">
                        {n.waktu
                          ? new Date(n.waktu).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Profile Dropdown ─────────────────────────────────────────────────────────
function ProfileDropdown({
  open,
  onClose,
  user,
  onLogout,
  fotoLocal,
  onFotoChange,
  uploadingFoto,
}) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-12 w-64 bg-white rounded-2xl border border-slate-100 shadow-xl z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-blue-100 flex-shrink-0">
                {fotoLocal || fotoUrl(user?.foto) ? (
                  <img
                    src={fotoLocal || fotoUrl(user?.foto)}
                    alt={user?.nama}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-bold text-blue-600">
                    {user?.nama?.slice(0, 2).toUpperCase() || "?"}
                  </div>
                )}
              </div>
              <label
                className={clsx(
                  "absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors",
                  uploadingFoto && "opacity-50 cursor-not-allowed",
                )}
              >
                {uploadingFoto ? (
                  <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <HiUser className="w-2.5 h-2.5 text-white" />
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={onFotoChange}
                  disabled={uploadingFoto}
                />
              </label>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.nama}
              </p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Menu */}
          <div className="py-1.5">
            <Link
              to="/user/profil"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <HiUser className="w-4 h-4" /> Edit Profil
            </Link>
            <Link
              to="/user/ganti-password"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <HiKey className="w-4 h-4" /> Ganti Password
            </Link>
          </div>

          <div className="border-t border-slate-100 py-1.5">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <HiArrowLeftOnRectangle className="w-4 h-4" /> Keluar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function UserSidebar({ mobileOpen, onMobileClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const Content = ({ mobile = false }) => (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100 flex-shrink-0">
        <img
          src={LOGOSF}
          alt="SportCoach"
          className="h-8 w-8 object-contain flex-shrink-0"
        />
        <div className="flex flex-col leading-tight">
          <span
            style={{
              fontWeight: 700,
              fontSize: "15px",
              letterSpacing: "-0.3px",
              color: "#0f172a",
              lineHeight: 1.1,
            }}
          >
            Sport<span style={{ color: "#2563EB" }}>Coach</span>
          </span>
          <span
            style={{
              fontSize: "8px",
              letterSpacing: "1.5px",
              color: "#94a3b8",
              fontWeight: 500,
              lineHeight: 1,
              marginTop: "2px",
              textTransform: "uppercase",
            }}
          >
            Rekomendasi Pelatih
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2">
          Main
        </p>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={mobile ? onMobileClose : undefined}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800",
                )}
              >
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2 mt-6">
          Settings
        </p>
        <div className="space-y-0.5">
          <Link
            to="/user/profil"
            onClick={mobile ? onMobileClose : undefined}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all"
          >
            <HiCog6Tooth className="w-4.5 h-4.5 flex-shrink-0" />
            <span className="flex-1 text-left">Settings</span>
            <HiChevronDown className="w-3.5 h-3.5 text-slate-300 -rotate-90" />
          </Link>
        </div>
      </nav>

      <div className="px-3 pb-4 border-t border-slate-100 pt-3 space-y-0.5">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all">
          <HiQuestionMarkCircle className="w-4.5 h-4.5 flex-shrink-0" /> Help
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <HiArrowLeftOnRectangle className="w-4.5 h-4.5 flex-shrink-0" />{" "}
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex w-[220px] flex-col h-screen bg-white border-r border-slate-100 flex-shrink-0">
        <Content />
      </aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed left-0 top-0 bottom-0 w-[220px] bg-white z-50 lg:hidden border-r border-slate-100 shadow-xl"
            >
              <Content mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────
export default function UserLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [fotoLocal, setFotoLocal] = useState(null);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  // ✅ pakai updateUser (bukan setUser mentah) supaya selalu sync ke localStorage
  const { user, api, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/notifikasi/unread-count")
      .then((res) => setUnreadCount(res.data.data?.count || 0))
      .catch(() => setUnreadCount(0)); // sudah ada, pastikan tidak throw
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 2MB");
      return;
    }

    setUploadingFoto(true);
    try {
      const formData = new FormData();
      formData.append("foto", file);
      const res = await api.post("/api/user/my-foto", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Preview instan dari file lokal
      setFotoLocal(URL.createObjectURL(file));

      // ✅ updateUser otomatis sync ke localStorage, jadi survive refresh
      updateUser((p) => ({ ...p, foto: res.data.data.foto }));

      toast.success("Foto profil berhasil diupload!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal upload foto");
    } finally {
      setUploadingFoto(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <UserSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center gap-4 px-6 flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <HiBars3 className="w-5 h-5" />
          </button>

          <div className="relative flex-1 max-w-xs">
            <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-full text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition"
            />
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            {/* Notif bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen((p) => !p);
                  setProfileOpen(false);
                }}
                className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
              >
                <HiBell className="w-5 h-5 text-slate-500" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 border-2 border-white" />
                )}
              </button>
              <NotifPanel
                open={notifOpen}
                onClose={() => setNotifOpen(false)}
                api={api}
              />
            </div>

            {/* Notif pill (optional, bisa dihapus kalau redundan) */}
            <button
              onClick={() => {
                setNotifOpen((p) => !p);
                setProfileOpen(false);
              }}
              className="hidden sm:flex items-center gap-1.5 bg-blue-600 text-white text-xs font-semibold px-3.5 py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              <HiBell className="w-3.5 h-3.5" />
              {unreadCount} Notification
            </button>

            <div className="w-px h-6 bg-slate-200" />

            {/* Profile dropdown trigger */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen((p) => !p);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-100 flex-shrink-0 border border-slate-200">
                  {fotoLocal || fotoUrl(user?.foto) ? (
                    <img
                      src={fotoLocal || fotoUrl(user?.foto)}
                      alt={user?.nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Avatar
                      initials={
                        user?.initials ||
                        user?.nama?.slice(0, 2).toUpperCase() ||
                        "?"
                      }
                      size="sm"
                      id={user?.id || 0}
                    />
                  )}
                </div>
                <span className="text-sm font-semibold text-slate-800 hidden md:block">
                  {user?.nama || "User"}
                </span>
                <HiChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
              </button>
              <ProfileDropdown
                open={profileOpen}
                onClose={() => setProfileOpen(false)}
                user={user}
                onLogout={handleLogout}
                fotoLocal={fotoLocal}
                onFotoChange={handleFotoChange}
                uploadingFoto={uploadingFoto}
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
