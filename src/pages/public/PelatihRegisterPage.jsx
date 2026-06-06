import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiTrophy, HiArrowLeft, HiArrowRight } from "react-icons/hi2";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

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

  // Fetch cabor dari backend
  useEffect(() => {
    api
      .get("/api/cabor")
      .then((res) => {
        const data = res.data.data || res.data;
        setCaborList(Array.isArray(data) ? data : []);
      })
      .catch(() => toast.error("Gagal memuat daftar cabor"));
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
              className="mb-5 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-2xl"
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
                ["nama", "Nama Lengkap", "text", "Hendra Raafliadi, S. Pd"],
                ["email", "Email", "email", "pelatih@email.com"],
                ["password", "Password", "password", "Min. 6 karakter"],
                ["umur", "Umur (opsional)", "number", "25"],
                ["domisili", "Domisili / Kota", "text", "Kabupaten Magelang"],
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

              {/* Cabang Olahraga */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Cabang Olahraga
                </label>
                <select
                  value={form.cabor_id}
                  onChange={(e) => {
                    const selected = caborList.find(
                      (c) => String(c.cabor_id) === e.target.value,
                    );
                    set("cabor_id", e.target.value);
                    set("cabor_nama", selected?.nama_cabor || "");
                  }}
                  className="input-field"
                >
                  <option value="">Pilih Cabang Olahraga</option>
                  {caborList.map((c) => (
                    <option key={c.cabor_id} value={c.cabor_id}>
                      {c.nama_cabor}
                    </option>
                  ))}
                </select>
              </div>

              {/* Spesialis */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Spesialis (opsional)
                </label>
                <input
                  type="text"
                  value={form.spesialis}
                  onChange={(e) => set("spesialis", e.target.value)}
                  className="input-field"
                  placeholder="Antar Sekolah, Club, dan Daerah"
                />
              </div>

              {/* Pengalaman Melatih */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Pengalaman Melatih
                </label>
                <p className="text-xs text-slate-400 mb-2">
                  Tulis satu per baris (nama sekolah, tim, atau klub). Jumlah
                  entri = nilai pengalaman (max 5).
                </p>
                <textarea
                  value={form.pengalaman_melatih}
                  onChange={(e) => set("pengalaman_melatih", e.target.value)}
                  className="input-field min-h-[140px] resize-none"
                  placeholder={`SD N Pucungrejo 1\nSMP IT Ihsanul Fikri\nTIM Putra U19 KAB. Magelang`}
                />
                {form.pengalaman_melatih && (
                  <p className="text-xs text-primary-600 mt-1">
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

              {/* Level Lisensi */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Level Lisensi
                </label>
                <select
                  value={form.lisensi}
                  onChange={(e) => set("lisensi", e.target.value)}
                  className="input-field"
                >
                  <option value="">Pilih level lisensi</option>
                  <option value="1">1 - Belum ada lisensi</option>
                  <option value="2">2 - Lisensi Daerah</option>
                  <option value="3">3 - Lisensi Nasional C</option>
                  <option value="4">4 - Lisensi Nasional A/B</option>
                  <option value="5">5 - Lisensi Internasional</option>
                </select>
              </div>

              {/* Level Prestasi */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Level Prestasi
                </label>
                <select
                  value={form.prestasi}
                  onChange={(e) => set("prestasi", e.target.value)}
                  className="input-field"
                >
                  <option value="">Pilih level prestasi</option>
                  <option value="1">1 - Belum ada prestasi</option>
                  <option value="2">2 - Juara Daerah / Provinsi</option>
                  <option value="3">3 - Juara Nasional</option>
                  <option value="4">4 - Juara Internasional</option>
                  <option value="5">5 - Olimpiade / Kejuaraan Dunia</option>
                </select>
              </div>

              {/* Range Harga */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Range Harga per Pertemuan (Rp)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Minimum</p>
                    <input
                      type="number"
                      value={form.harga_min}
                      onChange={(e) => set("harga_min", e.target.value)}
                      className="input-field"
                      placeholder="100000"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Maksimum</p>
                    <input
                      type="number"
                      value={form.harga_max}
                      onChange={(e) => set("harga_max", e.target.value)}
                      className="input-field"
                      placeholder="250000"
                    />
                  </div>
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Deskripsi Tambahan (opsional)
                </label>
                <textarea
                  value={form.deskripsi}
                  onChange={(e) => set("deskripsi", e.target.value)}
                  className="input-field min-h-[80px] resize-none"
                  placeholder="Informasi tambahan tentang dirimu..."
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

              {/* Preview pengalaman melatih */}
              {form.pengalaman_melatih && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
                    Pengalaman Melatih:
                  </p>
                  <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl max-h-40 overflow-y-auto">
                    {form.pengalaman_melatih
                      .split("\n")
                      .filter(Boolean)
                      .map((item, i) => (
                        <p
                          key={i}
                          className="text-sm text-slate-700 dark:text-slate-300"
                        >
                          • {item}
                        </p>
                      ))}
                  </div>
                </div>
              )}

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/30">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Setelah mendaftar, akun Anda akan menunggu verifikasi dari
                  admin (1-3 hari kerja). Data profil bisa diupdate di dashboard
                  setelah login.
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
