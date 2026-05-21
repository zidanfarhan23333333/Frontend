import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiTrophy, HiArrowLeft, HiArrowRight } from "react-icons/hi2";
import { useAuth } from "../../context/AuthContext";
import { caborList } from "../../data/dummy";
import toast from "react-hot-toast";

const steps = ["Data Diri", "Keahlian", "Konfirmasi"];

const REDIRECT_MAP = {
  admin: "/admin/dashboard",
  pelatih: "/pelatih/dashboard",
  user: "/user/dashboard",
};

// Validasi per-step sebelum lanjut
function validateStep(step, form) {
  if (step === 0) {
    if (!form.nama.trim()) return "Nama lengkap wajib diisi";
    if (!form.email.trim()) return "Email wajib diisi";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return "Format email tidak valid";
    if (!form.password) return "Password wajib diisi";
    if (form.password.length < 6) return "Password minimal 6 karakter";
    if (!form.telepon.trim()) return "Nomor telepon wajib diisi";
    if (!form.lokasi.trim()) return "Lokasi wajib diisi";
  }
  if (step === 1) {
    if (!form.cabor) return "Cabang olahraga wajib dipilih";
    if (!form.pengalaman) return "Pengalaman wajib diisi";
    if (!form.biaya) return "Biaya per sesi wajib diisi";
  }
  return null;
}

export default function PelatihRegisterPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    telepon: "",
    lokasi: "",
    cabor: "",
    pengalaman: "",
    lisensi: "",
    prestasi: "",
    biaya: "",
    deskripsi: "",
  });

  const { register, login, api } = useAuth();
  const navigate = useNavigate();

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
      // 1. Register akun pelatih (hanya nama, email, password, role)
      await register(
        { nama: form.nama, email: form.email, password: form.password },
        "pelatih",
      );

      // 2. Auto-login untuk dapat token
      const userData = await login({
        email: form.email,
        password: form.password,
      });

      // 3. Kirim data profil pelatih ke endpoint terpisah
      //    Token sudah di-attach otomatis oleh interceptor AuthContext
      await api.post("/pelatih/profile", {
        telepon: form.telepon,
        lokasi: form.lokasi,
        cabor: form.cabor,
        pengalaman: parseInt(form.pengalaman) || 0,
        lisensi: form.lisensi,
        prestasi: form.prestasi,
        biaya: parseInt(form.biaya) || 0,
        deskripsi: form.deskripsi,
      });

      toast.success("Pendaftaran berhasil! Menunggu verifikasi admin.");

      // 4. Redirect berdasarkan role dari response server
      const dest = REDIRECT_MAP[userData.role] ?? "/";
      navigate(dest, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Gagal mendaftar, coba lagi";
      // Kalau error terjadi setelah login, tetap redirect ke dashboard
      // karena akun sudah terbuat — profil bisa diisi ulang nanti
      if (err.config?.url?.includes("/pelatih/profile")) {
        toast.error(
          "Akun dibuat, tapi profil gagal disimpan. Lengkapi di dashboard.",
        );
        navigate(REDIRECT_MAP["pelatih"], { replace: true });
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <HiTrophy className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-black text-2xl text-slate-900 dark:text-white">
              Sport<span className="text-emerald-500">Coach</span>
            </span>
          </Link>
          <h2 className="font-display font-black text-3xl text-slate-900 dark:text-white">
            Daftar sebagai Pelatih
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Bergabunglah dengan jaringan pelatih terpercaya
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8 gap-3">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i < step
                    ? "bg-emerald-500 text-white"
                    : i === step
                      ? "bg-primary-600 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span
                className={`text-sm font-semibold hidden sm:block ${i === step ? "text-primary-600" : "text-slate-400"}`}
              >
                {s}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 ${i < step ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="card p-8">
          {/* Error banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-2xl"
            >
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                {error}
              </p>
            </motion.div>
          )}

          {/* Step 0 — Data Diri */}
          {step === 0 && (
            <div className="space-y-5">
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-4">
                Data Diri
              </h3>
              {[
                ["nama", "Nama Lengkap", "text", "John Doe"],
                ["email", "Email", "email", "pelatih@email.com"],
                ["password", "Password", "password", "Min. 6 karakter"],
                ["telepon", "No. Telepon", "tel", "08xx-xxxx-xxxx"],
                ["lokasi", "Lokasi", "text", "Yogyakarta"],
              ].map(([k, l, t, p]) => (
                <div key={k}>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {l}
                  </label>
                  <input
                    type={t}
                    value={form[k]}
                    onChange={(e) => set(k, e.target.value)}
                    className="input-field"
                    placeholder={p}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Step 1 — Keahlian */}
          {step === 1 && (
            <div className="space-y-5">
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-4">
                Keahlian & Kompetensi
              </h3>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Cabang Olahraga
                </label>
                <select
                  value={form.cabor}
                  onChange={(e) => set("cabor", e.target.value)}
                  className="input-field"
                >
                  <option value="">Pilih Cabang Olahraga</option>
                  {caborList.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              {[
                ["pengalaman", "Pengalaman (Tahun)", "number", "10"],
                [
                  "lisensi",
                  "Lisensi/Sertifikasi",
                  "text",
                  "Nasional A / FINA / dll",
                ],
              ].map(([k, l, t, p]) => (
                <div key={k}>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {l}
                  </label>
                  <input
                    type={t}
                    value={form[k]}
                    onChange={(e) => set(k, e.target.value)}
                    className="input-field"
                    placeholder={p}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Prestasi
                </label>
                <textarea
                  value={form.prestasi}
                  onChange={(e) => set("prestasi", e.target.value)}
                  className="input-field min-h-[80px] resize-none"
                  placeholder="Juara PON 2021, Medali SEA Games, dll..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Biaya per Sesi (Rp)
                </label>
                <input
                  type="number"
                  value={form.biaya}
                  onChange={(e) => set("biaya", e.target.value)}
                  className="input-field"
                  placeholder="250000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Deskripsi Singkat
                </label>
                <textarea
                  value={form.deskripsi}
                  onChange={(e) => set("deskripsi", e.target.value)}
                  className="input-field min-h-[100px] resize-none"
                  placeholder="Ceritakan tentang dirimu sebagai pelatih..."
                />
              </div>
            </div>
          )}

          {/* Step 2 — Konfirmasi */}
          {step === 2 && (
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-4">
                Konfirmasi Data
              </h3>
              <div className="space-y-3 mb-6">
                {[
                  ["Nama", form.nama],
                  ["Email", form.email],
                  ["Telepon", form.telepon],
                  ["Lokasi", form.lokasi],
                  ["Cabang Olahraga", form.cabor],
                  [
                    "Pengalaman",
                    form.pengalaman ? form.pengalaman + " Tahun" : "-",
                  ],
                  ["Lisensi", form.lisensi],
                  [
                    "Biaya per Sesi",
                    form.biaya
                      ? `Rp ${parseInt(form.biaya).toLocaleString("id-ID")}`
                      : "-",
                  ],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between items-start py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
                  >
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {k}
                    </span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 text-right ml-4">
                      {v || "-"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/30">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Setelah mendaftar, akun Anda akan menunggu verifikasi dari
                  admin (1-3 hari kerja). Anda akan menerima notifikasi setelah
                  diverifikasi.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 gap-3">
            {step > 0 ? (
              <button
                onClick={handleBack}
                className="btn-secondary flex-1 justify-center"
              >
                <HiArrowLeft className="w-4 h-4" /> Kembali
              </button>
            ) : (
              <div />
            )}
            {step < 2 ? (
              <button
                onClick={handleNext}
                className="btn-primary flex-1 justify-center"
              >
                Lanjut <HiArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <motion.button
                onClick={handleSubmit}
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="btn-primary flex-1 justify-center disabled:opacity-60"
              >
                {loading ? "Mendaftar..." : "Daftar Sekarang"}
              </motion.button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="text-primary-600 font-bold hover:text-primary-700"
          >
            Masuk
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
