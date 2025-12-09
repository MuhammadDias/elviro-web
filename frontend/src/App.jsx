import { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

/* IMPORT BACKGROUND */
import AeroBackground from './components/AeroBackground';

import Home from './pages/Home';
import Join from './pages/Join';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Gallery from './pages/Gallery';
import Achievement from './pages/Achievement';
import AboutTeam from './pages/AboutTeam';
import Generic from './pages/Generic';

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/admin' || location.pathname === '/login';

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <>
      {/* 1. ANIMASI BACKGROUND */}
      <AeroBackground />

      {/* 2. KONTEN UTAMA */}
      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {!hideNavbar && (
          <nav className="navbar navbar-expand-lg navbar-dark bg-elviro-blue sticky-top p-3 shadow">
            <div className="container">
              <Link className="navbar-brand fw-bold text-elviro-yellow" to="/">
                ⚡ ELVIRO
              </Link>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto align-items-center">
                  <li className="nav-item">
                    <Link className="nav-link text-white mx-2" to="/">
                      Home
                    </Link>
                  </li>

                  {/* --- DROPDOWN MENU ABOUT (SUDAH DIPERBAIKI) --- */}
                  <li className="nav-item dropdown custom-dropdown">
                    <a className="nav-link text-white mx-2 dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" /* <-- INI KUNCINYA BUAT HP */ aria-expanded="false">
                      About
                    </a>
                    <ul className="dropdown-menu border-0 shadow mt-2">
                      <li>
                        <Link className="dropdown-item py-2" to="/about/team">
                          About Team
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2" to="/about/cars">
                          About Cars
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2" to="/about/competition">
                          About Competition
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link text-white mx-2" to="/gallery">
                      Gallery
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white mx-2" to="/achievement">
                      Achievement
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="btn btn-elviro btn-sm ms-3 px-4" to="/join">
                      JOIN US
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        )}

        {/* ROUTES CONTENT */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/join" element={<Join />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/achievement" element={<Achievement />} />
            <Route path="/about/team" element={<AboutTeam />} />
            <Route path="/about/cars" element={<Generic title="About Our Cars" content="Spesifikasi Mobil ELVIRO." />} />
            <Route path="/about/competition" element={<Generic title="About Competition" content="Kompetisi KMHE." />} />
          </Routes>
        </div>

        {!hideNavbar && (
          <footer className="bg-elviro-blue text-white text-center py-4 mt-auto">
            <p className="mb-0">&copy; 2025 ELVIRO Solar Car Team.</p>
          </footer>
        )}
      </div>
    </>
  );
}

export default App;
