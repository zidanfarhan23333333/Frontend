import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiTrophy,
  HiSquares2X2,
  HiUsers,
  HiCalendarDays,
  HiMagnifyingGlass,
  HiClipboardDocumentList,
  HiCheckBadge,
  HiPresentationChartBar,
  HiArrowLeftOnRectangle,
  HiChevronLeft,
  HiChevronRight,
  HiUser,
  HiStar,
} from "react-icons/hi2";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ui/ThemeToggle";
import Avatar from "../ui/Avatar";
import clsx from "clsx";
import LOGOSF from "../assets/logosf.png";

const adminLinks = [
  { to: "/admin/dashboard", icon: HiSquares2X2, label: "Dashboard" },
  { to: "/admin/pelatih", icon: HiUsers, label: "Manajemen Pelatih" },
  { to: "/admin/verifikasi", icon: HiCheckBadge, label: "Verifikasi" },
  { to: "/admin/cabor", icon: HiTrophy, label: "Cabang Olahraga" },
  { to: "/admin/ranking", icon: HiPresentationChartBar, label: "Ranking AHP" },
  { to: "/admin/pemesanan", icon: HiClipboardDocumentList, label: "Pemesanan" },
];
const pelatihLinks = [
  { to: "/pelatih/dashboard", icon: HiSquares2X2, label: "Dashboard" },
  { to: "/pelatih/profil", icon: HiUser, label: "Profil Saya" },
  { to: "/pelatih/jadwal", icon: HiCalendarDays, label: "Jadwal Latihan" },
  { to: "/pelatih/status", icon: HiStar, label: "Status & Ranking" },
];
const userLinks = [
  { to: "/user/dashboard", icon: HiSquares2X2, label: "Dashboard" },
  { to: "/user/cari-pelatih", icon: HiMagnifyingGlass, label: "Cari Pelatih" },
  {
    to: "/user/riwayat",
    icon: HiClipboardDocumentList,
    label: "Riwayat Booking",
  },
];

// Logo SVG — icon PNG + wordmark teks
function LogoFull() {
  return (
    <div className="flex items-center gap-3">
      <img
        src={LOGOSF}
        alt="SportCoach"
        className="h-10 w-10 object-contain flex-shrink-0"
      />
      <div className="flex flex-col leading-tight">
        <span
          style={{
            fontWeight: 700,
            fontSize: "17px",
            letterSpacing: "-0.3px",
            color: "white",
            lineHeight: 1.1,
          }}
        >
          Sport<span style={{ color: "#F59E0B" }}>Coach</span>
        </span>
        <span
          style={{
            fontSize: "9px",
            letterSpacing: "1.8px",
            color: "rgba(255,255,255,0.45)",
            fontWeight: 500,
            lineHeight: 1,
            marginTop: "3px",
            textTransform: "uppercase",
          }}
        >
          Sistem Rekomendasi Pelatih
        </span>
      </div>
    </div>
  );
}

function LogoCollapsed() {
  return (
    <img src={LOGOSF} alt="SportCoach" className="h-9 w-9 object-contain" />
  );
}

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "pelatih"
        ? pelatihLinks
        : userLinks;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={clsx(
          "flex items-center px-4 py-5 border-b border-white/10",
          collapsed && !mobile ? "justify-center px-2" : "justify-start",
        )}
      >
        {collapsed && !mobile ? <LogoCollapsed /> : <LogoFull />}
      </div>

      {/* Role badge */}
      {(!collapsed || mobile) && (
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
            <Avatar
              initials={user?.initials || "?"}
              size="sm"
              id={user?.id || 0}
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.nama?.split(" ")[0] || "User"}
              </p>
              <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-hide">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={mobile ? onMobileClose : undefined}
              title={collapsed && !mobile ? link.label : undefined}
              className={clsx(
                "sidebar-link",
                active && "active",
                collapsed && !mobile && "justify-center px-0 py-3",
              )}
            >
              <link.icon className="w-5 h-5 flex-shrink-0" />
              {(!collapsed || mobile) && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <ThemeToggle className="w-full rounded-xl justify-center text-slate-400 hover:text-white hover:bg-white/10" />
        <button
          onClick={handleLogout}
          className={clsx(
            "sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10",
            collapsed && !mobile && "justify-center px-0",
          )}
        >
          <HiArrowLeftOnRectangle className="w-5 h-5 flex-shrink-0" />
          {(!collapsed || mobile) && <span>Keluar</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex flex-col relative h-screen bg-slate-900 dark:bg-slate-950 border-r border-white/5 flex-shrink-0"
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors z-10"
        >
          {collapsed ? (
            <HiChevronRight className="w-3 h-3" />
          ) : (
            <HiChevronLeft className="w-3 h-3" />
          )}
        </button>
      </motion.aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-slate-900 dark:bg-slate-950 z-50 lg:hidden"
            >
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
