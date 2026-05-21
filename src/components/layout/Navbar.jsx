import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiBars3, HiXMark, HiTrophy, HiUserCircle } from "react-icons/hi2";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ui/ThemeToggle";
import clsx from "clsx";
import LOGOSF from "../assets/logosf.png";

const navLinks = [
  { to: "/", label: "Beranda" },
  { to: "/rekomendasi", label: "Cari Pelatih" },
  { to: "/tentang", label: "Tentang" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const getDashboardLink = () => {
    if (user?.role === "admin") return "/admin/dashboard";
    if (user?.role === "pelatih") return "/pelatih/dashboard";
    return "/user/dashboard";
  };

  return (
    <nav
      style={{ fontFamily: "var(--font-sf)" }}
      className={clsx(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-200 bg-white",
        scrolled
          ? "border-b border-gray-100 shadow-sm"
          : "border-b border-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-[60px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <img
              src={LOGOSF}
              alt="SportCoach Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav — center */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={clsx(
                  "text-[14px] font-medium tracking-[-0.1px] transition-colors duration-150",
                  location.pathname === link.to
                    ? "text-[#0a0a0a]"
                    : "text-gray-400 hover:text-[#0a0a0a]",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to={getDashboardLink()}
                  className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-[#0a0a0a] transition-colors px-3 py-1.5"
                >
                  <HiUserCircle className="w-4 h-4" />
                  {user.nama?.split(" ")[0]}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="bg-[#0a0a0a] text-white text-[13px] font-semibold px-4 py-2 rounded-full hover:bg-gray-800 transition-colors tracking-[-0.1px]"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-[13px] font-medium text-gray-500 hover:text-[#0a0a0a] transition-colors px-3 py-1.5"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="bg-[#0a0a0a] text-white text-[13px] font-semibold px-5 py-2 rounded-full hover:bg-gray-800 transition-colors tracking-[-0.1px]"
                >
                  Daftar →
                </Link>
              </div>
            )}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100"
            >
              {open ? (
                <HiXMark className="w-5 h-5" />
              ) : (
                <HiBars3 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100"
          >
            <div className="px-5 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={clsx(
                    "block px-4 py-2.5 rounded-xl text-[14px] font-medium transition-colors",
                    location.pathname === link.to
                      ? "bg-gray-100 text-[#0a0a0a]"
                      : "text-gray-500 hover:bg-gray-50 hover:text-[#0a0a0a]",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setOpen(false)}
                      className="text-center py-2.5 text-[14px] font-medium text-gray-600"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        navigate("/");
                        setOpen(false);
                      }}
                      className="bg-[#0a0a0a] text-white font-semibold py-2.5 rounded-xl text-[14px]"
                    >
                      Keluar
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="text-center py-2.5 text-[14px] font-medium text-gray-600"
                    >
                      Masuk
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="bg-[#0a0a0a] text-white font-semibold py-2.5 rounded-xl text-[14px] text-center"
                    >
                      Daftar
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
