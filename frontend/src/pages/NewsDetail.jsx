import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import SpotlightCard from '../components/SpotlightCard';

export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const API = 'http://127.0.0.1:5000';

  useEffect(() => {
    axios
      .get(`${API}/api/news/${id}`)
      .then((res) => setNews(res.data))
      .catch((e) => console.log(e));
  }, [id]);

  if (!news) return <div className="text-center py-5 text-white">Loading...</div>;

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: 'white' }}>
      <div className="container py-5">
        <Link to="/" className="btn btn-outline-warning mb-4 rounded-pill">
          &larr; Kembali
        </Link>

        <SpotlightCard className="card border-0 shadow-lg rounded-4 overflow-hidden text-white">
          {/* Tampilkan Thumbnail jika ada */}
          {news.thumbnail && <img src={`${API}/uploads/news_thumb/${news.thumbnail}`} className="w-100" style={{ maxHeight: '500px', objectFit: 'cover' }} alt={news.title} />}

          <div className="card-body p-5">
            <span className="badge bg-warning text-dark mb-3">{news.date}</span>
            <h1 className="fw-bold mb-4 display-5">{news.title}</h1>

            <div className="text-white-50" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '1.1rem' }}>
              {news.content}
            </div>

            {/* --- BAGIAN ACTION BUTTONS (Dokumen & Link) --- */}
            {(news.document || news.link) && (
              <div className="mt-5 pt-4 border-top border-secondary d-flex flex-wrap gap-3">
                {/* 1. Tombol Download Dokumen */}
                {news.document && (
                  <a href={`${API}/uploads/news_doc/${news.document}`} className="btn btn-primary rounded-pill px-4" download>
                    <i className="bi bi-download me-2"></i> Download Dokumen
                  </a>
                )}

                {/* 2. Tombol Kunjungi Link (INI YANG TADINYA HILANG) */}
                {news.link && (
                  <a href={news.link} target="_blank" rel="noreferrer" className="btn btn-outline-info rounded-pill px-4">
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
