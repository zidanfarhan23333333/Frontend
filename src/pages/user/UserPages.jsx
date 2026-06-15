import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiMagnifyingGlass,
  HiAdjustmentsHorizontal,
  HiStar,
  HiMapPin,
  HiClock,
  HiArrowLeft,
  HiHeart,
  HiCheckBadge,
  HiCalendarDays,
  HiArrowUpRight,
  HiTrophy,
  HiFire,
  HiXMark,
  HiChevronRight,
  HiBolt,
  HiUserGroup,
  HiSparkles,
} from "react-icons/hi2";
import UserLayout from "../../components/layout/UserLayout";
import Avatar from "../../components/ui/Avatar";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import clsx from "clsx";

const sf = { fontFamily: "var(--font-sf)" };

const formatRp = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

const BIAYA_LABEL = {
  1: "< Rp50.000",
  2: "Rp50.000 – Rp150.000",
  3: "Rp150.000 – Rp300.000",
  4: "Rp300.000 – Rp500.000",
  5: "> Rp500.000",
};

function tampilkanHarga(coach) {
  if (coach.harga_min && coach.harga_max)
    return `${formatRp(coach.harga_min)} – ${formatRp(coach.harga_max)}`;
  if (coach.harga_min) return `ab ${formatRp(coach.harga_min)}`;
  return BIAYA_LABEL[coach.biaya] || "-";
}

const BOBOT = { pengalaman: 0.35, lisensi: 0.25, prestasi: 0.25, biaya: 0.15 };

function hitungSkorAHP(pelatihList) {
  if (!pelatihList.length) return [];
  const max = {
    pengalaman: Math.max(...pelatihList.map((p) => p.pengalaman)) || 1,
    lisensi: Math.max(...pelatihList.map((p) => p.lisensi)) || 1,
    prestasi: Math.max(...pelatihList.map((p) => p.prestasi)) || 1,
    biaya: Math.max(...pelatihList.map((p) => p.biaya)) || 1,
  };
  return pelatihList
    .map((p) => ({
      ...p,
      id: p.pelatih_id,
      cabor: p.cabang?.nama_cabor || "-",
      initials: p.nama?.slice(0, 2).toUpperCase(),
      skorAHP: parseFloat(
        (
          BOBOT.pengalaman * (p.pengalaman / max.pengalaman) +
          BOBOT.lisensi * (p.lisensi / max.lisensi) +
          BOBOT.prestasi * (p.prestasi / max.prestasi) +
          BOBOT.biaya * (p.biaya / max.biaya)
        ).toFixed(4),
      ),
      rating: p.rating ?? 0,
      totalBooking: p.totalBooking ?? 0,
      lokasi: p.domisili || p.lokasi || "-",
      harga_min: p.harga_min || null,
      harga_max: p.harga_max || null,
      color:
        CABOR_COLORS[p.cabang?.nama_cabor] || "from-blue-400 to-indigo-500",
      accent: CABOR_ACCENT[p.cabang?.nama_cabor] || {
        bar: "bg-indigo-500",
        light: "bg-indigo-50 text-indigo-700",
      },
    }))
    .sort((a, b) => b.skorAHP - a.skorAHP)
    .map((p, i) => ({ ...p, ranking: i + 1 }));
}

const CABOR_COLORS = {
  Badminton: "from-emerald-400 to-teal-500",
  "Bulu Tangkis": "from-emerald-400 to-teal-500",
  Renang: "from-blue-400 to-cyan-500",
  Basket: "from-orange-400 to-red-500",
  "Sepak Bola": "from-green-500 to-emerald-700",
  Voli: "from-yellow-400 to-amber-500",
  Karate: "from-red-500 to-rose-600",
};

const CABOR_ACCENT = {
  Badminton: { bar: "bg-emerald-500", light: "bg-emerald-50 text-emerald-700" },
  "Sepak Bola": { bar: "bg-blue-500", light: "bg-blue-50 text-blue-700" },
  Renang: { bar: "bg-cyan-500", light: "bg-cyan-50 text-cyan-700" },
  Basket: { bar: "bg-orange-500", light: "bg-orange-50 text-orange-700" },
  Voli: { bar: "bg-amber-500", light: "bg-amber-50 text-amber-700" },
};

const HARI_ORDER = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];
const HARI_COLOR = {
  Senin: "bg-blue-50 text-blue-600 border border-blue-100",
  Selasa: "bg-violet-50 text-violet-600 border border-violet-100",
  Rabu: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  Kamis: "bg-amber-50 text-amber-600 border border-amber-100",
  Jumat: "bg-orange-50 text-orange-600 border border-orange-100",
  Sabtu: "bg-pink-50 text-pink-600 border border-pink-100",
  Minggu: "bg-red-50 text-red-600 border border-red-100",
};

// ─── Helper: resolve foto URL ─────────────────────────────────────────────────
const fotoUrl = (foto) => (foto ? `http://localhost:3000${foto}` : null);

// ─── CoachAvatar: reusable foto-or-initials avatar ───────────────────────────
function CoachAvatar({ foto, initials, accentLight, size = "md" }) {
  const sizeMap = {
    sm: "w-8 h-8 text-[11px]",
    md: "w-10 h-10 text-[13px]",
    lg: "w-12 h-12 text-[16px]",
    xl: "w-14 h-14 text-[18px]",
  };
  const url = fotoUrl(foto);
  return (
    <div
      className={clsx(
        "rounded-xl flex items-center justify-center font-bold flex-shrink-0 overflow-hidden",
        sizeMap[size],
        !url && accentLight,
      )}
    >
      {url ? (
        <img src={url} alt={initials} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

// ─── Status Pill ──────────────────────────────────────────────────────────────
function StatusPill({ status }) {
  const map = {
    konfirmasi: { label: "Aktif", cls: "bg-blue-50 text-blue-600", dot: true },
    confirmed: { label: "Aktif", cls: "bg-blue-50 text-blue-600", dot: true },
    pending: {
      label: "Pending",
      cls: "bg-amber-50 text-amber-600",
      dot: false,
    },
    completed: {
      label: "Selesai",
      cls: "bg-slate-100 text-slate-500",
      dot: false,
    },
    dibatalkan: { label: "Batal", cls: "bg-red-50 text-red-500", dot: false },
  };
  const s = map[status] || map.pending;
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold",
        s.cls,
      )}
    >
      {s.dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
      )}
      {s.label}
    </span>
  );
}

// ─── Jadwal Tersedia ──────────────────────────────────────────────────────────
function JadwalTersediaSection({ pelatihId, api }) {
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pelatihId) return;
    api
      .get(`/api/pelatih/jadwal/publik/${pelatihId}`)
      .then((res) => {
        const raw = res.data.data || res.data || [];
        const available = (Array.isArray(raw) ? raw : []).filter(
          (j) => j.status === "available",
        );
        setJadwal(
          available.sort(
            (a, b) => HARI_ORDER.indexOf(a.hari) - HARI_ORDER.indexOf(b.hari),
          ),
        );
      })
      .catch(() => setJadwal([]))
      .finally(() => setLoading(false));
  }, [pelatihId]);

  if (loading)
    return (
      <div className="flex items-center gap-2 text-[#aeaeb2] text-[13px] py-4">
        <div className="w-4 h-4 border-2 border-[#d0d0d0] border-t-transparent rounded-full animate-spin" />
        Memuat jadwal...
      </div>
    );

  if (!jadwal.length)
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <div className="w-12 h-12 bg-[#f5f5f7] rounded-2xl flex items-center justify-center mb-3">
          <HiCalendarDays className="w-6 h-6 text-[#d0d0d0]" />
        </div>
        <p className="text-[13px] text-[#aeaeb2] font-medium">
          Belum ada jadwal
        </p>
        <p className="text-[11px] text-[#c8c8c8] mt-0.5">
          Pelatih belum menambahkan jadwal sesi
        </p>
      </div>
    );

  const grouped = HARI_ORDER.reduce((acc, hari) => {
    const items = jadwal.filter((j) => j.hari === hari);
    if (items.length) acc[hari] = items;
    return acc;
  }, {});

  return (
    <div className="space-y-3">
      {Object.entries(grouped).map(([hari, items], gi) => (
        <motion.div
          key={hari}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: gi * 0.05 }}
        >
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-2 ${HARI_COLOR[hari]}`}
          >
            {hari}
          </span>
          <div className="space-y-1.5">
            {items.map((j) => (
              <div
                key={j.jadwal_id}
                className="flex items-center gap-3 bg-[#f5f5f7] rounded-xl px-3 py-2.5"
              >
                <HiClock className="w-3.5 h-3.5 text-[#aeaeb2] flex-shrink-0" />
                <span className="text-[13px] font-semibold text-[#0a0a0a]">
                  {j.jam_mulai} – {j.jam_selesai}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#aeaeb2] ml-auto">
                  <HiMapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate max-w-[120px]">{j.lokasi}</span>
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Jadwal Panel (booking sidebar) ──────────────────────────────────────────
function JadwalBookingPanel({ pelatihId, api }) {
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pelatihId) return;
    api
      .get(`/api/pelatih/jadwal/publik/${pelatihId}`)
      .then((res) => {
        const raw = res.data.data || res.data || [];
        setJadwal(
          (Array.isArray(raw) ? raw : []).filter(
            (j) => j.status === "available",
          ),
        );
      })
      .catch(() => setJadwal([]))
      .finally(() => setLoading(false));
  }, [pelatihId]);

  if (loading)
    return (
      <div className="flex justify-center py-4">
        <div className="w-4 h-4 border-2 border-[#d0d0d0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (!jadwal.length)
    return (
      <p className="text-[12px] text-[#aeaeb2] text-center py-4">
        Belum ada jadwal
      </p>
    );

  return (
    <div className="space-y-1.5">
      {jadwal.slice(0, 5).map((j) => (
        <div
          key={j.jadwal_id}
          className="flex items-center gap-2 px-3 py-2 bg-[#f5f5f7] rounded-xl"
        >
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${HARI_COLOR[j.hari]}`}
          >
            {j.hari}
          </span>
          <span className="text-[12px] font-semibold text-[#0a0a0a]">
            {j.jam_mulai}–{j.jam_selesai}
          </span>
          <span className="text-[11px] text-[#aeaeb2] ml-auto truncate max-w-[80px]">
            {j.lokasi}
          </span>
        </div>
      ))}
      {jadwal.length > 5 && (
        <p className="text-[11px] text-[#aeaeb2] text-center">
          +{jadwal.length - 5} jadwal lainnya
        </p>
      )}
    </div>
  );
}

// ─── Coach Card ───────────────────────────────────────────────────────────────
function CoachCard({ coach, delay = 0, onFav, isFav }) {
  const accent = coach.accent || {
    bar: "bg-indigo-500",
    light: "bg-indigo-50 text-indigo-700",
  };
  const ahpPct = (coach.skorAHP ?? 0) * 100;
  const pengalamanPct = ((coach.pengalaman ?? 0) / 5) * 100;
  const lisensiPct = ((coach.lisensi ?? 0) / 5) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.25 }}
      className="bg-white rounded-2xl overflow-hidden border border-[#f0f0f0] hover:border-[#d0d0d0] hover:shadow-md transition-all duration-200"
      style={sf}
    >
      {/* Accent bar top */}
      <div className={clsx("h-1 w-full", accent.bar)} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* ── Avatar dengan foto support ── */}
            <CoachAvatar
              foto={coach.foto}
              initials={coach.initials}
              accentLight={accent.light}
              size="md"
            />
            <div>
              <p className="text-[14px] font-semibold text-[#0a0a0a] leading-tight">
                {coach.nama?.split(" ").slice(0, 2).join(" ")}
              </p>
              <p className="text-[12px] text-[#aeaeb2] mt-0.5 flex items-center gap-1">
                <HiMapPin className="w-3 h-3 flex-shrink-0" />
                {coach.cabor} · {coach.lokasi}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              onFav?.(coach.id);
            }}
            className={clsx(
              "w-7 h-7 rounded-full flex items-center justify-center transition-all flex-shrink-0",
              isFav
                ? "bg-red-500 text-white"
                : "bg-[#f5f5f7] text-[#aeaeb2] hover:bg-red-500 hover:text-white",
            )}
          >
            <HiHeart className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress bars */}
        <div className="space-y-2.5 mb-4">
          {[
            {
              label: "Skor AHP",
              value: (coach.skorAHP ?? 0).toFixed(2),
              pct: ahpPct,
            },
            {
              label: "Pengalaman",
              value: `${coach.pengalaman}/5`,
              pct: pengalamanPct,
            },
            { label: "Lisensi", value: `${coach.lisensi}/5`, pct: lisensiPct },
          ].map(({ label, value, pct }, i) => (
            <div key={label}>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[#aeaeb2]">{label}</span>
                <span className="font-semibold text-[#0a0a0a]">{value}</span>
              </div>
              <div className="h-1.5 bg-[#f5f5f7] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: delay + 0.2 + i * 0.05, duration: 0.6 }}
                  className={clsx(
                    "h-full rounded-full",
                    accent.bar,
                    i > 0 && "opacity-60",
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#f5f5f7]">
          <div>
            <p className="text-[14px] font-bold text-[#0a0a0a] tracking-[-0.3px]">
              {tampilkanHarga(coach)}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-0.5 text-[11px] text-[#aeaeb2]">
                <HiStar className="w-3 h-3 text-amber-400" />{" "}
                {coach.rating ?? "-"}
              </span>
              <span className="text-[#e5e5ea]">·</span>
              <span className="flex items-center gap-0.5 text-[11px] text-[#aeaeb2]">
                <HiTrophy className="w-3 h-3" /> Ranking #{coach.ranking}
              </span>
            </div>
          </div>
          <Link
            to={`/user/detail/${coach.id}`}
            className="w-8 h-8 rounded-xl bg-[#0a0a0a] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
          >
            <HiArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════
// USER DASHBOARD
// ══════════════════════════════════════════
export function UserDashboard() {
  const { user, api } = useAuth();
  const [coaches, setCoaches] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [caborList, setCaborList] = useState([]);
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleFav = (id) =>
    setFavs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  useEffect(() => {
    Promise.all([
      api.get("/api/pelatih").catch(() => null),
      api.get("/api/user/bookings").catch(() => null),
      api.get("/api/user/stats").catch(() => null),
      api.get("/api/cabor").catch(() => null),
    ])
      .then(([pelatihRes, bookingRes, statsRes, caborRes]) => {
        const rawPelatih = pelatihRes?.data?.data || pelatihRes?.data || [];
        const list = Array.isArray(rawPelatih)
          ? rawPelatih
          : rawPelatih.pelatih || [];
        setCoaches(
          hitungSkorAHP(
            list.filter((p) => p.status_verifikasi === "terverifikasi"),
          ),
        );
        const rawBooking = bookingRes?.data?.data || bookingRes?.data || [];
        setBookings(
          Array.isArray(rawBooking) ? rawBooking : rawBooking.bookings || [],
        );
        setStats(statsRes?.data?.data || statsRes?.data || null);
        const rawCabor = caborRes?.data?.data || caborRes?.data || [];
        setCaborList(Array.isArray(rawCabor) ? rawCabor : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const s = stats || {
    totalBooking: 0,
    bookingAktif: 0,
    pelatihFavorit: 0,
    totalPengeluaran: 0,
  };
  const activeBookings = bookings.filter((b) =>
    ["pending", "konfirmasi", "confirmed"].includes(b.status),
  );

  const statCards = [
    {
      label: "Total Booking",
      value: s.totalBooking || bookings.length,
      icon: HiCalendarDays,
      color: "text-blue-500",
      bg: "bg-blue-50",
      bars: [40, 55, 70, 60, 80, 100],
    },
    {
      label: "Booking Aktif",
      value: s.bookingAktif || activeBookings.length,
      icon: HiBolt,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      bars: [30, 50, 65, 80, 100, 90],
    },
    {
      label: "Pelatih Favorit",
      value: s.pelatihFavorit || favs.length,
      icon: HiHeart,
      color: "text-red-400",
      bg: "bg-red-50",
      bars: [20, 40, 55, 70, 85, 100],
    },
    {
      label: "Pengeluaran",
      value: formatRp(s.totalPengeluaran),
      icon: HiSparkles,
      color: "text-amber-500",
      bg: "bg-amber-50",
      bars: [50, 60, 75, 80, 90, 100],
    },
  ];

  return (
    <UserLayout>
      <div className="flex h-full" style={sf}>
        {/* Main */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[13px] text-[#aeaeb2]">
                Selamat datang kembali
              </p>
              <h1 className="text-[26px] font-bold text-[#0a0a0a] tracking-[-0.5px] mt-0.5">
                {user?.nama?.split(" ")[0] || "Atlet"} 👋
              </h1>
            </div>
            <Link
              to="/user/cari-pelatih"
              className="hidden sm:flex items-center gap-2 bg-[#0a0a0a] text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
            >
              <HiMagnifyingGlass className="w-4 h-4" /> Cari Pelatih
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {statCards.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl p-4 border border-[#f0f0f0]"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={clsx(
                      "w-7 h-7 rounded-lg flex items-center justify-center",
                      s.bg,
                    )}
                  >
                    <s.icon className={clsx("w-4 h-4", s.color)} />
                  </div>
                  <span className="text-[12px] text-[#aeaeb2]">{s.label}</span>
                </div>
                <p
                  className={clsx(
                    "text-[26px] font-bold tracking-[-0.5px]",
                    s.color,
                  )}
                >
                  {s.value}
                </p>
                {/* Mini bar chart */}
                <div className="flex items-end gap-[3px] h-7 mt-3">
                  {s.bars.map((h, bi) => (
                    <div
                      key={bi}
                      className={clsx(
                        "flex-1 rounded-sm",
                        s.color.replace("text-", "bg-"),
                      )}
                      style={{
                        height: `${h}%`,
                        opacity: 0.5 + (bi / s.bars.length) * 0.5,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Kategori */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[15px] font-semibold text-[#0a0a0a] tracking-[-0.2px]">
                Kategori
              </h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                "Semua",
                ...caborList.slice(0, 5).map((c) => c.nama_cabor || c.nama),
              ].map((c, i) => (
                <Link
                  key={c}
                  to={`/user/cari-pelatih${i > 0 ? `?cabor=${encodeURIComponent(c)}` : ""}`}
                  className={clsx(
                    "px-4 py-2 rounded-full text-[12px] font-medium transition-all border",
                    i === 0
                      ? "bg-[#0a0a0a] text-white border-transparent"
                      : "bg-white text-[#6e6e73] border-[#f0f0f0] hover:border-[#d0d0d0]",
                  )}
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>

          {/* Rekomendasi */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[15px] font-semibold text-[#0a0a0a] tracking-[-0.2px]">
                  Rekomendasi Pelatih
                </h2>
                <p className="text-[12px] text-[#aeaeb2] mt-0.5">
                  Berdasarkan skor AHP tertinggi
                </p>
              </div>
              <Link
                to="/user/cari-pelatih"
                className="text-[13px] text-[#6e6e73] hover:text-[#0a0a0a] flex items-center gap-0.5 transition-colors"
              >
                Lihat semua <HiChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl h-52 border border-[#f0f0f0] animate-pulse"
                  />
                ))}
              </div>
            ) : coaches.length === 0 ? (
              <div className="text-center py-12 bg-[#f5f5f7] rounded-2xl">
                <p className="text-[13px] text-[#aeaeb2]">
                  Belum ada pelatih terverifikasi
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {coaches.slice(0, 3).map((c, i) => (
                  <CoachCard
                    key={c.id}
                    coach={c}
                    delay={i * 0.08}
                    onFav={toggleFav}
                    isFav={favs.includes(c.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Promo */}
          <div className="rounded-2xl bg-[#0a0a0a] p-6 flex items-center justify-between relative overflow-hidden">
            <div className="absolute right-6 text-6xl opacity-10 select-none">
              🏆
            </div>
            <div>
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-1">
                Promo Bulan Ini
              </p>
              <p className="text-[22px] font-bold text-white tracking-[-0.5px] leading-tight">
                Pelatih Premium
                <br />
                Diskon 20%
              </p>
            </div>
            <Link
              to="/user/cari-pelatih"
              className="bg-white text-[#0a0a0a] text-[13px] font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap flex-shrink-0 ml-4"
            >
              Cari Sekarang →
            </Link>
          </div>
        </div>

        {/* Right panel */}
        <div className="hidden xl:flex w-72 flex-col bg-white border-l border-[#f0f0f0] overflow-y-auto flex-shrink-0">
          <div className="p-5">
            {/* Booking Aktif */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[12px] font-semibold text-[#aeaeb2] uppercase tracking-wider">
                  Booking Aktif
                </h3>
                <Link
                  to="/user/riwayat"
                  className="text-[11px] text-blue-600 font-semibold"
                >
                  Lihat semua
                </Link>
              </div>
              {activeBookings.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-10 h-10 bg-[#f5f5f7] rounded-xl flex items-center justify-center mx-auto mb-2">
                    <HiCalendarDays className="w-5 h-5 text-[#d0d0d0]" />
                  </div>
                  <p className="text-[12px] text-[#aeaeb2]">
                    Tidak ada booking aktif
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeBookings.slice(0, 3).map((b, i) => {
                    const namaPelatih = b.pelatih?.nama || b.pelatihNama || "-";
                    const fotoPelatih = b.pelatih?.foto || null;
                    const cabor = b.cabang?.nama_cabor || b.cabor || "-";
                    const accent = CABOR_ACCENT[cabor] || {
                      bar: "bg-indigo-500",
                      light: "bg-indigo-50 text-indigo-700",
                    };
                    return (
                      <motion.div
                        key={b.pemesanan_id || b.id}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-3 p-3 rounded-xl border border-[#f0f0f0] hover:border-[#e0e0e0] transition-colors"
                      >
                        {/* ── Avatar booking aktif ── */}
                        <CoachAvatar
                          foto={fotoPelatih}
                          initials={namaPelatih.slice(0, 2).toUpperCase()}
                          accentLight={accent.light}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[#0a0a0a] truncate">
                            {namaPelatih.split(" ")[0]}
                          </p>
                          <p className="text-[11px] text-[#aeaeb2] flex items-center gap-1 mt-0.5">
                            <HiCalendarDays className="w-3 h-3" />
                            {b.tanggal
                              ? new Date(b.tanggal).toLocaleDateString(
                                  "id-ID",
                                  { day: "numeric", month: "short" },
                                )
                              : "-"}
                          </p>
                        </div>
                        <StatusPill status={b.status} />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Top Pelatih */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[12px] font-semibold text-[#aeaeb2] uppercase tracking-wider">
                  Top Pelatih
                </h3>
                <Link
                  to="/user/cari-pelatih"
                  className="text-[11px] text-blue-600 font-semibold"
                >
                  Lihat semua
                </Link>
              </div>
              <div className="space-y-1">
                {coaches.slice(0, 4).map((p, i) => {
                  const accent = p.accent || {
                    bar: "bg-indigo-500",
                    light: "bg-indigo-50 text-indigo-700",
                  };
                  return (
                    <Link
                      key={p.id}
                      to={`/user/detail/${p.id}`}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#f5f5f7] transition-colors"
                    >
                      {/* ── Avatar top pelatih ── */}
                      <CoachAvatar
                        foto={p.foto}
                        initials={p.initials}
                        accentLight={accent.light}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#0a0a0a] truncate">
                          {p.nama?.split(" ")[0]}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="h-1 flex-1 bg-[#f0f0f0] rounded-full overflow-hidden">
                            <div
                              className={clsx(
                                "h-full rounded-full",
                                accent.bar,
                              )}
                              style={{ width: `${p.skorAHP * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-[#aeaeb2] flex-shrink-0">
                            {p.skorAHP.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] text-[#aeaeb2] flex-shrink-0">
                        #{i + 1}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

// ══════════════════════════════════════════
// CARI PELATIH
// ══════════════════════════════════════════
export function UserCariPelatih() {
  const { api } = useAuth();
  const [allCoaches, setAllCoaches] = useState([]);
  const [caborList, setCaborList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cabor, setCabor] = useState("Semua");
  const [sort, setSort] = useState("ahp");
  const [maxBiayaSkala, setMaxBiayaSkala] = useState(5);
  const [view, setView] = useState("grid");
  const [favs, setFavs] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const toggleFav = (id) =>
    setFavs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  useEffect(() => {
    Promise.all([api.get("/api/pelatih"), api.get("/api/cabor")])
      .then(([pelatihRes, caborRes]) => {
        const raw = pelatihRes?.data?.data || pelatihRes?.data || [];
        const list = Array.isArray(raw) ? raw : raw.pelatih || [];
        setAllCoaches(
          hitungSkorAHP(
            list.filter((p) => p.status_verifikasi === "terverifikasi"),
          ),
        );
        const rawCabor = caborRes?.data?.data || caborRes?.data || [];
        setCaborList(Array.isArray(rawCabor) ? rawCabor : []);
      })
      .catch(() => toast.error("Gagal memuat data pelatih"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...allCoaches];
    if (search)
      list = list.filter(
        (p) =>
          p.nama?.toLowerCase().includes(search.toLowerCase()) ||
          p.cabor?.toLowerCase().includes(search.toLowerCase()) ||
          p.domisili?.toLowerCase().includes(search.toLowerCase()),
      );
    if (cabor !== "Semua") list = list.filter((p) => p.cabor === cabor);
    list = list.filter((p) => p.biaya <= maxBiayaSkala);
    if (sort === "ahp") return list.sort((a, b) => b.skorAHP - a.skorAHP);
    if (sort === "rating")
      return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    if (sort === "harga-asc") return list.sort((a, b) => a.biaya - b.biaya);
    if (sort === "harga-desc") return list.sort((a, b) => b.biaya - a.biaya);
    return list;
  }, [allCoaches, search, cabor, sort, maxBiayaSkala]);

  return (
    <UserLayout
      title="Cari Pelatih"
      subtitle={`${filtered.length} pelatih ditemukan`}
    >
      <div className="p-6 lg:p-8" style={sf}>
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-2 mb-5">
          <div className="relative flex-1">
            <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aeaeb2]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pelatih atau cabang olahraga..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#f0f0f0] text-[13px] text-[#0a0a0a] placeholder-[#aeaeb2] focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] focus:border-transparent transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <HiXMark className="w-4 h-4 text-[#aeaeb2]" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium border transition-all",
              showFilter
                ? "bg-[#0a0a0a] text-white border-transparent"
                : "bg-white text-[#6e6e73] border-[#f0f0f0] hover:border-[#d0d0d0]",
            )}
          >
            <HiAdjustmentsHorizontal className="w-4 h-4" /> Filter
          </button>
          <div className="flex bg-white border border-[#f0f0f0] rounded-xl overflow-hidden">
            {["grid", "list"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={clsx(
                  "px-4 py-2.5 text-[13px] font-medium transition-colors",
                  view === v
                    ? "bg-[#0a0a0a] text-white"
                    : "text-[#aeaeb2] hover:text-[#0a0a0a]",
                )}
              >
                {v === "grid" ? "⊞" : "≡"}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#f0f0f0] text-[13px] text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] cursor-pointer"
          >
            <option value="ahp">Skor AHP Tertinggi</option>
            <option value="rating">Rating Tertinggi</option>
            <option value="harga-asc">Harga Terendah</option>
            <option value="harga-desc">Harga Tertinggi</option>
          </select>
        </div>

        <AnimatePresence>
          {showFilter && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-5"
            >
              <div className="bg-white rounded-2xl p-5 border border-[#f0f0f0]">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aeaeb2] mb-2">
                      Biaya Maksimal
                    </p>
                    <p className="text-[14px] font-semibold text-[#0a0a0a] mb-2">
                      {BIAYA_LABEL[maxBiayaSkala]}
                    </p>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={maxBiayaSkala}
                      onChange={(e) => setMaxBiayaSkala(Number(e.target.value))}
                      className="w-full accent-[#0a0a0a]"
                    />
                    <div className="flex justify-between text-[11px] text-[#aeaeb2] mt-1">
                      <span>{"< Rp50rb"}</span>
                      <span>{"> Rp500rb"}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aeaeb2] mb-2">
                      Urutkan
                    </p>
                    <div className="space-y-1">
                      {[
                        ["ahp", "Skor AHP Tertinggi"],
                        ["rating", "Rating Tertinggi"],
                        ["harga-asc", "Harga Terendah"],
                        ["harga-desc", "Harga Tertinggi"],
                      ].map(([v, l]) => (
                        <button
                          key={v}
                          onClick={() => setSort(v)}
                          className={clsx(
                            "w-full text-left text-[12px] px-3 py-2 rounded-lg transition-colors font-medium",
                            sort === v
                              ? "bg-[#0a0a0a] text-white"
                              : "text-[#6e6e73] hover:bg-[#f5f5f7]",
                          )}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-5">
          {["Semua", ...caborList.map((c) => c.nama_cabor || c.nama)].map(
            (c, i) => (
              <button
                key={c}
                onClick={() => setCabor(c)}
                className={clsx(
                  "whitespace-nowrap px-4 py-2 rounded-full text-[12px] font-medium flex-shrink-0 transition-all border",
                  cabor === c
                    ? "bg-[#0a0a0a] text-white border-transparent"
                    : "bg-white text-[#6e6e73] border-[#f0f0f0] hover:border-[#d0d0d0]",
                )}
              >
                {c}
              </button>
            ),
          )}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-52 border border-[#f0f0f0] animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 bg-[#f5f5f7] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HiMagnifyingGlass className="w-7 h-7 text-[#aeaeb2]" />
            </div>
            <p className="text-[15px] font-semibold text-[#aeaeb2]">
              Pelatih tidak ditemukan
            </p>
          </div>
        ) : view === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((c, i) => (
              <CoachCard
                key={c.id}
                coach={c}
                delay={i * 0.04}
                onFav={toggleFav}
                isFav={favs.includes(c.id)}
              />
            ))}
          </div>
        ) : (
          /* List view */
          <div className="space-y-2 max-w-2xl">
            {filtered.map((c, i) => {
              const accent = c.accent || {
                bar: "bg-indigo-500",
                light: "bg-indigo-50 text-indigo-700",
              };
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-xl border border-[#f0f0f0] p-4 flex items-center gap-4 hover:border-[#d0d0d0] transition-colors"
                >
                  {/* ── Avatar list view ── */}
                  <CoachAvatar
                    foto={c.foto}
                    initials={c.initials}
                    accentLight={accent.light}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[#0a0a0a]">
                      {c.nama?.split(" ").slice(0, 2).join(" ")}
                    </p>
                    <p className="text-[12px] text-[#aeaeb2]">
                      {c.cabor} · {c.lokasi}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-1.5 w-24 bg-[#f5f5f7] rounded-full overflow-hidden">
                        <div
                          className={clsx("h-full rounded-full", accent.bar)}
                          style={{ width: `${(c.skorAHP ?? 0) * 100}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-[#aeaeb2]">
                        {(c.skorAHP ?? 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[14px] font-bold text-[#0a0a0a]">
                      {tampilkanHarga(c)}
                    </p>
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                      <HiStar className="w-3 h-3 text-amber-400" />
                      <span className="text-[12px] text-[#aeaeb2]">
                        {c.rating ?? "-"}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/user/detail/${c.id}`}
                    className="w-8 h-8 rounded-xl bg-[#0a0a0a] flex items-center justify-center text-white hover:opacity-80 transition-opacity flex-shrink-0"
                  >
                    <HiArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </UserLayout>
  );
}

// ══════════════════════════════════════════
// DETAIL PELATIH
// ══════════════════════════════════════════
export function UserDetailPelatih() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api } = useAuth();
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/api/pelatih/${id}`),
      api.get("/api/pelatih").catch(() => null),
    ])
      .then(([detailRes, allRes]) => {
        const raw = detailRes?.data?.data || detailRes?.data;
        const allRaw = allRes?.data?.data || allRes?.data || [];
        const allList = Array.isArray(allRaw) ? allRaw : allRaw.pelatih || [];
        const withScores = hitungSkorAHP(
          allList.filter((p) => p.status_verifikasi === "terverifikasi"),
        );
        const fromList = withScores.find((p) => p.id === parseInt(id));
        const enriched = fromList
          ? {
              id: fromList.id,
              pelatih_id: fromList.id,
              nama: raw?.nama || fromList.nama,
              foto: raw?.foto || fromList.foto || null,
              cabor: raw?.cabang?.nama_cabor || fromList.cabor,
              color: CABOR_COLORS[raw?.cabang?.nama_cabor] || fromList.color,
              accent: CABOR_ACCENT[raw?.cabang?.nama_cabor] || fromList.accent,
              initials:
                raw?.nama?.slice(0, 2).toUpperCase() || fromList.initials,
              skorAHP: fromList.skorAHP,
              ranking: fromList.ranking,
              lokasi: raw?.domisili || raw?.lokasi || fromList.lokasi || "-",
              deskripsi: raw?.deskripsi || null,
              spesialis: raw?.spesialis || null,
              domisili: raw?.domisili || null,
              pengalaman_melatih: raw?.pengalaman_melatih || null,
              harga_min: raw?.harga_min || null,
              harga_max: raw?.harga_max || null,
              status_verifikasi:
                raw?.status_verifikasi || fromList.status_verifikasi,
              pengalaman: raw?.pengalaman ?? fromList.pengalaman,
              lisensi: raw?.lisensi ?? fromList.lisensi,
              prestasi: raw?.prestasi ?? fromList.prestasi,
              biaya: raw?.biaya ?? fromList.biaya,
              rating: raw?.rating ?? fromList.rating ?? 0,
              totalBooking: raw?.totalBooking ?? fromList.totalBooking ?? 0,
            }
          : {
              ...raw,
              id: raw?.pelatih_id,
              pelatih_id: raw?.pelatih_id,
              foto: raw?.foto || null,
              cabor: raw?.cabang?.nama_cabor || "-",
              initials: raw?.nama?.slice(0, 2).toUpperCase(),
              skorAHP: 0,
              ranking: "-",
              lokasi: raw?.domisili || raw?.lokasi || "-",
              color:
                CABOR_COLORS[raw?.cabang?.nama_cabor] ||
                "from-blue-400 to-indigo-500",
              accent: CABOR_ACCENT[raw?.cabang?.nama_cabor] || {
                bar: "bg-indigo-500",
                light: "bg-indigo-50 text-indigo-700",
              },
            };
        setCoach(enriched);
      })
      .catch(() => toast.error("Gagal memuat detail pelatih"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
        </div>
      </UserLayout>
    );
  if (!coach)
    return (
      <UserLayout title="Tidak Ditemukan">
        <div className="p-8">
          <button onClick={() => navigate(-1)} className="btn-secondary">
            ← Kembali
          </button>
        </div>
      </UserLayout>
    );

  const accent = coach.accent || {
    bar: "bg-indigo-500",
    light: "bg-indigo-50 text-indigo-700",
  };

  return (
    <UserLayout>
      <div className="flex h-full" style={sf}>
        <div className="flex-1 overflow-y-auto">
          {/* Hero */}
          <div
            className={clsx(
              "relative h-56 bg-gradient-to-br flex items-end",
              coach.color,
            )}
          >
            <div className="absolute inset-0 bg-black/10" />
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-5 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <HiArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFav(!fav)}
              className={clsx(
                "absolute top-4 right-5 w-9 h-9 rounded-full flex items-center justify-center transition-all",
                fav
                  ? "bg-red-500 text-white"
                  : "bg-white/20 backdrop-blur-sm text-white hover:bg-red-500",
              )}
            >
              <HiHeart className="w-4 h-4" />
            </button>
            <div className="relative px-6 pb-5 flex items-end gap-4">
              {/* ── Hero avatar ── */}
              <div
                className={clsx(
                  "w-14 h-14 rounded-2xl flex items-center justify-center text-[18px] font-bold overflow-hidden flex-shrink-0",
                  !coach.foto && accent.light,
                )}
              >
                {coach.foto ? (
                  <img
                    src={fotoUrl(coach.foto)}
                    alt={coach.nama}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  coach.initials
                )}
              </div>
              <div>
                <p className="text-white/70 text-[12px] mb-0.5">
                  {coach.cabor}
                </p>
                <h1 className="text-[24px] font-bold text-white tracking-[-0.5px]">
                  {coach.nama}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-[13px] text-white">
                    <HiStar className="w-3.5 h-3.5 text-amber-400" />{" "}
                    {coach.rating ?? "-"}
                  </span>
                  <span className="flex items-center gap-1 text-[13px] text-white/70">
                    <HiMapPin className="w-3.5 h-3.5" /> {coach.lokasi}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Quick stats */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                {
                  label: "Pengalaman",
                  value: `${coach.pengalaman} / 5`,
                  icon: HiTrophy,
                },
                {
                  label: "Total Sesi",
                  value: coach.totalBooking ?? 0,
                  icon: HiCalendarDays,
                },
                { label: "Ranking", value: `#${coach.ranking}`, icon: HiFire },
                {
                  label: "Skor AHP",
                  value: (coach.skorAHP ?? 0).toFixed(2),
                  icon: HiCheckBadge,
                },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-2xl p-4 text-center border border-[#f0f0f0]"
                >
                  <s.icon className="w-4 h-4 text-[#aeaeb2] mx-auto mb-2" />
                  <p className="text-[16px] font-bold text-[#0a0a0a] tracking-[-0.3px]">
                    {s.value}
                  </p>
                  <p className="text-[11px] text-[#aeaeb2] mt-0.5">{s.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              <div>
                <h3 className="text-[15px] font-semibold text-[#0a0a0a] mb-3 tracking-[-0.2px]">
                  Tentang Pelatih
                </h3>
                {coach.deskripsi ? (
                  <p className="text-[13px] text-[#6e6e73] leading-relaxed">
                    {coach.deskripsi}
                  </p>
                ) : (
                  <p className="text-[13px] text-[#aeaeb2] italic">
                    Belum ada deskripsi.
                  </p>
                )}
                {coach.domisili && (
                  <div className="flex items-center gap-2 mt-3 text-[13px] text-[#6e6e73]">
                    <HiMapPin className="w-4 h-4 text-[#aeaeb2] flex-shrink-0" />
                    <span>{coach.domisili}</span>
                  </div>
                )}
                {coach.spesialis && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-xl">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 mb-1">
                      Spesialis
                    </p>
                    <p className="text-[13px] text-blue-700">
                      {coach.spesialis}
                    </p>
                  </div>
                )}
                {coach.pengalaman_melatih && (
                  <div className="mt-3 p-4 bg-[#f5f5f7] rounded-xl">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aeaeb2] mb-2">
                      Pengalaman Melatih
                    </p>
                    <div className="space-y-1">
                      {coach.pengalaman_melatih
                        .split("\n")
                        .filter(Boolean)
                        .map((item, i) => (
                          <p key={i} className="text-[13px] text-[#0a0a0a]">
                            • {item}
                          </p>
                        ))}
                    </div>
                  </div>
                )}
                <div className="mt-3 p-3 bg-emerald-50 rounded-xl">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-500 mb-1">
                    {coach.harga_min && coach.harga_max
                      ? "Range Harga per Pertemuan"
                      : "Estimasi Biaya"}
                  </p>
                  <p className="text-[14px] font-bold text-emerald-700">
                    {tampilkanHarga(coach)}
                  </p>
                </div>

                {/* Progress bars AHP */}
                <div className="mt-3 p-4 bg-[#f5f5f7] rounded-xl">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aeaeb2] mb-3">
                    Kriteria AHP
                  </p>
                  <div className="space-y-2.5">
                    {[
                      {
                        label: "Pengalaman",
                        value: coach.pengalaman,
                        bobot: "35%",
                      },
                      { label: "Lisensi", value: coach.lisensi, bobot: "25%" },
                      {
                        label: "Prestasi",
                        value: coach.prestasi,
                        bobot: "25%",
                      },
                      { label: "Biaya", value: coach.biaya, bobot: "15%" },
                    ].map(({ label, value, bobot }) => (
                      <div key={label}>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-[#aeaeb2]">
                            {label}{" "}
                            <span className="text-[#c8c8c8]">({bobot})</span>
                          </span>
                          <span className="font-semibold text-[#0a0a0a]">
                            {value} / 5
                          </span>
                        </div>
                        <div className="h-1.5 bg-white rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(value / 5) * 100}%` }}
                            transition={{ duration: 0.8 }}
                            className={clsx("h-full rounded-full", accent.bar)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600">
                    Lisensi L{coach.lisensi}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600">
                    {coach.cabor}
                  </span>
                  <span
                    className={clsx(
                      "px-2.5 py-1 rounded-full text-[11px] font-semibold",
                      coach.status_verifikasi === "terverifikasi"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-500",
                    )}
                  >
                    {coach.status_verifikasi}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-[15px] font-semibold text-[#0a0a0a] mb-3 tracking-[-0.2px]">
                  Jadwal Tersedia
                </h3>
                <JadwalTersediaSection
                  pelatihId={coach.id || coach.pelatih_id}
                  api={api}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Booking panel */}
        <div className="hidden lg:flex w-72 flex-col bg-white border-l border-[#f0f0f0] flex-shrink-0">
          <div className="p-5 flex-1 overflow-y-auto">
            <div className="pb-5 border-b border-[#f0f0f0] mb-5">
              <p className="text-[11px] text-[#aeaeb2] mb-1">
                {coach.harga_min && coach.harga_max
                  ? "Range Harga per Pertemuan"
                  : "Estimasi Biaya"}
              </p>
              <p className="text-[22px] font-bold text-[#0a0a0a] tracking-[-0.5px]">
                {tampilkanHarga(coach)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <HiStar className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[13px] font-medium text-[#0a0a0a]">
                  {coach.rating ?? "-"}
                </span>
                <span className="text-[#aeaeb2] text-[13px]">
                  · {coach.totalBooking ?? 0} sesi
                </span>
              </div>
            </div>
            <div className="mb-5">
              <p className="text-[11px] font-semibold text-[#aeaeb2] uppercase tracking-wider mb-3">
                Pilih Jadwal
              </p>
              <JadwalBookingPanel
                pelatihId={coach.id || coach.pelatih_id}
                api={api}
              />
            </div>
          </div>
          <div className="p-4 border-t border-[#f0f0f0]">
            <Link
              to={`/user/booking/${coach.id}`}
              className="w-full flex items-center justify-center gap-2 bg-[#0a0a0a] text-white text-[13px] font-semibold rounded-xl py-3 hover:opacity-90 transition-opacity"
            >
              Booking Sekarang <HiArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

// ══════════════════════════════════════════
// BOOKING
// ══════════════════════════════════════════
export function UserBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, api } = useAuth();
  const [coach, setCoach] = useState(null);
  const [caborList, setCaborList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ cabor_id: "", tanggal: "", catatan: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/api/pelatih/${id}`),
      api.get("/api/cabor"),
      api.get("/api/pelatih").catch(() => null),
    ])
      .then(([detailRes, caborRes, allRes]) => {
        const raw = detailRes?.data?.data || detailRes?.data;
        const allRaw = allRes?.data?.data || allRes?.data || [];
        const allList = Array.isArray(allRaw) ? allRaw : allRaw.pelatih || [];
        const withScores = hitungSkorAHP(
          allList.filter((p) => p.status_verifikasi === "terverifikasi"),
        );
        const fromList = withScores.find((p) => p.id === parseInt(id));
        const enriched = fromList
          ? {
              id: fromList.id,
              pelatih_id: fromList.id,
              nama: raw?.nama || fromList.nama,
              foto: raw?.foto || fromList.foto || null,
              cabor: raw?.cabang?.nama_cabor || fromList.cabor,
              color: fromList.color,
              accent: fromList.accent,
              initials: fromList.initials,
              skorAHP: fromList.skorAHP,
              lokasi: raw?.domisili || raw?.lokasi || fromList.lokasi || "-",
              harga_min: raw?.harga_min || null,
              harga_max: raw?.harga_max || null,
              biaya: raw?.biaya ?? fromList.biaya,
            }
          : {
              ...raw,
              id: raw?.pelatih_id,
              pelatih_id: raw?.pelatih_id,
              foto: raw?.foto || null,
              cabor: raw?.cabang?.nama_cabor || "-",
              initials: raw?.nama?.slice(0, 2).toUpperCase(),
              color:
                CABOR_COLORS[raw?.cabang?.nama_cabor] ||
                "from-blue-400 to-indigo-500",
              accent: CABOR_ACCENT[raw?.cabang?.nama_cabor] || {
                bar: "bg-indigo-500",
                light: "bg-indigo-50 text-indigo-700",
              },
            };
        setCoach(enriched);
        if (raw?.cabor_id) setForm((p) => ({ ...p, cabor_id: raw.cabor_id }));
        const rawCabor = caborRes?.data?.data || caborRes?.data || [];
        setCaborList(Array.isArray(rawCabor) ? rawCabor : []);
      })
      .catch(() => toast.error("Gagal memuat data"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tanggal || !form.cabor_id) {
      toast.error("Lengkapi data booking");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/api/user/booking", {
        pelatih_id: parseInt(id),
        cabor_id: Number(form.cabor_id),
        tanggal: form.tanggal,
        catatan: form.catatan,
      });
      api
        .post("/api/rekomendasi", {
          cabor_id: Number(form.cabor_id),
          user_id: user?.user_id || user?.id,
        })
        .catch(() => null);
      toast.success("Booking berhasil! Menunggu konfirmasi pelatih.");
      navigate("/user/riwayat");
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Gagal membuat booking",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !coach)
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
        </div>
      </UserLayout>
    );

  const accent = coach.accent || {
    bar: "bg-indigo-500",
    light: "bg-indigo-50 text-indigo-700",
  };

  return (
    <UserLayout title="Konfirmasi Booking">
      <div className="p-6 lg:p-8 max-w-xl" style={sf}>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[13px] font-medium text-[#aeaeb2] hover:text-[#0a0a0a] mb-6 transition-colors"
        >
          <HiArrowLeft className="w-4 h-4" /> Kembali
        </button>

        {/* Coach card */}
        <div
          className={clsx(
            "rounded-2xl p-5 bg-gradient-to-br mb-4 flex items-center gap-4",
            coach.color,
          )}
        >
          {/* ── Avatar booking coach card ── */}
          <div
            className={clsx(
              "w-12 h-12 rounded-2xl flex items-center justify-center text-[16px] font-bold overflow-hidden flex-shrink-0",
              !coach.foto && accent.light,
            )}
          >
            {coach.foto ? (
              <img
                src={fotoUrl(coach.foto)}
                alt={coach.nama}
                className="w-full h-full object-cover"
              />
            ) : (
              coach.initials
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[18px] font-bold text-white tracking-[-0.3px]">
              {coach.nama}
            </p>
            <p className="text-white/70 text-[13px]">
              {coach.cabor} · {coach.lokasi}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-white/70 text-[11px]">Per Sesi</p>
            <p className="text-[16px] font-bold text-white tracking-[-0.3px]">
              {tampilkanHarga(coach)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#f0f0f0]">
          <h3 className="text-[15px] font-semibold text-[#0a0a0a] mb-5 tracking-[-0.2px]">
            Detail Booking
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#aeaeb2] mb-2">
                Cabang Olahraga
              </label>
              <select
                value={form.cabor_id}
                onChange={(e) =>
                  setForm((p) => ({ ...p, cabor_id: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-[#f0f0f0] bg-[#f5f5f7] text-[13px] text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]"
                required
              >
                <option value="">Pilih cabor...</option>
                {caborList.map((c) => (
                  <option key={c.cabor_id} value={c.cabor_id}>
                    {c.nama_cabor}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#aeaeb2] mb-2">
                Tanggal Latihan
              </label>
              <input
                type="date"
                value={form.tanggal}
                onChange={(e) =>
                  setForm((p) => ({ ...p, tanggal: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-[#f0f0f0] bg-[#f5f5f7] text-[13px] text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#aeaeb2] mb-2">
                Catatan (Opsional)
              </label>
              <textarea
                value={form.catatan}
                onChange={(e) =>
                  setForm((p) => ({ ...p, catatan: e.target.value }))
                }
                placeholder="Tujuan latihan, level, fokus latihan..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#f0f0f0] bg-[#f5f5f7] text-[13px] text-[#0a0a0a] placeholder-[#aeaeb2] focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] resize-none min-h-[80px]"
              />
            </div>
            <div className="bg-[#f5f5f7] rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-[13px]">
                <span className="text-[#aeaeb2]">Biaya sesi</span>
                <span className="font-semibold text-[#0a0a0a]">
                  {tampilkanHarga(coach)}
                </span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#aeaeb2]">Durasi</span>
                <span className="font-semibold text-[#0a0a0a]">1 sesi</span>
              </div>
              <p className="text-[11px] text-[#aeaeb2] pt-1 border-t border-[#e5e5ea]">
                Pembayaran langsung ke pelatih setelah sesi selesai.
              </p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#0a0a0a] text-white text-[13px] font-semibold py-3.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-40"
            >
              {submitting ? "Memproses..." : "Konfirmasi Booking"}
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  );
}

// ══════════════════════════════════════════
// RIWAYAT
// ══════════════════════════════════════════
export function UserRiwayat() {
  const { api } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Semua");

  useEffect(() => {
    api
      .get("/api/user/bookings")
      .then((res) => {
        const raw = res?.data?.data || res?.data || [];
        setBookings(Array.isArray(raw) ? raw : raw.bookings || []);
      })
      .catch(() => toast.error("Gagal memuat riwayat"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = bookings.filter((b) => {
    if (tab === "Aktif")
      return ["pending", "konfirmasi", "confirmed"].includes(b.status);
    if (tab === "Selesai") return b.status === "completed";
    return true;
  });

  return (
    <UserLayout title="Jadwal & Riwayat" subtitle="Semua sesi latihanmu">
      <div className="p-6 lg:p-8" style={sf}>
        <div className="flex gap-1 mb-6 bg-white border border-[#f0f0f0] p-1 rounded-xl w-fit">
          {["Semua", "Aktif", "Selesai"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                "px-5 py-2 rounded-lg text-[13px] font-medium transition-all",
                tab === t
                  ? "bg-[#0a0a0a] text-white"
                  : "text-[#aeaeb2] hover:text-[#0a0a0a]",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-2 max-w-2xl">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-20 border border-[#f0f0f0] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2 max-w-2xl">
            {filtered.map((b, i) => {
              const namaPelatih = b.pelatih?.nama || b.pelatihNama || "-";
              const fotoPelatih = b.pelatih?.foto || null;
              const namaCabor = b.cabang?.nama_cabor || b.cabor || "-";
              const accent = CABOR_ACCENT[namaCabor] || {
                bar: "bg-indigo-500",
                light: "bg-indigo-50 text-indigo-700",
              };
              const tanggal = b.tanggal
                ? new Date(b.tanggal).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "-";
              const jam = b.tanggal
                ? new Date(b.tanggal).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-";
              return (
                <motion.div
                  key={b.pemesanan_id || b.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-4 border border-[#f0f0f0] flex items-center gap-4 hover:border-[#d0d0d0] transition-colors"
                >
                  {/* ── Avatar riwayat ── */}
                  <CoachAvatar
                    foto={fotoPelatih}
                    initials={namaPelatih.slice(0, 2).toUpperCase()}
                    accentLight={accent.light}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[#0a0a0a]">
                      {namaPelatih}
                    </p>
                    <p className="text-[12px] text-[#aeaeb2]">{namaCabor}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px] text-[#aeaeb2] flex items-center gap-1">
                        <HiCalendarDays className="w-3 h-3" /> {tanggal}
                      </span>
                      <span className="text-[11px] text-[#aeaeb2] flex items-center gap-1">
                        <HiClock className="w-3 h-3" /> {jam}
                      </span>
                    </div>
                  </div>
                  <StatusPill status={b.status} />
                </motion.div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-[#f5f5f7] rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <HiCalendarDays className="w-6 h-6 text-[#aeaeb2]" />
                </div>
                <p className="text-[14px] font-semibold text-[#aeaeb2]">
                  Tidak ada riwayat
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </UserLayout>
  );
}

// ══════════════════════════════════════════
// FAVORIT
// ══════════════════════════════════════════
export function UserFavorit() {
  const { api } = useAuth();
  const [allCoaches, setAllCoaches] = useState([]);
  const [favs, setFavs] = useState([]);
  const toggle = (id) =>
    setFavs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  useEffect(() => {
    api
      .get("/api/pelatih")
      .then((res) => {
        const raw = res?.data?.data || res?.data || [];
        const list = Array.isArray(raw) ? raw : raw.pelatih || [];
        setAllCoaches(
          hitungSkorAHP(
            list.filter((p) => p.status_verifikasi === "terverifikasi"),
          ),
        );
      })
      .catch(() => {});
  }, []);

  const favCoaches = allCoaches.filter((p) => favs.includes(p.id));

  return (
    <UserLayout
      title="Pelatih Favorit"
      subtitle={`${favCoaches.length} tersimpan`}
    >
      <div className="p-6 lg:p-8" style={sf}>
        {favCoaches.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HiHeart className="w-8 h-8 text-red-300" />
            </div>
            <p className="text-[16px] font-semibold text-[#aeaeb2]">
              Belum ada favorit
            </p>
            <p className="text-[13px] text-[#aeaeb2] mt-1">
              Tambahkan pelatih ke favorit saat menjelajah
            </p>
            <Link
              to="/user/cari-pelatih"
              className="mt-5 inline-flex items-center gap-2 bg-[#0a0a0a] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
            >
              Cari Pelatih
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favCoaches.map((c, i) => (
              <CoachCard
                key={c.id}
                coach={c}
                delay={i * 0.08}
                onFav={toggle}
                isFav={true}
              />
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
