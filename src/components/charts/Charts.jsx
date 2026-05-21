import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts'
import { monthlyBookingData, caborBookingData, ahpBobot, rankingAHPData } from '../../data/dummy'
import { useTheme } from '../../context/ThemeContext'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 shadow-sport text-sm">
      <p className="font-bold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {typeof p.value === 'number' && p.value > 1000
            ? new Intl.NumberFormat('id-ID').format(p.value)
            : p.value}
        </p>
      ))}
    </div>
  )
}

export function BookingLineChart() {
  const { dark } = useTheme()
  const gridColor = dark ? '#334155' : '#E2E8F0'
  const textColor = dark ? '#94A3B8' : '#64748B'
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={monthlyBookingData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="bulan" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="booking" stroke="#1D4ED8" strokeWidth={3} dot={{ fill: '#1D4ED8', r: 4 }} name="Booking" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function CaborPieChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={caborBookingData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
          paddingAngle={3} dataKey="value">
          {caborBookingData.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function AHPBobot() {
  const { dark } = useTheme()
  const gridColor = dark ? '#334155' : '#E2E8F0'
  const textColor = dark ? '#94A3B8' : '#64748B'
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={ahpBobot} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="kriteria" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 0.5]} />
        <Tooltip content={<CustomTooltip />} formatter={v => [(v * 100).toFixed(0) + '%']} />
        <Bar dataKey="bobot" name="Bobot" radius={[6, 6, 0, 0]}>
          {ahpBobot.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function RankingBarChart() {
  const { dark } = useTheme()
  const gridColor = dark ? '#334155' : '#E2E8F0'
  const textColor = dark ? '#94A3B8' : '#64748B'
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={rankingAHPData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
        <XAxis type="number" domain={[0, 1]} tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="nama" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="skor" name="Skor AHP" fill="url(#gradBar)" radius={[0, 6, 6, 0]} />
        <defs>
          <linearGradient id="gradBar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#4338CA" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  )
}
