import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(true);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
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

  const handleCategoryChange = async (e) => {
    const catId = e.target.value;
    setCategoryId(catId);
    setSubcategoryId('');
    setSubcategories([]);

    if (!catId) return;

    try {
      const response = await API.get(`/subcategory/byCategory/${catId}`);
      if (response.data.success) {
        setSubcategories(response.data.records || []);
      }
    } catch (error) {
      toast.error('Error fetching subcategories');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      setImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) return toast.error("Please select a category");
    if (!subcategoryId) return toast.error("Please select a subcategory");
    if (!name.trim()) return toast.error("Product name cannot be empty");
    if (!price || price <= 0) return toast.error("Invalid price");

    setLoading(true);

    try {
      // Use FormData for multipart/form-data
      const formData = new FormData();
      formData.append('category_id', categoryId);
      formData.append('subcategory_id', subcategoryId);
      formData.append('p_name', name);
      formData.append('p_price', parseFloat(price));
      formData.append('p_description', description);
      formData.append('status', status);

      // Add image if selected
      if (image) {
        formData.append('image', image);
      }

      const response = await API.post('/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        await Swal.fire({
          title: 'Success!',
          text: 'Product added successfully.',
          icon: 'success',
          confirmButtonColor: "#3085d6"
        });

        navigate('/products');
      } else {
        toast.error(response.data.message || "Error adding product");
      }

    } catch (error) {
      toast.error("Error adding product: " + error.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-semibold mb-3">Add Product</h2>

      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label">Select Category</label>
          <select
            className="form-select"
            value={categoryId}
            onChange={handleCategoryChange}
            disabled={loading}
          >
            <option value="">-- Select Category --</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Select Subcategory</label>
          <select
            className="form-select"
            value={subcategoryId}
            disabled={!categoryId || loading}
            onChange={(e) => setSubcategoryId(e.target.value)}
          >
            <option value="">-- Select Subcategory --</option>
            {subcategories.map(subcat => (
              <option key={subcat._id} value={subcat._id}>{subcat.sub_name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            placeholder="Enter product name"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price (₹)</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={loading}
            placeholder="Enter price"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            placeholder="Enter description (optional)"
          />
        </div>

        {/* IMAGE UPLOAD SECTION */}
        <div className="mb-3 p-3 border border-dashed">
          <label className="form-label fw-semibold">Product Image (Optional)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
          />
          <small className="text-muted d-block mt-2">Supported: JPG, PNG, GIF, WebP (Max 5MB)</small>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-3">
              <p className="fw-semibold">Preview:</p>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px' }}
              />
              <br />
              <button 
                type="button" 
                className="btn btn-sm btn-danger mt-2"
                onClick={handleRemoveImage}
              >
                Remove Image
              </button>
            </div>
          )}
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

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>

      </form>
    </div>
  );
}
