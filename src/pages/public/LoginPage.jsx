import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff, HiExclamationCircle } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ROLES = [
  { value: "admin", label: "Admin", color: "#4A3AFF", text: "#fff" },
  { value: "user", label: "User", color: "#1a1a2e", text: "#fff" },
  { value: "pelatih", label: "Pelatih", color: "#FFD700", text: "#1a1a2e" },
];

// Redirect tujuan berdasarkan role yang dikembalikan server
const REDIRECT_MAP = {
  admin: "/admin/dashboard",
  pelatih: "/pelatih/dashboard",
  user: "/user/dashboard",
};

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  // selectedRole hanya untuk tampilan UX — tidak dikirim ke backend
  const [selectedRole, setSelectedRole] = useState("user");
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const activeRole = ROLES.find((r) => r.value === selectedRole);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validasi input kosong
    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi");
      toast.error("Email dan password wajib diisi!");
      return;
    }

    try {
      // Kirim hanya email & password — role dikembalikan dari server
      const userData = await login({
        email: form.email,
        password: form.password,
      });

      // ✅ Toast sukses login
      toast.success(`Selamat datang, ${userData.nama}!`);

      // Redirect berdasarkan role dari response server
      const dest = REDIRECT_MAP[userData.role] ?? "/";
      navigate(dest, { replace: true });
    } catch (err) {
      console.error("Login error:", err);

      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Email atau password salah";

      // Set error state untuk 显示 di form
      setError(msg);

      // ✅ Toast error (popup langsung)
      toast.error(msg);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
      }}
      className="login-grid"
    >
      {/* LEFT PANEL */}
      <div
        style={{
          background: "#1a1a2e",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 48,
          position: "relative",
          overflow: "hidden",
        }}
        className="login-left"
      >
        <div
          style={{
            position: "absolute",
            top: 60,
            right: 40,
            width: 160,
            height: 160,
            border: "3px solid rgba(74,58,255,0.3)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 80,
            right: 60,
            width: 100,
            height: 100,
            border: "3px solid rgba(255,215,0,0.15)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <svg
          style={{ position: "absolute", left: 20, bottom: 100, opacity: 0.08 }}
          width="120"
          height="180"
          viewBox="0 0 80 120"
        >
          <path d="M50 0L20 55H45L15 120L70 45H42L50 0Z" fill="#4A3AFF" />
        </svg>
        <svg
          style={{ position: "absolute", right: 20, top: 200, opacity: 0.06 }}
          width="80"
          height="120"
          viewBox="0 0 80 120"
        >
          <path d="M50 0L20 55H45L15 120L70 45H42L50 0Z" fill="#FFD700" />
        </svg>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "#4A3AFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontFamily: "Oswald,sans-serif",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              CF
            </span>
          </div>
          <span
            style={{
              fontFamily: "Oswald,sans-serif",
              fontWeight: 700,
              fontSize: 20,
              color: "#fff",
              letterSpacing: "0.08em",
            }}
          >
            COACHFINDER
          </span>
        </div>

        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "inline-block",
              background: "#4A3AFF",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: 999,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 20,
            }}
          >
            Berbasis Teknologi AHP
          </div>
          <h1
            style={{
              fontFamily: "Oswald,sans-serif",
              fontWeight: 700,
              fontSize: 48,
              color: "#fff",
              textTransform: "uppercase",
              lineHeight: 1.1,
              margin: "0 0 16px",
            }}
          >
            TEMUKAN
            <br />
            PELATIH
            <br />
            <span style={{ color: "#FFD700" }}>TERBAIK</span>
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 15,
              lineHeight: 1.7,
              maxWidth: 340,
              margin: 0,
            }}
          >
            Sistem rekomendasi cerdas berbasis Analytical Hierarchy Process
            untuk帮助运动员找到最合适的教练。
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
            position: "relative",
          }}
        >
          {[
            ["50+", "Pelatih Aktif"],
            ["10+", "Cabang Olahraga"],
            ["200+", "Atlet Puas"],
          ].map(([n, l]) => (
            <div
              key={l}
              style={{
                border: "1px solid rgba(74,58,255,0.4)",
                borderRadius: 12,
                padding: "14px 12px",
                background: "rgba(74,58,255,0.1)",
              }}
            >
              <p
                style={{
                  fontFamily: "Oswald,sans-serif",
                  fontWeight: 700,
                  fontSize: 28,
                  color: "#fff",
                  margin: 0,
                }}
              >
                {n}
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 11,
                  margin: 0,
                }}
              >
                {l}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          background: "#fff",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                width: 40,
                height: 3,
                background: "#4A3AFF",
                borderRadius: 2,
                marginBottom: 12,
              }}
            />
            <h2
              style={{
                fontFamily: "Oswald,sans-serif",
                fontWeight: 700,
                fontSize: 32,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                color: "#1a1a2e",
                margin: "0 0 6px",
              }}
            >
              Masuk ke Akun
            </h2>
            <p style={{ color: "#9ca3af", fontSize: 14, margin: 0 }}>
              Belum punya akun?{" "}
              <Link
                to="/register"
                style={{
                  color: "#4A3AFF",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Daftar sekarang
              </Link>
            </p>
          </div>

          {/* ROLE SELECTOR — UX only, tidak dikirim ke backend */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 8,
                color: "#1a1a2e",
              }}
            >
              Masuk sebagai
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
              }}
            >
              {ROLES.map(({ value, label, color, text }) => {
                const active = selectedRole === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setSelectedRole(value);
                      setError("");
                    }}
                    style={{
                      background: active ? color : "transparent",
                      color: active ? text : "#6b7280",
                      border: `2px solid ${active ? color : "#e5e7eb"}`,
                      borderRadius: 10,
                      padding: "10px 8px",
                      fontFamily: "Oswald,sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {selectedRole === "admin" && (
              <div
                style={{
                  marginTop: 10,
                  padding: 12,
                  background: "#fffbeb",
                  borderRadius: 10,
                  border: "1px solid #fde68a",
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    color: "#92400e",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  <strong>ℹ️ Akun Admin</strong> tidak perlu registrasi — sudah
                  dibuat langsung di database oleh sistem. Gunakan email &amp;
                  password yang diberikan pengelolaan系统。
                </p>
              </div>
            )}
          </div>

          {/* ✅ ERROR ALERT - Popup error di dalam form */}
          {error && (
            <div
              style={{
                marginBottom: 16,
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: 14,
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 10,
                animation: "shake 0.5s ease-in-out",
              }}
            >
              <HiExclamationCircle
                style={{
                  color: "#ef4444",
                  width: 18,
                  height: 18,
                  flexShrink: 0,
                  marginTop: 1,
                }}
              />
              <p
                style={{
                  color: "#991b1b",
                  fontSize: 13,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {error}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                  marginBottom: 6,
                  color: "#1a1a2e",
                }}
              >
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => {
                  setForm((f) => ({ ...f, email: e.target.value }));
                  setError(""); // Clear error saat user mulai ketik
                }}
                placeholder="email@contoh.com"
                className="psg-input"
                style={error ? { borderColor: "#ef4444" } : {}}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                  marginBottom: 6,
                  color: "#1a1a2e",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={show ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, password: e.target.value }));
                    setError(""); // Clear error saat user mulai ketik
                  }}
                  placeholder="••••••••"
                  className="psg-input"
                  style={{
                    paddingRight: 40,
                    borderColor: error ? "#ef4444" : "initial",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    color: "#9ca3af",
                  }}
                >
                  {show ? (
                    <HiEyeOff style={{ width: 18, height: 18 }} />
                  ) : (
                    <HiEye style={{ width: 18, height: 18 }} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                justifyContent: "center",
                padding: "12px 20px",
                fontSize: 15,
                fontFamily: "Oswald,sans-serif",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                width: "100%",
                marginTop: 4,
                background: activeRole?.color,
                color: activeRole?.text,
                border: "none",
                borderRadius: 10,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Masuk..." : "Masuk →"}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-grid { grid-template-columns: 1fr !important; }
          .login-left { display: none !important; }
        }

        /* ✅ Animasi shake saat error */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
