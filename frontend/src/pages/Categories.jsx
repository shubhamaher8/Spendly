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

  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <div className="page-header">
        <h1 className="page-title">Categories</h1>
        <p className="page-subtitle">Organize your transactions</p>
      </div>

      <div className="card mb-6">
        <div className="inline-form">
          <input
            type="text"
            placeholder="New category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button
            className="btn-primary"
            onClick={handleAdd}
            disabled={loading || !newName.trim()}
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>

      {categories.length > 0 ? (
        <div className="category-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="card category-card">
              <span className="category-name">{cat.name}</span>
              <button
                className="text-action text-action-danger"
                onClick={() => handleDelete(cat.id, cat.name)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          No categories yet. Create one above.
        </div>
      )}
    </div>
  );
}
