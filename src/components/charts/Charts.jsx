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
  { kriteria: "Pengalaman", bobot: 0.35, fill: "#1D4ED8" },
  { kriteria: "Lisensi", bobot: 0.25, fill: "#4338CA" },
  { kriteria: "Prestasi", bobot: 0.25, fill: "#06B6D4" },
  { kriteria: "Biaya", bobot: 0.15, fill: "#10B981" },
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

// ─── Hook: fetch dengan fallback ──────────────────────────────────────────────
function useChartData(fetcher, fallback) {
  const [data, setData] = useState(fallback);
  const { api } = useAuth();

  useEffect(() => {
    fetcher(api)
      .then((res) => {
        const d = res?.data?.data || res?.data;
        if (
          d &&
          (Array.isArray(d) ? d.length > 0 : Object.keys(d).length > 0)
        ) {
          setData(d);
        }
      })
      .catch(() => {
        /* gunakan fallback */
      });
  }, []);

  return data;
}

// ─── BookingLineChart ─────────────────────────────────────────────────────────
export function BookingLineChart() {
  const { dark } = useTheme();
  const gridColor = dark ? "#334155" : "#E2E8F0";
  const textColor = dark ? "#94A3B8" : "#64748B";

  // Fetch booking per bulan dari admin stats atau endpoint khusus
  const { api } = useAuth();
  const [data, setData] = useState(DUMMY_MONTHLY);

  useEffect(() => {
    api
      .get("/api/admin/stats")
      .then((res) => {
        const raw = res?.data?.data || res?.data;
        // Jika backend mengembalikan monthlyBooking array
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
        }
        // Jika backend mengembalikan bookingPerBulan
        else if (
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
        // Tetap pakai dummy jika struktur tidak cocok
      })
      .catch(() => {
        /* tetap dummy */
      });
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
    // Fetch semua pemesanan → hitung per cabor, ATAU pakai endpoint stats
    Promise.all([
      api.get("/api/admin/stats").catch(() => null),
      api.get("/api/cabor").catch(() => null),
    ]).then(([statsRes, caborRes]) => {
      const stats = statsRes?.data?.data || statsRes?.data;

      // Jika backend punya caborStats / bookingPerCabor
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

      // Fallback: hitung dari list cabor (tampilkan jumlah pelatih per cabor)
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
// Bobot AHP adalah konfigurasi sistem (statis), tidak perlu fetch dari API.
// Tapi jika backend punya endpoint bobot dinamis, fetch dari sana.
export function AHPBobot() {
  const { dark } = useTheme();
  const gridColor = dark ? "#334155" : "#E2E8F0";
  const textColor = dark ? "#94A3B8" : "#64748B";
  const { api } = useAuth();
  const [data, setData] = useState(AHP_BOBOT_STATIC);

  useEffect(() => {
    api
      .get("/api/ahp/bobot")
      .catch(() => null)
      .then((res) => {
        const raw = res?.data?.data || res?.data;
        if (Array.isArray(raw) && raw.length > 0) {
          setData(
            raw.map((item, i) => ({
              kriteria: item.nama_kriteria || item.kriteria || item.nama,
              bobot: parseFloat(item.bobot),
              fill:
                AHP_BOBOT_STATIC[i]?.fill || PIE_COLORS[i % PIE_COLORS.length],
            })),
          );
        }
      });
  }, []);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey="kriteria"
          tick={{ fill: textColor, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: textColor, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          domain={[0, 0.5]}
        />
        <Tooltip
          content={<CustomTooltip />}
          formatter={(v) => [(v * 100).toFixed(0) + "%"]}
        />
        <Bar dataKey="bobot" name="Bobot" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── RankingBarChart ──────────────────────────────────────────────────────────
export function RankingBarChart() {
  const { dark } = useTheme();
  const gridColor = dark ? "#334155" : "#E2E8F0";
  const textColor = dark ? "#94A3B8" : "#64748B";
  const { api } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .get("/api/rekomendasi")
      .catch(() => null)
      .then(async (res) => {
        const raw = res?.data?.data || res?.data;

        // Coba endpoint rekomendasi dulu
        if (Array.isArray(raw) && raw.length > 0) {
          setData(
            raw.slice(0, 8).map((p) => ({
              nama: shortenName(p.nama || p.pelatih?.nama || ""),
              skor: parseFloat(p.skor_akhir || p.skorAHP || p.skor || 0),
              cabor: p.cabang?.nama_cabor || p.cabor || "",
            })),
          );
          return;
        }

        // Fallback: fetch semua pelatih → hitung skor AHP di frontend
        const pelatihRes = await api.get("/api/pelatih").catch(() => null);
        const pelatih = pelatihRes?.data?.data || pelatihRes?.data;
        const list = Array.isArray(pelatih)
          ? pelatih
          : Array.isArray(pelatih?.pelatih)
            ? pelatih.pelatih
            : [];

        if (list.length > 0) {
          const maxVal = {
            pengalaman: Math.max(...list.map((p) => p.pengalaman)) || 1,
            lisensi: Math.max(...list.map((p) => p.lisensi)) || 1,
            prestasi: Math.max(...list.map((p) => p.prestasi)) || 1,
            biaya: Math.max(...list.map((p) => p.biaya)) || 1,
          };
          const scored = list
            .filter((p) => p.status_verifikasi === "terverifikasi")
            .map((p) => ({
              nama: shortenName(p.nama),
              skor: parseFloat(
                (
                  0.35 * (p.pengalaman / maxVal.pengalaman) +
                  0.25 * (p.lisensi / maxVal.lisensi) +
                  0.25 * (p.prestasi / maxVal.prestasi) +
                  0.15 * (p.biaya / maxVal.biaya)
                ).toFixed(4),
              ),
              cabor: p.cabang?.nama_cabor || "",
            }))
            .sort((a, b) => b.skor - a.skor)
            .slice(0, 8);

          if (scored.length > 0) {
            setData(scored);
            return;
          }
        }

        // Jika benar-benar belum ada data pelatih terverifikasi
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
