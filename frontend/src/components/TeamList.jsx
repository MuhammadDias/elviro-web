import { useState, useEffect } from 'react';
import axios from 'axios';
import SpotlightCard from './SpotlightCard';
import './TeamList.css';

export default function TeamList() {
  const [team, setTeam] = useState([]);
  const [filter, setFilter] = useState('All');
  const [divisions, setDivisions] = useState([]);
  const API = 'http://127.0.0.1:5000';

  useEffect(() => {
    // Ambil data team yang diflag show_on_home=True
    axios
      .get(`${API}/api/team?home=true`)
      .then((res) => {
        setTeam(res.data);
        // Ambil daftar divisi unik dari data yang ada
        const uniqueDivs = [...new Set(res.data.map((item) => item.division).filter((div) => div))];
        setDivisions(['All', ...uniqueDivs]);
      })
      .catch((err) => console.error(err));
  }, []);

  // Filter data berdasarkan divisi yang dipilih
  const filteredTeam = filter === 'All' ? team : team.filter((member) => member.division === filter);

  return (
    <div>
      {/* Tombol Filter */}
      {divisions.length > 1 && (
        <div className="d-flex justify-content-center gap-2 mb-5 flex-wrap">
          {divisions.map((div) => (
            <button key={div} onClick={() => setFilter(div)} className={`btn rounded-pill px-4 transition-all ${filter === div ? 'btn-warning text-dark fw-bold' : 'btn-outline-light text-white-50'}`}>
              {div}
            </button>
          ))}
        </div>
      )}

      {/* Grid Team */}
      <div className="team-grid">
        {filteredTeam.map((member) => (
          <SpotlightCard key={member.id} className="team-card-square rounded-4 overflow-hidden border-0 shadow-sm text-white">
            {/* Foto Background */}
            <img src={`${API}/uploads/team/${member.photo}`} alt={member.name} className="team-photo-bg" />

            {/* Info Member */}
            <div className="position-relative z-1 text-center w-100">
              <h5 className="fw-bold mb-0 text-truncate" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                {member.name}
              </h5>
              <small className="text-white-50 d-block" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                {member.position}
              </small>
              {/* Tampilkan Badge Divisi jika ada */}
              {member.division && (
                <span className="badge bg-white text-dark mt-2 opacity-75 shadow-sm" style={{ fontSize: '0.7rem', backdropFilter: 'blur(4px)' }}>
                  {member.division}
                </span>
              )}
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}
