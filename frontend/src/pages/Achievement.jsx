import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Achievement() {
  const [achievements, setAchievements] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // PERBAIKAN 1: Definisikan API sebagai string kosong (Supaya ikut Proxy Vite)
  const API = ''; 

  useEffect(() => {
    // Ambil data achievements dengan validasi array
    axios.get('/api/achievements')
      .then((res) => {
        // Pastikan data yang masuk adalah Array
        setAchievements(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error fetching achievements:", err);
        setAchievements([]); // Set array kosong jika error
      });
  }, []);

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Header */}
      <div className="py-5 text-center position-relative">
        <div className="container position-relative z-2" data-aos="fade-down">
          <h1 className="fw-bold display-3 text-warning mb-2" style={{ textShadow: '0 0 20px rgba(250, 204, 21, 0.5)' }}>
            CHAMPIONS ROAD
          </h1>
          <p className="lead text-white-50">Jejak Langkah Menuju Puncak Prestasi</p>
        </div>
      </div>

      <div className="container my-5 pb-5">
        <div className="position-relative py-4">
          {/* Glowing Line */}
          <div className="position-absolute start-50 top-0 bottom-0 bg-primary rounded" style={{ width: '4px', transform: 'translateX(-50%)', boxShadow: '0 0 15px #0d6efd' }}></div>

          {/* PERBAIKAN 2: Cek apakah data achievements ada isinya */}
          {Array.isArray(achievements) && achievements.length > 0 ? (
            achievements.map((item, idx) => (
              <motion.div
                className={`row align-items-center mb-5 ${idx % 2 === 0 ? '' : 'flex-row-reverse'}`}
                key={item.id || idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
              >
                {/* Card Content */}
                <div className={`col-md-5 ${idx % 2 === 0 ? 'text-end' : 'text-start'}`}>
                  <motion.div
                    className="card border-0 shadow-lg p-0 overflow-hidden cursor-pointer"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '20px',
                    }}
                    whileHover={{ scale: 1.05, borderColor: '#facc15' }}
                    onClick={() => setSelectedItem(item)}
                  >
                    {/* Image Cover */}
                    <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50 hover-hide" style={{ transition: '0.3s' }}></div>
                      
                      {/* PERBAIKAN 3: Gunakan API variable dan onError */}
                      <img 
                        src={`${API}/uploads/achievement/${item.photo}`} 
                        className="w-100 h-100" 
                        style={{ objectFit: 'cover' }} 
                        alt={item.event}
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'; }}
                      />
                      
                      <div className="position-absolute bottom-0 start-0 p-3 w-100 bg-gradient-to-t">
                        <h2 className="fw-bold text-white mb-0" style={{ textShadow: '2px 2px 4px black' }}>
                          {item.year}
                        </h2>
                      </div>
                    </div>

                    <div className="p-4 text-white">
                      <h4 className="fw-bold text-warning mb-1">{item.event}</h4>
                      <p className="text-info small fw-bold text-uppercase mb-3">{item.category}</p>
                      <div className={`d-flex align-items-center ${idx % 2 === 0 ? 'justify-content-end' : 'justify-content-start'} gap-2`}>
                        <span className="badge bg-warning text-dark">
                          <i className="bi bi-trophy-fill me-1"></i> {item.result}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Center Dot */}
                <div className="col-md-2 text-center position-relative">
                  <motion.div
                    className="bg-dark rounded-circle d-inline-flex align-items-center justify-content-center border border-2 border-warning shadow-lg"
                    style={{ width: 50, height: 50, zIndex: 2, boxShadow: '0 0 20px rgba(250, 204, 21, 0.6)' }}
                    whileHover={{ scale: 1.2 }}
                  >
                    <i className="bi bi-lightning-fill text-warning"></i>
                  </motion.div>
                </div>

                <div className="col-md-5"></div>
              </motion.div>
            ))
          ) : (
             /* TAMPILAN JIKA DATA KOSONG / LOADING */
             <div className="text-center py-5">
               <div className="spinner-border text-warning mb-3" role="status"></div>
               <p className="text-white-50">Sedang memuat data prestasi...</p>
             </div>
          )}
        </div>
      </div>

      {/* --- MODAL DETAIL (POP-UP) --- */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-4"
            style={{ zIndex: 9999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              className="bg-dark border border-secondary rounded-4 shadow-lg overflow-hidden w-100"
              style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="position-relative">
                <img 
                   src={`${API}/uploads/achievement/${selectedItem.photo}`} 
                   className="w-100" 
                   style={{ height: '300px', objectFit: 'cover' }} 
                   onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'; }}
                />
                <button onClick={() => setSelectedItem(null)} className="btn btn-dark rounded-circle position-absolute top-0 end-0 m-3 p-2 border border-secondary shadow">
                  <i className="bi bi-x-lg text-white"></i>
                </button>
                <div className="position-absolute bottom-0 start-0 p-4 w-100 text-white" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
                  <h1 className="display-5 fw-bold text-warning mb-0">{selectedItem.year}</h1>
                </div>
              </div>

              <div className="p-5 text-white">
                <h3 className="fw-bold mb-2">{selectedItem.event}</h3>
                <div className="d-flex gap-2 mb-4">
                  <span className="badge bg-primary px-3 py-2">{selectedItem.category}</span>
                  <span className="badge bg-warning text-dark px-3 py-2">{selectedItem.result}</span>
                </div>
                <p className="text-white-50" style={{ fontSize: '1.1rem', lineHeight: '1.8', textAlign: 'justify' }}>
                  {selectedItem.description || 'Tidak ada deskripsi tambahan.'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}