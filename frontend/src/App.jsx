import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Dashboard from './pages/Dashboard';
import AddCategory from './pages/AddCategory';
import ViewCategory from './pages/ViewCategory';
import AddSubcategory from './pages/AddSubcategory';
import ViewSubcategory from './pages/ViewSubcategory';
import AddProduct from './pages/AddProduct';
import ViewProduct from './pages/ViewProduct';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      {/* GLOBAL TOAST CONTAINER */}
      <ToastContainer
        position="top-right"
        theme="colored"
        autoClose={2500}
        pauseOnHover={true}
      />

      <div className="d-flex layout">

        {/* SIDEBAR */}
        <div className="sidebar bg-dark text-white p-3">
          <h5 className="fw-bold mb-4">CRUD Admin</h5>

          <nav className="nav flex-column gap-1">
            <Link className="nav-link text-white" to="/">Dashboard</Link>

            <div className="mb-2">
              <small className="text-secondary">Categories</small>
              <div className="d-flex flex-column ms-2">
                <Link className="side-item" to="/add-category">Add Category</Link>
                <Link className="side-item" to="/categories">View Categories</Link>
              </div>
            </div>

            <div className="mb-2">
              <small className="text-secondary">Subcategories</small>
              <div className="d-flex flex-column ms-2">
                <Link className="side-item" to="/add-subcategory">Add Subcategory</Link>
                <Link className="side-item" to="/subcategories">View Subcategories</Link>
              </div>
            </div>

            <div>
              <small className="text-secondary">Products</small>
              <div className="d-flex flex-column ms-2">
                <Link className="side-item" to="/add-product">Add Product</Link>
                <Link className="side-item" to="/products">View Products</Link>
              </div>
            </div>
          </nav>
        </div>

        {/* CONTENT */}
        <div className="content-area">
          <div className="page-container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add-category" element={<AddCategory />} />
              <Route path="/categories" element={<ViewCategory />} />
              <Route path="/add-subcategory" element={<AddSubcategory />} />
              <Route path="/subcategories" element={<ViewSubcategory />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/products" element={<ViewProduct />} />
            </Routes>
          </div>
        </div>
      </div>

      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow-x: hidden;
        }

        .layout {
          width: 100%;
          min-height: 100vh;
        }

        .sidebar {
          width: 240px;
          min-height: 100vh;
          flex-shrink: 0;
        }

        .side-item {
          text-decoration: none;
          color: rgba(255,255,255,0.85);
          padding: 3px 0;
          font-size: 14px;
        }

        .side-item:hover {
          color: white;
        }

        .content-area {
          flex: 1 1 auto;
          width: 100%;
          background: #f4f5f7;
          padding: 24px;
          overflow-y: auto;
          min-width: 0;
        }

        .page-container {
          width: 100%;
        }
      `}</style>
    </Router>
  );
}

export default App;
