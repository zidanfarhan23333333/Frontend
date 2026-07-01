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
  HiHeart,
  HiCog6Tooth,
  HiQuestionMarkCircle,
} from "react-icons/hi2";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../ui/Avatar";
import clsx from "clsx";
import LOGOSF from "../assets/logosf.png";

const adminLinks = [
  {
    to: "/admin/dashboard",
    icon: HiSquares2X2,
    label: "Dashboard",
    group: "MAIN",
  },
  {
    to: "/admin/pelatih",
    icon: HiUsers,
    label: "Manajemen Pelatih",
    group: "MAIN",
  },
  {
    to: "/admin/verifikasi",
    icon: HiCheckBadge,
    label: "Verifikasi",
    group: "MAIN",
  },
  {
    to: "/admin/cabor",
    icon: HiTrophy,
    label: "Cabang Olahraga",
    group: "MAIN",
  },
  {
    to: "/admin/ranking",
    icon: HiPresentationChartBar,
    label: "Ranking AHP",
    group: "MAIN",
  },
  {
    to: "/admin/pemesanan",
    icon: HiClipboardDocumentList,
    label: "Pemesanan",
    group: "MAIN",
  },
];

const pelatihLinks = [
  {
    to: "/pelatih/dashboard",
    icon: HiSquares2X2,
    label: "Dashboard",
    group: "MAIN",
  },
  { to: "/pelatih/profil", icon: HiUser, label: "Profil Saya", group: "MAIN" },
  {
    to: "/pelatih/jadwal",
    icon: HiCalendarDays,
    label: "Jadwal Latihan",
    group: "MAIN",
  },
  {
    to: "/pelatih/status",
    icon: HiStar,
    label: "Status & Ranking",
    group: "MAIN",
  },
];

const userLinks = [
  {
    to: "/user/dashboard",
    icon: HiSquares2X2,
    label: "Beranda",
    group: "MAIN",
  },
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

function LogoFull() {
  return (
    <div className="flex items-center gap-2.5">
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
            lineHeight: 1.1,
          }}
          className="text-slate-900 dark:text-white"
        >
          Sport<span style={{ color: "#F59E0B" }}>Coach</span>
        </span>
        <span
          style={{
            fontSize: "8px",
            letterSpacing: "1.5px",
            fontWeight: 500,
            lineHeight: 1,
            marginTop: "2px",
            textTransform: "uppercase",
          }}
          className="text-slate-400 dark:text-slate-500"
        >
          Rekomendasi Pelatih
        </span>
      </div>
    </div>
  );
}

function LogoCollapsed() {
  return (
    <img src={LOGOSF} alt="SportCoach" className="h-8 w-8 object-contain" />
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

  const SidebarContent = ({ mobile = false }) => {
    const mainLinks = links.filter((l) => l.group === "MAIN");

    return (
      <div className="flex flex-col h-full bg-white dark:bg-slate-800 transition-colors">
        {/* Logo */}
        <div
          className={clsx(
            "flex items-center px-5 py-5 border-b border-slate-100 dark:border-slate-700",
            collapsed && !mobile ? "justify-center px-3" : "justify-start",
          )}
        >
          {collapsed && !mobile ? <LogoCollapsed /> : <LogoFull />}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-hide">
          {(!collapsed || mobile) && (
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-2">
              Main
            </p>
          )}
          <div className="space-y-0.5">
            {mainLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={mobile ? onMobileClose : undefined}
                  title={collapsed && !mobile ? link.label : undefined}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    active
                      ? "bg-blue-600 text-white"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100",
                    collapsed && !mobile && "justify-center px-0 py-3",
                  )}
                >
                  <link.icon className="w-5 h-5 flex-shrink-0" />
                  {(!collapsed || mobile) && <span>{link.label}</span>}
                </Link>
              );
            })}
          </div>

          {/* Settings group */}
          {(!collapsed || mobile) && (
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-2 mt-6">
              Settings
            </p>
          )}
          <div className="space-y-0.5 mt-1">
            <button
              className={clsx(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100 transition-all",
                collapsed && !mobile && "justify-center px-0 py-3",
              )}
            >
              <HiCog6Tooth className="w-5 h-5 flex-shrink-0" />
              {(!collapsed || mobile) && (
                <span className="flex-1 text-left">Settings</span>
              )}
              {(!collapsed || mobile) && (
                <HiChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
              )}
            </button>
          </div>
        </nav>

        {/* Bottom: Help + Logout */}
        <div className="px-3 pb-4 border-t border-slate-100 dark:border-slate-700 pt-3 space-y-0.5">
          <button
            className={clsx(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100 transition-all",
              collapsed && !mobile && "justify-center px-0",
            )}
          >
            <HiQuestionMarkCircle className="w-5 h-5 flex-shrink-0" />
            {(!collapsed || mobile) && <span>Help</span>}
          </button>
          <button
            onClick={handleLogout}
            className={clsx(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-300 transition-all",
              collapsed && !mobile && "justify-center px-0",
            )}
          >
            <HiArrowLeftOnRectangle className="w-5 h-5 flex-shrink-0" />
            {(!collapsed || mobile) && <span>Logout</span>}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 220 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden lg:flex flex-col relative h-screen bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 flex-shrink-0 transition-colors"
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm flex items-center justify-center text-slate-400 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white transition-colors z-10"
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
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-800 z-50 lg:hidden border-r border-slate-100 dark:border-slate-700"
            >
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
