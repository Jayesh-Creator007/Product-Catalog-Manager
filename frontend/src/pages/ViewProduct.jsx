import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

export default function ViewProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editSubcategoryId, setEditSubcategoryId] = useState('');
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await API.get('/product');
      if (response.data.success) {
        setProducts(response.data.records || []);
      }
    } catch (error) {
      toast.error("Failed to fetch products");
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
      title: "Delete Product?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Delete"
    });

    if (!res.isConfirmed) return;

    try {
      const response = await API.delete(`/product/${id}`);
      if (response.data.success) {
        toast.success("Product deleted");
        fetchProducts();
      } else {
        toast.error("Delete failed");
      }
    } catch (error) {
      toast.error("Error deleting: " + error.message);
    }
  };

  const handleEdit = async (product) => {
    setEditingId(product._id);
    setEditCategoryId(product.category_id._id);
    setEditName(product.p_name);
    setEditPrice(product.p_price);
    setEditDescription(product.p_description || "");
    setEditStatus(product.status);

    try {
      const response = await API.get(`/subcategory/byCategory/${product.category_id._id}`);
      if (response.data.success) {
        setSubcategories(response.data.records || []);
        setEditSubcategoryId(product.subcategory_id._id);
      }
    } catch (error) {
      toast.error("Failed to fetch subcategories");
    }
  };

  const handleCategoryChange = async (catId) => {
    setEditCategoryId(catId);
    setEditSubcategoryId('');
    setSubcategories([]);

    if (catId) {
      try {
        const response = await API.get(`/subcategory/byCategory/${catId}`);
        if (response.data.success) {
          setSubcategories(response.data.records || []);
        }
      } catch (error) {
        toast.error("Failed to fetch subcategories");
      }
    }
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return toast.error("Product name is required");
    if (!editCategoryId) return toast.error("Category must be selected");
    if (!editSubcategoryId) return toast.error("Subcategory must be selected");

    try {
      const response = await API.put(`/product/${id}`, {
        category_id: editCategoryId,
        subcategory_id: editSubcategoryId,
        p_name: editName,
        p_price: parseFloat(editPrice),
        p_description: editDescription,
        status: editStatus,
      });

      if (response.data.success) {
        toast.success("Product updated");
        setEditingId(null);
        fetchProducts();
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
      <h2 className="mb-3 fw-semibold">View Products</h2>

      <button className="btn btn-primary mb-3" onClick={() => navigate('/add-product')}>
        + Add Product
      </button>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th>Status</th>
                <th style={{ width: "180px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((prod, index) => (
                <tr key={prod._id}>
                  <td>{index + 1}</td>

                  <td>
                    {editingId === prod._id ? (
                      <select
                        className="form-select form-select-sm"
                        value={editCategoryId}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                      >
                        <option value="">-- Category --</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    ) : prod.category_id?.name}
                  </td>

                  <td>
                    {editingId === prod._id ? (
                      <select
                        className="form-select form-select-sm"
                        value={editSubcategoryId}
                        onChange={(e) => setEditSubcategoryId(e.target.value)}
                      >
                        <option value="">-- Subcategory --</option>
                        {subcategories.map((sub) => (
                          <option key={sub._id} value={sub._id}>{sub.sub_name}</option>
                        ))}
                      </select>
                    ) : prod.subcategory_id?.sub_name || "N/A"}
                  </td>

                  <td>
                    {editingId === prod._id ? (
                      <input
                        className="form-control form-control-sm"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : prod.p_name}
                  </td>

                  <td>
                    {editingId === prod._id ? (
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                      />
                    ) : `₹${prod.p_price}`}
                  </td>

                  <td className="desc-col">
                    {editingId === prod._id ? (
                      <textarea
                        className="form-control form-control-sm"
                        rows={2}
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                    ) : prod.p_description || "N/A"}
                  </td>

                  <td>
                    {editingId === prod._id ? (
                      <select
                        className="form-select form-select-sm"
                        value={editStatus ? 'active' : 'inactive'}
                        onChange={(e) => setEditStatus(e.target.value === 'active')}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : (
                      <span className={`badge ${prod.status ? 'bg-success' : 'bg-secondary'}`}>
                        {prod.status ? "Active" : "Inactive"}
                      </span>
                    )}
                  </td>

                  <td>
                    {editingId === prod._id ? (
                      <>
                        <button className="btn btn-sm btn-success me-2" onClick={() => handleUpdate(prod._id)}>Save</button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(prod)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(prod._id)}>Delete</button>
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
        .desc-col {
          max-width: 240px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
}
