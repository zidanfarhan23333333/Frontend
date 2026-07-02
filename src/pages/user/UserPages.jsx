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
} from "react-icons/hi2";
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
      color:
        CABOR_COLORS[p.cabang?.nama_cabor] || "from-blue-400 to-indigo-500",
    }))
    .sort((a, b) => b.skorAHP - a.skorAHP)
    .map((p, i) => ({ ...p, ranking: i + 1 }));
}

const CABOR_COLORS = {
  Badminton: "from-emerald-400 to-teal-500",
  "Bulu Tangkis": "from-emerald-400 to-teal-500",
  Renang: "from-blue-400 to-cyan-500",
  Basket: "from-orange-400 to-red-500",
  Futsal: "from-green-400 to-emerald-600",
  "Sepak Bola": "from-green-500 to-emerald-700",
  Karate: "from-red-500 to-rose-600",
  Atletik: "from-amber-400 to-orange-500",
  Voli: "from-yellow-400 to-amber-500",
  "Bola Voli": "from-yellow-400 to-amber-500",
  "Tenis Meja": "from-red-400 to-rose-500",
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

const HARI_COLOR_USER = {
  Senin: "bg-blue-50 text-blue-600 border border-blue-100",
  Selasa: "bg-violet-50 text-violet-600 border border-violet-100",
  Rabu: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  Kamis: "bg-amber-50 text-amber-600 border border-amber-100",
  Jumat: "bg-orange-50 text-orange-600 border border-orange-100",
  Sabtu: "bg-pink-50 text-pink-600 border border-pink-100",
  Minggu: "bg-red-50 text-red-600 border border-red-100",
};

function JadwalTersediaSection({ pelatihId, api }) {
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pelatihId) return;
    (async () => {
      try {
        const res = await api.get(`/api/public/pelatih/${pelatihId}/jadwal`);
        const raw = res.data.data || res.data.jadwal || res.data || [];
        const available = (Array.isArray(raw) ? raw : []).filter(
          (j) => j.status === "available",
        );
        setJadwal(
          available.sort(
            (a, b) => HARI_ORDER.indexOf(a.hari) - HARI_ORDER.indexOf(b.hari),
          ),
        );
      } catch {
        setJadwal([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [pelatihId]);

  if (loading)
    return (
      <div className="flex items-center gap-2 text-[#aeaeb2] text-[13px] py-2">
        <div className="w-4 h-4 border-2 border-[#d0d0d0] border-t-transparent rounded-full animate-spin" />
        Memuat jadwal...
      </div>
    );

  if (!jadwal.length)
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <HiCalendarDays className="w-8 h-8 text-[#d0d0d0] mb-2" />
        <p className="text-[13px] text-[#aeaeb2] font-medium">
          Belum ada jadwal tersedia
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
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: gi * 0.05 }}
        >
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-2 ${HARI_COLOR_USER[hari]}`}
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

function JadwalBookingPanel({ pelatihId, api }) {
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pelatihId) return;
    (async () => {
      try {
        const res = await api.get(`/api/public/pelatih/${pelatihId}/jadwal`);
        const raw = res.data.data || res.data.jadwal || res.data || [];
        setJadwal(
          (Array.isArray(raw) ? raw : []).filter(
            (j) => j.status === "available",
          ),
        );
      } catch {
        setJadwal([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [pelatihId]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-4">
        <div className="w-4 h-4 border-2 border-[#d0d0d0] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!jadwal.length)
    return (
      <p className="text-[12px] text-[#aeaeb2] text-center py-4">
        Belum ada jadwal tersedia
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
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${HARI_COLOR_USER[j.hari]}`}
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

function StatusPill({ status }) {
  const map = {
    confirmed: { label: "Aktif", cls: "bg-blue-50 text-blue-600" },
    konfirmasi: { label: "Aktif", cls: "bg-blue-50 text-blue-600" },
    pending: { label: "Pending", cls: "bg-amber-50 text-amber-600" },
    completed: { label: "Selesai", cls: "bg-[#f5f5f7] text-[#6e6e73]" },
    selesai: { label: "Selesai", cls: "bg-[#f5f5f7] text-[#6e6e73]" },
    dibatalkan: { label: "Batal", cls: "bg-red-50 text-red-500" },
    cancelled: { label: "Batal", cls: "bg-red-50 text-red-500" },
  };
  const s = map[status] || map.pending;
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold",
        s.cls,
      )}
    >
      {(status === "confirmed" || status === "konfirmasi") && (
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
      )}
      {s.label}
    </span>
  );
}

function CoachCard({ coach, delay = 0, onFav, isFav }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden border border-[#f0f0f0] hover:border-[#e0e0e0] hover:shadow-md transition-all duration-200"
      style={sf}
    >
      <div
        className={clsx(
          "h-1 w-full bg-gradient-to-r",
          coach.color || "from-blue-400 to-indigo-500",
        )}
      />
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {coach.foto ? (
              <img
                src={coach.foto}
                alt={coach.nama}
                className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <Avatar initials={coach.initials} size="md" id={coach.id} />
            )}
            <div>
              <p className="text-[14px] font-semibold text-[#0a0a0a] leading-tight">
                {coach.nama?.split(" ").slice(0, 2).join(" ")}
              </p>
              <p className="text-[12px] text-[#aeaeb2] mt-0.5">{coach.cabor}</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              onFav?.(coach.id);
            }}
            className={clsx(
              "w-7 h-7 rounded-full flex items-center justify-center transition-all",
              isFav
                ? "bg-red-500 text-white"
                : "bg-[#f5f5f7] text-[#aeaeb2] hover:bg-red-500 hover:text-white",
            )}
          >
            <HiHeart className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="text-[12px] text-[#aeaeb2] space-y-1 mb-3">
          <div className="flex items-center gap-1.5">
            <HiMapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{coach.lokasi}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HiTrophy className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Level {coach.lisensi}</span>
          </div>
        </div>
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-[#aeaeb2]">Skor AHP</span>
            <span className="text-[11px] font-semibold text-[#0a0a0a]">
              {(coach.skorAHP ?? 0).toFixed(2)}
            </span>
          </div>
          <div className="h-1 bg-[#f5f5f7] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0a0a0a] rounded-full"
              style={{ width: `${(coach.skorAHP ?? 0) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[#f5f5f7]">
          <div>
            <p className="text-[15px] font-bold text-[#0a0a0a] tracking-[-0.3px]">
              {coach.harga_min && coach.harga_max
                ? `${formatRp(coach.harga_min)} – ${formatRp(coach.harga_max)}`
                : formatRp(coach.biaya)}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-0.5 text-[11px] text-[#aeaeb2]">
                <HiStar className="w-3 h-3 text-amber-400" />{" "}
                {coach.rating ?? "-"}
              </span>
              <span className="text-[#e5e5ea]">·</span>
              <span className="text-[11px] text-[#aeaeb2]">
                {coach.totalBooking ?? 0} sesi
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

  return (
    <div className="flex h-full" style={sf}>
      <div className="flex-1 overflow-y-auto p-6 lg:p-8 min-w-0">
        <div className="mb-6">
          <p className="text-[13px] text-[#aeaeb2]">Selamat datang kembali</p>
          <h1 className="text-[28px] font-bold text-[#0a0a0a] tracking-[-0.5px] mt-0.5">
            {user?.nama?.split(" ")[0] || "Atlet"} 👋
          </h1>
        </div>

        <Link to="/user/cari-pelatih" className="block mb-6">
          <div className="flex items-center gap-3 w-full max-w-md px-4 py-3 rounded-xl bg-white border border-[#f0f0f0] hover:border-[#d0d0d0] transition-colors cursor-pointer">
            <HiMagnifyingGlass className="w-4 h-4 text-[#aeaeb2] flex-shrink-0" />
            <span className="text-[13px] text-[#aeaeb2]">
              Cari pelatih atau cabang olahraga...
            </span>
          </div>
        </Link>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            {
              label: "Total Booking",
              value: s.totalBooking || bookings.length,
              accent: "#0a0a0a",
            },
            {
              label: "Booking Aktif",
              value: s.bookingAktif || activeBookings.length,
              accent: "#16a34a",
            },
            {
              label: "Favorit",
              value: s.pelatihFavorit || favs.length,
              accent: "#dc2626",
            },
            {
              label: "Pengeluaran",
              value: formatRp(s.totalPengeluaran),
              accent: "#d97706",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl p-4 border border-[#f0f0f0]"
            >
              <p
                className="text-[24px] font-bold tracking-[-0.5px]"
                style={{ color: stat.accent }}
              >
                {stat.value}
              </p>
              <p className="text-[12px] text-[#aeaeb2] mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mb-6">
          <h2 className="text-[15px] font-semibold text-[#0a0a0a] tracking-[-0.2px] mb-3">
            Kategori
          </h2>
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

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-[#0a0a0a] tracking-[-0.2px]">
              Rekomendasi Untukmu
            </h2>
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
            <p className="text-[13px] text-[#aeaeb2] py-4">
              Belum ada pelatih terverifikasi
            </p>
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
              <p className="text-[12px] text-[#aeaeb2] text-center py-4">
                Tidak ada booking aktif
              </p>
            ) : (
              <div className="space-y-2">
                {activeBookings.slice(0, 3).map((b, i) => {
                  const namaPelatih = b.pelatih?.nama || b.pelatihNama || "-";
                  return (
                    <motion.div
                      key={b.pemesanan_id || b.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3 p-3 rounded-xl border border-[#f0f0f0] hover:border-[#e0e0e0] transition-colors"
                    >
                      <Avatar
                        initials={namaPelatih.slice(0, 2).toUpperCase()}
                        size="sm"
                        id={b.pelatih_id || b.pelatihId}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#0a0a0a] truncate">
                          {namaPelatih.split(" ")[0]}
                        </p>
                        <p className="text-[11px] text-[#aeaeb2] flex items-center gap-1 mt-0.5">
                          <HiCalendarDays className="w-3 h-3" />
                          {b.tanggal
                            ? new Date(b.tanggal).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                              })
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

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[12px] font-semibold text-[#aeaeb2] uppercase tracking-wider">
                Favorit
              </h3>
              <Link
                to="/user/favorit"
                className="text-[11px] text-blue-600 font-semibold"
              >
                Lihat semua
              </Link>
            </div>
            {coaches.filter((p) => favs.includes(p.id)).length === 0 ? (
              <p className="text-[12px] text-[#aeaeb2] text-center py-4">
                Belum ada favorit
              </p>
            ) : (
              <div className="space-y-1">
                {coaches
                  .filter((p) => favs.includes(p.id))
                  .map((p) => (
                    <Link
                      key={p.id}
                      to={`/user/detail/${p.id}`}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#f5f5f7] transition-colors"
                    >
                      <Avatar initials={p.initials} size="sm" id={p.id} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#0a0a0a] truncate">
                          {p.nama?.split(" ")[0]}
                        </p>
                        <p className="text-[11px] text-[#aeaeb2]">{p.cabor}</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <HiStar className="w-3 h-3 text-amber-400" />
                        <span className="text-[11px] font-semibold text-[#6e6e73]">
                          {p.rating ?? "-"}
                        </span>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function UserCariPelatih() {
  const { api } = useAuth();
  const [allCoaches, setAllCoaches] = useState([]);
  const [caborList, setCaborList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cabor, setCabor] = useState("Semua");
  const [sort, setSort] = useState("ahp");
  const [maxBiaya, setMaxBiaya] = useState(500000);
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
    list = list.filter((p) => p.biaya <= maxBiaya);
    if (sort === "ahp") return list.sort((a, b) => b.skorAHP - a.skorAHP);
    if (sort === "rating")
      return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    if (sort === "harga-asc") return list.sort((a, b) => a.biaya - b.biaya);
    if (sort === "harga-desc") return list.sort((a, b) => b.biaya - a.biaya);
    return list;
  }, [allCoaches, search, cabor, sort, maxBiaya]);

  return (
    <div className="p-6 lg:p-8" style={sf}>
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
                    Harga Maksimal
                  </p>
                  <p className="text-[14px] font-semibold text-[#0a0a0a] mb-2">
                    Rp {maxBiaya.toLocaleString("id-ID")}
                  </p>
                  <input
                    type="range"
                    min={100000}
                    max={500000}
                    step={50000}
                    value={maxBiaya}
                    onChange={(e) => setMaxBiaya(Number(e.target.value))}
                    className="w-full accent-[#0a0a0a]"
                  />
                  <div className="flex justify-between text-[11px] text-[#aeaeb2] mt-1">
                    <span>100K</span>
                    <span>500K</span>
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
        {["Semua", ...caborList.map((c) => c.nama_cabor || c.nama)].map((c) => (
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
        ))}
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
        <div className="space-y-2 max-w-2xl">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-xl border border-[#f0f0f0] p-4 flex items-center gap-4 hover:border-[#d0d0d0] transition-colors"
            >
              <Avatar initials={c.initials} size="md" id={c.id} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#0a0a0a]">
                  {c.nama?.split(" ").slice(0, 2).join(" ")}
                </p>
                <p className="text-[12px] text-[#aeaeb2]">
                  {c.cabor} · {c.lokasi}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1 w-24 bg-[#f5f5f7] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0a0a0a] rounded-full"
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
                  {c.harga_min && c.harga_max
                    ? `${formatRp(c.harga_min)} – ${formatRp(c.harga_max)}`
                    : formatRp(c.biaya)}
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
          ))}
        </div>
      )}
    </div>
  );
}

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
              foto: raw?.foto || fromList.foto || null, // ← tambah ini
              cabor: raw?.cabang?.nama_cabor || fromList.cabor,
              color: CABOR_COLORS[raw?.cabang?.nama_cabor] || fromList.color,
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
              foto: raw?.foto || null, // ← tambah ini
              cabor: raw?.cabang?.nama_cabor || "-",
              initials: raw?.nama?.slice(0, 2).toUpperCase(),
              skorAHP: 0,
              ranking: "-",
              lokasi: raw?.domisili || raw?.lokasi || "-",
              color:
                CABOR_COLORS[raw?.cabang?.nama_cabor] ||
                "from-blue-400 to-indigo-500",
            };

        setCoach(enriched);
        console.log("coach.foto:", enriched.foto);
        console.log("raw.foto:", raw?.foto);
        console.log("fromList.foto:", fromList?.foto);
      })
      .catch(() => toast.error("Gagal memuat detail pelatih"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!coach)
    return (
      <div className="p-8">
        <button onClick={() => navigate(-1)} className="btn-secondary">
          ← Kembali
        </button>
      </div>
    );

  const hargaText =
    coach.harga_min && coach.harga_max
      ? `${formatRp(coach.harga_min)} – ${formatRp(coach.harga_max)}`
      : formatRp(coach.biaya);

  return (
    <div className="flex h-full" style={sf}>
      {/* ✅ pb-24 di mobile agar tidak tertutup fixed bottom bar */}
      <div className="flex-1 overflow-y-auto pb-24 lg:pb-0">
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
          {/* Di hero section — ini yang salah */}
          <div className="relative px-6 pb-5 flex items-end gap-4">
            {coach.foto ? (
              <img
                src={coach.foto}
                alt={coach.nama}
                className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border-2 border-white/30"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <Avatar initials={coach.initials} size="xl" id={coach.id} />
            )}
            <div>
              <p className="text-white/70 text-[12px] mb-0.5">{coach.cabor}</p>
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
                value: `${coach.pengalaman}/5`,
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
                className="bg-white rounded-2xl p-3 sm:p-4 text-center border border-[#f0f0f0]"
              >
                <s.icon className="w-4 h-4 text-[#aeaeb2] mx-auto mb-1.5" />
                <p className="text-[14px] sm:text-[16px] font-bold text-[#0a0a0a] tracking-[-0.3px]">
                  {s.value}
                </p>
                <p className="text-[10px] sm:text-[11px] text-[#aeaeb2] mt-0.5">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* ✅ Mobile booking card — hanya tampil di bawah lg */}
          <div className="lg:hidden mb-5">
            <div className="bg-white rounded-2xl border border-[#f0f0f0] p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[11px] text-[#aeaeb2] mb-0.5">
                    {coach.harga_min && coach.harga_max
                      ? "Range Harga"
                      : "Per Sesi"}
                  </p>
                  <p className="text-[18px] font-bold text-[#0a0a0a] tracking-[-0.5px]">
                    {hargaText}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <HiStar className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[13px] font-medium">
                    {coach.rating ?? "-"}
                  </span>
                  <span className="text-[12px] text-[#aeaeb2]">
                    {" "}
                    · {coach.totalBooking ?? 0} sesi
                  </span>
                </div>
              </div>
              <p className="text-[11px] font-semibold text-[#aeaeb2] uppercase tracking-wider mb-2">
                Jadwal Tersedia
              </p>
              <JadwalBookingPanel
                pelatihId={coach.id || coach.pelatih_id}
                api={api}
              />
            </div>
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
                  <p className="text-[13px] text-blue-700">{coach.spesialis}</p>
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
              {coach.harga_min && coach.harga_max && (
                <div className="mt-3 p-3 bg-emerald-50 rounded-xl">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-500 mb-1">
                    Range Harga per Pertemuan
                  </p>
                  <p className="text-[14px] font-bold text-emerald-700">
                    {hargaText}
                  </p>
                </div>
              )}
              <div className="mt-4 p-4 bg-[#f5f5f7] rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aeaeb2] mb-2">
                  Kriteria AHP
                </p>
                <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-[12px]">
                  {[
                    ["Pengalaman", coach.pengalaman],
                    ["Lisensi", coach.lisensi],
                    ["Prestasi", coach.prestasi],
                    ["Biaya", coach.biaya],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-[#aeaeb2]">{k}</span>
                      <span className="font-semibold text-[#0a0a0a]">
                        {v} / 5
                      </span>
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

      {/* Desktop booking panel */}
      <div className="hidden lg:flex w-72 flex-col bg-white border-l border-[#f0f0f0] flex-shrink-0">
        <div className="p-5 flex-1 overflow-y-auto">
          <div className="pb-5 border-b border-[#f0f0f0] mb-5">
            <p className="text-[11px] text-[#aeaeb2] mb-1">
              {coach.harga_min && coach.harga_max
                ? "Range Harga per Pertemuan"
                : "Biaya per Sesi"}
            </p>
            <p className="text-[22px] font-bold text-[#0a0a0a] tracking-[-0.5px]">
              {hargaText}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <HiStar className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[13px] font-medium text-[#0a0a0a]">
                {coach.rating ?? "-"}
              </span>
              <span className="text-[#aeaeb2] text-[13px]">
                {" "}
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

      {/* ✅ Mobile fixed bottom booking bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#f0f0f0] p-4 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-[#aeaeb2]">
            {coach.harga_min && coach.harga_max ? "Range Harga" : "Per Sesi"}
          </p>
          <p className="text-[15px] font-bold text-[#0a0a0a] truncate">
            {hargaText}
          </p>
        </div>
        <Link
          to={`/user/booking/${coach.id}`}
          className="flex items-center gap-2 bg-[#0a0a0a] text-white text-[13px] font-semibold px-5 py-3 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap flex-shrink-0"
        >
          Booking Sekarang <HiArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

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
              cabor: raw?.cabang?.nama_cabor || fromList.cabor,
              color: fromList.color,
              initials: fromList.initials,
              lokasi: raw?.domisili || raw?.lokasi || fromList.lokasi || "-",
              harga_min: raw?.harga_min || null,
              harga_max: raw?.harga_max || null,
              biaya: raw?.biaya ?? fromList.biaya,
              rating: raw?.rating ?? fromList.rating ?? 0,
              totalBooking: raw?.totalBooking ?? fromList.totalBooking ?? 0,
            }
          : {
              ...raw,
              id: raw?.pelatih_id,
              pelatih_id: raw?.pelatih_id,
              cabor: raw?.cabang?.nama_cabor || "-",
              initials: raw?.nama?.slice(0, 2).toUpperCase(),
              lokasi: raw?.domisili || raw?.lokasi || "-",
              color:
                CABOR_COLORS[raw?.cabang?.nama_cabor] ||
                "from-blue-400 to-indigo-500",
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
      await api.post("/api/rekomendasi", {
        cabor_id: Number(form.cabor_id),
        user_id: user?.user_id || user?.id,
      });
      await api
        .post("/api/user/booking", {
          pelatih_id: parseInt(id),
          cabor_id: Number(form.cabor_id),
          tanggal: form.tanggal,
          catatan: form.catatan,
        })
        .catch(() => null);
      toast.success("Booking berhasil! Menunggu konfirmasi pelatih.");
      navigate("/user/riwayat");
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal membuat booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !coach)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const hargaText =
    coach.harga_min && coach.harga_max
      ? `${formatRp(coach.harga_min)} – ${formatRp(coach.harga_max)}`
      : formatRp(coach.biaya);

  return (
    <div className="p-6 lg:p-8 max-w-xl" style={sf}>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-[13px] font-medium text-[#aeaeb2] hover:text-[#0a0a0a] mb-6 transition-colors"
      >
        <HiArrowLeft className="w-4 h-4" /> Kembali
      </button>
      <div
        className={clsx(
          "rounded-2xl p-5 bg-gradient-to-br mb-4 flex items-center gap-4",
          coach.color,
        )}
      >
        <Avatar initials={coach.initials} size="lg" id={coach.id} />
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
            {hargaText}
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
              <span className="font-semibold text-[#0a0a0a]">{hargaText}</span>
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
  );
}

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
    if (tab === "Selesai")
      return b.status === "selesai" || b.status === "completed";
    return true;
  });

  return (
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
            const namaCabor = b.cabang?.nama_cabor || b.cabor || "-";
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[13px] font-bold">
                    {namaPelatih.slice(0, 2).toUpperCase()}
                  </span>
                </div>
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
  );
}

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
  );
}
