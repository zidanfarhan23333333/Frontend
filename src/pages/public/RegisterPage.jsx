import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff, HiExclamationCircle } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const REDIRECT_MAP = {
  admin: "/admin/dashboard",
  pelatih: "/pelatih/dashboard",
  user: "/user/dashboard",
};

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

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
      await register(
        { nama: form.nama, email: form.email, password: form.password },
        "user",
      );
      const userData = await login({
        email: form.email,
        password: form.password,
      });
      toast.success("Akun berhasil dibuat!");
      navigate(REDIRECT_MAP[userData.role] ?? "/user/dashboard", {
        replace: true,
      });
    } catch (err) {
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

  return (
    <div className="auth-root">
      {/* Background */}
      <div className="auth-bg">
        <div className="auth-bg-overlay" />
        <div className="auth-bg-grid" />
        <div className="deco-circle deco-circle-1" />
        <div className="deco-circle deco-circle-2" />
        <div className="deco-circle deco-circle-3" />
      </div>

      <div className="auth-layout">
        {/* LEFT — Brand panel */}
        <div className="auth-left">
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

          <div className="brand-hero">
            <div className="brand-badge">Daftar Gratis</div>
            <h1 className="brand-headline">
              MULAI
              <br />
              PERJALANAN
              <br />
              <span className="brand-accent">JUARAMU</span>
            </h1>
            <p className="brand-desc">
              Buat akun dalam hitungan detik dan temukan pelatih terbaik yang
              cocok dengan kebutuhanmu menggunakan teknologi AHP.
            </p>

            <div className="feature-list">
              {[
                ["✓", "Rekomendasi pelatih berbasis AHP"],
                ["✓", "Akses ke 50+ pelatih terverifikasi"],
                ["✓", "Jadwal dan booking mudah"],
              ].map(([icon, text]) => (
                <div key={text} className="feature-item">
                  <span className="feature-icon">{icon}</span>
                  <span className="feature-text">{text}</span>
                </div>
              ))}
            </div>
          </div>

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

        {/* RIGHT — Register form */}
        <div className="auth-right">
          <div className="glass-card">
            <div className="card-accent" />

            <div className="card-header">
              <h2 className="card-title">Buat Akun</h2>
              <p className="card-sub">
                Sudah punya akun?{" "}
                <Link to="/login" className="card-link">
                  Masuk di sini
                </Link>
              </p>
            </div>

            {error && (
              <div className="error-box">
                <HiExclamationCircle className="error-icon" />
                <p className="error-msg">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="field-group">
                <label className="field-label">Nama Lengkap</label>
                <input
                  value={form.nama}
                  onChange={(e) => set("nama", e.target.value)}
                  placeholder="Nama lengkap kamu"
                  className="glass-input"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="field-group">
                <label className="field-label">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="nama@email.com"
                  className="glass-input"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="field-group">
                <label className="field-label">Password</label>
                <div className="input-wrap">
                  <input
                    type={show ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="glass-input"
                    autoComplete="new-password"
                    required
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
                <label className="field-label">Konfirmasi Password</label>
                <input
                  type="password"
                  value={form.konfirmasi}
                  onChange={(e) => set("konfirmasi", e.target.value)}
                  placeholder="Ulangi password"
                  className={`glass-input ${form.konfirmasi && form.konfirmasi !== form.password ? "glass-input--error" : ""} ${form.konfirmasi && form.konfirmasi === form.password && form.password ? "glass-input--success" : ""}`}
                  autoComplete="new-password"
                  required
                />
                {form.konfirmasi &&
                  form.konfirmasi === form.password &&
                  form.password && (
                    <span className="match-hint">✓ Password cocok</span>
                  )}
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? (
                  <span className="spinner" />
                ) : (
                  <>
                    Buat Akun <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="card-divider">
              <span>atau</span>
            </div>

            <Link to="/pelatih/register" className="pelatih-btn">
              Daftar sebagai Pelatih
            </Link>
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

        .auth-layout {
          position: relative; z-index: 1;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .auth-left {
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 48px 56px;
        }

        .brand-logo { display: flex; align-items: center; gap: 12px; }
        .brand-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: #4A3AFF;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .brand-name {
          font-family: 'Oswald', 'Arial Narrow', sans-serif;
          font-weight: 700; font-size: 20px; letter-spacing: 0.12em; color: #fff;
        }

        .brand-hero { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 40px 0; }
        .brand-badge {
          display: inline-block;
          background: rgba(74,58,255,0.3); border: 1px solid rgba(74,58,255,0.5);
          color: #a8a0ff; font-size: 11px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 5px 14px; border-radius: 999px; margin-bottom: 24px;
        }
        .brand-headline {
          font-family: 'Oswald', 'Arial Narrow', sans-serif;
          font-weight: 700; font-size: 52px; line-height: 1.05;
          color: #fff; text-transform: uppercase; margin-bottom: 20px;
        }
        .brand-accent { color: #FFD700; }
        .brand-desc {
          color: rgba(255,255,255,0.45); font-size: 15px;
          line-height: 1.75; max-width: 360px; margin-bottom: 28px;
        }

        .feature-list { display: flex; flex-direction: column; gap: 10px; }
        .feature-item { display: flex; align-items: center; gap: 10px; }
        .feature-icon { color: #4A3AFF; font-weight: 700; font-size: 14px; }
        .feature-text { color: rgba(255,255,255,0.55); font-size: 14px; }

        .brand-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .stat-card {
          border: 1px solid rgba(74,58,255,0.25);
          background: rgba(74,58,255,0.08);
          border-radius: 12px; padding: 16px 14px;
        }
        .stat-num {
          font-family: 'Oswald', sans-serif;
          font-weight: 700; font-size: 30px; color: #fff; line-height: 1;
        }
        .stat-label { color: rgba(255,255,255,0.4); font-size: 11px; margin-top: 4px; }

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
          position: relative; overflow: hidden;
        }
        .card-accent {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #4A3AFF, #7B6EFF, #4A3AFF);
        }

        .card-header { margin-bottom: 24px; }
        .card-title {
          font-family: 'Oswald', sans-serif;
          font-weight: 700; font-size: 28px;
          color: #fff; text-transform: uppercase;
          letter-spacing: 0.06em; margin-bottom: 8px;
        }
        .card-sub { font-size: 13px; color: rgba(255,255,255,0.4); }
        .card-link { color: #7B6EFF; font-weight: 600; text-decoration: none; }
        .card-link:hover { color: #a8a0ff; }

        .error-box {
          display: flex; align-items: flex-start; gap: 10px;
          background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3);
          border-radius: 10px; padding: 12px 14px; margin-bottom: 16px;
          animation: shake 0.4s ease;
        }
        .error-icon { color: #f87171; width: 18px; height: 18px; flex-shrink: 0; margin-top: 1px; }
        .error-msg { color: #fca5a5; font-size: 13px; font-weight: 500; }

        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-4px); }
          40%,80% { transform: translateX(4px); }
        }

        .auth-form { display: flex; flex-direction: column; gap: 14px; }
        .field-group { display: flex; flex-direction: column; gap: 6px; }
        .field-label {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(255,255,255,0.45);
        }
        .input-wrap { position: relative; }

        .glass-input {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 12px 16px;
          color: #fff; font-size: 14px; outline: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .glass-input::placeholder { color: rgba(255,255,255,0.22); }
        .glass-input:focus {
          border-color: rgba(74,58,255,0.7);
          background: rgba(74,58,255,0.08);
        }
        .glass-input--error { border-color: rgba(239,68,68,0.5) !important; }
        .glass-input--success { border-color: rgba(34,197,94,0.5) !important; }

        .match-hint { font-size: 11px; color: #4ade80; margin-top: 2px; }

        .eye-btn {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.3); font-size: 18px;
          display: flex; align-items: center; transition: color 0.15s;
        }
        .eye-btn:hover { color: rgba(255,255,255,0.6); }

        .submit-btn {
          width: 100%; margin-top: 4px;
          background: #4A3AFF; border: none; border-radius: 10px;
          color: #fff;
          font-family: 'Oswald', sans-serif;
          font-weight: 700; font-size: 16px;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 14px; cursor: pointer;
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

        .card-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 20px 0 16px;
        }
        .card-divider::before, .card-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.1);
        }
        .card-divider span { font-size: 12px; color: rgba(255,255,255,0.3); }

        .pelatih-btn {
          display: block; width: 100%; text-align: center;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 10px;
          color: rgba(255,255,255,0.6);
          font-size: 14px; font-weight: 600;
          padding: 12px;
          text-decoration: none;
          transition: all 0.15s;
        }
        .pelatih-btn:hover {
          border-color: rgba(255,255,255,0.3);
          color: rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.05);
        }

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
