import { useEffect, useState } from 'react';
import API from '../api/axios';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, TimeScale);

export default function Dashboard() {
  const [data, setData] = useState({
    categories: [],
    subcategories: [],
    products: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const [cat, sub, prod] = await Promise.all([
        API.get('/category'),
        API.get('/subcategory'),
        API.get('/product')
      ]);

      setData({
        categories: cat.data.records || [],
        subcategories: sub.data.records || [],
        products: prod.data.records || []
      });
    };

    fetchData();
  }, []);

  const toHours = arr => {
    return arr
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map(x => ({
        x: new Date(x.createdAt),
        y: arr.indexOf(x) + 1
      }));
  };

  const catData = toHours(data.categories);
  const subData = toHours(data.subcategories);
  const prodData = toHours(data.products);

  return (
    <div className="dashboard">

      <h2 className="fw-semibold">Dashboard</h2>

      {/* CARDS */}
      <div className="card-row">
        <div className="stat-card blue">
          <span className="label">Categories</span>
          <span className="value">{data.categories.length}</span>
        </div>
        <div className="stat-card green">
          <span className="label">Subcategories</span>
          <span className="value">{data.subcategories.length}</span>
        </div>
        <div className="stat-card yellow">
          <span className="label">Products</span>
          <span className="value">{data.products.length}</span>
        </div>
      </div>

      {/* CHARTS */}
      <div className="charts-container">
        <div className="chart-box">
          <h6>Categories Growth (Hours)</h6>
          <Line data={{
            datasets: [{ data: catData, borderColor: "#0d6efd", tension: 0.3 }]
          }} options={{ parsing: false, scales:{ x:{ type:'time'} }, plugins:{ legend:{ display:false }}}}/>
        </div>

        <div className="chart-box">
          <h6>Subcategories Growth (Hours)</h6>
          <Line data={{
            datasets: [{ data: subData, borderColor:"#198754", tension: 0.3 }]
          }} options={{ parsing: false, scales:{ x:{ type:'time'} }, plugins:{ legend:{ display:false }}}}/>
        </div>

        <div className="chart-box">
          <h6>Products Growth (Hours)</h6>
          <Line data={{
            datasets: [{ data: prodData, borderColor:"#ffc107", tension: 0.3 }]
          }} options={{ parsing: false, scales:{ x:{ type:'time'} }, plugins:{ legend:{ display:false }}}}/>
        </div>

        <div className="chart-box">
          <h6>Total Distribution</h6>
          <Pie data={{
            labels: ["Categories", "Subcategories", "Products"],
            datasets: [{
              data: [
                data.categories.length,
                data.subcategories.length,
                data.products.length
              ],
              backgroundColor: ["#0d6efd", "#198754", "#ffc107"]
            }]
          }}/>
        </div>
      </div>

      {/* CSS */}
      <style>{`
        .dashboard{ padding:24px; display:flex; flex-direction:column; gap:20px; }
        .card-row{ display:flex; gap:16px; }
        .stat-card{ flex:1; padding:18px; height:100px; border-radius:10px; color:white; display:flex; flex-direction:column; justify-content:space-between; }
        .label{ font-size:14px; opacity:.9; }
        .value{ font-size:28px; font-weight:600; }
        .blue{ background:#0d6efd; }
        .green{ background:#198754; }
        .yellow{ background:#ffc107; color:black; }
        .charts-container{ display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
        .chart-box{ background:white; padding:18px; border-radius:10px; }
      `}</style>
    </div>
  );
}
