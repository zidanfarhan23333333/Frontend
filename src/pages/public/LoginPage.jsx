import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff, HiExclamationCircle } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
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
    <div className="auth-root">
      {/* Background */}
      <div className="auth-bg">
        <div className="auth-bg-overlay" />
        <div className="auth-bg-grid" />
        {/* Decorative circles */}
        <div className="deco-circle deco-circle-1" />
        <div className="deco-circle deco-circle-2" />
        <div className="deco-circle deco-circle-3" />
      </div>

      {/* Split layout */}
      <div className="auth-layout">
        {/* LEFT — Brand panel */}
        <div className="auth-left">
          {/* Logo */}
          <div className="brand-logo">
            <div className="brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
                  fill="white"
                  fillOpacity="0.9"
                />
              </svg>
            </div>
            <span className="brand-name">COACHFINDER</span>
          </div>

          {/* Hero text */}
          <div className="brand-hero">
            <div className="brand-badge">Berbasis Teknologi AHP</div>
            <h1 className="brand-headline">
              TEMUKAN
              <br />
              PELATIH
              <br />
              <span className="brand-accent">TERBAIK</span>
            </h1>
            <p className="brand-desc">
              Sistem rekomendasi cerdas berbasis Analytical Hierarchy Process
              untuk membantu atlet menemukan pelatih yang paling sesuai.
            </p>
          </div>

          {/* Stats */}
          <div className="brand-stats">
            {[
              ["50+", "Pelatih Aktif"],
              ["10+", "Cabang Olahraga"],
              ["200+", "Atlet Puas"],
            ].map(([n, l]) => (
              <div key={l} className="stat-card">
                <p className="stat-num">{n}</p>
                <p className="stat-label">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Form panel (glass card) */}
        <div className="auth-right">
          <div className="glass-card">
            {/* Card top accent */}
            <div className="card-accent" />

            <div className="card-header">
              <h2 className="card-title">Masuk ke Akun</h2>
              <p className="card-sub">
                Belum punya akun?{" "}
                <Link to="/register" className="card-link">
                  Daftar sekarang
                </Link>
              </p>
            </div>

            {/* Role selector */}
            <div className="role-section">
              <p className="field-label">Masuk sebagai</p>
              <div className="role-grid">
                {ROLES.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setSelectedRole(value);
                      setError("");
                    }}
                    className={`role-btn ${selectedRole === value ? "role-btn--active" : ""}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
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
                  placeholder="email@contoh.com"
                  className={`glass-input ${error ? "glass-input--error" : ""}`}
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
                    placeholder="••••••••"
                    className={`glass-input ${error ? "glass-input--error" : ""}`}
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

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? (
                  <span className="spinner" />
                ) : (
                  <>
                    Masuk <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          min-height: 100vh;
          position: relative;
          font-family: 'Inter', system-ui, sans-serif;
          overflow: hidden;
        }

        /* ── Background ── */
        .auth-bg {
          position: fixed; inset: 0;
          background: #0a0a1a;
          z-index: 0;
        }
        .auth-bg-overlay {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 60% at 20% 50%, rgba(74,58,255,0.18) 0%, transparent 60%),
                      radial-gradient(ellipse 60% 60% at 80% 50%, rgba(30,10,80,0.4) 0%, transparent 60%);
        }
        .auth-bg-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .deco-circle {
          position: absolute; border-radius: 50%; border: 1px solid rgba(255,255,255,0.06);
          pointer-events: none;
        }
        .deco-circle-1 { width: 500px; height: 500px; top: -100px; right: -100px; }
        .deco-circle-2 { width: 300px; height: 300px; top: 50px; right: 50px; border-color: rgba(74,58,255,0.12); }
        .deco-circle-3 { width: 200px; height: 200px; bottom: 80px; left: 80px; border-color: rgba(255,215,0,0.08); }

        /* ── Layout ── */
        .auth-layout {
          position: relative; z-index: 1;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        /* ── Left panel ── */
        .auth-left {
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 48px 56px;
        }

        .brand-logo {
          display: flex; align-items: center; gap: 12px;
        }
        .brand-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: #4A3AFF;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .brand-name {
          font-family: 'Oswald', 'Arial Narrow', sans-serif;
          font-weight: 700; font-size: 20px; letter-spacing: 0.12em;
          color: #fff;
        }

        .brand-hero { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 48px 0; }
        .brand-badge {
          display: inline-block;
          background: rgba(74,58,255,0.3);
          border: 1px solid rgba(74,58,255,0.5);
          color: #a8a0ff;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 5px 14px; border-radius: 999px;
          margin-bottom: 24px;
        }
        .brand-headline {
          font-family: 'Oswald', 'Arial Narrow', sans-serif;
          font-weight: 700; font-size: 58px; line-height: 1.05;
          color: #fff; text-transform: uppercase;
          margin-bottom: 20px;
        }
        .brand-accent { color: #FFD700; }
        .brand-desc {
          color: rgba(255,255,255,0.45);
          font-size: 15px; line-height: 1.75;
          max-width: 360px;
        }

        .brand-stats {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
        }
        .stat-card {
          border: 1px solid rgba(74,58,255,0.25);
          background: rgba(74,58,255,0.08);
          border-radius: 12px;
          padding: 16px 14px;
        }
        .stat-num {
          font-family: 'Oswald', sans-serif;
          font-weight: 700; font-size: 30px; color: #fff;
          line-height: 1;
        }
        .stat-label {
          color: rgba(255,255,255,0.4);
          font-size: 11px; margin-top: 4px;
        }

        /* ── Right panel ── */
        .auth-right {
          display: flex; align-items: center; justify-content: center;
          padding: 32px;
        }

        .glass-card {
          width: 100%; max-width: 420px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 40px 36px;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          position: relative;
          overflow: hidden;
        }

        /* Top shimmer accent */
        .card-accent {
          position: absolute; top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #4A3AFF, #7B6EFF, #4A3AFF);
        }

        .card-header { margin-bottom: 28px; }
        .card-title {
          font-family: 'Oswald', sans-serif;
          font-weight: 700; font-size: 28px;
          color: #fff; text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 8px;
        }
        .card-sub { font-size: 13px; color: rgba(255,255,255,0.4); }
        .card-link { color: #7B6EFF; font-weight: 600; text-decoration: none; }
        .card-link:hover { color: #a8a0ff; }

        /* Role selector */
        .role-section { margin-bottom: 20px; }
        .role-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
          margin-top: 8px;
        }
        .role-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: rgba(255,255,255,0.5);
          font-family: 'Oswald', sans-serif;
          font-weight: 700; font-size: 13px;
          letter-spacing: 0.06em; text-transform: uppercase;
          padding: 11px 8px; cursor: pointer;
          transition: all 0.15s;
        }
        .role-btn:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8); }
        .role-btn--active {
          background: #4A3AFF;
          border-color: #4A3AFF;
          color: #fff;
        }

        /* Error */
        .error-box {
          display: flex; align-items: flex-start; gap: 10px;
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 16px;
          animation: shake 0.4s ease;
        }
        .error-icon { color: #f87171; width: 18px; height: 18px; flex-shrink: 0; margin-top: 1px; }
        .error-msg { color: #fca5a5; font-size: 13px; font-weight: 500; }

        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-4px); }
          40%,80% { transform: translateX(4px); }
        }

        /* Form */
        .auth-form { display: flex; flex-direction: column; gap: 16px; }
        .field-group { display: flex; flex-direction: column; gap: 7px; }
        .field-label {
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .input-wrap { position: relative; }

        .glass-input {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 12px 16px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .glass-input::placeholder { color: rgba(255,255,255,0.25); }
        .glass-input:focus {
          border-color: rgba(74,58,255,0.7);
          background: rgba(74,58,255,0.08);
        }
        .glass-input--error { border-color: rgba(239,68,68,0.5) !important; }

        .eye-btn {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.3); font-size: 18px;
          display: flex; align-items: center;
          transition: color 0.15s;
        }
        .eye-btn:hover { color: rgba(255,255,255,0.6); }

        .submit-btn {
          width: 100%; margin-top: 6px;
          background: #4A3AFF;
          border: none; border-radius: 10px;
          color: #fff;
          font-family: 'Oswald', sans-serif;
          font-weight: 700; font-size: 16px;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 14px;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .submit-btn:hover:not(:disabled) { background: #5a4bff; }
        .submit-btn:active:not(:disabled) { transform: scale(0.99); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-arrow { font-size: 20px; line-height: 1; }

        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .auth-layout { grid-template-columns: 1fr; }
          .auth-left { display: none; }
          .auth-right { padding: 24px 16px; align-items: flex-start; padding-top: 60px; }
          .glass-card { padding: 32px 24px; }
        }
      `}</style>
    </div>
  );
}
