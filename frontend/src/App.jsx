import { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import SplashCursor from './components/SplashCursor';

// --- IMPORT ASET LOGO BARU DENGAN NAMA BARU ---
import LogoIcon from './Asset 4@4x.png';
import LogoText from './Asset 6@4x.png';
// --- AKHIR IMPORT ASET LOGO BARU ---

import Home from './pages/Home';
import Join from './pages/Join';
import Login from './pages/Login';
import SignUp from './pages/SignUp'; // <-- TAMBAHAN: Import Halaman SignUp
import Admin from './pages/Admin';
import Gallery from './pages/Gallery';
import Achievement from './pages/Achievement';
import AboutTeam from './pages/AboutTeam';
import Generic from './pages/Generic';
import NewsDetail from './pages/NewsDetail';

function App() {
  const location = useLocation();
  // Sembunyikan navbar di halaman admin, login, dan signup
  const hideNavbar = location.pathname === '/admin' || location.pathname === '/login' || location.pathname === '/signup';

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  // Filter untuk mengubah gambar menjadi putih (Jika gambar aslinya gelap)
  const whiteFilterStyle = {
    filter: 'invert(100%) sepia(100%) saturate(0) hue-rotate(0deg) brightness(100%)',
    transition: 'filter 0.3s ease', // Tambahkan transisi agar halus
  };

  return (
    <>
      {/* 1. ANIMASI SPLASH CURSOR (VERSI RINGAN / LOW SPEC) */}
      <SplashCursor
        SIM_RESOLUTION={64} // Turun dari 128. Mengurangi beban fisika 50%.
        DYE_RESOLUTION={512} // Turun dari 1440. Kunci biar ringan di browser.
        PRESSURE_ITERATIONS={10} // Turun dari 20. CPU bekerja lebih santai.
        DENSITY_DISSIPATION={3} // Asap hilang sedikit lebih cepat biar memori lega.
      />

      {/* 2. KONTEN UTAMA: Pastikan background transparan */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'transparent',
        }}
      >
        {!hideNavbar && (
          <nav className="navbar navbar-expand-lg navbar-dark bg-elviro-blue sticky-top p-3 shadow">
            <div className="container">
              {/* --- GANTI LOGO BARU DI SINI --- */}
              <Link className="navbar-brand d-flex align-items-center" to="/">
                {/* LOGO ICON: Terapkan Filter */}
                <img
                  src={LogoIcon}
                  alt="ELVIRO Icon"
                  style={{
                    height: '30px',
                    marginRight: '8px',
                    ...whiteFilterStyle,
                  }}
                />
                {/* LOGO TEXT: Terapkan Filter */}
                <img
                  src={LogoText}
                  alt="ELVIRO Text"
                  style={{
                    height: '20px',
                    ...whiteFilterStyle,
                  }}
                />
              </Link>
              {/* --- AKHIR LOGO BARU --- */}

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

                  {/* --- DROPDOWN MENU ABOUT --- */}
                  <li className="nav-item dropdown custom-dropdown">
                    <a className="nav-link text-white mx-2 dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
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

        <div style={{ flex: 1, backgroundColor: 'transparent' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/join" element={<Join />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} /> {/* <-- TAMBAHAN: Route SignUp */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/achievement" element={<Achievement />} />
            <Route path="/about/team" element={<AboutTeam />} />
            <Route path="/about/cars" element={<Generic title="About Our Cars" content="Spesifikasi Mobil ELVIRO." />} />
            <Route path="/about/competition" element={<Generic title="About Competition" content="Kompetisi KMHE." />} />
            <Route path="/news/:id" element={<NewsDetail />} />
          </Routes>
        </div>

        {!hideNavbar && (
          <footer className="bg-elviro-blue text-white text-center py-4 mt-auto">
            <p className="mb-0">&copy; 2025 ELVIRO Electric Prototype Car Team.</p>
          </footer>
        )}
      </div>
    </>
  );
}

export default App;
