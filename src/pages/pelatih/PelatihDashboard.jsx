import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiClipboardDocumentList,
  HiStar,
  HiTrophy,
  HiUsers,
  HiBell,
  HiCheckCircle,
  HiClock,
  HiXCircle,
  HiChevronRight,
  HiChevronLeft,
  HiShieldCheck,
  HiExclamationTriangle,
  HiCalendarDays,
  HiMapPin,
} from "react-icons/hi2";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { StatusBadge } from "../../components/ui/Badges";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

// ── Constants ────────────────────────────────────────────────────
const SKALA = {
  1: "Pemula",
  2: "Dasar",
  3: "Menengah",
  4: "Mahir",
  5: "Expert",
};
const LISENSI = {
  1: "Tidak Ada",
  2: "Daerah",
  3: "Nasional",
  4: "Asia",
  5: "Internasional",
};

const HARI_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const HARI_FULL = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 07:00 – 20:00

const STATUS_BOOKING_COLOR = {
  dikonfirmasi: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-blue-50 text-blue-700 border-blue-200",
  dibatalkan: "bg-red-50 text-red-500 border-red-200",
  selesai: "bg-slate-50 text-slate-400 border-slate-200",
};

// ── Helpers ──────────────────────────────────────────────────────
function parseTime(str) {
  if (!str) return null;
  const [h, m] = str.split(":").map(Number);
  return h * 60 + (m || 0);
}

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

// Map "Senin" → weekday index (0=Sun, 1=Mon, …)
const HARI_TO_DAY = {
  Minggu: 0,
  Senin: 1,
  Selasa: 2,
  Rabu: 3,
  Kamis: 4,
  Jumat: 5,
  Sabtu: 6,
};

// ── Sub-components ───────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent, delay = 0 }) {
  const colors = {
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-500",
      border: "border-blue-100",
      dot: "bg-blue-400",
    },
    amber: {
      bg: "bg-amber-50",
      icon: "text-amber-500",
      border: "border-amber-100",
      dot: "bg-amber-400",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-500",
      border: "border-purple-100",
      dot: "bg-purple-400",
    },
    teal: {
      bg: "bg-teal-50",
      icon: "text-teal-500",
      border: "border-teal-100",
      dot: "bg-teal-400",
    },
  };
  const c = colors[accent] || colors.blue;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-2xl border ${c.border} bg-white p-5 flex flex-col gap-3 shadow-sm`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.bg}`}
      >
        <Icon className={`w-5 h-5 ${c.icon}`} />
      </div>
      <div>
        <p className="text-2xl font-black text-slate-800 leading-none">
          {value}
        </p>
        <p className="text-xs text-slate-400 mt-1 font-medium">{label}</p>
      </div>
    </motion.div>
  );
}

function AHPBar({ label, bobot, nilai, rawVal, delay }) {
  const pct = ((rawVal || 0) / 5) * 100;
  const barColors = [
    "from-blue-400 to-blue-500",
    "from-indigo-400 to-purple-400",
    "from-amber-400 to-orange-400",
    "from-teal-400 to-emerald-400",
  ];
  const idx = ["Pengalaman", "Lisensi", "Prestasi", "Biaya"].indexOf(label);
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-semibold text-slate-600">
          {label}{" "}
          <span className="text-slate-300 font-normal ml-1">({bobot})</span>
        </span>
        <span className="text-xs font-bold text-slate-700">{nilai}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay, duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${barColors[idx] || barColors[0]}`}
        />
      </div>
    </div>
  );
}

function NotifItem({ icon: Icon, color, title, sub, time }) {
  const cls = {
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-500",
  };
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${cls[color] || cls.blue}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-700 leading-snug">
          {title}
        </p>
        <p className="text-xs text-slate-400 truncate">{sub}</p>
      </div>
      <span className="text-[10px] text-slate-300 flex-shrink-0 mt-0.5">
        {time}
      </span>
    </div>
  );
}

// ── Calendar Section (synced with jadwalList) ────────────────────
function JadwalSection({ bookings, jadwalList }) {
  const [view, setView] = useState("day");
  const [activeDay, setActiveDay] = useState(new Date());
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, []);

  const goPrev = () => {
    const d = new Date(activeDay);
    d.setDate(d.getDate() - (view === "week" ? 7 : 1));
    setActiveDay(d);
  };
  const goNext = () => {
    const d = new Date(activeDay);
    d.setDate(d.getDate() + (view === "week" ? 7 : 1));
    setActiveDay(d);
  };

  const days =
    view === "day"
      ? [activeDay]
      : Array.from({ length: 7 }, (_, i) => {
          const d = new Date(activeDay);
          const diff = i - d.getDay();
          d.setDate(d.getDate() + diff);
          return new Date(d);
        });

  // Bookings for a specific day
  function bookingsForDay(day) {
    const dayStr = isoDate(day);
    return bookings.filter((b) => b.tanggal?.slice(0, 10) === dayStr);
  }

  // Jadwal aktif blocks for a day (from jadwalList, matched by day-of-week)
  function jadwalForDay(day) {
    const dayIndex = day.getDay(); // 0=Sun
    return jadwalList.filter((j) => HARI_TO_DAY[j.hari] === dayIndex);
  }

  const PX_PER_MIN = 56 / 60;
  const START_MIN = 7 * 60;

  function topPx(timeStr) {
    const m = parseTime(timeStr) ?? START_MIN;
    return Math.max(0, m - START_MIN) * PX_PER_MIN;
  }
  function heightPx(startStr, endStr) {
    const s = parseTime(startStr) ?? START_MIN;
    const e = parseTime(endStr) ?? s + 60;
    return Math.max(28, e - s) * PX_PER_MIN;
  }

  const totalH = HOURS.length * 56;

  const headerLabel =
    view === "day"
      ? activeDay.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : `Minggu ${days[0]?.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} – ${days[6]?.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
    >
      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
            <HiCalendarDays className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800">Jadwal Sesi</h3>
            <p className="text-xs text-slate-400">{headerLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
          >
            <HiChevronLeft className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={goNext}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
          >
            <HiChevronRight className="w-4 h-4 text-slate-400" />
          </button>
          <div className="flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
            {["day", "week"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  view === v
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {v === "day" ? "Hari" : "Minggu"}
              </button>
            ))}
          </div>
          <button
            onClick={() => setActiveDay(new Date())}
            className="px-3 py-1.5 text-xs font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Hari Ini
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {view === "week" && (
            <div className="flex border-b border-slate-100">
              <div className="w-14 flex-shrink-0" />
              {days.map((d, i) => {
                const isToday = isoDate(d) === isoDate(new Date());
                return (
                  <div
                    key={i}
                    className={`flex-1 text-center py-2.5 text-xs font-bold cursor-pointer transition-colors
                      ${isToday ? "text-blue-600 bg-blue-50" : "text-slate-400 hover:bg-slate-50"}`}
                    onClick={() => {
                      setActiveDay(new Date(d));
                      setView("day");
                    }}
                  >
                    <div>{HARI_SHORT[d.getDay()]}</div>
                    <div
                      className={`text-base font-black mt-0.5 ${isToday ? "text-blue-600" : "text-slate-700"}`}
                    >
                      {d.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div ref={scrollRef} className="overflow-y-auto max-h-[380px]">
            <div className="flex">
              {/* Hour labels */}
              <div
                className="w-14 flex-shrink-0 relative"
                style={{ height: totalH }}
              >
                {HOURS.map((h) => (
                  <div
                    key={h}
                    className="absolute left-0 right-0 flex items-center justify-end pr-3"
                    style={{ top: (h - 7) * 56, height: 56 }}
                  >
                    <span className="text-[10px] font-medium text-slate-300">
                      {String(h).padStart(2, "0")}:00
                    </span>
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {days.map((day, di) => {
                const dayBookings = bookingsForDay(day);
                const dayJadwal = jadwalForDay(day);
                const isToday = isoDate(day) === isoDate(new Date());
                return (
                  <div
                    key={di}
                    className={`flex-1 relative border-l border-slate-100 ${isToday ? "bg-blue-50/20" : ""}`}
                    style={{ height: totalH }}
                  >
                    {/* Hour lines */}
                    {HOURS.map((h) => (
                      <div
                        key={h}
                        className="absolute left-0 right-0 border-t border-slate-100"
                        style={{ top: (h - 7) * 56 }}
                      />
                    ))}

                    {/* Jadwal aktif background blocks (availability) */}
                    {dayJadwal.map((j, ji) => {
                      const top = topPx(j.jam_mulai);
                      const height = heightPx(j.jam_mulai, j.jam_selesai);
                      return (
                        <div
                          key={`jadwal-${ji}`}
                          className="absolute left-0 right-0 bg-slate-50 border-l-2 border-slate-200"
                          style={{ top, height: Math.max(height, 28) }}
                        >
                          {j.lokasi && (
                            <p className="text-[9px] text-slate-300 px-2 pt-1 flex items-center gap-0.5 truncate">
                              <HiMapPin className="w-2.5 h-2.5 flex-shrink-0" />
                              {j.lokasi}
                            </p>
                          )}
                        </div>
                      );
                    })}

                    {/* Booking blocks */}
                    {dayBookings.map((b, bi) => {
                      const startTime = b.jam_mulai || b.start || null;
                      const endTime = b.jam_selesai || b.end || null;
                      const top = startTime ? topPx(startTime) : bi * 58;
                      const height =
                        startTime && endTime
                          ? heightPx(startTime, endTime)
                          : 52;
                      const colorCls =
                        STATUS_BOOKING_COLOR[b.status] ||
                        "bg-blue-50 text-blue-700 border-blue-200";
                      return (
                        <div
                          key={bi}
                          className={`absolute left-1 right-1 rounded-lg border px-2 py-1 text-[11px] font-semibold overflow-hidden cursor-pointer hover:brightness-95 transition-all ${colorCls}`}
                          style={{ top, height: Math.max(height, 28) }}
                        >
                          <p className="font-bold leading-tight truncate">
                            {b.userName || b.user?.nama || "Atlet"}
                          </p>
                          {startTime && (
                            <p className="opacity-70 text-[10px]">
                              {startTime}
                              {endTime ? ` – ${endTime}` : ""}
                            </p>
                          )}
                          <p className="opacity-60 text-[10px] capitalize">
                            {b.status}
                          </p>
                        </div>
                      );
                    })}

                    {/* Empty */}
                    {dayBookings.length === 0 &&
                      dayJadwal.length === 0 &&
                      view === "day" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-xs text-slate-300 font-medium">
                            Tidak ada sesi
                          </p>
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-3 border-t border-slate-50 flex items-center gap-5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-slate-50 border-l-2 border-slate-300" />
          <span className="text-[11px] text-slate-400 font-medium">
            Tersedia
          </span>
        </div>
        {[
          { label: "Dikonfirmasi", cls: "bg-emerald-100 border-emerald-200" },
          { label: "Pending", cls: "bg-blue-100 border-blue-200" },
          { label: "Dibatalkan", cls: "bg-red-100 border-red-200" },
          { label: "Selesai", cls: "bg-slate-100 border-slate-200" },
        ].map(({ label, cls }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm border ${cls}`} />
            <span className="text-[11px] text-slate-400 font-medium">
              {label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────
export default function PelatihDashboard() {
  const { user, api } = useAuth();
  const [profil, setProfil] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [ranking, setRanking] = useState(null);
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Ganti fungsi fetchDashboardData di PelatihDashboard.jsx dengan ini:

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [profilRes, statsRes] = await Promise.all([
        api.get("/api/pelatih/my-profile"),
        api.get("/api/pelatih/my-stats"),
      ]);

      const profil = profilRes.data.data || profilRes.data;
      setProfil(profil);

      const stats = statsRes.data.data || statsRes.data;
      setRanking({
        rank: stats.ranking,
        skorAHP: stats.skorAHP,
      });

      if (profil?.pelatih_id) {
        const [bookingRes, jadwalRes] = await Promise.all([
          api
            .get(`/api/public/bookings/${profil.pelatih_id}`)
            .catch(() => ({ data: [] })),
          api.get("/api/pelatih/jadwal").catch(() => ({ data: [] })), // ✅ fix: pakai endpoint jadwal sendiri
        ]);

        const bRaw = bookingRes.data.data || bookingRes.data;
        setBookings(bRaw.bookings || (Array.isArray(bRaw) ? bRaw : []));

        const jRaw = jadwalRes.data.data || jadwalRes.data;
        setJadwal(Array.isArray(jRaw) ? jRaw : jRaw?.jadwal || []);
      }
    } catch (err) {
      console.error("❌ Error fetching dashboard:", err);
      setError(err.response?.data?.message || "Gagal memuat data");
      toast.error("Gagal memuat dashboard");
    } finally {
      setLoading(false);
    }
  };

  const p = profil;
  const r = ranking;
  const isVerified = p?.status_verifikasi === "terverifikasi";

  const bobotDisplay = [
    {
      label: "Pengalaman",
      bobot: "35%",
      nilai: SKALA[p?.pengalaman] || "-",
      rawVal: p?.pengalaman,
    },
    {
      label: "Lisensi",
      bobot: "25%",
      nilai: LISENSI[p?.lisensi] || "-",
      rawVal: p?.lisensi,
    },
    {
      label: "Prestasi",
      bobot: "25%",
      nilai: SKALA[p?.prestasi] || "-",
      rawVal: p?.prestasi,
    },
    {
      label: "Biaya",
      bobot: "15%",
      nilai: p?.biaya ? `Skala ${p.biaya}/5` : "-",
      rawVal: p?.biaya,
    },
  ];

  const notifs = bookings.slice(0, 4).map((b) => ({
    icon:
      b.status === "dikonfirmasi"
        ? HiCheckCircle
        : b.status === "pending"
          ? HiClock
          : b.status === "dibatalkan"
            ? HiXCircle
            : HiClipboardDocumentList,
    color:
      b.status === "dikonfirmasi"
        ? "green"
        : b.status === "pending"
          ? "amber"
          : b.status === "dibatalkan"
            ? "red"
            : "blue",
    title: `Booking dari ${b.userName || b.user?.nama || "Atlet"}`,
    sub: b.tanggal
      ? new Date(b.tanggal).toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "short",
        })
      : "-",
    time: "baru",
  }));

  if (loading)
    return (
      <DashboardLayout
        title={`Halo, ${user?.nama?.split(" ")[0] || "Pelatih"} 👋`}
        subtitle="Memuat data..."
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400 text-sm">Memuat dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout
      title={`Halo, ${user?.nama?.split(" ")[0] || "Pelatih"} 👋`}
      subtitle="Pantau aktivitas dan performa Anda"
    >
      {/* ── Hero Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-6 rounded-2xl overflow-hidden h-32 md:h-40"
        style={{
          background:
            "linear-gradient(135deg, #1e293b 0%, #1e3a5f 50%, #1d4ed8 100%)",
        }}
      >
        {/* Subtle pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
              radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-400/10 blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative z-10 h-full flex items-center justify-between px-6 md:px-8">
          <div>
            <p className="text-blue-200/70 text-[10px] font-semibold tracking-widest uppercase mb-1">
              Dashboard Pelatih
            </p>
            <h1 className="text-white font-black text-xl md:text-2xl leading-tight">
              Halo, {user?.nama?.split(" ")[0] || "Pelatih"} 👋
            </h1>
            <p className="text-white/40 text-xs mt-1">
              Pantau aktivitas dan performa Anda
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isVerified ? (
              <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                <HiShieldCheck className="w-3.5 h-3.5" /> Terverifikasi
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                <HiExclamationTriangle className="w-3.5 h-3.5" /> Menunggu
                Verifikasi
              </div>
            )}
            {r?.rank && isVerified && (
              <div className="bg-white/10 border border-white/20 text-white font-black text-lg w-12 h-12 rounded-xl flex items-center justify-center">
                #{r.rank}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard
          icon={HiClipboardDocumentList}
          label="Total Booking"
          value={bookings.length}
          accent="blue"
          delay={0}
        />
        <StatCard
          icon={HiStar}
          label="Skor AHP"
          value={r?.skorAHP?.toFixed(3) || "0.000"}
          accent="amber"
          delay={0.05}
        />
        <StatCard
          icon={HiTrophy}
          label="Ranking"
          value={r?.rank ? `#${r.rank}` : "-"}
          accent="purple"
          delay={0.1}
        />
        <StatCard
          icon={HiUsers}
          label="Cabang Olahraga"
          value={p?.cabang?.nama_cabor || "-"}
          accent="teal"
          delay={0.15}
        />
      </div>

      {/* ── 3-col Info ── */}
      <div className="grid lg:grid-cols-3 gap-4 mb-5">
        {/* Data Profil */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-sm text-slate-800">Data Profil</h3>
            <span className="text-[10px] text-slate-300 font-medium uppercase tracking-wide">
              Info
            </span>
          </div>
          {p ? (
            <div className="space-y-0">
              {[
                ["Nama", p.nama],
                ["Cabor", p.cabang?.nama_cabor || "-"],
                ["Pengalaman", SKALA[p.pengalaman] || "-"],
                ["Lisensi", LISENSI[p.lisensi] || "-"],
                ["Prestasi", SKALA[p.prestasi] || "-"],
                ["Biaya", `Skala ${p.biaya}/5`],
                ["Status", null],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0"
                >
                  <span className="text-xs text-slate-400 font-medium">
                    {k}
                  </span>
                  {k === "Status" ? (
                    <StatusBadge status={p.status_verifikasi || "pending"} />
                  ) : (
                    <span className="text-xs font-semibold text-slate-700">
                      {v}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">
              Data profil tidak ditemukan
            </p>
          )}
        </motion.div>

        {/* Skor AHP */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-sm text-slate-800">Skor AHP</h3>
            <span className="text-[10px] text-slate-300 font-medium uppercase tracking-wide">
              Analitik
            </span>
          </div>
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#F1F5F9"
                  strokeWidth="7"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#ahpGrad)"
                  strokeWidth="7"
                  strokeDasharray={`${(r?.skorAHP || 0) * 251.2} 251.2`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="ahpGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-black text-xl text-slate-800 leading-none">
                  {r?.skorAHP?.toFixed(2) || "0.00"}
                </span>
                <span className="text-[9px] text-slate-400 mt-0.5 font-medium">
                  AHP Score
                </span>
              </div>
            </div>
            {r?.rank && (
              <p className="text-sm font-black text-amber-500 mt-2">
                🏆 Ranking #{r.rank}
              </p>
            )}
          </div>
          <div className="space-y-3">
            {bobotDisplay.map((k, i) => (
              <AHPBar key={i} {...k} delay={0.5 + i * 0.1} />
            ))}
          </div>
        </motion.div>

        {/* Notifikasi */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <HiBell className="w-4 h-4 text-slate-300" /> Notifikasi
            </h3>
            {notifs.length > 0 && (
              <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {notifs.length}
              </span>
            )}
          </div>
          {notifs.length > 0 ? (
            notifs.map((n, i) => <NotifItem key={i} {...n} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-3">
                <HiBell className="w-5 h-5 text-slate-200" />
              </div>
              <p className="text-sm text-slate-400">Tidak ada notifikasi</p>
            </div>
          )}
          {!isVerified && p && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                <HiExclamationTriangle className="w-3.5 h-3.5" /> Menunggu
                verifikasi admin
              </p>
              <p className="text-[11px] text-amber-500 mt-0.5">
                Proses membutuhkan 1–3 hari kerja
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Jadwal Sesi (calendar, synced with jadwalList) ── */}
      <div className="mb-5">
        <JadwalSection bookings={bookings} jadwalList={jadwal} />
      </div>

      {/* ── Booking Terbaru ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800">Booking Terbaru</h3>
          {bookings.length > 5 && (
            <button className="text-xs text-blue-500 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Lihat semua <HiChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {bookings.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {bookings.slice(0, 5).map((b, i) => (
              <motion.div
                key={b.booking_id || b.pemesanan_id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-xs font-black">
                    {(b.userName || b.user?.nama || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {b.userName || b.user?.nama || "-"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {b.tanggal
                        ? new Date(b.tanggal).toLocaleDateString("id-ID", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </p>
                  </div>
                </div>
                <StatusBadge status={b.status} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-3">
              <HiClipboardDocumentList className="w-6 h-6 text-slate-200" />
            </div>
            <p className="text-sm text-slate-400 font-medium">
              Belum ada booking
            </p>
            <p className="text-xs text-slate-300 mt-1">
              Booking dari atlet akan muncul di sini
            </p>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
