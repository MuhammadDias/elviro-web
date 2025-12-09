import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; /* <--- KITA TAMBAH INI */
import App from './App.jsx';

/* IMPORT BOOTSTRAP (Biar Hamburger Menu Jalan) */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BUNGKUS APP DENGAN BROWSERROUTER */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
