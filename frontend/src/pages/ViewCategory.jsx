import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

export default function ViewCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await API.get('/category');
      if (response.data.success) {
        setCategories(response.data.records || []);
      }
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Category?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Delete"
    });

    if (!result.isConfirmed) return;

    try {
      const response = await API.delete(`/category/${id}`);
      if (response.data.success) {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      toast.error("Error deleting: " + error.message);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setEditName(category.name);
    setEditStatus(category.status);
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return toast.error("Category name cannot be empty");

    try {
      const response = await API.put(`/category/${id}`, { name: editName, status: editStatus });

      if (response.data.success) {
        toast.success("Category updated");
        setEditingId(null);
        fetchCategories();
      } else {
        toast.error("Error updating category");
      }

    } catch (error) {
      toast.error("Update failed: " + error.message);
    }
  };

  if (loading) {
    return <div className="container mt-5"><p>Loading...</p></div>;
  }

  return (
    <div className="category-page">

      <div className="page-header">
        <h2 className="page-title">View Categories</h2>
        <button className="btn btn-primary" onClick={() => navigate('/add-category')}>
          + Add New Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="empty">No categories found.</div>
      ) : (
        <div className="table-wrapper">
          <table className="table custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th style={{ width: "180px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, index) => (
                <tr key={cat._id}>
                  <td className="id-col">{index + 1}</td>

                  <td>
                    {editingId === cat._id ? (
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : cat.name}
                  </td>

                  <td>
                    {editingId === cat._id ? (
                      <select
                        className="form-select form-select-sm"
                        value={editStatus ? 'active' : 'inactive'}
                        onChange={(e) => setEditStatus(e.target.value === 'active')}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : (
                      <span className={`badge ${cat.status ? 'bg-success' : 'bg-secondary'}`}>
                        {cat.status ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </td>

                  <td>
                    {editingId === cat._id ? (
                      <>
                        <button className="btn btn-sm btn-success me-2" onClick={() => handleUpdate(cat._id)}>Save</button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(cat)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat._id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      <style>{`
      .category-page {
        width: 100%;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .page-title {
        font-weight: 600;
      }

      .table-wrapper {
        background: white;
        padding: 16px;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        border: 1px solid rgba(0,0,0,0.05);
      }

      .custom-table thead {
        background: #f8f9fa;
      }

      .custom-table tbody tr:hover {
        background: #f5f7fa;
        transition: 0.2s ease;
      }

      .id-col {
        width: 60px;
        text-align: center;
        font-weight: 600;
      }

      .empty {
        padding: 20px;
        text-align: center;
        background: #fff;
        border-radius: 10px;
        border: 1px solid rgba(0,0,0,0.05);
      }
    `}</style>
    </div>
  );
}
