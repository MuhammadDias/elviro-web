import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tilt } from 'react-tilt';
import { Typewriter } from 'react-simple-typewriter';
import CountUp from 'react-countup';

export default function Home() {
  const [news, setNews] = useState([]);
  const [team, setTeam] = useState([]);
  const API = 'http://127.0.0.1:5000'; // Koneksi ke Flask Backend

  useEffect(() => {
    axios.get(`${API}/api/news`).then((res) => setNews(res.data));
    axios.get(`${API}/api/team`).then((res) => setTeam(res.data));
    axios.get(`${API}/api/team?home=true`).then(res => setTeam(res.data));
  }, []);

  // Variabel Animasi
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div style={{ overflowX: 'hidden', backgroundColor: '#f8fafc' }}>
      {/* =================================================================================
               1. HERO SECTION (Dark Premium, Centered, No Image)
               ================================================================================= */}
      <header
        className="position-relative text-white text-center"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgb(15, 23, 42) 0%, rgb(2, 6, 23) 100%)',
          minHeight: '95vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '60px',
          overflow: 'hidden',
        }}
      >
        {/* Background Decoration (Glowing Orbs Animation) */}
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
                {/* Badge */}
                <div className="d-inline-block px-4 py-2 mb-4 border border-warning text-warning rounded-pill fw-bold bg-dark bg-opacity-50" style={{ letterSpacing: '2px', backdropFilter: 'blur(10px)' }}>
                  ⚡ EEPIS ELECTRIC VEHICLE TEAM
                </div>

                {/* Main Headline */}
                <h1 className="display-1 fw-bold mb-4" style={{ lineHeight: '1.1', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                  The Future is <br />
                  <span style={{ color: '#facc15' }}>
                    <Typewriter words={['Electric.', 'Efficient.', 'Sustainable.', 'ELVIRO.']} loop={0} cursor cursorStyle="_" typeSpeed={70} deleteSpeed={50} delaySpeed={1000} />
                  </span>
                </h1>

                {/* Subheadline */}
                <p className="lead text-white-50 mb-5 mx-auto fs-4" style={{ maxWidth: '800px' }}>
                  We design and build high-efficiency <strong>Battery-Electric Prototypes</strong>. Pushing the boundaries of aerodynamics and energy management for a greener earth.
                </p>

                {/* Buttons */}
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

        {/* Scroll Down Indicator */}
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="position-absolute bottom-0 start-50 translate-middle-x mb-5 text-white text-center opacity-50">
          <small className="ls-2">SCROLL DOWN</small>
          <br />
          <i className="bi bi-chevron-down fs-4"></i>
        </motion.div>
      </header>

      {/* =================================================================================
               2. STATS SECTION (Counter Up)
               ================================================================================= */}
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

      {/* =================================================================================
               3. WHO WE ARE (Centered Text Card, No Side Images)
               ================================================================================= */}
      <section className="py-5 bg-light">
        <div className="container py-5">
          <div className="row justify-content-center text-center">
            <div className="col-lg-9" data-aos="fade-up">
              <h6 className="text-warning fw-bold text-uppercase ls-2 mb-3">Who We Are</h6>
              <h2 className="display-4 fw-bold text-dark mb-5">
                EEPIS Electric Vehicle <br />
                Prototype Concept
              </h2>

              <div className="bg-white p-5 rounded-5 shadow-sm border-top border-5 border-warning position-relative overflow-hidden">
                {/* Decorative BG Icon */}
                <i className="bi bi-lightning-charge-fill position-absolute text-light" style={{ fontSize: '20rem', top: '-50px', right: '-50px', opacity: 0.1, transform: 'rotate(15deg)' }}></i>

                <p className="text-dark lead mb-4 position-relative z-1">
                  Formerly known as CHAPENS Team, ELVIRO is a research team from <strong>Politeknik Elektronika Negeri Surabaya (PENS)</strong> established in 2023.
                </p>
                <p className="text-muted mb-4 position-relative z-1 fs-5">
                  We focus on developing <strong>Energy-Efficient Car Prototypes</strong> using <strong>Batteries</strong> as the main power source. Our primary goal is to compete in the <em>Kontes Mobil Hemat Energi (KMHE)</em> organized
                  by the Ministry of Education, Culture, Research, and Technology (BPTI).
                </p>

                <hr className="my-5 w-25 mx-auto border-warning border-3 opacity-100 position-relative z-1" />

                <div className="row justify-content-center mt-4 position-relative z-1">
                  <div className="col-md-5 mb-4 mb-md-0">
                    <div className="p-3 rounded-4 bg-light h-100">
                      <i className="bi bi-battery-charging fs-1 text-primary mb-2"></i>
                      <h5 className="fw-bold mb-1">Battery Powered</h5>
                      <small className="text-muted">Zero Emission Technology</small>
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="p-3 rounded-4 bg-light h-100">
                      <i className="bi bi-speedometer2 fs-1 text-primary mb-2"></i>
                      <h5 className="fw-bold mb-1">High Efficiency</h5>
                      <small className="text-muted">Aerodynamic Design</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================================
               4. LATEST NEWS (Interactive Cards with Docs & Thumbnails)
               ================================================================================= */}
      <section className="py-5 my-5">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <h6 className="text-warning fw-bold text-uppercase">Updates</h6>
            <h2 className="fw-bold text-dark display-5">Latest News & Activity</h2>
          </div>

          <div className="row g-4 justify-content-center">
            {news.length > 0 ? (
              news.map((n, idx) => (
                <div className="col-lg-4 col-md-6" key={n.id} data-aos="fade-up" data-aos-delay={idx * 100}>
                  <Tilt options={{ max: 5, scale: 1.02, speed: 1000 }}>
                    <div className="card h-100 border-0 shadow-sm hover-card" style={{ borderRadius: '20px', overflow: 'hidden', background: '#fff' }}>
                      {/* Thumbnail Image */}
                      {n.thumbnail ? (
                        <div style={{ height: '200px', overflow: 'hidden' }}>
                          <img src={`${API}/uploads/news_thumb/${n.thumbnail}`} className="w-100 h-100" style={{ objectFit: 'cover' }} alt="News Thumb" />
                        </div>
                      ) : (
                        <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '150px' }}>
                          <i className="bi bi-newspaper fs-1 text-muted opacity-25"></i>
                        </div>
                      )}

                      <div className="card-body p-4 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3">{n.date}</span>
                        </div>

                        <h4 className="card-title fw-bold mb-3 text-dark">{n.title}</h4>
                        <p className="card-text text-muted mb-4 flex-grow-1 small" style={{ lineHeight: '1.6' }}>
                          {n.content.substring(0, 100)}...
                        </p>

                        {/* Action Buttons (Download & Link) */}
                        <div className="d-flex gap-2 mt-auto pt-3 border-top border-light">
                          {n.document && (
                            <a href={`${API}/uploads/news_doc/${n.document}`} className="btn btn-sm btn-outline-primary flex-fill rounded-pill" download>
                              <i className="bi bi-file-earmark-arrow-down me-1"></i> Download Doc
                            </a>
                          )}
                          {n.link && (
                            <a href={n.link} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-dark flex-fill rounded-pill">
                              <i className="bi bi-link-45deg me-1"></i> Visit Link
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </Tilt>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <div className="p-5 bg-light rounded-4 d-inline-block">
                  <i className="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
                  <p className="text-muted mb-0">Belum ada berita terbaru.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =================================================================================
               5. TEAM SECTION (Full Details: NRP, Major, etc)
               ================================================================================= */}
      <section className="py-5 text-white" style={{ background: '#0f172a' }}>
        <div className="container py-5">
          <div className="text-center mb-5" data-aos="zoom-in">
            <h2 className="fw-bold display-5">
              Meet The <span className="text-warning">Team</span>
            </h2>
            <p className="text-white-50">The brilliance behind the wheels and circuits.</p>
          </div>

          <div className="row g-4 justify-content-center">
            {team.map((t, idx) => (
              <div className="col-xl-3 col-lg-4 col-sm-6" key={idx} data-aos="flip-up" data-aos-delay={idx * 50}>
                <div className="card border-0 text-center h-100 bg-transparent team-card group">
                  <div className="position-relative d-inline-block mx-auto mb-3">
                    <motion.div whileHover={{ scale: 1.1 }} className="rounded-circle p-1" style={{ background: 'linear-gradient(45deg, #facc15, #00d4ff)' }}>
                      <img src={`${API}/uploads/team/${t.photo}`} className="rounded-circle border border-4 border-dark" style={{ width: '150px', height: '150px', objectFit: 'cover' }} alt={t.name} />
                    </motion.div>
                  </div>

                  <h5 className="fw-bold mb-1 text-white">{t.name}</h5>
                  <p className="small text-warning fw-bold text-uppercase ls-1 mb-2">{t.position}</p>

                  {/* Detailed Info Badge */}
                  <div className="bg-white bg-opacity-10 p-3 rounded-3 mt-2 mx-auto" style={{ maxWidth: '250px', backdropFilter: 'blur(5px)' }}>
                    <div className="small text-white-50 mb-1">{t.major}</div>
                    <div className="fw-bold text-white small" style={{ fontSize: '0.85rem' }}>
                      {t.nrp} <span className="mx-1">•</span> {t.batch}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================================
               6. CTA SECTION
               ================================================================================= */}
      <section className="py-5 text-center position-relative overflow-hidden">
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-warning" style={{ opacity: 0.95 }}></div>
        {/* Texture Pattern */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.1 }}></div>

        <div className="container position-relative z-2 py-5" data-aos="fade-up">
          <h2 className="display-4 fw-bold text-dark mb-3">Ready to Make History?</h2>
          <p className="lead text-dark mb-4 col-lg-8 mx-auto fw-medium">Join the ELVIRO team and help us build the most efficient electric vehicle in Indonesia.</p>
          <Link to="/join" className="btn btn-dark btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg hover-scale border-0">
            REGISTER NOW
          </Link>
        </div>
      </section>

      {/* --- INLINE STYLES --- */}
      <style>{`
                .ls-1 { letter-spacing: 1px; }
                .ls-2 { letter-spacing: 2px; }
                .hover-scale:hover { transform: scale(1.05); transition: 0.3s; }
                .hover-card { transition: all 0.3s ease; }
                .hover-card:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; }
                .backdrop-blur { backdrop-filter: blur(10px); }
                .text-elviro-blue { color: #0f172a; }
            `}</style>
    </div>
  );
}
