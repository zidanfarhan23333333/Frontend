import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiTrophy,
  HiEye,
  HiEyeSlash,
  HiArrowLeft,
  HiExclamationCircle,
} from "react-icons/hi2";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    konfirmasi: "",
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, login } = useAuth();
  const navigate = useNavigate();

  // Mapping role ke redirect path
  const REDIRECT_MAP = {
    admin: "/admin/dashboard",
    pelatih: "/pelatih/dashboard",
    user: "/user/dashboard",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validasi client-side
    if (!form.nama.trim() || !form.email || !form.password) {
      setError("Semua field wajib diisi");
      toast.error("Semua field wajib diisi!");
      return;
    }
    if (form.password !== form.konfirmasi) {
      setError("Password dan konfirmasi password tidak cocok");
      toast.error("Password tidak cocok!");
      return;
    }
    if (form.password.length < 6) {
      setError("Password minimal 6 karakter");
      toast.error("Password minimal 6 karakter!");
      return;
    }

    setLoading(true);
    try {
      // ============================================
      // ✅ 1. REGISTER - Console Log
      // ============================================
      const registerPayload = {
        nama: form.nama,
        email: form.email,
        password: form.password,
        role: "user",
      };

      console.log("=================================================");
      console.log("📤 MENGIRIM REQUEST REGISTER KE BACKEND...");
      console.log("📤 Endpoint: POST /auth/register");
      console.log("📤 Payload:", JSON.stringify(registerPayload, null, 2));
      console.log("=================================================");

      // 1. Register akun baru
      const registerResult = await register(
        { nama: form.nama, email: form.email, password: form.password },
        "user",
      );

      // ✅ Console log response register
      console.log("=================================================");
      console.log("✅ REGISTER BERHASIL!");
      console.log(
        "✅ Response dari server:",
        JSON.stringify(registerResult, null, 2),
      );
      console.log("=================================================");

      // ============================================
      // ✅ 2. AUTO-LOGIN - Console Log
      // ============================================
      const loginPayload = {
        email: form.email,
        password: form.password,
      };

      console.log("=================================================");
      console.log("📤 MENGIRIM REQUEST LOGIN KE BACKEND...");
      console.log("📤 Endpoint: POST /auth/login");
      console.log("📤 Payload:", JSON.stringify(loginPayload, null, 2));
      console.log("=================================================");

      // 2. Auto-login setelah register
      const userData = await login({
        email: form.email,
        password: form.password,
      });

      // ✅ Console log response login
      console.log("=================================================");
      console.log("✅ LOGIN BERHASIL!");
      console.log(
        "✅ Response dari server:",
        JSON.stringify(userData, null, 2),
      );
      console.log("✅ User Role:", userData.role);
      console.log(
        "✅ redirect ke:",
        REDIRECT_MAP[userData.role] ?? "/user/dashboard",
      );
      console.log("=================================================");

      toast.success("Akun berhasil dibuat!");

      // 3. Redirect berdasarkan role dari response server
      const dest = REDIRECT_MAP[userData.role] ?? "/user/dashboard";
      navigate(dest, { replace: true });
    } catch (err) {
      // ============================================
      // ✅ ERROR HANDLING - Console Log
      // ============================================
      console.error("=================================================");
      console.error("❌ ERROR TERJADI!");
      console.error("❌ Error message:", err.message);
      console.error("❌ Error response:", err.response?.data);
      console.error("❌ Error status:", err.response?.status);
      console.error("=================================================");

      const msg =
        err.response?.data?.message ||
        err.message ||
        "Gagal membuat akun, coba lagi";

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center">
              <HiTrophy className="w-5 h-5 text-white dark:text-slate-900" />
            </div>
            <span className="font-display font-black text-2xl text-slate-900 dark:text-white">
              Sport<span className="text-slate-400">Coach</span>
            </span>
          </Link>
          <h2 className="font-display font-black text-3xl text-slate-900 dark:text-white">
            Buat Akun Baru
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Daftar sebagai pengguna untuk mencari pelatih
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-8 shadow-sm">
          {/* Error alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-2xl"
            >
              <HiExclamationCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                {error}
              </p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Nama Lengkap
              </label>
              <input
                value={form.nama}
                onChange={(e) => set("nama", e.target.value)}
                className="input-field"
                placeholder="Nama lengkap kamu"
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="input-field"
                placeholder="nama@email.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  className="input-field pr-10"
                  placeholder="Minimal 6 karakter"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {show ? (
                    <HiEyeSlash className="w-4 h-4" />
                  ) : (
                    <HiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Konfirmasi Password
              </label>
              <input
                type="password"
                value={form.konfirmasi}
                onChange={(e) => set("konfirmasi", e.target.value)}
                className="input-field"
                placeholder="Ulangi password"
                autoComplete="new-password"
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-3.5 rounded-xl text-base hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Mendaftar...
                </>
              ) : (
                "Buat Akun"
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-primary-600 font-bold hover:text-primary-700 transition-colors"
            >
              Masuk
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
            Ingin jadi pelatih?{" "}
            <Link
              to="/pelatih/register"
              className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
            >
              Daftar sebagai Pelatih
            </Link>
          </p>
        </div>

        <Link
          to="/"
          className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <HiArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>
      </motion.div>
    </div>
  );
}
