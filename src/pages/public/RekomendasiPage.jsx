import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  HiMagnifyingGlass,
  HiAdjustmentsHorizontal,
  HiXMark,
} from "react-icons/hi2";
import Navbar from "../../components/layout/Navbar";
import CoachCard from "../../components/coach/CoachCard";
import { pelatihList, caborList } from "../../data/dummy";
import { EmptyState } from "../../components/ui/Badges";

const lisensiOpts = [
  "Semua",
  "Internasional A",
  "Internasional B",
  "Nasional A",
  "Nasional B",
];
const sortOpts = [
  { value: "ahp", label: "Skor AHP Tertinggi" },
  { value: "rating", label: "Rating Tertinggi" },
  { value: "harga-asc", label: "Harga Terendah" },
  { value: "harga-desc", label: "Harga Tertinggi" },
  { value: "pengalaman", label: "Pengalaman Terbanyak" },
];

export default function RekomendasiPage() {
  const [search, setSearch] = useState("");
  const [cabor, setCabor] = useState("Semua");
  const [lisensi, setLisensi] = useState("Semua");
  const [sort, setSort] = useState("ahp");
  const [maxBiaya, setMaxBiaya] = useState(500000);
  const [showFilter, setShowFilter] = useState(false);

  const filtered = useMemo(() => {
    let list = pelatihList.filter((p) => p.status === "verified");
    if (search)
      list = list.filter(
        (p) =>
          p.nama.toLowerCase().includes(search.toLowerCase()) ||
          p.cabor.toLowerCase().includes(search.toLowerCase()),
      );
    if (cabor !== "Semua") list = list.filter((p) => p.cabor === cabor);
    if (lisensi !== "Semua")
      list = list.filter((p) => p.lisensi.includes(lisensi));
    list = list.filter((p) => p.biaya <= maxBiaya);
    list = [...list].sort((a, b) => {
      if (sort === "ahp") return b.skorAHP - a.skorAHP;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "harga-asc") return a.biaya - b.biaya;
      if (sort === "harga-desc") return b.biaya - a.biaya;
      if (sort === "pengalaman") return b.pengalaman - a.pengalaman;
      return 0;
    });
    return list;
  }, [search, cabor, lisensi, sort, maxBiaya]);

  const resetFilter = () => {
    setCabor("Semua");
    setLisensi("Semua");
    setMaxBiaya(500000);
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      <Navbar />

      {/* ── Header ── */}
      <div className="pt-[60px] bg-white dark:bg-[#0a0a0a] border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#aeaeb2] mb-2">
              Rekomendasi
            </p>
            <h1 className="text-[40px] sm:text-[52px] font-bold text-[#0a0a0a] dark:text-white leading-[1.05] tracking-[-0.04em] mb-3">
              Cari Pelatih
            </h1>
            <p className="text-[15px] text-[#6e6e73] dark:text-[#aeaeb2]">
              Temukan pelatih terbaik berdasarkan skor AHP
            </p>
          </motion.div>

          {/* Search bar */}
          <div className="relative max-w-2xl">
            <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aeaeb2]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full
                         border border-[#e5e5ea] dark:border-[#2c2c2e]
                         bg-[#f5f5f7] dark:bg-[#1c1c1e]
                         text-[#0a0a0a] dark:text-white
                         placeholder-[#aeaeb2] dark:placeholder-[#636366]
                         text-[14px] tracking-[-0.01em]
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-150"
              placeholder="Cari nama pelatih atau cabang olahraga..."
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-[#aeaeb2] text-white"
              >
                <HiXMark className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Filter Sidebar ── */}
          <aside
            className={`lg:w-60 flex-shrink-0 ${showFilter ? "block" : "hidden lg:block"}`}
          >
            <div className="sticky top-20 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white tracking-[-0.01em]">
                  Filter
                </h3>
                <button
                  onClick={resetFilter}
                  className="text-[12px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* Cabang Olahraga */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#aeaeb2] mb-3">
                  Cabang Olahraga
                </p>
                <div className="space-y-0.5">
                  {["Semua", ...caborList.map((c) => c.name)]
                    .slice(0, 8)
                    .map((c) => (
                      <button
                        key={c}
                        onClick={() => setCabor(c)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-[13px] transition-colors duration-100 ${
                          cabor === c
                            ? "bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] font-semibold"
                            : "text-[#6e6e73] dark:text-[#aeaeb2] hover:bg-[#f5f5f7] dark:hover:bg-[#1c1c1e] hover:text-[#0a0a0a] dark:hover:text-white"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                </div>
              </div>

              {/* Lisensi */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#aeaeb2] mb-3">
                  Lisensi
                </p>
                <div className="space-y-0.5">
                  {lisensiOpts.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLisensi(l)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-[13px] transition-colors duration-100 ${
                        lisensi === l
                          ? "bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] font-semibold"
                          : "text-[#6e6e73] dark:text-[#aeaeb2] hover:bg-[#f5f5f7] dark:hover:bg-[#1c1c1e] hover:text-[#0a0a0a] dark:hover:text-white"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Maks. Biaya */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#aeaeb2] mb-2">
                  Maks. Biaya
                </p>
                <p className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white mb-3">
                  Rp {maxBiaya.toLocaleString("id-ID")}
                </p>
                <input
                  type="range"
                  min={100000}
                  max={500000}
                  step={50000}
                  value={maxBiaya}
                  onChange={(e) => setMaxBiaya(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-[11px] text-[#aeaeb2] mt-1.5">
                  <span>Rp 100K</span>
                  <span>Rp 500K</span>
                </div>
              </div>
            </div>
          </aside>

          {/* ── Results ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
              <p className="text-[13px] text-[#aeaeb2]">
                Menampilkan{" "}
                <span className="font-semibold text-[#0a0a0a] dark:text-white">
                  {filtered.length}
                </span>{" "}
                pelatih
              </p>
              <div className="flex items-center gap-2">
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="lg:hidden flex items-center gap-1.5 text-[13px] font-medium
                             text-[#6e6e73] border border-[#e5e5ea] dark:border-[#2c2c2e]
                             px-3.5 py-2 rounded-full hover:bg-[#f5f5f7] dark:hover:bg-[#1c1c1e]
                             transition-colors"
                >
                  <HiAdjustmentsHorizontal className="w-4 h-4" />
                  Filter
                </button>

                {/* Sort */}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="text-[13px] font-medium text-[#0a0a0a] dark:text-white
                             border border-[#e5e5ea] dark:border-[#2c2c2e]
                             bg-white dark:bg-[#1c1c1e]
                             px-4 py-2 rounded-full
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             transition-colors cursor-pointer"
                >
                  {sortOpts.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid or Empty */}
            {filtered.length === 0 ? (
              <EmptyState
                icon={HiMagnifyingGlass}
                title="Pelatih tidak ditemukan"
                description="Coba ubah filter atau kata kunci pencarian"
                action={
                  <button onClick={resetFilter} className="btn-primary">
                    Reset Filter
                  </button>
                }
              />
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((coach, i) => (
                  <CoachCard key={coach.id} coach={coach} delay={i * 0.06} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
