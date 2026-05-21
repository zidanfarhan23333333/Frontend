import { useState, useMemo } from "react";
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
  HiChevronLeft,
  HiBolt,
  HiUsers,
  HiPlus,
} from "react-icons/hi2";
import UserLayout from "../../components/layout/UserLayout";
import Avatar from "../../components/ui/Avatar";
import { StatusBadge } from "../../components/ui/Badges";
import {
  pelatihList,
  bookingList,
  caborList,
  jadwalLatihan,
  dashboardStats,
} from "../../data/dummy";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import clsx from "clsx";

const sf = { fontFamily: "var(--font-sf)" };
const formatRp = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

/* ── Status pill ── */
function StatusPill({ status }) {
  const map = {
    confirmed: { label: "Aktif", cls: "bg-blue-50 text-blue-600" },
    pending: { label: "Pending", cls: "bg-amber-50 text-amber-600" },
    completed: { label: "Selesai", cls: "bg-[#f5f5f7] text-[#6e6e73]" },
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
      {status === "confirmed" && (
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
      )}
      {s.label}
    </span>
  );
}

/* ── Coach card — rentabel-style ── */
function CoachCard({ coach, delay = 0, onFav, isFav }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden border border-[#f0f0f0] hover:border-[#e0e0e0] hover:shadow-md transition-all duration-200"
      style={sf}
    >
      {/* Color bar top */}
      <div
        className={clsx(
          "h-1 w-full bg-gradient-to-r",
          coach.color || "from-blue-400 to-indigo-500",
        )}
      />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar initials={coach.initials} size="md" id={coach.id} />
            <div>
              <p className="text-[14px] font-semibold text-[#0a0a0a] leading-tight">
                {coach.nama.split(" ").slice(0, 2).join(" ")}
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

        {/* Meta */}
        <div className="text-[12px] text-[#aeaeb2] space-y-1 mb-3">
          <div className="flex items-center gap-1.5">
            <HiMapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{coach.lokasi}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HiTrophy className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{coach.lisensi}</span>
          </div>
        </div>

        {/* Progress bar — AHP score */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-[#aeaeb2]">Skor AHP</span>
            <span className="text-[11px] font-semibold text-[#0a0a0a]">
              {coach.skorAHP.toFixed(2)}
            </span>
          </div>
          <div className="h-1 bg-[#f5f5f7] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0a0a0a] rounded-full"
              style={{ width: `${coach.skorAHP * 100}%` }}
            />
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-3 border-t border-[#f5f5f7]">
          <div>
            <p className="text-[15px] font-bold text-[#0a0a0a] tracking-[-0.3px]">
              {formatRp(coach.biaya)}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-0.5 text-[11px] text-[#aeaeb2]">
                <HiStar className="w-3 h-3 text-amber-400" /> {coach.rating}
              </span>
              <span className="text-[#e5e5ea]">·</span>
              <span className="text-[11px] text-[#aeaeb2]">
                {coach.totalBooking} sesi
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

/* ══════════════════════════════════════════
   USER DASHBOARD
══════════════════════════════════════════ */
export function UserDashboard() {
  const { user } = useAuth();
  const [favs, setFavs] = useState([1, 6]);
  const toggleFav = (id) =>
    setFavs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const topCoaches = pelatihList
    .filter((p) => p.status === "verified")
    .sort((a, b) => b.skorAHP - a.skorAHP);
  const myBookings = bookingList.slice(0, 3);
  const s = dashboardStats?.user || {};

  return (
    <UserLayout>
      <div className="flex h-full" style={sf}>
        {/* ── Main col ── */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 min-w-0">
          {/* Greeting */}
          <div className="mb-6">
            <p className="text-[13px] text-[#aeaeb2]">Selamat datang kembali</p>
            <h1 className="text-[28px] font-bold text-[#0a0a0a] tracking-[-0.5px] mt-0.5">
              {user?.nama?.split(" ")[0] || "Atlet"} 👋
            </h1>
          </div>

          {/* Search bar */}
          <Link to="/user/cari-pelatih" className="block mb-6">
            <div className="flex items-center gap-3 w-full max-w-md px-4 py-3 rounded-xl bg-white border border-[#f0f0f0] hover:border-[#d0d0d0] transition-colors cursor-pointer">
              <HiMagnifyingGlass className="w-4 h-4 text-[#aeaeb2] flex-shrink-0" />
              <span className="text-[13px] text-[#aeaeb2]">
                Cari pelatih atau cabang olahraga...
              </span>
              <span className="ml-auto text-[11px] font-semibold text-[#aeaeb2] bg-[#f5f5f7] px-1.5 py-0.5 rounded-md">
                ⌘K
              </span>
            </div>
          </Link>

          {/* Stats — 4 cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              {
                label: "Total Booking",
                value: s.totalBooking || 12,
                accent: "#0a0a0a",
              },
              {
                label: "Booking Aktif",
                value: s.bookingAktif || 3,
                accent: "#16a34a",
              },
              {
                label: "Favorit",
                value: s.pelatihFavorit || 5,
                accent: "#dc2626",
              },
              { label: "Pengeluaran", value: "Rp 2,8jt", accent: "#d97706" },
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
                <p className="text-[12px] text-[#aeaeb2] mt-0.5">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Category chips */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[15px] font-semibold text-[#0a0a0a] tracking-[-0.2px]">
                Kategori
              </h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                "Semua",
                "Bulu Tangkis",
                "Renang",
                "Basket",
                "Futsal",
                "Karate",
              ].map((c, i) => (
                <button
                  key={c}
                  className={clsx(
                    "px-4 py-2 rounded-full text-[12px] font-medium transition-all border",
                    i === 0
                      ? "bg-[#0a0a0a] text-white border-transparent"
                      : "bg-white text-[#6e6e73] border-[#f0f0f0] hover:border-[#d0d0d0]",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Coach grid */}
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topCoaches.slice(0, 3).map((c, i) => (
                <CoachCard
                  key={c.id}
                  coach={c}
                  delay={i * 0.08}
                  onFav={toggleFav}
                  isFav={favs.includes(c.id)}
                />
              ))}
            </div>
          </div>

          {/* Promo banner */}
          <div className="rounded-2xl bg-[#0a0a0a] p-6 flex items-center justify-between relative overflow-hidden">
            <div className="absolute right-6 text-6xl opacity-10 select-none">
              🏆
            </div>
            <div>
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-1">
                Promo Agustus
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

        {/* ── Right panel ── */}
        <div className="hidden xl:flex w-72 flex-col bg-white border-l border-[#f0f0f0] overflow-y-auto flex-shrink-0">
          <div className="p-5">
            {/* Calendar strip */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-semibold text-[#0a0a0a]">
                  Jadwal Mendatang
                </span>
                <div className="flex items-center gap-1 text-[#aeaeb2]">
                  <HiChevronLeft className="w-4 h-4 cursor-pointer hover:text-[#0a0a0a]" />
                  <span className="text-[12px]">Agustus</span>
                  <HiChevronRight className="w-4 h-4 cursor-pointer hover:text-[#0a0a0a]" />
                </div>
              </div>
              <div className="flex gap-1">
                {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d, i) => (
                  <div
                    key={d}
                    className={clsx(
                      "flex-1 flex flex-col items-center py-2 rounded-xl text-[11px] font-medium cursor-pointer transition-all",
                      i === 3
                        ? "bg-[#0a0a0a] text-white"
                        : "text-[#aeaeb2] hover:bg-[#f5f5f7]",
                    )}
                  >
                    <span>{d}</span>
                    <span className="mt-0.5 font-bold">{14 + i}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking aktif */}
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
              <div className="space-y-2">
                {myBookings
                  .filter((b) => b.status !== "completed")
                  .map((b, i) => (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3 p-3 rounded-xl border border-[#f0f0f0] hover:border-[#e0e0e0] transition-colors"
                    >
                      <Avatar
                        initials={b.pelatihNama.slice(0, 2).toUpperCase()}
                        size="sm"
                        id={b.pelatihId}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#0a0a0a] truncate">
                          {b.pelatihNama.split(" ")[0]}
                        </p>
                        <p className="text-[11px] text-[#aeaeb2] flex items-center gap-1 mt-0.5">
                          <HiCalendarDays className="w-3 h-3" /> {b.tanggal}
                        </p>
                      </div>
                      <StatusPill status={b.status} />
                    </motion.div>
                  ))}
              </div>
            </div>

            {/* Favorit */}
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
              <div className="space-y-1">
                {pelatihList
                  .filter((p) => [1, 6].includes(p.id))
                  .map((p) => (
                    <Link
                      key={p.id}
                      to={`/user/detail/${p.id}`}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#f5f5f7] transition-colors"
                    >
                      <Avatar initials={p.initials} size="sm" id={p.id} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#0a0a0a] truncate">
                          {p.nama.split(" ")[0]}
                        </p>
                        <p className="text-[11px] text-[#aeaeb2]">{p.cabor}</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <HiStar className="w-3 h-3 text-amber-400" />
                        <span className="text-[11px] font-semibold text-[#6e6e73]">
                          {p.rating}
                        </span>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

/* ══════════════════════════════════════════
   CARI PELATIH
══════════════════════════════════════════ */
export function UserCariPelatih() {
  const [search, setSearch] = useState("");
  const [cabor, setCabor] = useState("Semua");
  const [sort, setSort] = useState("ahp");
  const [maxBiaya, setMaxBiaya] = useState(500000);
  const [view, setView] = useState("grid");
  const [favs, setFavs] = useState([1, 6]);
  const [showFilter, setShowFilter] = useState(false);
  const toggleFav = (id) =>
    setFavs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const filtered = useMemo(() => {
    let list = pelatihList.filter((p) => p.status === "verified");
    if (search)
      list = list.filter(
        (p) =>
          p.nama.toLowerCase().includes(search.toLowerCase()) ||
          p.cabor.toLowerCase().includes(search.toLowerCase()),
      );
    if (cabor !== "Semua") list = list.filter((p) => p.cabor === cabor);
    list = list.filter((p) => p.biaya <= maxBiaya);
    if (sort === "ahp") return [...list].sort((a, b) => b.skorAHP - a.skorAHP);
    if (sort === "rating") return [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "harga-asc")
      return [...list].sort((a, b) => a.biaya - b.biaya);
    if (sort === "harga-desc")
      return [...list].sort((a, b) => b.biaya - a.biaya);
    return list;
  }, [search, cabor, sort, maxBiaya]);

  const caborOptions = ["Semua", ...caborList.map((c) => c.name)];

  return (
    <UserLayout
      title="Cari Pelatih"
      subtitle={`${filtered.length} pelatih ditemukan`}
    >
      <div className="p-6 lg:p-8" style={sf}>
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-2 mb-5">
          {/* Search */}
          <div className="relative flex-1">
            <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aeaeb2]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pelatih atau cabang olahraga..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#f0f0f0]
                         text-[13px] text-[#0a0a0a] placeholder-[#aeaeb2]
                         focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] focus:border-transparent
                         transition-all"
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

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium border transition-all",
              showFilter
                ? "bg-[#0a0a0a] text-white border-transparent"
                : "bg-white text-[#6e6e73] border-[#f0f0f0] hover:border-[#d0d0d0]",
            )}
          >
            <HiAdjustmentsHorizontal className="w-4 h-4" />
            Filter
          </button>

          {/* View toggle */}
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

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#f0f0f0]
                       text-[13px] text-[#0a0a0a] focus:outline-none focus:ring-2
                       focus:ring-[#0a0a0a] cursor-pointer"
          >
            <option value="ahp">Skor AHP Tertinggi</option>
            <option value="rating">Rating Tertinggi</option>
            <option value="harga-asc">Harga Terendah</option>
            <option value="harga-desc">Harga Tertinggi</option>
          </select>
        </div>

        {/* Filter panel */}
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

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-5">
          {caborOptions.map((c) => (
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

        {/* Results */}
        {filtered.length === 0 ? (
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
                    {c.nama.split(" ").slice(0, 2).join(" ")}
                  </p>
                  <p className="text-[12px] text-[#aeaeb2]">
                    {c.cabor} · {c.lokasi}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1 w-24 bg-[#f5f5f7] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0a0a0a] rounded-full"
                        style={{ width: `${c.skorAHP * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-[#aeaeb2]">
                      {c.skorAHP.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[14px] font-bold text-[#0a0a0a]">
                    {formatRp(c.biaya)}
                  </p>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    <HiStar className="w-3 h-3 text-amber-400" />
                    <span className="text-[12px] text-[#aeaeb2]">
                      {c.rating}
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
    </UserLayout>
  );
}

/* ══════════════════════════════════════════
   DETAIL PELATIH
══════════════════════════════════════════ */
export function UserDetailPelatih() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fav, setFav] = useState(false);
  const coach = pelatihList.find((p) => p.id === parseInt(id));

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

  return (
    <UserLayout>
      <div className="flex h-full" style={sf}>
        {/* Main */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero */}
          <div
            className={clsx(
              "relative h-56 bg-gradient-to-br flex items-end",
              coach.color || "from-blue-400 to-indigo-500",
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
              <Avatar initials={coach.initials} size="xl" id={coach.id} />
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
                    {coach.rating}
                  </span>
                  <span className="flex items-center gap-1 text-[13px] text-white/70">
                    <HiMapPin className="w-3.5 h-3.5" /> {coach.lokasi}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Quick stats */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                {
                  label: "Pengalaman",
                  value: coach.pengalaman + " Thn",
                  icon: HiTrophy,
                },
                {
                  label: "Total Sesi",
                  value: coach.totalBooking,
                  icon: HiCalendarDays,
                },
                { label: "Ranking", value: "#" + coach.ranking, icon: HiFire },
                {
                  label: "Skor AHP",
                  value: coach.skorAHP.toFixed(2),
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
                <p className="text-[13px] text-[#6e6e73] leading-relaxed">
                  {coach.deskripsi}
                </p>
                <div className="mt-4 p-4 bg-[#f5f5f7] rounded-xl">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aeaeb2] mb-1.5">
                    Prestasi
                  </p>
                  <p className="text-[13px] text-[#0a0a0a]">{coach.prestasi}</p>
                </div>
                <div className="flex gap-2 mt-3">
                  <span className="badge-blue">{coach.lisensi}</span>
                  <span className="badge-green">{coach.cabor}</span>
                </div>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#0a0a0a] mb-3 tracking-[-0.2px]">
                  Jadwal Tersedia
                </h3>
                <div className="space-y-2">
                  {coach.jadwal?.map((j, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-[#f0f0f0] hover:border-[#d0d0d0] cursor-pointer transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#f5f5f7] flex items-center justify-center text-[#0a0a0a]">
                        <HiCalendarDays className="w-4 h-4" />
                      </div>
                      <span className="flex-1 text-[13px] font-medium text-[#0a0a0a]">
                        {j}
                      </span>
                      <HiChevronRight className="w-4 h-4 text-[#aeaeb2] group-hover:text-[#0a0a0a] transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking panel */}
        <div className="hidden lg:flex w-72 flex-col bg-white border-l border-[#f0f0f0] flex-shrink-0">
          <div className="p-5 flex-1 overflow-y-auto">
            <div className="pb-5 border-b border-[#f0f0f0] mb-5">
              <p className="text-[11px] text-[#aeaeb2] mb-1">Biaya per Sesi</p>
              <p className="text-[28px] font-bold text-[#0a0a0a] tracking-[-0.5px]">
                {formatRp(coach.biaya)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <HiStar className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[13px] font-medium text-[#0a0a0a]">
                  {coach.rating}
                </span>
                <span className="text-[#aeaeb2] text-[13px]">
                  · {coach.totalBooking} sesi
                </span>
              </div>
            </div>

            <div className="mb-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aeaeb2] mb-3">
                Pilih Jadwal
              </p>
              <div className="space-y-2">
                {jadwalLatihan?.map((j) => (
                  <label
                    key={j.id}
                    className={clsx(
                      "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                      j.status === "available"
                        ? "border-[#f0f0f0] hover:border-[#0a0a0a]"
                        : "border-[#f0f0f0] opacity-40 cursor-not-allowed",
                    )}
                  >
                    <input
                      type="radio"
                      name="jadwal"
                      disabled={j.status !== "available"}
                      className="accent-[#0a0a0a]"
                    />
                    <div className="flex-1">
                      <p className="text-[12px] font-semibold text-[#0a0a0a]">
                        {j.hari}
                      </p>
                      <p className="text-[11px] text-[#aeaeb2]">{j.jam}</p>
                    </div>
                    <span
                      className={clsx(
                        "badge",
                        j.status === "available" ? "badge-green" : "badge-red",
                      )}
                    >
                      {j.status === "available" ? "Tersedia" : "Penuh"}
                    </span>
                  </label>
                ))}
              </div>
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

/* ══════════════════════════════════════════
   BOOKING
══════════════════════════════════════════ */
export function UserBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const coach = pelatihList.find((p) => p.id === parseInt(id));
  const [form, setForm] = useState({ jadwal: "", tanggal: "", catatan: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tanggal || !form.jadwal) {
      toast.error("Pilih jadwal dan tanggal");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    toast.success("Booking berhasil! Menunggu konfirmasi pelatih.");
    navigate("/user/riwayat");
  };

  if (!coach) return null;

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
            coach.color || "from-blue-400 to-indigo-500",
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
            <p className="text-[20px] font-bold text-white tracking-[-0.3px]">
              {formatRp(coach.biaya)}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-5 border border-[#f0f0f0]">
          <h3 className="text-[15px] font-semibold text-[#0a0a0a] mb-5 tracking-[-0.2px]">
            Detail Booking
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#aeaeb2] mb-2">
                Pilih Jadwal
              </label>
              {jadwalLatihan?.map((j) => (
                <label
                  key={j.id}
                  className={clsx(
                    "flex items-center gap-3 p-3.5 rounded-xl border mb-2 cursor-pointer transition-all",
                    form.jadwal === j.jam
                      ? "border-[#0a0a0a]"
                      : "border-[#f0f0f0] hover:border-[#d0d0d0]",
                    j.status !== "available" && "opacity-40 cursor-not-allowed",
                  )}
                >
                  <input
                    type="radio"
                    name="jadwal"
                    value={j.jam}
                    onChange={() => setForm((p) => ({ ...p, jadwal: j.jam }))}
                    disabled={j.status !== "available"}
                    className="accent-[#0a0a0a]"
                  />
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-[#0a0a0a]">
                      {j.hari} · {j.jam}
                    </p>
                    <p className="text-[11px] text-[#aeaeb2]">{j.lokasi}</p>
                  </div>
                  <span
                    className={clsx(
                      "badge",
                      j.status === "available" ? "badge-green" : "badge-red",
                    )}
                  >
                    {j.status === "available" ? "Tersedia" : "Penuh"}
                  </span>
                </label>
              ))}
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
                className="w-full px-4 py-2.5 rounded-xl border border-[#f0f0f0] bg-[#f5f5f7]
                           text-[13px] text-[#0a0a0a]
                           focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]"
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
                className="w-full px-4 py-2.5 rounded-xl border border-[#f0f0f0] bg-[#f5f5f7]
                           text-[13px] text-[#0a0a0a] placeholder-[#aeaeb2]
                           focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]
                           resize-none min-h-[80px]"
              />
            </div>

            {/* Summary */}
            <div className="bg-[#f5f5f7] rounded-xl p-4 space-y-2">
              {[
                ["Biaya sesi", formatRp(coach.biaya)],
                ["Durasi", "2 jam"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-[13px]">
                  <span className="text-[#aeaeb2]">{k}</span>
                  <span className="font-semibold text-[#0a0a0a]">{v}</span>
                </div>
              ))}
              <p className="text-[11px] text-[#aeaeb2] pt-1 border-t border-[#e5e5ea]">
                Pembayaran langsung ke pelatih setelah sesi selesai.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0a0a0a] text-white text-[13px] font-semibold py-3.5 rounded-xl
                         hover:opacity-90 transition-all disabled:opacity-40"
            >
              {loading ? "Memproses..." : "Konfirmasi Booking"}
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  );
}

/* ══════════════════════════════════════════
   RIWAYAT
══════════════════════════════════════════ */
export function UserRiwayat() {
  const tabs = ["Semua", "Aktif", "Selesai"];
  const [tab, setTab] = useState("Semua");

  const filtered = bookingList.filter((b) => {
    if (tab === "Aktif") return ["confirmed", "pending"].includes(b.status);
    if (tab === "Selesai") return b.status === "completed";
    return true;
  });

  return (
    <UserLayout title="Jadwal & Riwayat" subtitle="Semua sesi latihanmu">
      <div className="p-6 lg:p-8" style={sf}>
        {/* Tab pills */}
        <div className="flex gap-1 mb-6 bg-white border border-[#f0f0f0] p-1 rounded-xl w-fit">
          {tabs.map((t) => (
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

        {/* List */}
        <div className="space-y-2 max-w-2xl">
          {filtered.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-4 border border-[#f0f0f0] flex items-center gap-4 hover:border-[#d0d0d0] transition-colors"
            >
              {/* Color dot */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[13px] font-bold">
                  {b.pelatihNama.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#0a0a0a]">
                  {b.pelatihNama}
                </p>
                <p className="text-[12px] text-[#aeaeb2]">{b.cabor}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] text-[#aeaeb2] flex items-center gap-1">
                    <HiCalendarDays className="w-3 h-3" /> {b.tanggal}
                  </span>
                  <span className="text-[11px] text-[#aeaeb2] flex items-center gap-1">
                    <HiClock className="w-3 h-3" /> {b.jam} · {b.durasi}jam
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[15px] font-bold text-[#0a0a0a] tracking-[-0.3px]">
                  {formatRp(b.biaya)}
                </p>
                <div className="mt-1">
                  <StatusPill status={b.status} />
                </div>
              </div>
            </motion.div>
          ))}

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
      </div>
    </UserLayout>
  );
}

/* ══════════════════════════════════════════
   FAVORIT
══════════════════════════════════════════ */
export function UserFavorit() {
  const [favs, setFavs] = useState([1, 6]);
  const toggle = (id) =>
    setFavs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const favCoaches = pelatihList.filter((p) => favs.includes(p.id));

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
