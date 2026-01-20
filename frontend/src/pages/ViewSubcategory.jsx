import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

export default function ViewSubcategory() {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState(true);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      const response = await API.get('/subcategory');
      if (response.data.success) {
        setSubcategories(response.data.records || []);
      }
    } catch (error) {
      toast.error("Failed to fetch subcategories");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await API.get('/category');
      if (response.data.success) {
        setCategories(response.data.records || []);
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: "Delete Subcategory?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Delete"
    });

    if (!res.isConfirmed) return;

    try {
      const response = await API.delete(`/subcategory/${id}`);
      if (response.data.success) {
        toast.success("Subcategory deleted");
        fetchSubcategories();
      } else {
        toast.error("Delete failed");
      }
    } catch (error) {
      toast.error("Error deleting: " + error.message);
    }
  };

  const handleEdit = (subcat) => {
    setEditingId(subcat._id);
    setEditCategoryId(subcat.category_id?._id);
    setEditName(subcat.sub_name);
    setEditStatus(subcat.status);
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return toast.error("Subcategory name is required");
    if (!editCategoryId) return toast.error("Category is required");

    try {
      const response = await API.put(`/subcategory/${id}`, {
        category_id: editCategoryId,
        sub_name: editName,
        status: editStatus,
      });

      if (response.data.success) {
        toast.success("Subcategory updated");
        setEditingId(null);
        fetchSubcategories();
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      toast.error("Error updating: " + error.message);
    }
  };

  if (loading) {
    return <div className="container mt-5"><p>Loading...</p></div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-3 fw-semibold">View Subcategories</h2>

      <button className="btn btn-primary mb-3" onClick={() => navigate('/add-subcategory')}>
        + Add Subcategory
      </button>

      {subcategories.length === 0 ? (
        <p>No subcategories found.</p>
      ) : (
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Category</th>
              <th>Name</th>
              <th>Status</th>
              <th style={{ width: "180px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {subcategories.map((subcat, index) => (
              <tr key={subcat._id}>
                <td>{index + 1}</td>

                <td>
                  {editingId === subcat._id ? (
                    <select
                      className="form-select form-select-sm"
                      value={editCategoryId}
                      onChange={(e) => setEditCategoryId(e.target.value)}
                    >
                      <option value="">-- Category --</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  ) : (
                    subcat.category_id?.name || "N/A"
                  )}
                </td>

                <td>
                  {editingId === subcat._id ? (
                    <input
                      className="form-control form-control-sm"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    subcat.sub_name
                  )}
                </td>

                <td>
                  {editingId === subcat._id ? (
                    <select
                      className="form-select form-select-sm"
                      value={editStatus ? 'active' : 'inactive'}
                      onChange={(e) => setEditStatus(e.target.value === 'active')}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  ) : (
                    <span className={`badge ${subcat.status ? 'bg-success' : 'bg-secondary'}`}>
                      {subcat.status ? "Active" : "Inactive"}
                    </span>
                  )}
                </td>

                <td>
                  {editingId === subcat._id ? (
                    <>
                      <button className="btn btn-sm btn-success me-2" onClick={() => handleUpdate(subcat._id)}>Save</button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(subcat)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(subcat._id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <style>{`
        .badge {
          font-size: 12px;
          padding: 5px 10px;
        }
      `}</style>
    </div>
  );
}
