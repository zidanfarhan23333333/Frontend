import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  HiStar,
  HiMapPin,
  HiTrophy,
  HiClock,
  HiArrowUpRight,
} from "react-icons/hi2";
import Avatar from "../ui/Avatar";
import { StatusBadge } from "../ui/Badges";
import clsx from "clsx";

export default function CoachCard({ coach, delay = 0 }) {
  const formatRupiah = (n) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="card overflow-hidden hover:shadow-sport-lg transition-all duration-300"
    >
      {/* Top gradient bar */}
      <div
        className={clsx(
          "h-1.5 bg-gradient-to-r",
          coach.color || "from-primary-500 to-indigo-600",
        )}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              {coach.foto ? (
                <img
                  src={coach.foto}
                  alt={coach.nama}
                  className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                />
              ) : (
                <Avatar initials={coach.initials} size="md" id={coach.id} />
              )}
              {coach.ranking <= 3 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-white text-[10px] font-black">
                  {coach.ranking}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white leading-tight">
                {coach.nama}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {coach.cabor}
              </p>
            </div>
          </div>
          <StatusBadge status={coach.status} />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
            <p className="text-xs text-slate-400 font-medium">Pengalaman</p>
            <p className="text-base font-display font-black text-slate-800 dark:text-white mt-0.5">
              {coach.pengalaman} Thn
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
            <p className="text-xs text-slate-400 font-medium">Skor AHP</p>
            <p
              className={clsx(
                "text-base font-display font-black mt-0.5",
                coach.skorAHP >= 0.9
                  ? "text-emerald-500"
                  : coach.skorAHP >= 0.8
                    ? "text-primary-600"
                    : "text-amber-500",
              )}
            >
              {coach.skorAHP.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <HiTrophy className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span className="truncate">{coach.lisensi}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <HiMapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
            <span>{coach.lokasi}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <HiStar className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>
              {coach.rating}/5.0 · {coach.totalBooking} sesi
            </span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Per Sesi</p>
            <p className="text-base font-display font-black text-primary-700 dark:text-primary-400">
              {formatRupiah(coach.biaya)}
            </p>
          </div>
          <Link
            to={`/user/detail/${coach.id}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-xs font-bold hover:shadow-sport transition-all duration-200 hover:scale-105"
          >
            Detail <HiArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
