import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import SpotlightCard from '../components/SpotlightCard';

export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState(null);

  // PERBAIKAN 1: Definisikan API sebagai string kosong (Supaya ikut Proxy Vite)
  // Jangan dikomentari karena dipakai di bagian image & document
  const API = '';

  useEffect(() => {
    axios
      .get(`/api/news/${id}`)
      .then((res) => setNews(res.data))
      .catch((e) => console.log('Gagal ambil berita:', e));
  }, [id]);

  // Loading State
  if (!news) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: '#0f172a' }}>
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: 'white' }}>
      <div className="container py-5">
        <Link to="/" className="btn btn-outline-warning mb-4 rounded-pill px-4 fw-bold">
          <i className="bi bi-arrow-left me-2"></i> Kembali
        </Link>

        <SpotlightCard className="card border-0 shadow-lg rounded-4 overflow-hidden text-white" spotlightColor="rgba(250, 204, 21, 0.15)">
          {/* Tampilkan Thumbnail jika ada */}
          {news.thumbnail && (
            <img
              src={`${API}/uploads/news_thumb/${news.thumbnail}`}
              className="w-100"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
              alt={news.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
              }}
            />
          )}

          <div className="card-body p-md-5 p-4">
            <span className="badge bg-warning text-dark mb-3 px-3 py-2 rounded-pill fw-bold">
              <i className="bi bi-calendar-event me-2"></i>
              {news.date}
            </span>
            <h1 className="fw-bold mb-4 display-5">{news.title}</h1>

            <div className="text-white-50" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '1.1rem', textAlign: 'justify' }}>
              {news.content}
            </div>

            {/* --- BAGIAN ACTION BUTTONS (Dokumen & Link) --- */}
            {(news.document || news.link) && (
              <div className="mt-5 pt-4 border-top border-secondary d-flex flex-wrap gap-3">
                {/* 1. Tombol Download Dokumen */}
                {news.document && (
                  <a href={`${API}/uploads/news_doc/${news.document}`} className="btn btn-primary rounded-pill px-4 fw-bold" download>
                    <i className="bi bi-download me-2"></i> Download Dokumen
                  </a>
                )}

                {/* 2. Tombol Kunjungi Link */}
                {news.link && (
                  <a href={news.link} target="_blank" rel="noreferrer" className="btn btn-outline-info rounded-pill px-4 fw-bold">
                    <i className="bi bi-link-45deg me-2"></i> Kunjungi Link Terkait
                  </a>
                )}
              </div>
            )}
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}
