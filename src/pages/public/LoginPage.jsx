import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiEye,
  HiEyeOff,
  HiExclamationCircle,
  HiChevronDown,
} from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import assetbola from "../../components/assets/assetbola.png";
import assetbasket from "../../components/assets/assetbasket.png";
import assettkd from "../../components/assets/assettkd.png";
import assetvoli from "../../components/assets/assetvoli.png";

const HERO_IMAGES = [assetbola, assetbasket, assettkd, assetvoli];

const ROLES = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
  { value: "pelatih", label: "Pelatih" },
];

const REDIRECT_MAP = {
  admin: "/admin/dashboard",
  pelatih: "/pelatih/dashboard",
  user: "/user/dashboard",
};

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("user");
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi");
      toast.error("Email dan password wajib diisi!");
      return;
    }
    try {
      const userData = await login({
        email: form.email,
        password: form.password,
      });
      toast.success(`Selamat datang, ${userData.nama}!`);
      navigate(REDIRECT_MAP[userData.role] ?? "/", { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Email atau password salah";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* LEFT — hero image panel */}
        <div className="hero-panel">
          {HERO_IMAGES.map((img, i) => (
            <img
              key={img}
              src={img}
              alt="Athletes"
              className={`hero-img ${i === heroIndex ? "hero-img--active" : ""}`}
            />
          ))}
          <div className="hero-overlay" />

          <div className="hero-logo">
            <span className="logo-mark">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 20L12 4L14 8L9 20H4Z" fill="#2563EB" />
                <path d="M11 20L17 8L19 12L16 20H11Z" fill="#60A5FA" />
              </svg>
            </span>
            <span className="logo-text">Sport Coach</span>
          </div>

          <div className="hero-bottom">
            <h1 className="hero-headline">
              Mulai Perjalananmu
              <br />
              Mencari Pelatih Terbaik
            </h1>
            <p className="hero-desc">
              Sport Coach Recommendation adalah sebuah platform untuk siswa
              ataupun masyarakat umum yang membutuhkan pelatih olahraga yang
              terjangkau.
            </p>

            <div className="hero-dots">
              {HERO_IMAGES.map((_, i) => (
                <button
                  key={i}
                  className={`hero-dot ${i === heroIndex ? "hero-dot--active" : ""}`}
                  onClick={() => setHeroIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — form panel */}
        <div className="form-panel">
          <div className="form-inner">
            <h2 className="form-title">Masuk ke Akun</h2>
            <p className="form-sub">
              Belum punya akun?{" "}
              <Link to="/register" className="form-link">
                Daftar sekarang
              </Link>
            </p>

            {error && (
              <div className="error-box">
                <HiExclamationCircle className="error-icon" />
                <p className="error-msg">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="field-group">
                <label className="field-label">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, email: e.target.value }));
                    setError("");
                  }}
                  placeholder="nameemail@gmail.com"
                  className={`plain-input ${error ? "plain-input--error" : ""}`}
                />
              </div>

              <div className="field-group">
                <label className="field-label">Password</label>
                <div className="input-wrap">
                  <input
                    type={show ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, password: e.target.value }));
                      setError("");
                    }}
                    placeholder="Minimum 6 characters"
                    className={`plain-input ${error ? "plain-input--error" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="eye-btn"
                  >
                    {show ? <HiEyeOff /> : <HiEye />}
                  </button>
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Role</label>
                <div className="select-wrap">
                  <select
                    value={selectedRole}
                    onChange={(e) => {
                      setSelectedRole(e.target.value);
                      setError("");
                    }}
                    className="plain-input select-input"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <HiChevronDown className="select-chevron" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? <span className="spinner" /> : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-page {
          min-height: 100vh;
          width: 100vw;
          background: #f3f4f6;
          display: flex; align-items: stretch; justify-content: center;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .auth-card {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          background: #fff;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          min-height: 100vh;
        }

        /* ── Hero panel ── */
        .hero-panel {
          position: relative;
          background: #dfe6f5;
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 40px 44px;
          overflow: hidden;
        }
        .hero-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: 50% 20%;
          z-index: 0;
          opacity: 0;
          transition: opacity 1s ease-in-out;
        }
        .hero-img--active { opacity: 1; }
        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0) 35%, rgba(37,99,235,0.5) 72%, rgba(29,78,216,0.92) 100%);
          z-index: 1;
        }

        .hero-logo {
          position: relative; z-index: 2;
          display: flex; align-items: center; gap: 8px;
        }
        .logo-mark { display: flex; }
        .logo-text { font-weight: 700; font-size: 17px; color: #111; }

        .hero-bottom { position: relative; z-index: 2; }
        .hero-headline {
          font-family: 'Instrument Serif', serif;
          font-weight: 400;
          font-size: 34px;
          line-height: 1.15;
          color: #fff;
          margin-bottom: 12px;
        }
        .hero-desc {
          font-size: 13px;
          line-height: 1.6;
          color: rgba(255,255,255,0.88);
          max-width: 360px;
          margin-bottom: 18px;
        }
        .hero-dots { display: flex; gap: 8px; }
        .hero-dot {
          width: 8px; height: 8px; border-radius: 50%;
          border: none; background: rgba(255,255,255,0.4);
          cursor: pointer; padding: 0; transition: all 0.2s;
        }
        .hero-dot--active { background: #fff; width: 20px; border-radius: 4px; }

        /* ── Form panel ── */
        .form-panel {
          padding: 56px 64px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .form-inner { width: 100%; max-width: 440px; }

        .form-title { font-size: 28px; font-weight: 700; color: #111; margin-bottom: 6px; }
        .form-sub { font-size: 13px; color: #6b7280; margin-bottom: 28px; }
        .form-link { color: #2563EB; font-weight: 600; text-decoration: none; }
        .form-link:hover { text-decoration: underline; }

        .error-box {
          display: flex; align-items: flex-start; gap: 8px;
          background: #fef2f2; border: 1px solid #fecaca;
          border-radius: 8px; padding: 10px 12px; margin-bottom: 16px;
        }
        .error-icon { color: #ef4444; width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; }
        .error-msg { color: #b91c1c; font-size: 12.5px; font-weight: 500; }

        .auth-form { display: flex; flex-direction: column; gap: 18px; width: 100%; }
        .field-group { display: flex; flex-direction: column; gap: 6px; }
        .field-label { font-size: 12.5px; font-weight: 600; color: #374151; }

        .plain-input {
          width: 100%;
          background: #fff;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 11px 14px;
          font-size: 13.5px;
          color: #111;
          outline: none;
          transition: border-color 0.15s;
        }
        .plain-input::placeholder { color: #9ca3af; }
        .plain-input:focus { border-color: #2563EB; }
        .plain-input--error { border-color: #ef4444 !important; }

        .input-wrap { position: relative; }
        .eye-btn {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #9ca3af; font-size: 16px;
          display: flex; align-items: center;
        }
        .eye-btn:hover { color: #4b5563; }

        .select-wrap { position: relative; }
        .select-input { appearance: none; -webkit-appearance: none; padding-right: 36px; cursor: pointer; }
        .select-chevron {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          color: #9ca3af; pointer-events: none; font-size: 16px;
        }

        .submit-btn {
          width: 100%; margin-top: 4px;
          background: #2563EB;
          border: none; border-radius: 8px;
          color: #fff; font-weight: 600; font-size: 14.5px;
          padding: 12px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .submit-btn:hover:not(:disabled) { background: #1d4ed8; }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          display: inline-block;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .auth-card { grid-template-columns: 1fr; }
          .hero-panel { display: none; }
          .form-panel { padding: 32px 24px; }
        }
      `}</style>
    </div>
  );
}
