import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiHome,
  HiMagnifyingGlass,
  HiCalendarDays,
  HiHeart,
  HiArrowLeftOnRectangle,
  HiBars3,
  HiTrophy,
  HiBell,
} from "react-icons/hi2";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ui/ThemeToggle";
import Avatar from "../ui/Avatar";
import clsx from "clsx";

const navItems = [
  { to: "/user/dashboard", icon: HiHome, label: "Beranda" },
  { to: "/user/cari-pelatih", icon: HiMagnifyingGlass, label: "Cari Pelatih" },
  { to: "/user/riwayat", icon: HiCalendarDays, label: "Jadwal & Riwayat" },
  { to: "/user/favorit", icon: HiHeart, label: "Favorit" },
];

function UserSidebar({ mobileOpen, onMobileClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const Content = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-[60px] border-b border-[#f0f0f0] flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-[#0a0a0a] flex items-center justify-center">
          <HiTrophy className="w-3.5 h-3.5 text-white" />
        </div>
        <span
          className="text-[16px] font-bold text-[#0a0a0a] tracking-[-0.3px]"
          style={{ fontFamily: "var(--font-sf)" }}
        >
          Sport<span className="text-blue-600">Coach</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={mobile ? onMobileClose : undefined}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150",
                active
                  ? "bg-[#0a0a0a] text-white"
                  : "text-[#6e6e73] hover:bg-[#f5f5f7] hover:text-[#0a0a0a]",
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user */}
      <div className="px-3 py-4 border-t border-[#f0f0f0] space-y-0.5">
        <ThemeToggle
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px]
                     font-medium text-[#6e6e73] hover:bg-[#f5f5f7] hover:text-[#0a0a0a]
                     transition-colors justify-start"
        />
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px]
                     font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <HiArrowLeftOnRectangle className="w-4 h-4" />
          Keluar
        </button>
        {/* User chip */}
        <div className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl bg-[#f5f5f7]">
          <Avatar
            initials={user?.initials || "?"}
            size="sm"
            id={user?.id || 0}
          />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-[#0a0a0a] truncate">
              {user?.nama?.split(" ")[0] || "User"}
            </p>
            <p className="text-[11px] text-[#aeaeb2]">Atlet</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 flex-col h-screen bg-white border-r border-[#f0f0f0] flex-shrink-0">
        <Content />
      </aside>

      {/* Mobile drawer */}
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
              className="fixed left-0 top-0 bottom-0 w-56 bg-white z-50 lg:hidden shadow-xl"
            >
              <Content mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default function UserLayout({ children, title, subtitle, rightSlot }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div
      className="flex h-screen bg-[#f5f5f7] overflow-hidden"
      style={{ fontFamily: "var(--font-sf)" }}
    >
      <UserSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-[60px] flex items-center justify-between px-6 bg-white border-b border-[#f0f0f0] flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-[#6e6e73] hover:bg-[#f5f5f7]"
            >
              <HiBars3 className="w-5 h-5" />
            </button>
            {title && (
              <div>
                <h1 className="text-[16px] font-semibold text-[#0a0a0a] leading-none tracking-[-0.3px]">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-[12px] text-[#aeaeb2] mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {rightSlot}
            <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-[#6e6e73] hover:bg-[#f5f5f7]">
              <HiBell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <Avatar
              initials={user?.initials || "?"}
              size="sm"
              id={user?.id || 0}
            />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
