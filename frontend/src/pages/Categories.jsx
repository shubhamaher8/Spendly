import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await api.get('/categories');
    setCategories(res.data);
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    try {
      await api.post('/categories', { name: newName });
      setNewName('');
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.error || 'Error adding category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.error || 'Cannot delete category with existing transactions');
    }
  };

  const categoryIcons = {
    Food: '🍕',
    Transport: '🚗',
    Entertainment: '🎬',
    Health: '💊',
    Salary: '💰',
    Shopping: '🛍️',
    Other: '📦'
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-slate-400 mt-1">Organize your transactions</p>
      </div>

      {/* Add Category */}
      <div className="glass-card p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="New category name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="flex-1"
          />
          <button
            onClick={handleAdd}
            disabled={loading || !newName.trim()}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add
              </>
            )}
          </button>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat, index) => (
          <div
            key={cat.id}
            className="glass-card p-5 group hover:scale-[1.02] transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${0.1 + index * 0.05}s` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-3xl mb-3">
                  {categoryIcons[cat.name] || '📁'}
                </div>
                <h3 className="font-semibold text-white">{cat.name}</h3>
              </div>
              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-all"
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
      </div>

      {categories.length === 0 && (
        <div className="glass-card p-12 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <p className="text-slate-500">No categories yet</p>
          <p className="text-slate-600 text-sm mt-1">Create your first category above</p>
        </div>
      )}
    </div>
  );
}
