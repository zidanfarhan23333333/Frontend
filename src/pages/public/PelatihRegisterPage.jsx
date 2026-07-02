import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiArrowLeft, HiArrowRight, HiExclamationCircle } from "react-icons/hi";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import assetbola from "../../components/assets/assetbola.png";
import assetbasket from "../../components/assets/assetbasket.png";
import assettkd from "../../components/assets/assettkd.png";
import assetvoli from "../../components/assets/assetvoli.png";

const HERO_IMAGES = [assetbola, assetbasket, assettkd, assetvoli];

const steps = ["Data Diri", "Keahlian", "Konfirmasi"];

const REDIRECT_MAP = {
  admin: "/admin/dashboard",
  pelatih: "/pelatih/dashboard",
  user: "/user/dashboard",
};

function validateStep(step, form) {
  if (step === 0) {
    if (!form.nama.trim()) return "Nama lengkap wajib diisi";
    if (!form.email.trim()) return "Email wajib diisi";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return "Format email tidak valid";
    if (!form.password) return "Password wajib diisi";
    if (form.password.length < 6) return "Password minimal 6 karakter";
    if (!form.domisili.trim()) return "Domisili wajib diisi";
  }
  if (step === 1) {
    if (!form.cabor_id) return "Cabang olahraga wajib dipilih";
    if (!form.pengalaman_melatih.trim())
      return "Pengalaman melatih wajib diisi";
    if (!form.lisensi) return "Level lisensi wajib dipilih";
    if (!form.prestasi) return "Level prestasi wajib dipilih";
    if (!form.harga_min) return "Harga minimum wajib diisi";
    if (!form.harga_max) return "Harga maksimum wajib diisi";
  }
  return null;
}

function hargaKeSkala(min, max) {
  const rata = (Number(min) + Number(max)) / 2;
  if (rata < 50000) return 5;
  if (rata < 150000) return 4;
  if (rata < 300000) return 3;
  if (rata < 500000) return 2;
  return 1;
}

export default function PelatihRegisterPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [caborList, setCaborList] = useState([]);
  const [show, setShow] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    umur: "",
    domisili: "",
    cabor_id: "",
    cabor_nama: "",
    spesialis: "",
    pengalaman_melatih: "",
    lisensi: "",
    prestasi: "",
    harga_min: "",
    harga_max: "",
    deskripsi: "",
  });

  const { register, login, api } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/cabor")
      .then((res) => {
        const data = res.data.data || res.data;
        setCaborList(Array.isArray(data) ? data : []);
      })
      .catch(() => toast.error("Gagal memuat daftar cabor"));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setError("");
  };

  const handleNext = () => {
    const err = validateStep(step, form);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError("");
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const jumlahEntri = form.pengalaman_melatih
        .split("\n")
        .filter(Boolean).length;
      const pengalamanSkala = Math.min(5, Math.max(1, jumlahEntri));

      await register(
        {
          nama: form.nama,
          email: form.email,
          password: form.password,
          cabor: form.cabor_nama,
          pengalaman: pengalamanSkala,
          lisensi: parseInt(form.lisensi) || 1,
          prestasi: parseInt(form.prestasi) || 1,
          biaya: hargaKeSkala(form.harga_min, form.harga_max),
          deskripsi: form.deskripsi || null,
          spesialis: form.spesialis || null,
          domisili: form.domisili || null,
          pengalaman_melatih: form.pengalaman_melatih || null,
          harga_min: form.harga_min ? parseInt(form.harga_min) : null,
          harga_max: form.harga_max ? parseInt(form.harga_max) : null,
        },
        "pelatih",
      );

      const userData = await login({
        email: form.email,
        password: form.password,
      });
      toast.success("Pendaftaran berhasil! Menunggu verifikasi admin.");
      navigate(REDIRECT_MAP[userData.role] ?? "/pelatih/dashboard", {
        replace: true,
      });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Gagal mendaftar, coba lagi";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
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
              Bergabung Jadi
              <br />
              Pelatih Terpercaya
            </h1>
            <p className="hero-desc">
              Daftarkan dirimu sebagai pelatih dan jangkau lebih banyak siswa
              maupun masyarakat umum yang membutuhkan bimbingan olahragamu.
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

        {/* RIGHT — multi-step form panel */}
        <div className="form-panel">
          <div className="form-inner">
            <h2 className="form-title">Daftar sebagai Pelatih</h2>
            <p className="form-sub">
              Sudah punya akun?{" "}
              <Link to="/login" className="form-link">
                Masuk di sini
              </Link>
            </p>

            {/* Step indicator */}
            <div className="step-indicator">
              {steps.map((s, i) => (
                <div key={i} className="step-item">
                  <div
                    className={`step-circle ${
                      i < step
                        ? "step-circle--done"
                        : i === step
                          ? "step-circle--active"
                          : ""
                    }`}
                  >
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span
                    className={`step-label ${i === step ? "step-label--active" : ""}`}
                  >
                    {s}
                  </span>
                  {i < steps.length - 1 && (
                    <div
                      className={`step-line ${i < step ? "step-line--done" : ""}`}
                    />
                  )}
                </div>
              ))}
            </div>

            {error && (
              <div className="error-box">
                <HiExclamationCircle className="error-icon" />
                <p className="error-msg">{error}</p>
              </div>
            )}

            {/* Step 0 — Data Diri */}
            {step === 0 && (
              <div className="auth-form">
                <div className="field-group">
                  <label className="field-label">Nama Lengkap</label>
                  <input
                    type="text"
                    value={form.nama}
                    onChange={(e) => set("nama", e.target.value)}
                    placeholder="Hendra Raafliadi, S. Pd"
                    className="plain-input"
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="pelatih@email.com"
                    className="plain-input"
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Password</label>
                  <div className="input-wrap">
                    <input
                      type={show ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                      placeholder="Min. 6 karakter"
                      className="plain-input"
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
                  <label className="field-label">Umur (opsional)</label>
                  <input
                    type="number"
                    value={form.umur}
                    onChange={(e) => set("umur", e.target.value)}
                    placeholder="25"
                    className="plain-input"
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Domisili / Kota</label>
                  <input
                    type="text"
                    value={form.domisili}
                    onChange={(e) => set("domisili", e.target.value)}
                    placeholder="Kabupaten Magelang"
                    className="plain-input"
                  />
                </div>
              </div>
            )}

            {/* Step 1 — Keahlian */}
            {step === 1 && (
              <div className="auth-form">
                <div className="field-group">
                  <label className="field-label">Cabang Olahraga</label>
                  <select
                    value={form.cabor_id}
                    onChange={(e) => {
                      const selected = caborList.find(
                        (c) => String(c.cabor_id) === e.target.value,
                      );
                      set("cabor_id", e.target.value);
                      set("cabor_nama", selected?.nama_cabor || "");
                    }}
                    className="plain-input"
                  >
                    <option value="">Pilih Cabang Olahraga</option>
                    {caborList.map((c) => (
                      <option key={c.cabor_id} value={c.cabor_id}>
                        {c.nama_cabor}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field-group">
                  <label className="field-label">Spesialis (opsional)</label>
                  <input
                    type="text"
                    value={form.spesialis}
                    onChange={(e) => set("spesialis", e.target.value)}
                    placeholder="Antar Sekolah, Club, dan Daerah"
                    className="plain-input"
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Pengalaman Melatih</label>
                  <p className="field-hint">
                    Tulis satu per baris (nama sekolah, tim, atau klub). Jumlah
                    entri = nilai pengalaman (max 5).
                  </p>
                  <textarea
                    value={form.pengalaman_melatih}
                    onChange={(e) => set("pengalaman_melatih", e.target.value)}
                    className="plain-input plain-textarea"
                    placeholder={`SD N Pucungrejo 1\nSMP IT Ihsanul Fikri\nTIM Putra U19 KAB. Magelang`}
                  />
                  {form.pengalaman_melatih && (
                    <p className="field-note">
                      {Math.min(
                        5,
                        form.pengalaman_melatih.split("\n").filter(Boolean)
                          .length,
                      )}{" "}
                      entri terdeteksi → nilai pengalaman:{" "}
                      {Math.min(
                        5,
                        form.pengalaman_melatih.split("\n").filter(Boolean)
                          .length,
                      )}
                      /5
                    </p>
                  )}
                </div>

                <div className="field-group">
                  <label className="field-label">Level Lisensi</label>
                  <select
                    value={form.lisensi}
                    onChange={(e) => set("lisensi", e.target.value)}
                    className="plain-input"
                  >
                    <option value="">Pilih level lisensi</option>
                    <option value="1">1 - Belum ada lisensi</option>
                    <option value="2">2 - Lisensi Daerah</option>
                    <option value="3">3 - Lisensi Nasional C</option>
                    <option value="4">4 - Lisensi Nasional A/B</option>
                    <option value="5">5 - Lisensi Internasional</option>
                  </select>
                </div>

                <div className="field-group">
                  <label className="field-label">Level Prestasi</label>
                  <select
                    value={form.prestasi}
                    onChange={(e) => set("prestasi", e.target.value)}
                    className="plain-input"
                  >
                    <option value="">Pilih level prestasi</option>
                    <option value="1">1 - Belum ada prestasi</option>
                    <option value="2">2 - Juara Daerah / Provinsi</option>
                    <option value="3">3 - Juara Nasional</option>
                    <option value="4">4 - Juara Internasional</option>
                    <option value="5">5 - Olimpiade / Kejuaraan Dunia</option>
                  </select>
                </div>

                <div className="field-group">
                  <label className="field-label">
                    Range Harga per Pertemuan (Rp)
                  </label>
                  <div className="price-grid">
                    <div>
                      <p className="field-hint">Minimum</p>
                      <input
                        type="number"
                        value={form.harga_min}
                        onChange={(e) => set("harga_min", e.target.value)}
                        placeholder="100000"
                        className="plain-input"
                      />
                    </div>
                    <div>
                      <p className="field-hint">Maksimum</p>
                      <input
                        type="number"
                        value={form.harga_max}
                        onChange={(e) => set("harga_max", e.target.value)}
                        placeholder="250000"
                        className="plain-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">
                    Deskripsi Tambahan (opsional)
                  </label>
                  <textarea
                    value={form.deskripsi}
                    onChange={(e) => set("deskripsi", e.target.value)}
                    className="plain-input plain-textarea plain-textarea--sm"
                    placeholder="Informasi tambahan tentang dirimu..."
                  />
                </div>
              </div>
            )}

            {/* Step 2 — Konfirmasi */}
            {step === 2 && (
              <div className="confirm-block">
                {[
                  ["Nama", form.nama],
                  ["Email", form.email],
                  ["Umur", form.umur ? form.umur + " Tahun" : "-"],
                  ["Domisili", form.domisili],
                  ["Cabang Olahraga", form.cabor_nama],
                  ["Spesialis", form.spesialis || "-"],
                  [
                    "Level Lisensi",
                    form.lisensi ? `Level ${form.lisensi}` : "-",
                  ],
                  [
                    "Level Prestasi",
                    form.prestasi ? `Level ${form.prestasi}` : "-",
                  ],
                  [
                    "Range Harga",
                    form.harga_min && form.harga_max
                      ? `Rp${Number(form.harga_min).toLocaleString("id-ID")} - Rp${Number(form.harga_max).toLocaleString("id-ID")}`
                      : "-",
                  ],
                ].map(([k, v]) => (
                  <div key={k} className="confirm-row">
                    <span className="confirm-key">{k}</span>
                    <span className="confirm-val">{v || "-"}</span>
                  </div>
                ))}

                {form.pengalaman_melatih && (
                  <div className="confirm-exp">
                    <p className="confirm-exp-title">Pengalaman Melatih:</p>
                    <div className="confirm-exp-box">
                      {form.pengalaman_melatih
                        .split("\n")
                        .filter(Boolean)
                        .map((item, i) => (
                          <p key={i} className="confirm-exp-item">
                            • {item}
                          </p>
                        ))}
                    </div>
                  </div>
                )}

                <div className="confirm-notice">
                  Setelah mendaftar, akun Anda akan menunggu verifikasi dari
                  admin (1-3 hari kerja). Data profil bisa diupdate di dashboard
                  setelah login.
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="step-nav">
              {step > 0 ? (
                <button onClick={handleBack} className="outline-btn step-btn">
                  <HiArrowLeft /> Kembali
                </button>
              ) : (
                <div />
              )}
              {step < 2 ? (
                <button onClick={handleNext} className="submit-btn step-btn">
                  Lanjut <HiArrowRight />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="submit-btn step-btn"
                >
                  {loading ? <span className="spinner" /> : "Daftar Sekarang"}
                </button>
              )}
            </div>
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
        .hero-logo { position: relative; z-index: 2; display: flex; align-items: center; gap: 8px; }
        .logo-mark { display: flex; }
        .logo-text { font-weight: 700; font-size: 17px; color: #111; }
        .hero-bottom { position: relative; z-index: 2; }
        .hero-headline {
          font-family: 'Instrument Serif', serif;
          font-weight: 400; font-size: 34px; line-height: 1.15;
          color: #fff; margin-bottom: 12px;
        }
        .hero-desc { font-size: 13px; line-height: 1.6; color: rgba(255,255,255,0.88); max-width: 360px; margin-bottom: 18px; }
        .hero-dots { display: flex; gap: 8px; }
        .hero-dot {
          width: 8px; height: 8px; border-radius: 50%;
          border: none; background: rgba(255,255,255,0.4);
          cursor: pointer; padding: 0; transition: all 0.2s;
        }
        .hero-dot--active { background: #fff; width: 20px; border-radius: 4px; }

        /* ── Form panel ── */
        .form-panel {
          padding: 48px 64px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          overflow-y: auto;
        }
        .form-inner { width: 100%; max-width: 460px; }

        .form-title { font-size: 26px; font-weight: 700; color: #111; margin-bottom: 6px; }
        .form-sub { font-size: 13px; color: #6b7280; margin-bottom: 22px; }
        .form-link { color: #2563EB; font-weight: 600; text-decoration: none; }
        .form-link:hover { text-decoration: underline; }

        /* ── Step indicator ── */
        .step-indicator { display: flex; align-items: center; margin-bottom: 24px; }
        .step-item { display: flex; align-items: center; gap: 8px; }
        .step-circle {
          width: 26px; height: 26px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: #9ca3af;
          background: #f3f4f6; flex-shrink: 0;
          transition: all 0.2s;
        }
        .step-circle--active { background: #2563EB; color: #fff; }
        .step-circle--done { background: #16a34a; color: #fff; }
        .step-label { font-size: 12px; font-weight: 600; color: #9ca3af; display: none; }
        .step-label--active { color: #2563EB; }
        .step-line { width: 28px; height: 2px; background: #e5e7eb; margin: 0 6px; }
        .step-line--done { background: #16a34a; }
        @media (min-width: 640px) { .step-label { display: block; } }

        .error-box {
          display: flex; align-items: flex-start; gap: 8px;
          background: #fef2f2; border: 1px solid #fecaca;
          border-radius: 8px; padding: 10px 12px; margin-bottom: 16px;
        }
        .error-icon { color: #ef4444; width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; }
        .error-msg { color: #b91c1c; font-size: 12.5px; font-weight: 500; }

        .auth-form { display: flex; flex-direction: column; gap: 16px; width: 100%; }
        .field-group { display: flex; flex-direction: column; gap: 6px; }
        .field-label { font-size: 12.5px; font-weight: 600; color: #374151; }
        .field-hint { font-size: 11.5px; color: #9ca3af; margin-bottom: 2px; }
        .field-note { font-size: 11.5px; color: #2563EB; margin-top: 2px; }

        .plain-input {
          width: 100%;
          background: #fff;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 11px 14px;
          font-size: 13.5px;
          color: #111;
          outline: none;
          font-family: inherit;
          transition: border-color 0.15s;
        }
        .plain-input::placeholder { color: #9ca3af; }
        .plain-input:focus { border-color: #2563EB; }

        .plain-textarea { min-height: 120px; resize: none; line-height: 1.5; }
        .plain-textarea--sm { min-height: 72px; }

        .input-wrap { position: relative; }
        .eye-btn {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #9ca3af; font-size: 16px; display: flex; align-items: center;
        }
        .eye-btn:hover { color: #4b5563; }

        .price-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        /* ── Confirmation step ── */
        .confirm-block { display: flex; flex-direction: column; gap: 4px; }
        .confirm-row {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding: 10px 0; border-bottom: 1px solid #f1f5f9;
        }
        .confirm-key { font-size: 12.5px; color: #6b7280; }
        .confirm-val { font-size: 12.5px; font-weight: 600; color: #111; text-align: right; margin-left: 16px; }
        .confirm-exp { margin-top: 14px; }
        .confirm-exp-title { font-size: 12.5px; font-weight: 600; color: #6b7280; margin-bottom: 8px; }
        .confirm-exp-box {
          background: #f9fafb; border-radius: 8px; padding: 12px;
          max-height: 140px; overflow-y: auto;
        }
        .confirm-exp-item { font-size: 12.5px; color: #374151; line-height: 1.7; }
        .confirm-notice {
          margin-top: 16px; padding: 12px 14px;
          background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px;
          font-size: 11.5px; color: #92400e; line-height: 1.6;
        }

        /* ── Nav buttons ── */
        .step-nav { display: flex; gap: 12px; margin-top: 24px; }
        .step-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
        }

        .submit-btn {
          background: #2563EB;
          border: none; border-radius: 8px;
          color: #fff; font-weight: 600; font-size: 14px;
          padding: 12px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .submit-btn:hover:not(:disabled) { background: #1d4ed8; }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .outline-btn {
          background: #fff; border: 1px solid #d1d5db; border-radius: 8px;
          color: #374151; font-size: 14px; font-weight: 600;
          padding: 12px; cursor: pointer; transition: all 0.15s;
        }
        .outline-btn:hover { border-color: #9ca3af; background: #f9fafb; }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff; border-radius: 50%;
          display: inline-block; animation: spin 0.7s linear infinite;
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
