import { useState, useEffect } from 'react';
import api from '../api/axios';
import TransactionForm from '../components/TransactionForm';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [editing, setEditing] = useState(null);
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [page, filterMonth, filterYear, filterType]);

  const fetchCategories = async () => {
    const res = await api.get('/categories');
    setCategories(res.data);
  };

  const fetchTransactions = async () => {
    let url = `/transactions?page=${page}&size=10`;
    if (filterMonth) url += `&month=${filterMonth}`;
    if (filterYear) url += `&year=${filterYear}`;
    if (filterType) url += `&type=${filterType}`;
    const res = await api.get(url);
    setTransactions(res.data.content);
    setTotalPages(res.data.totalPages);
    setTotalElements(res.data.totalElements);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return;
    await api.delete(`/transactions/${id}`);
    fetchTransactions();
  };

  const handleSaved = () => {
    setEditing(null);
    fetchTransactions();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-slate-400 mt-1">{totalElements} transactions total</p>
        </div>
      </div>

      {/* Form */}
      <div className="mb-6">
        <TransactionForm
          categories={categories}
          onSaved={handleSaved}
          editingTransaction={editing}
          onCancel={() => setEditing(null)}
        />
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6 flex flex-wrap gap-4 items-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          Filters
        </div>
        <select
          value={filterMonth}
          onChange={(e) => { setFilterMonth(e.target.value); setPage(0); }}
          className="min-w-[120px]"
        >
          <option value="">All Months</option>
          {monthNames.map((name, i) => (
            <option key={i} value={i + 1}>{name}</option>
          ))}
        </select>
        <select
          value={filterYear}
          onChange={(e) => { setFilterYear(e.target.value); setPage(0); }}
          className="min-w-[100px]"
        >
          <option value="">All Years</option>
          {[2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); setPage(0); }}
          className="min-w-[120px]"
        >
          <option value="">All Types</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>

        {(filterMonth || filterYear || filterType) && (
          <button
            onClick={() => { setFilterMonth(''); setFilterYear(''); setFilterType(''); setPage(0); }}
            className="btn-ghost text-xs"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden animate-fade-in" style={{ animationDelay: '0.15s' }}>
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <div className="col-span-2 text-xs text-slate-500 font-medium uppercase tracking-wider">Date</div>
          <div className="col-span-2 text-xs text-slate-500 font-medium uppercase tracking-wider">Type</div>
          <div className="col-span-2 text-xs text-slate-500 font-medium uppercase tracking-wider">Category</div>
          <div className="col-span-3 text-xs text-slate-500 font-medium uppercase tracking-wider">Description</div>
          <div className="col-span-2 text-xs text-slate-500 font-medium uppercase tracking-wider text-right">Amount</div>
          <div className="col-span-1 text-xs text-slate-500 font-medium uppercase tracking-wider text-center">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-white/5">
          {transactions.map((t, index) => (
            <div
              key={t.id}
              className="table-row grid grid-cols-12 gap-4 px-6 py-4 items-center"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="col-span-2 text-sm text-slate-300 font-mono">
                {t.date}
              </div>
              <div className="col-span-2">
                <span className={t.type === 'INCOME' ? 'badge-income' : 'badge-expense'}>
                  {t.type}
                </span>
              </div>
              <div className="col-span-2 text-sm text-slate-300">
                {t.categoryName}
              </div>
              <div className="col-span-3 text-sm text-slate-500 truncate">
                {t.description || '—'}
              </div>
              <div className={`col-span-2 text-sm font-mono font-medium text-right ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {t.type === 'INCOME' ? '+' : '−'} Rs. {Number(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div className="col-span-1 flex justify-center gap-1">
                <button
                  onClick={() => setEditing(t)}
                  className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-indigo-400 transition-colors"
                  title="Edit"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Delete"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {transactions.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <p className="text-slate-500">No transactions found</p>
              <p className="text-slate-600 text-sm mt-1">Add your first transaction above</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="btn-ghost disabled:opacity-30"
          >
            ← Previous
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                  page === i
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
            className="btn-ghost disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
