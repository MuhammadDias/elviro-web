import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import CountUp from 'react-countup';

// Pastikan path ini sesuai dengan struktur folder kamu
import SpotlightCard from '../components/SpotlightCard';

// --- KOMPONEN CARD BERITA ---
const NewsCard = ({ newsItem, index }) => {
  if (!newsItem) return null; // Pengaman jika item kosong

  return (
    <motion.div className="col-lg-4 col-md-6" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6, delay: index * 0.2 }}>
      <Link to={`/news/${newsItem.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <SpotlightCard className="h-100 d-flex flex-column" spotlightColor="rgba(250, 204, 21, 0.15)">
          {newsItem.thumbnail ? (
            <div style={{ height: '220px', overflow: 'hidden', position: 'relative', borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem' }}>
              <img src={`/uploads/news_thumb/${newsItem.thumbnail}`} className="w-100 h-100" style={{ objectFit: 'cover', transition: 'transform 0.5s' }} alt={newsItem.title || 'News'} />
              <style>{`.card-spotlight:hover img { transform: scale(1.1); }`}</style>
            </div>
          ) : (
            <div className="bg-secondary d-flex align-items-center justify-content-center" style={{ height: '150px', borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem' }}>
              <i className="bi bi-newspaper fs-1 text-white opacity-50"></i>
            </div>
          )}

          <div className="card-body p-4 d-flex flex-column flex-grow-1">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="badge bg-warning text-dark border border-warning rounded-pill px-3 fw-bold">
                <i className="bi bi-calendar-event me-2"></i>
                {newsItem.date || '-'}
              </span>
            </div>
            <h4 className="card-title fw-bold mb-3 text-white" style={{ minHeight: '60px' }}>
              {newsItem.title}
            </h4>
            <p className="card-text text-white-50 mb-4 flex-grow-1 small" style={{ lineHeight: '1.6' }}>
              {newsItem.summary ? newsItem.summary : newsItem.content ? newsItem.content.substring(0, 100) + '...' : ''}
            </p>
            <div className="d-flex gap-2 mt-auto pt-3 border-top border-secondary">
              <span className="btn btn-sm text-warning fw-bold p-0 d-flex align-items-center">
                BACA SELENGKAPNYA <i className="bi bi-arrow-right ms-2"></i>
              </span>
            </div>
          </div>
        </SpotlightCard>
      </Link>
    </motion.div>
  );
};

export default function Home() {
  // Inisialisasi state dengan Array kosong [] agar tidak undefined
  const [news, setNews] = useState([]);
  const [team, setTeam] = useState([]);
  const [filteredTeam, setFilteredTeam] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState('All Divisions');
  const [divisions, setDivisions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  // 1. Handle Click Outside Dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  // 2. Fetch Data (DENGAN PENGAMAN VALIDASI ARRAY)
  useEffect(() => {
    // --- FETCH NEWS ---
    axios
      .get(`/api/news`)
      .then((res) => {
        // Cek apakah data yang diterima benar-benar array
        const data = Array.isArray(res.data) ? res.data : [];
        setNews(data);
      })
      .catch((err) => {
        console.error('Error fetching news:', err);
        setNews([]); // Set kosong jika error
      });

    // --- FETCH TEAM ---
    axios
      .get(`/api/team?home=true`)
      .then((res) => {
        const teamData = Array.isArray(res.data) ? res.data : [];
        setTeam(teamData);
        setFilteredTeam(teamData);

        // Ambil Unique Divisions dari position
        const allPositions = teamData.map((member) => member.position);
        const uniqueDivisions = [...new Set(allPositions.filter((pos) => pos && pos.trim() !== ''))];
        setDivisions(uniqueDivisions);
      })
      .catch((err) => {
        console.error('Error fetching team:', err);
        setTeam([]);
        setFilteredTeam([]);
      });
  }, []);

  // 3. Logic Filter
  const handleFilterSelect = (category) => {
    setSelectedDivision(category);
    setIsDropdownOpen(false);

    if (category === 'All Divisions') {
      setFilteredTeam(team);
    } else {
      const filtered = team.filter((member) => member.position === category);
      setFilteredTeam(filtered);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* 1. HERO SECTION */}
      <header className="position-relative text-white text-center" style={{ background: 'transparent', minHeight: '95vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '60px', overflow: 'visible' }}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="position-absolute top-50 start-50 translate-middle bg-primary rounded-circle"
          style={{ width: '600px', height: '600px', filter: 'blur(180px)', opacity: 0.2, zIndex: 0 }}
        />
        <motion.div
          animate={{ x: [-20, 20, -20], y: [-20, 20, -20] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="position-absolute top-0 end-0 bg-warning rounded-circle"
          style={{ width: '400px', height: '400px', filter: 'blur(150px)', opacity: 0.15, zIndex: 0 }}
        />

        <div className="container position-relative z-2">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                <div className="d-inline-block px-4 py-2 mb-4 border border-warning text-warning rounded-pill fw-bold bg-dark bg-opacity-50" style={{ letterSpacing: '2px', backdropFilter: 'blur(10px)' }}>
                  EEPIS ELECTRIC VEHICLE PROTOTYPE CONCEPT
                </div>
                <h1 className="display-1 fw-bold mb-4" style={{ lineHeight: '1.1', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                  The Future is <br />
                  <span style={{ color: '#facc15' }}>
                    <Typewriter words={['Electric.', 'Efficient.', 'Sustainable.', 'ELVIRO.', 'Green ENERGY']} loop={0} cursor cursorStyle="_" typeSpeed={70} deleteSpeed={50} delaySpeed={1000} />
                  </span>
                </h1>
                <p className="lead text-white-50 mb-5 mx-auto fs-4" style={{ maxWidth: '800px' }}>
                  We design and build high-efficiency <strong>Battery-Electric Prototypes</strong>. Pushing the boundaries of aerodynamics and energy management for a greener earth.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link to="/join" className="btn btn-warning btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg hover-scale text-dark border-0">
                    JOIN THE TEAM
                  </Link>
                  <Link to="/achievement" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill fw-bold hover-scale backdrop-blur">
                    VIEW TRACK RECORD
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. STATS SECTION */}
      <div className="bg-white py-5 shadow-sm position-relative" style={{ marginTop: '-40px', zIndex: 10, borderRadius: '40px 40px 0 0' }}>
        <div className="container">
          <div className="row text-center g-4">
            {[
              { label: 'Years of Experience', val: 12, suffix: '+' },
              { label: 'Awards Won', val: 20, suffix: '+' },
              { label: 'Team Members', val: 50, suffix: '+' },
              { label: 'Battery Efficiency', val: 98, suffix: '%' },
            ].map((stat, idx) => (
              <div className="col-md-3 col-6" key={idx}>
                <h2 className="fw-bold display-4 text-elviro-blue mb-0">
                  <CountUp end={stat.val} duration={3} enableScrollSpy />
                  {stat.suffix}
                </h2>
                <small className="text-muted fw-bold text-uppercase ls-1">{stat.label}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. WHO WE ARE */}
      <section className="py-5 bg-light">
        <div className="container py-5">
          <div className="row justify-content-center text-center">
            <div className="col-lg-9" data-aos="fade-up">
              <h6 className="text-warning fw-bold text-uppercase ls-2 mb-3">Who We Are</h6>
              <h2 className="display-4 fw-bold text-dark mb-5">
                EEPIS Electric Vehicle <br /> Prototype Concept
              </h2>
              <div className="bg-white p-5 rounded-5 shadow-sm border-top border-5 border-warning position-relative overflow-hidden">
                <i className="bi bi-lightning-charge-fill position-absolute text-light" style={{ fontSize: '20rem', top: '-50px', right: '-50px', opacity: 0.1, transform: 'rotate(15deg)' }}></i>
                <p className="text-dark lead mb-4 position-relative z-1">
                  Formerly known as CHAPENS Team, ELVIRO is a research team from <strong>Politeknik Elektronika Negeri Surabaya (PENS)</strong> established in 2023.
                </p>
                <div className="row justify-content-center mt-4 position-relative z-1">
                  <div className="col-md-5 mb-4 mb-md-0">
                    <div className="p-3 rounded-4 bg-light h-100">
                      <i className="bi bi-battery-charging fs-1 text-primary mb-2"></i>
                      <h5 className="fw-bold mb-1">Battery Powered</h5>
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="p-3 rounded-4 bg-light h-100">
                      <i className="bi bi-speedometer2 fs-1 text-primary mb-2"></i>
                      <h5 className="fw-bold mb-1">High Efficiency</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LATEST NEWS (PERBAIKAN UTAMA: OPTIONAL CHAINING) */}
      <section className="py-5 my-5">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <h6 className="text-warning fw-bold text-uppercase">Updates</h6>
            <h2 className="fw-bold text display-5">Latest News & Activity</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {/* PERBAIKAN: Cek Array.isArray dan gunakan ?. */}
            {Array.isArray(news) && news.length > 0 ? (
              news.slice(0, 3).map((item, idx) => <NewsCard key={item.id || idx} newsItem={item} index={idx} />)
            ) : (
              <div className="col-12 text-center py-5">
                <p className="text-muted">
                  {/* Tampilkan pesan loading jika news masih kosong tapi belum error */}
                  Belum ada berita terbaru.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. TEAM SECTION */}
      <section className="py-5 text-white position-relative" style={{ background: '#0b1120', minHeight: '800px', overflow: 'visible' }}>
        <div
          className="position-absolute start-0 top-0 w-100 h-100"
          style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }}
        ></div>

        <div className="container py-5 position-relative z-1">
          <div className="d-flex flex-column align-items-center mb-5 position-relative" style={{ zIndex: 1000 }}>
            <h2 className="fw-bold display-5 mb-3">
              Meet The <span className="text-warning">Squad</span>
            </h2>

            {/* CUSTOM DROPDOWN FILTER */}
            <div className="position-relative mt-2" ref={dropdownRef} style={{ width: '250px' }}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="btn w-100 d-flex justify-content-between align-items-center text-white border border-secondary rounded-pill px-4 py-2 tech-dropdown-btn"
                style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}
              >
                <span className="fw-medium text-uppercase ls-1 small text-truncate">{selectedDivision === 'All Divisions' ? 'FILTER: ALL TEAMS' : selectedDivision}</span>
                <i className={`bi bi-chevron-down transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="position-absolute w-100 mt-2 rounded-3 overflow-hidden shadow-lg border border-secondary"
                    style={{ background: '#1e293b', zIndex: 9999 }}
                  >
                    <div className="d-flex flex-column" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      <button className={`btn text-start text-white py-2 px-3 border-0 rounded-0 tech-dropdown-item ${selectedDivision === 'All Divisions' ? 'bg-warning text-dark' : ''}`} onClick={() => handleFilterSelect('All Divisions')}>
                        All Divisions
                      </button>

                      {divisions.length > 0 ? (
                        divisions.map((div, idx) => (
                          <button key={idx} className={`btn text-start text-white py-2 px-3 border-0 rounded-0 tech-dropdown-item ${selectedDivision === div ? 'bg-warning text-dark' : ''}`} onClick={() => handleFilterSelect(div)}>
                            {div}
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-white-50 small fst-italic">No divisions found</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* GRID TEAM (PERBAIKAN UTAMA: OPTIONAL CHAINING) */}
          <motion.div layout className="row row-cols-2 row-cols-md-3 row-cols-xl-5 g-4 justify-content-center" style={{ position: 'relative', zIndex: 1 }}>
            <AnimatePresence mode="popLayout">
              {/* PERBAIKAN: Cek Array.isArray dan filteredTeam.length */}
              {Array.isArray(filteredTeam) && filteredTeam.length > 0 ? (
                filteredTeam.map((t) => (
                  <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} className="col" key={t.id || t.nrp}>
                    {/* TECH CARD DESIGN */}
                    <div className="card h-100 border-0 rounded-4 overflow-hidden tech-card bg-dark text-white position-relative">
                      <div className="card-glow"></div>

                      {/* IMAGE AREA */}
                      <div className="position-relative" style={{ height: '240px' }}>
                        <img
                          src={`/uploads/team/${t.photo}`}
                          alt={t.name}
                          className="w-100 h-100 object-fit-cover tech-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                          }}
                        />
                        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to bottom, transparent 60%, #1e293b 100%)' }}></div>
                        {t.division && (
                          <div className="position-absolute top-0 start-0 m-3">
                            <span className="badge bg-black bg-opacity-75 border border-warning text-warning rounded-1 text-uppercase ls-1" style={{ fontSize: '0.65rem', backdropFilter: 'blur(4px)' }}>
                              {t.division}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* INFO AREA */}
                      <div className="card-body p-3 pt-0 position-relative z-1" style={{ backgroundColor: '#1e293b' }}>
                        <h6 className="fw-bold text-white mb-1 text-truncate font-heading" style={{ fontSize: '1rem' }} title={t.name}>
                          {t.name}
                        </h6>
                        <p className="small text-white-50 text-uppercase ls-1 mb-3" style={{ fontSize: '0.7rem' }}>
                          {t.position}
                        </p>

                        <div className="row g-1">
                          <div className="col-12">
                            <div className="bg-black bg-opacity-40 p-2 rounded-2 border border-secondary border-opacity-25 d-flex align-items-center gap-2">
                              <i className="bi bi-mortarboard text-warning" style={{ fontSize: '0.8rem' }}></i>
                              <span className="text-truncate text-white-50 small" style={{ fontSize: '0.7rem' }}>
                                {t.major}
                              </span>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="bg-black bg-opacity-40 p-1 rounded-2 border border-secondary border-opacity-25 text-center">
                              <small className="d-block text-secondary" style={{ fontSize: '0.6rem' }}>
                                NRP
                              </small>
                              <span className="text-white small fw-bold" style={{ fontSize: '0.7rem' }}>
                                {t.nrp}
                              </span>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="bg-black bg-opacity-40 p-1 rounded-2 border border-secondary border-opacity-25 text-center">
                              <small className="d-block text-secondary" style={{ fontSize: '0.6rem' }}>
                                BATCH
                              </small>
                              <span className="text-warning small fw-bold" style={{ fontSize: '0.7rem' }}>
                                {t.batch}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <p className="text-white-50">No team members found in this division.</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 6. CTA SECTION */}
      <section className="py-5 text-center position-relative overflow-hidden">
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-warning" style={{ opacity: 0.95 }}></div>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.1 }}></div>
        <div className="container position-relative z-2 py-5" data-aos="fade-up">
          <h2 className="display-4 fw-bold text-dark mb-3">Ready to Make History?</h2>
          <p className="lead text-dark mb-4 col-lg-8 mx-auto fw-medium">Join the ELVIRO team and help us build the most efficient electric vehicle in Indonesia.</p>
          <Link to="/join" className="btn btn-dark btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg hover-scale border-0">
            REGISTER NOW
          </Link>
        </div>
      </section>

      {/* CSS Styles */}
      <style>{`
          .ls-1 { letter-spacing: 1px; }
          .ls-2 { letter-spacing: 2px; }
          .font-heading { font-family: 'Montserrat', sans-serif; letter-spacing: -0.5px; }
          .rotate-180 { transform: rotate(180deg); }
          .transition-transform { transition: transform 0.3s ease; }
          .hover-scale:hover { transform: scale(1.05); transition: 0.3s; }

          /* DROPDOWN HOVER */
          .tech-dropdown-item:hover { background-color: rgba(250, 204, 21, 0.2); color: #facc15 !important; }
          .tech-dropdown-btn:hover { border-color: #facc15 !important; color: #facc15 !important; }

          /* TECH CARD STYLES */
          .tech-card {
             box-shadow: 0 4px 6px rgba(0,0,0,0.3);
             transition: all 0.3s ease;
             background-color: #1e293b; /* Slate 800 */
          }
          .tech-card:hover {
             transform: translateY(-8px);
             box-shadow: 0 0 20px rgba(250, 204, 21, 0.3); /* Yellow Glow */
          }
          .tech-card:hover .card-glow {
             opacity: 1;
          }
          
          /* Border Glow Effect */
          .card-glow {
             position: absolute;
             top: 0; left: 0; right: 0; bottom: 0;
             border-radius: 1rem;
             border: 2px solid #facc15;
             opacity: 0;
             pointer-events: none;
             z-index: 2;
             transition: opacity 0.3s ease;
             box-shadow: inset 0 0 15px rgba(250, 204, 21, 0.2);
          }

          .tech-img { transition: transform 0.5s ease; }
          .tech-card:hover .tech-img { transform: scale(1.1); }
      `}</style>
    </div>
  );
}
