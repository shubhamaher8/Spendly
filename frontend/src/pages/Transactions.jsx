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
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Transactions</h1>
        <p className="page-subtitle">{totalElements} total</p>
      </div>

      <div className="mb-6">
        <TransactionForm
          categories={categories}
          onSaved={handleSaved}
          editingTransaction={editing}
          onCancel={() => setEditing(null)}
        />
      </div>

      <div className="card mb-6" style={{ padding: '16px 20px' }}>
        <div className="filter-bar">
          <span className="section-label" style={{ margin: 0 }}>Filter</span>
          <select
            value={filterMonth}
            onChange={(e) => { setFilterMonth(e.target.value); setPage(0); }}
          >
            <option value="">All months</option>
            {monthNames.map((name, i) => (
              <option key={i} value={i + 1}>{name}</option>
            ))}
          </select>
          <select
            value={filterYear}
            onChange={(e) => { setFilterYear(e.target.value); setPage(0); }}
          >
            <option value="">All years</option>
            {[2024, 2025, 2026, 2027, 2028].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setPage(0); }}
          >
            <option value="">All types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
          {(filterMonth || filterYear || filterType) && (
            <button
              className="text-action"
              onClick={() => { setFilterMonth(''); setFilterYear(''); setFilterType(''); setPage(0); }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '0 24px' }}>
          <div className="table-header" style={{ gridTemplateColumns: '100px 90px 1fr 100px 120px 80px' }}>
            <div className="table-header-cell">Date</div>
            <div className="table-header-cell">Type</div>
            <div className="table-header-cell">Category</div>
            <div className="table-header-cell">Description</div>
            <div className="table-header-cell text-right">Amount</div>
            <div className="table-header-cell" style={{ textAlign: 'center' }}>Actions</div>
          </div>

          {transactions.map((t) => (
            <div key={t.id} className="table-row" style={{ gridTemplateColumns: '100px 90px 1fr 100px 120px 80px' }}>
              <div data-label="Date" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-muted)' }}>
                {t.date}
              </div>
              <div data-label="Type">
                <span className={`badge badge-${t.type === 'INCOME' ? 'income' : 'expense'}`}>
                  <span className={`dot dot-${t.type === 'INCOME' ? 'green' : 'red'}`} />
                  {t.type === 'INCOME' ? 'Income' : 'Expense'}
                </span>
              </div>
              <div data-label="Category" style={{ fontSize: 13 }}>{t.categoryName}</div>
              <div data-label="Description" style={{ fontSize: 13, color: 'var(--ink-muted)' }} className="truncate">
                {t.description || '—'}
              </div>
              <div data-label="Amount" className={`amount ${t.type === 'INCOME' ? 'amount-positive' : 'amount-negative'}`}>
                {t.type === 'INCOME' ? '+' : '−'} Rs. {Number(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex gap-2" style={{ justifyContent: 'center' }}>
                <button className="text-action" onClick={() => setEditing(t)}>Edit</button>
                <button className="text-action text-action-danger" onClick={() => handleDelete(t.id)}>Delete</button>
              </div>
            </div>
          ))}

          {transactions.length === 0 && (
            <div className="empty-state">
              No transactions found
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={page === i ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
