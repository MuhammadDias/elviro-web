import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AboutTeam() {
  const [team, setTeam] = useState([]);
  const API = 'http://127.0.0.1:5000';

  useEffect(() => {
    // Ambil semua data tim (tanpa filter home)
    axios.get(`${API}/api/team`).then((res) => setTeam(res.data));
  }, []);

  // Kelompokkan Tim Berdasarkan Tahun
  const groupedTeam = team.reduce((acc, member) => {
    const year = member.period;
    if (!acc[year]) acc[year] = [];
    acc[year].push(member);
    return acc;
  }, {});

  // Urutkan tahun dari terbaru ke terlama
  const sortedYears = Object.keys(groupedTeam).sort((a, b) => b - a);

  return (
    <div className="bg-light min-vh-100">
      <div className="py-5 text-center text-white bg-elviro-blue">
        <h1 className="fw-bold display-4">MEET OUR SQUAD</h1>
        <p className="lead text-white-50">The people behind the innovation</p>
      </div>

      <div className="container my-5">
        {sortedYears.map((year) => (
          <div key={year} className="mb-5">
            <h2 className="fw-bold border-bottom border-3 border-warning d-inline-block mb-4 pe-5">Team {year}</h2>

            <div className="row g-4">
              {groupedTeam[year].map((t, idx) => (
                <div className="col-lg-3 col-md-4 col-sm-6" key={idx} data-aos="fade-up">
                  <div className="card border-0 text-center h-100 bg-white shadow-sm p-3 rounded-4">
                    <div className="position-relative d-inline-block mx-auto mb-3">
                      <img src={`${API}/uploads/team/${t.photo}`} className="rounded-circle border border-3 border-warning" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
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
        ))}
      </div>
    </div>
  );
}
