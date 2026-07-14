import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../api/axios';
import SummaryCard from '../components/SummaryCard';

const COLORS = ['#818cf8', '#34d399', '#fb7185', '#fbbf24', '#a78bfa', '#f472b6'];

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-white/10">
        <p className="text-slate-400 text-xs mb-1">{monthNames[label - 1]}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-mono" style={{ color: entry.color }}>
            {entry.name}: Rs. {Number(entry.value).toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchSummary();
  }, [month, year]);

  const fetchSummary = async () => {
    try {
      const res = await api.get(`/dashboard/summary?month=${month}&year=${year}`);
      setSummary(res.data);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    }
  };

  if (!summary) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 skeleton"></div>
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 skeleton"></div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-80 skeleton"></div>
            <div className="h-80 skeleton"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-slate-400 mt-1">Your financial overview</p>
        </div>

        <div className="flex gap-3">
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="min-w-[140px]"
          >
            {monthNames.map((name, i) => (
              <option key={i} value={i + 1}>{name}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="min-w-[100px]"
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          title="Total Income"
          amount={summary.totalIncome}
          color="green"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
          }
        />
        <SummaryCard
          title="Total Expense"
          amount={summary.totalExpense}
          color="red"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fb7185" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
              <polyline points="17 18 23 18 23 12"></polyline>
            </svg>
          }
        />
        <SummaryCard
          title="Net Balance"
          amount={summary.netBalance}
          color="blue"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-3 glass-card p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
            Monthly Trend
          </h2>
          {summary.monthlyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summary.monthlyTrend} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(m) => monthNames[m - 1]?.slice(0, 3)}
                  stroke="rgba(255,255,255,0.1)"
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  stroke="rgba(255,255,255,0.1)"
                  tickFormatter={(v) => `Rs.${(v/1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="totalIncome" fill="#34d399" name="Income" radius={[6, 6, 0, 0]} />
                <Bar dataKey="totalExpense" fill="#fb7185" name="Expense" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500">
              No data for last 6 months
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="lg:col-span-2 glass-card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
              </svg>
            </div>
            Categories
          </h2>
          {summary.categoryBreakdown.length > 0 ? (
            <div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={summary.categoryBreakdown}
                    dataKey="totalAmount"
                    nameKey="categoryName"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    strokeWidth={0}
                  >
                    {summary.categoryBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass-card p-2 border border-white/10">
                            <p className="text-sm font-mono text-white">
                              {payload[0].name}: Rs. {Number(payload[0].value).toLocaleString('en-IN')}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="space-y-2 mt-4">
                {summary.categoryBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-slate-300">{item.categoryName}</span>
                    </div>
                    <span className="font-mono text-slate-400">Rs. {Number(item.totalAmount).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500">
              No expenses this month
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
