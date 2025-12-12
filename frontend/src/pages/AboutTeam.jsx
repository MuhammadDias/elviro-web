import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AboutTeam() {
  // Inisialisasi array kosong
  const [team, setTeam] = useState([]);
  
  // PERBAIKAN 1: Definisikan API sebagai string kosong (Supaya ikut Proxy Vite)
  const API = ''; 

  useEffect(() => {
    // Ambil semua data tim
    axios.get('/api/team')
      .then((res) => {
        // PERBAIKAN 2: Pastikan data yang masuk adalah Array
        setTeam(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error(err);
        setTeam([]); // Jika error, set array kosong agar tidak crash
      });
  }, []);

  // PERBAIKAN 3: Bungkus logika reduce agar aman jika team masih kosong
  const groupedTeam = Array.isArray(team) ? team.reduce((acc, member) => {
    const year = member.period || 'Unknown'; // Fallback jika tahun kosong
    if (!acc[year]) acc[year] = [];
    acc[year].push(member);
    return acc;
  }, {}) : {};

  // Urutkan tahun dari terbaru ke terlama
  const sortedYears = Object.keys(groupedTeam).sort((a, b) => b - a);

  return (
    <div className="bg-light min-vh-100">
      <div className="py-5 text-center text-white bg-primary" style={{ background: 'linear-gradient(45deg, #0b1120, #1e293b)' }}>
        <h1 className="fw-bold display-4">MEET OUR SQUAD</h1>
        <p className="lead text-white-50">The people behind the innovation</p>
      </div>

      <div className="container my-5">
        {/* Cek apakah ada data */}
        {sortedYears.length > 0 ? (
          sortedYears.map((year) => (
            <div key={year} className="mb-5">
              <h2 className="fw-bold border-bottom border-3 border-warning d-inline-block mb-4 pe-5">Team {year}</h2>

              <div className="row g-4">
                {groupedTeam[year]?.map((t, idx) => (
                  <div className="col-lg-3 col-md-4 col-sm-6" key={t.id || idx} data-aos="fade-up">
                    <div className="card border-0 text-center h-100 bg-white shadow-sm p-3 rounded-4 hover-top">
                      <div className="position-relative d-inline-block mx-auto mb-3">
                        {/* PERBAIKAN 4: Gunakan variable API dan tambahkan onError */}
                        <img 
                          src={`${API}/uploads/team/${t.photo}`} 
                          className="rounded-circle border border-3 border-warning" 
                          style={{ width: '120px', height: '120px', objectFit: 'cover' }} 
                          alt={t.name}
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150?text=No+Img'; }}
                        />
                      </div>
                      <h5 className="fw-bold mb-1">{t.name}</h5>
                      <p className="small text-primary fw-bold text-uppercase mb-2">{t.position}</p>
                      <small className="text-muted d-block">{t.major}</small>
                      <small className="text-muted">{t.nrp}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          /* Tampilan jika data masih loading atau kosong */
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p className="text-muted">Memuat data tim...</p>
          </div>
        )}
      </div>
      
      {/* Tambahan CSS kecil untuk efek hover */}
      <style>{`
        .hover-top { transition: transform 0.3s; }
        .hover-top:hover { transform: translateY(-5px); }
      `}</style>
    </div>
  );
}