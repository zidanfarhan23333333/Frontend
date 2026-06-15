import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

// ─── Dummy fallback ────────────────────────────────────────────────────────────
const DUMMY_MONTHLY = [
  { bulan: "Jan", booking: 65 },
  { bulan: "Feb", booking: 72 },
  { bulan: "Mar", booking: 89 },
  { bulan: "Apr", booking: 95 },
  { bulan: "Mei", booking: 110 },
  { bulan: "Jun", booking: 98 },
  { bulan: "Jul", booking: 124 },
  { bulan: "Agu", booking: 108 },
];

const DUMMY_CABOR = [
  { name: "Bulu Tangkis", value: 28, fill: "#10B981" },
  { name: "Renang", value: 18, fill: "#06B6D4" },
  { name: "Basket", value: 15, fill: "#F97316" },
  { name: "Futsal", value: 14, fill: "#22C55E" },
  { name: "Karate", value: 12, fill: "#EF4444" },
  { name: "Lainnya", value: 13, fill: "#8B5CF6" },
];

const AHP_BOBOT_STATIC = [
  { kriteria: "Pengalaman", bobot: 0.5449, fill: "#1D4ED8" },
  { kriteria: "Lisensi", bobot: 0.2798, fill: "#4338CA" },
  { kriteria: "Prestasi", bobot: 0.1193, fill: "#06B6D4" },
  { kriteria: "Biaya", bobot: 0.056, fill: "#10B981" },
];

const PIE_COLORS = [
  "#10B981",
  "#06B6D4",
  "#F97316",
  "#22C55E",
  "#EF4444",
  "#8B5CF6",
  "#F59E0B",
  "#3B82F6",
];

// ─── Tooltip ──────────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 shadow-sport text-sm">
      <p className="font-bold text-slate-700 dark:text-slate-200 mb-1">
        {label}
      </p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}:{" "}
          {typeof p.value === "number" && p.value > 1000
            ? new Intl.NumberFormat("id-ID").format(p.value)
            : p.value}
        </p>
      ))}
    </div>
  );
};

// ─── BookingLineChart ─────────────────────────────────────────────────────────
export function BookingLineChart() {
  const { dark } = useTheme();
  const gridColor = dark ? "#334155" : "#E2E8F0";
  const textColor = dark ? "#94A3B8" : "#64748B";
  const { api } = useAuth();
  const [data, setData] = useState(DUMMY_MONTHLY);

  useEffect(() => {
    api
      .get("/api/admin/stats")
      .then((res) => {
        const raw = res?.data?.data || res?.data;
        if (
          Array.isArray(raw?.monthlyBooking) &&
          raw.monthlyBooking.length > 0
        ) {
          setData(
            raw.monthlyBooking.map((item) => ({
              bulan: item.bulan || item.month,
              booking: item.booking || item.count || item.total,
            })),
          );
        } else if (
          Array.isArray(raw?.bookingPerBulan) &&
          raw.bookingPerBulan.length > 0
        ) {
          setData(
            raw.bookingPerBulan.map((item) => ({
              bulan: item.bulan || item.month,
              booking: item.booking || item.count || item.total,
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey="bulan"
          tick={{ fill: textColor, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: textColor, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="booking"
          stroke="#1D4ED8"
          strokeWidth={3}
          dot={{ fill: "#1D4ED8", r: 4 }}
          name="Booking"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── CaborPieChart ────────────────────────────────────────────────────────────
export function CaborPieChart() {
  const { api } = useAuth();
  const [data, setData] = useState(DUMMY_CABOR);

  useEffect(() => {
    Promise.all([
      api.get("/api/admin/stats").catch(() => null),
      api.get("/api/cabor").catch(() => null),
    ]).then(([statsRes, caborRes]) => {
      const stats = statsRes?.data?.data || statsRes?.data;
      if (Array.isArray(stats?.caborStats) && stats.caborStats.length > 0) {
        setData(
          stats.caborStats.map((c, i) => ({
            name: c.nama_cabor || c.nama || c.name,
            value: c.total || c.count || c.value,
            fill: PIE_COLORS[i % PIE_COLORS.length],
          })),
        );
        return;
      }
      if (
        Array.isArray(stats?.bookingPerCabor) &&
        stats.bookingPerCabor.length > 0
      ) {
        setData(
          stats.bookingPerCabor.map((c, i) => ({
            name: c.nama_cabor || c.nama || c.name,
            value: c.total || c.count || c.value,
            fill: PIE_COLORS[i % PIE_COLORS.length],
          })),
        );
        return;
      }
      const caborRaw = caborRes?.data?.data || caborRes?.data;
      if (Array.isArray(caborRaw) && caborRaw.length > 0) {
        const mapped = caborRaw
          .filter((c) => (c._count?.pelatih || c.jumlahPelatih || 0) > 0)
          .slice(0, 6)
          .map((c, i) => ({
            name: c.nama_cabor || c.nama,
            value: c._count?.pelatih || c.jumlahPelatih || 1,
            fill: PIE_COLORS[i % PIE_COLORS.length],
          }));
        if (mapped.length > 0) setData(mapped);
      }
    });
  }, []);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.fill || PIE_COLORS[i % PIE_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── AHPBobot ─────────────────────────────────────────────────────────────────
export function AHPBobot({ onBobotLoaded } = {}) {
  const { dark } = useTheme();
  const { api } = useAuth();
  const [data, setData] = useState(AHP_BOBOT_STATIC);

  useEffect(() => {
    api
      .get("/api/ahp/bobot")
      .catch(() => null)
      .then((res) => {
        const raw = res?.data?.data || res?.data;

        const list = Array.isArray(raw?.kriteria)
          ? raw.kriteria
          : Array.isArray(raw)
            ? raw
            : [];

        if (list.length > 0) {
          const mapped = list.map((item, i) => ({
            kriteria: item.nama || item.kriteria || item.nama_kriteria,
            bobot: parseFloat(item.bobot),
            fill:
              AHP_BOBOT_STATIC[i]?.fill || PIE_COLORS[i % PIE_COLORS.length],
          }));

          setData(mapped);

          onBobotLoaded?.(
            mapped.reduce((acc, d) => {
              acc[d.kriteria.toLowerCase()] = d.bobot;
              return acc;
            }, {}),
          );
        }
      });
  }, []);

  const textColor = dark ? "#94A3B8" : "#475569";
  const trackColor = dark ? "#1E293B" : "#F1F5F9";
  const maxBobot = Math.max(...data.map((d) => d.bobot));

  return (
    <div className="flex flex-col gap-4 w-full py-2">
      {data.map((item, i) => {
        const widthPct = ((item.bobot / maxBobot) * 100).toFixed(1);
        const pctLabel = (item.bobot * 100).toFixed(1) + "%";
        return (
          <div key={i} className="flex items-center gap-3">
            <span
              className="text-xs font-semibold shrink-0 text-right"
              style={{ color: textColor, width: "76px" }}
            >
              {item.kriteria}
            </span>
            <div
              className="flex-1 rounded-full overflow-hidden"
              style={{ backgroundColor: trackColor, height: "32px" }}
            >
              <div
                className="h-full rounded-full flex items-center px-3 transition-all duration-700"
                style={{
                  width: `${widthPct}%`,
                  background: `linear-gradient(90deg, ${item.fill}cc, ${item.fill})`,
                  minWidth: "64px",
                }}
              >
                <span className="text-white text-xs font-bold drop-shadow-sm">
                  {pctLabel}
                </span>
              </div>
            </div>
            <span
              className="text-xs font-mono shrink-0"
              style={{ color: textColor, width: "48px" }}
            >
              {item.bobot.toFixed(4)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── RankingBarChart ──────────────────────────────────────────────────────────
// ✅ FIX: Gunakan /api/admin/ranking sebagai satu-satunya sumber kebenaran,
//         sama dengan AdminRanking.jsx dan AdminDashboard.jsx
export function RankingBarChart() {
  const { dark } = useTheme();
  const gridColor = dark ? "#334155" : "#E2E8F0";
  const textColor = dark ? "#94A3B8" : "#64748B";
  const { api } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .get("/api/admin/ranking")
      .then((res) => {
        const raw = res?.data?.data || res?.data;
        // Backend /api/admin/ranking mengembalikan { pelatih: [...], bobot: {...} }
        const list = raw?.pelatih || (Array.isArray(raw) ? raw : []);
        if (list.length > 0) {
          setData(
            list.slice(0, 8).map((p) => ({
              nama: shortenName(p.nama),
              // Backend sudah menghitung skor — ambil langsung
              skor: p.skorAHP ?? p.skor ?? 0,
              cabor: p.cabor || p.cabang?.nama_cabor || "-",
            })),
          );
        } else {
          setData([]);
        }
      })
      .catch(() => {
        setData([]);
      });
  }, []);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[280px] text-slate-400 text-sm">
        Belum ada data pelatih terverifikasi
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 10, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={gridColor}
          horizontal={false}
        />
        <XAxis
          type="number"
          domain={[0, 1]}
          tick={{ fill: textColor, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="nama"
          tick={{ fill: textColor, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={80}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="skor"
          name="Skor AHP"
          fill="url(#gradBar)"
          radius={[0, 6, 6, 0]}
        />
        <defs>
          <linearGradient id="gradBar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#4338CA" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function shortenName(nama = "") {
  const parts = nama.trim().split(" ");
  if (parts.length < 2) return nama;
  return parts[0] + " " + parts[1][0] + ".";
}
