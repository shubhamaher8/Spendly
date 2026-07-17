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
    <div className="card">
      <div className="section-label" style={{ marginBottom: 16 }}>
        {editingTransaction ? 'Edit transaction' : 'New transaction'}
      </div>
      <form onSubmit={handleSubmit} className="form-row" style={{ flexWrap: 'wrap' }}>
        <div className="form-field" style={{ flex: '0 0 120px' }}>
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            placeholder="0"
            value={form.amount}
            onChange={handleChange}
            inputMode="numeric"
            required
          />
        </div>
        <div className="form-field" style={{ flex: '0 0 120px' }}>
          <label>Type</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
        </div>
        <div className="form-field" style={{ flex: '0 0 160px' }}>
          <label>Category</label>
          <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
            <option value="">Select</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="form-field" style={{ flex: '0 0 150px' }}>
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field" style={{ flex: 1, minWidth: 160 }}>
          <label>Description</label>
          <input
            type="text"
            name="description"
            placeholder="Optional"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-field" style={{ flex: '0 0 auto', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-primary">
            {editingTransaction ? 'Update' : 'Add'}
          </button>
        </div>
        {editingTransaction && (
          <div className="form-field" style={{ flex: '0 0 auto', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-ghost" onClick={onCancel}>
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
