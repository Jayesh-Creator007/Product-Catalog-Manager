import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

export default function AddSubcategory() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get('/category');
        if (response.data.success) {
          setCategories(response.data.records || []);
        }
      } catch (error) {
        toast.error('Error fetching categories');
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) return toast.error("Please select a category");
    if (!name.trim()) return toast.error("Subcategory name cannot be empty");

    setLoading(true);

    try {
      const response = await API.post('/subcategory', {
        category_id: categoryId,
        sub_name: name,
        status,
      });

      if (response.data.success) {
        await Swal.fire({
          title: "Success!",
          text: "Subcategory added successfully.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });

        navigate('/subcategories');
      } else {
        toast.error(response.data.message || "Error adding subcategory");
      }

    } catch (error) {
      toast.error("Error adding subcategory: " + error.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-semibold mb-3">Add Subcategory</h2>

      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label">Select Category</label>
          <select
            className="form-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={loading}
          >
            <option value="">-- Select Category --</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Subcategory Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter subcategory name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            checked={status}
            disabled={loading}
            onChange={(e) => setStatus(e.target.checked)}
          />
          <label className="form-check-label">Active</label>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Adding..." : "Add Subcategory"}
        </button>

      </form>
    </div>
  );
}
