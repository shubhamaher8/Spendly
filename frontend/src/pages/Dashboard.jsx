import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../api/axios';
import SummaryCard from '../components/SummaryCard';

const COLORS = ['#78716c', '#2563eb', '#16a34a', '#dc2626', '#a16207', '#7c3aed'];

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#fff',
        border: '1px solid var(--border)',
        padding: '8px 12px',
        fontSize: 13
      }}>
        <div style={{ color: 'var(--ink-muted)', marginBottom: 4, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {monthNames[label - 1]}
        </div>
        {payload.map((entry, index) => (
          <div key={index} style={{ fontFamily: 'var(--font-mono)', color: entry.color }}>
            {entry.name}: Rs. {Number(entry.value).toLocaleString('en-IN')}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <path
        d={`M ${cx},${cy}
            L ${cx + outerRadius * 1.05 * Math.cos(startAngle)}
              ${cy + outerRadius * 1.05 * Math.sin(startAngle)}
            A ${outerRadius * 1.05} ${outerRadius * 1.05} 0 1 1
              ${cx + outerRadius * 1.05 * Math.cos(endAngle)}
              ${cy + outerRadius * 1.05 * Math.sin(endAngle)} Z`}
        fill={fill}
        opacity={0.9}
      />
    </g>
  );
};

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [activeIndex, setActiveIndex] = useState(null);

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
      <div className="page">
        <div style={{ color: 'var(--ink-muted)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="flex justify-between items-center mb-8 dashboard-header">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Monthly overview</p>
        </div>

        <div className="flex gap-3">
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            style={{ width: 'auto', minWidth: 130 }}
          >
            {monthNames.map((name, i) => (
              <option key={i} value={i + 1}>{name}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            style={{ width: 'auto', minWidth: 90 }}
          >
            {[2024, 2025, 2026, 2027, 2028].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid-3 mb-8">
        <SummaryCard title="Income" amount={summary.totalIncome} dotColor="green" />
        <SummaryCard title="Expense" amount={summary.totalExpense} dotColor="red" />
        <SummaryCard title="Net" amount={summary.netBalance} dotColor="blue" />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-label">Monthly trend</div>
          <div className="chart-container">
            {summary.monthlyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={summary.monthlyTrend} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#78716c', fontSize: 11 }}
                    tickFormatter={(m) => monthNames[m - 1]?.slice(0, 3)}
                    stroke="var(--border)"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#78716c', fontSize: 11 }}
                    stroke="var(--border)"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${(v/1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                  <Bar dataKey="totalIncome" fill="var(--green)" name="Income" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="totalExpense" fill="var(--red)" name="Expense" radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-muted)' }}>
                No data for the last 6 months
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="section-label">By category</div>
          {summary.categoryBreakdown.length > 0 ? (
            <div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={summary.categoryBreakdown}
                    dataKey="totalAmount"
                    nameKey="categoryName"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                    strokeWidth={0}
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onClick={(_, index) => setActiveIndex(activeIndex === index ? null : index)}
                  >
                    {summary.categoryBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div style={{ background: '#fff', border: '1px solid var(--border)', padding: '6px 10px', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
                            {payload[0].name}: Rs. {Number(payload[0].value).toLocaleString('en-IN')}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
                {summary.categoryBreakdown.map((item, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, background: COLORS[index % COLORS.length], flexShrink: 0 }} />
                      <span>{item.categoryName}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
                      Rs. {Number(item.totalAmount).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-muted)' }}>
              No expenses this month
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
