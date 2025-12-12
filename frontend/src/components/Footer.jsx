import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-elviro-blue text-white">
      {/* Main Footer Content */}
      <div className="container py-5">
        <div className="row">
          {/* Company Info */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="footer-brand mb-3">
              <img src="/src/Asset 5@4x.png" alt="ELVIRO Logo" style={{ height: '40px', filter: 'brightness(0) invert(1)' }} className="me-2" />
              {/* <h5 className="d-inline text-elviro-yellow">ELVIRO</h5> */}
            </div>
            <p className="text-light mb-3">Electric Vehicle Research and Innovation Organization -Mengembangkan teknologi mobil listrik untuk masa depan yang berkelanjutan.</p>
            <div className="d-flex gap-2">
              <span className="badge bg-elviro-yellow textcolor-yellow">KMHE</span>
              <span className="badge bg-elviro-yellow textcolor-yellow">Electric</span>
              <span className="badge bg-elviro-yellow textcolor-yellow">Innovation</span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h6 className="text-elviro-yellow mb-3 text-uppercase fw-bold">Kontak Kami</h6>
            <div className="contact-info">
              <div className="contact-item mb-2">
                <i className="bi bi-envelope me-2 text-elviro-yellow"></i>
                <a href="mailto:eepisukm.mhe@gmail.com" className="text-light text-decoration-none">
                  eepisukm.mhe@gmail.com
                </a>
              </div>
              <div className="contact-item mb-2">
                <i className="bi bi-whatsapp me-2 text-elviro-yellow"></i>
                <a href="https://wa.me/085704880050" className="text-light text-decoration-none" target="_blank" rel="noopener noreferrer">
                  +6285704880050
                </a>
              </div>
              <div className="contact-item mb-2">
                <i className="bi bi-geo-alt me-2 text-elviro-yellow"></i>
                <span className="text-light">Surabaya, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h6 className="text-elviro-yellow mb-3 text-uppercase fw-bold">Ikuti Kami</h6>
            <div className="social-links">
              <a href="https://www.youtube.com/@elviro_team" target="_blank" rel="noopener noreferrer" className="social-link d-block mb-2 text-light text-decoration-none">
                <i className="bi bi-youtube me-2 text-elviro-yellow"></i>
                YouTube Channel
              </a>
              <a href="https://www.instagram.com/elviro_team/" target="_blank" rel="noopener noreferrer" className="social-link d-block mb-2 text-light text-decoration-none">
                <i className="bi bi-instagram me-2 text-elviro-yellow"></i>
                Instagram @elviro_team
              </a>
              <a href="https://tiktok.com/@elviro.team" target="_blank" rel="noopener noreferrer" className="social-link d-block mb-2 text-light text-decoration-none">
                <i className="bi bi-tiktok me-2 text-elviro-yellow"></i>
                TikTok @elviro.team
              </a>
              <a href="https://wa.me/085704880050" target="_blank" rel="noopener noreferrer" className="social-link d-block mb-2 text-light text-decoration-none">
                <i className="bi bi-whatsapp me-2 text-elviro-yellow"></i>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-elviro-yellow mb-3 text-uppercase fw-bold">Quick Links</h6>
            <div className="footer-links">
              <Link to="/" className="d-block mb-2 text-light text-decoration-none">
                Home
              </Link>
              <Link to="/about/team" className="d-block mb-2 text-light text-decoration-none">
                About Team
              </Link>
              <Link to="/gallery" className="d-block mb-2 text-light text-decoration-none">
                Gallery
              </Link>
              <Link to="/achievement" className="d-block mb-2 text-light text-decoration-none">
                Achievement
              </Link>
              <Link to="/join" className="d-block mb-2 text-light text-decoration-none">
                Join Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-top border-secondary">
        <div className="container py-3">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="mb-0 text-light">&copy; 2025 ELVIRO Electric Prototype Car Team. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="license-info">
                <small className="text-light">
                  <i className="bi bi-shield-check me-1 text-elviro-yellow"></i>
                  Licensed under MIT License |<span className="ms-1">Built with React & Flask</span>
                  <br />
                  <span className="text-elviro-yellow">Developed by: Elviro Team</span>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
