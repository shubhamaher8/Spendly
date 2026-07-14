import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function TransactionForm({ categories, onSaved, editingTransaction, onCancel }) {
  const [form, setForm] = useState({
    amount: '',
    type: 'EXPENSE',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    if (editingTransaction) {
      const cat = categories.find(c => c.name === editingTransaction.categoryName);
      setForm({
        amount: editingTransaction.amount,
        type: editingTransaction.type,
        categoryId: cat ? cat.id : '',
        date: editingTransaction.date,
        description: editingTransaction.description || ''
      });
    }
  }, [editingTransaction, categories]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTransaction) {
        await api.put(`/transactions/${editingTransaction.id}`, {
          ...form,
          amount: parseFloat(form.amount),
          categoryId: parseInt(form.categoryId)
        });
      } else {
        await api.post('/transactions', {
          ...form,
          amount: parseFloat(form.amount),
          categoryId: parseInt(form.categoryId)
        });
      }
      setForm({ amount: '', type: 'EXPENSE', categoryId: '', date: new Date().toISOString().split('T')[0], description: '' });
      onSaved();
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving transaction');
    }
  };

  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {editingTransaction ? (
              <>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </>
            ) : (
              <>
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </>
            )}
          </svg>
        </div>
        {editingTransaction ? 'Edit Transaction' : 'New Transaction'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-xs text-slate-400 mb-2 font-medium">Amount</label>
          <input
            type="number"
            name="amount"
            placeholder="0.00"
            value={form.amount}
            onChange={handleChange}
            className="w-full font-mono"
            required
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-2 font-medium">Type</label>
          <select name="type" value={form.type} onChange={handleChange} className="w-full">
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-2 font-medium">Category</label>
          <select name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full" required>
            <option value="">Select</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-2 font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full"
            required
          />
        </div>
      </div>

      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-xs text-slate-400 mb-2 font-medium">Description</label>
          <input
            type="text"
            name="description"
            placeholder="Optional note..."
            value={form.description}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={handleSubmit} className="btn-primary">
            {editingTransaction ? 'Update' : 'Add Transaction'}
          </button>
          {editingTransaction && (
            <button onClick={onCancel} className="btn-ghost">
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
