import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiTrophy,
  HiStar,
  HiCheckBadge,
  HiUsers,
  HiArrowRight,
  HiChevronDown,
  HiChevronUp,
  HiBolt,
  HiShieldCheck,
} from "react-icons/hi2";
import Navbar from "../../components/layout/Navbar";
import CoachCard from "../../components/coach/CoachCard";
import {
  pelatihList,
  caborList,
  testimoniList,
  faqList,
} from "../../data/dummy";
import Avatar from "../../components/ui/Avatar";
import clsx from "clsx";

/* SF Pro stack as inline style helper */
const sf = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Inter, sans-serif",
};

const stats = [
  { label: "Pelatih Terverifikasi", value: "47+" },
  { label: "Pengguna Aktif", value: "312+" },
  { label: "Sesi Latihan", value: "1.248+" },
  { label: "Cabang Olahraga", value: "12+" },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-white" style={sf}>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="pt-28 pb-0 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          {/* Tag line */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <span className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-1.5 text-[13px] font-medium text-gray-500">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Sistem AHP Pertama di Indonesia
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center text-[52px] sm:text-[68px] lg:text-[80px] font-bold text-[#0a0a0a] leading-[1.05] tracking-[-2px] mb-5"
          >
            Temukan Pelatih
            <br />
            <span className="text-blue-600">Terbaik</span> Untukmu.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-[16px] text-gray-400 max-w-lg mx-auto leading-relaxed mb-8"
          >
            Platform rekomendasi pelatih olahraga berbasis{" "}
            <span className="text-[#0a0a0a] font-medium">
              AHP (Analytic Hierarchy Process)
            </span>{" "}
            — objektif, terukur, dan terpercaya.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-3 mb-14"
          >
            <Link
              to="/rekomendasi"
              className="flex items-center gap-2 bg-[#0a0a0a] text-white text-[14px] font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition-colors tracking-[-0.1px]"
            >
              Mulai Sekarang →
            </Link>
            <Link
              to="/tentang"
              className="flex items-center gap-2 bg-gray-100 text-[#0a0a0a] text-[14px] font-semibold px-6 py-3 rounded-full hover:bg-gray-200 transition-colors tracking-[-0.1px]"
            >
              Pelajari AHP
            </Link>
          </motion.div>

          {/* Hero image band — dark rounded box */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-2xl bg-[#0a0a0a] overflow-hidden relative"
            style={{ minHeight: 340 }}
          >
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />

            <div className="relative z-10 p-8 sm:p-12 grid lg:grid-cols-3 gap-6 items-center">
              {/* Left copy */}
              <div className="lg:col-span-1">
                <p className="text-gray-500 text-[12px] font-medium uppercase tracking-widest mb-3">
                  Top Pelatih
                </p>
                <h2 className="text-white text-3xl font-bold tracking-tight leading-tight mb-4">
                  Sistem rekomendasi
                  <br />
                  berbasis data nyata.
                </h2>
                <Link
                  to="/rekomendasi"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors"
                >
                  Lihat semua pelatih <HiArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Coach cards */}
              <div className="lg:col-span-2 grid sm:grid-cols-3 gap-3">
                {pelatihList.slice(0, 3).map((coach, i) => (
                  <motion.div
                    key={coach.id}
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="bg-white/8 border border-white/10 rounded-xl p-4 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <Avatar
                        initials={coach.initials}
                        size="sm"
                        id={coach.id}
                      />
                      <div className="min-w-0">
                        <p className="text-white text-[13px] font-semibold truncate leading-tight">
                          {coach.nama.split(" ").slice(0, 2).join(" ")}
                        </p>
                        <p className="text-gray-500 text-[11px]">
                          {coach.cabor}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2.5 border-t border-white/10">
                      <span className="text-gray-500 text-[11px]">
                        Skor AHP
                      </span>
                      <span className="text-emerald-400 text-[13px] font-bold">
                        {coach.skorAHP}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== STATS STRIP ===== */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <p className="text-center text-[13px] text-gray-400 mb-10 font-medium">
            A few more facts about us in numbers
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0 sm:divide-x divide-gray-100">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center sm:px-8"
              >
                <p className="text-[40px] sm:text-[48px] font-bold text-[#0a0a0a] leading-none tracking-[-1.5px] mb-1">
                  {s.value}
                </p>
                <p className="text-[13px] text-gray-400">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
                Tentang SportCoach
              </p>
              <h2 className="text-[32px] sm:text-[38px] font-bold text-[#0a0a0a] leading-[1.15] tracking-[-1px]">
                Kami tidak sekadar mencocokkan — kami menemukan yang{" "}
                <em className="text-blue-600 not-italic">tepat</em> untukmu.
              </h2>
            </div>
            <div className="pt-2">
              <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
                Sejak 2025, SportCoach membantu ratusan atlet menemukan pelatih
                yang sesuai menggunakan metode ilmiah AHP. Tidak ada iklan,
                tidak ada favorit — hanya data dan kecocokan yang sesungguhnya.
              </p>
              {/* Feature highlight 3-col */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    icon: HiCheckBadge,
                    label: "Terverifikasi",
                    color: "text-emerald-500",
                  },
                  {
                    icon: HiStar,
                    label: "Skor Objektif",
                    color: "text-amber-500",
                  },
                  {
                    icon: HiUsers,
                    label: "Komunitas Aktif",
                    color: "text-blue-500",
                  },
                ].map((f, i) => (
                  <div
                    key={i}
                    className="text-center p-4 rounded-xl bg-gray-50"
                  >
                    <f.icon className={clsx("w-6 h-6 mx-auto mb-2", f.color)} />
                    <p className="text-[12px] font-medium text-gray-600">
                      {f.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== KEUNGGULAN ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
              Services
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <h2 className="text-[34px] font-bold text-[#0a0a0a] leading-tight tracking-[-1px]">
                Keunggulan Sistem AHP
              </h2>
              <p className="text-[14px] text-gray-400 max-w-xs">
                Metode ilmiah untuk rekomendasi pelatih terbaik berdasarkan
                multi-kriteria terukur.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: HiBolt,
                title: "Multi-Kriteria",
                desc: "Evaluasi berdasarkan pengalaman, lisensi, prestasi, dan biaya secara bersamaan dengan bobot yang terukur.",
                badge: "01",
                dark: true,
              },
              {
                icon: HiShieldCheck,
                title: "Terverifikasi",
                desc: "Semua pelatih melalui proses verifikasi ketat untuk memastikan kualitas dan keabsahan sertifikasi.",
                badge: "02",
                dark: false,
              },
              {
                icon: HiStar,
                title: "Skor Objektif",
                desc: "Perhitungan skor AHP yang transparan dan objektif, bukan berdasarkan iklan atau sponsorship.",
                badge: "03",
                dark: false,
              },
              {
                icon: HiUsers,
                title: "Komunitas Aktif",
                desc: "Jaringan atlet, pelatih, dan pengurus olahraga yang aktif dari seluruh DIY dan sekitarnya.",
                badge: "04",
                dark: false,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={clsx(
                  "rounded-2xl p-7 transition-all duration-200",
                  item.dark
                    ? "bg-[#0a0a0a] text-white"
                    : "bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md",
                )}
              >
                <div className="flex items-start justify-between mb-8">
                  <div
                    className={clsx(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      item.dark ? "bg-white/10" : "bg-gray-100",
                    )}
                  >
                    <item.icon
                      className={clsx(
                        "w-5 h-5",
                        item.dark ? "text-white" : "text-gray-700",
                      )}
                    />
                  </div>
                  <span
                    className={clsx(
                      "text-[11px] font-medium",
                      item.dark ? "text-white/30" : "text-gray-200",
                    )}
                  >
                    {item.badge}
                  </span>
                </div>
                <h3
                  className={clsx(
                    "text-[18px] font-bold mb-2 tracking-[-0.3px]",
                    item.dark ? "text-white" : "text-[#0a0a0a]",
                  )}
                >
                  {item.title}
                </h3>
                <p
                  className={clsx(
                    "text-[14px] leading-relaxed",
                    item.dark ? "text-white/50" : "text-gray-400",
                  )}
                >
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TOP RANKING ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                Peringkat
              </p>
              <h2 className="text-[34px] font-bold text-[#0a0a0a] leading-tight tracking-[-1px]">
                Top Pelatih
              </h2>
            </div>
            <Link
              to="/rekomendasi"
              className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 hover:text-[#0a0a0a] border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50 transition-all"
            >
              Lihat Semua <HiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pelatihList
              .filter((p) => p.status === "verified")
              .slice(0, 4)
              .map((coach, i) => (
                <CoachCard key={coach.id} coach={coach} delay={i * 0.1} />
              ))}
          </div>
        </div>
      </section>

      {/* ===== CABANG OLAHRAGA ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Pilihan
            </p>
            <h2 className="text-[34px] font-bold text-[#0a0a0a] tracking-[-1px]">
              Cabang Olahraga
            </h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {caborList.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-4 text-center cursor-pointer border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <div
                  className={clsx(
                    "w-10 h-10 rounded-xl bg-gradient-to-br mx-auto mb-2.5 flex items-center justify-center text-xl",
                    c.color,
                  )}
                >
                  {c.icon}
                </div>
                <p className="font-semibold text-[12px] text-[#0a0a0a]">
                  {c.name}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {c.count} Pelatih
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONI ===== */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-600 mb-2">
              Testimoni
            </p>
            <h2 className="text-[34px] font-bold text-white tracking-[-1px]">
              Apa Kata Mereka?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimoniList.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/8 rounded-2xl p-5"
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <HiStar key={j} className="w-3.5 h-3.5 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-400 text-[13px] leading-relaxed mb-5">
                  "{t.komentar}"
                </p>
                <div className="flex items-center gap-2.5 pt-3.5 border-t border-white/8">
                  <Avatar initials={t.initials} size="sm" id={i} />
                  <div>
                    <p className="text-white font-semibold text-[13px]">
                      {t.nama}
                    </p>
                    <p className="text-gray-600 text-[11px]">
                      Pelatih: {t.pelatih}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
              FAQ
            </p>
            <h2 className="text-[34px] font-bold text-[#0a0a0a] tracking-[-1px]">
              Pertanyaan Umum
            </h2>
          </div>
          <div className="space-y-2">
            {faqList.map((item, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-[14px] text-[#0a0a0a] pr-4">
                    {item.q}
                  </span>
                  {openFaq === i ? (
                    <HiChevronUp className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  ) : (
                    <HiChevronDown className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-[13px] text-gray-400 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[48px] sm:text-[58px] font-bold text-[#0a0a0a] tracking-[-2px] leading-[1.05] mb-4">
              Siap Memulai
              <br />
              <span className="text-blue-600">Latihan?</span>
            </h2>
            <p className="text-[15px] text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">
              Temukan pelatih terbaik dan mulai perjalanan atletikmu sekarang
              juga.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/register"
                className="bg-[#0a0a0a] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-gray-800 transition-colors text-[14px] tracking-[-0.1px]"
              >
                Mulai Sekarang →
              </Link>
              <Link
                to="/rekomendasi"
                className="bg-white text-[#0a0a0a] font-semibold px-8 py-3.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-[14px]"
              >
                Lihat Pelatih
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-[#0a0a0a] flex items-center justify-center">
                  <HiTrophy className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-[17px] text-[#0a0a0a] tracking-[-0.3px]">
                  Sport<span className="text-blue-600">Coach</span>
                </span>
              </div>
              <p className="text-[13px] text-gray-400 leading-relaxed max-w-xs">
                Platform rekomendasi pelatih olahraga terpercaya berbasis metode
                AHP untuk atlet dan penggemar olahraga.
              </p>
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wide text-[#0a0a0a] mb-4">
                Platform
              </p>
              <div className="space-y-2.5">
                {["Cari Pelatih", "Daftar Pelatih", "Tentang AHP", "FAQ"].map(
                  (l) => (
                    <p
                      key={l}
                      className="text-[13px] text-gray-400 hover:text-[#0a0a0a] cursor-pointer transition-colors"
                    >
                      {l}
                    </p>
                  ),
                )}
              </div>
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wide text-[#0a0a0a] mb-4">
                Kontak
              </p>
              <div className="space-y-2.5">
                <p className="text-[13px] text-gray-400">
                  sportcoach@ugm.ac.id
                </p>
                <p className="text-[13px] text-gray-400">
                  Yogyakarta, Indonesia
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[12px] text-gray-300">© 2025 SportCoach</p>
            <p className="text-[12px] text-gray-300">
              Sistem Rekomendasi Pelatih Olahraga
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
