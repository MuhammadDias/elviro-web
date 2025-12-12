import { useState, useEffect } from 'react';
import axios from 'axios';
import { Tilt } from 'react-tilt';

export default function Gallery() {
  // Inisialisasi state sebagai array kosong
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // Event yg sedang dibuka
  const [photos, setPhotos] = useState([]); // Foto di dalam event
  
  // PERBAIKAN 1: Definisikan API sebagai string kosong (Supaya ikut Proxy Vite)
  const API = ''; 

  useEffect(() => {
    // Ambil data event dengan validasi
    axios.get('/api/gallery/events')
      .then((res) => {
        setEvents(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setEvents([]);
      });
  }, []);

  const openEvent = async (event) => {
    setSelectedEvent(event);
    setPhotos([]); // Reset foto dulu biar gak muncul foto album sebelumnya
    
    try {
      // PERBAIKAN 2: Gunakan path relatif /api/... (tanpa ${API} yang undefined)
      const res = await axios.get(`/api/gallery/photos/${event.id}`);
      setPhotos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching photos:", err);
      setPhotos([]);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Header */}
      <div className="py-5 text-center text-white" style={{ background: '#0f172a' }}>
        <h1 className="fw-bold display-4 text-warning">GALLERY</h1>
        <p className="lead text-white-50">Our Journey & Moments</p>
      </div>

      <div className="container my-5">
        
        {/* VIEW 1: LIST EVENT (CARD) */}
        {!selectedEvent && (
          <div className="row g-4">
            {/* PERBAIKAN 3: Cek apakah events ada isinya */}
            {Array.isArray(events) && events.length > 0 ? (
              events.map((e, idx) => (
                <div className="col-md-4" key={e.id || idx}>
                  <Tilt options={{ max: 10, scale: 1.02 }}>
                    <div className="card h-100 border-0 shadow-sm overflow-hidden" onClick={() => openEvent(e)} style={{ cursor: 'pointer' }}>
                      
                      {/* PERBAIKAN 4: Gunakan API variable dan onError */}
                      <img 
                        src={`${API}/uploads/gallery_thumb/${e.thumbnail}`} 
                        className="card-img-top" 
                        style={{ height: '250px', objectFit: 'cover' }} 
                        alt={e.title}
                        onError={(evt) => { evt.target.onerror = null; evt.target.src = 'https://via.placeholder.com/400x300?text=No+Thumbnail'; }}
                      />
                      
                      <div className="card-body text-center bg-white">
                        <h5 className="fw-bold mb-1">{e.title}</h5>
                        <small className="text-muted">
                          {e.location} | {e.year}
                        </small>
                      </div>
                    </div>
                  </Tilt>
                </div>
              ))
            ) : (
              /* Loading State / Empty State */
              <div className="col-12 text-center py-5">
                {events === null ? (
                   <div className="spinner-border text-primary" role="status"></div>
                ) : (
                   <p className="text-muted">Belum ada album galeri.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: DETAIL FOTO */}
        {selectedEvent && (
          <div>
            <button onClick={() => setSelectedEvent(null)} className="btn btn-outline-dark mb-4 rounded-pill px-4">
              <i className="bi bi-arrow-left me-2"></i> Back to Albums
            </button>
            <h2 className="fw-bold mb-4">
              {selectedEvent.title} <span className="text-warning">Photos</span>
            </h2>

            <div className="row g-3">
              {Array.isArray(photos) && photos.length > 0 ? (
                photos.map((p, idx) => (
                  <div className="col-md-3 col-6" key={p.id || idx}>
                    <img 
                      src={`${API}/uploads/gallery_photo/${p.photo}`} 
                      className="img-fluid rounded shadow-sm hover-zoom" 
                      style={{ width: '100%', height: '200px', objectFit: 'cover', transition: 'transform 0.3s' }} 
                      alt="Moment"
                      onError={(evt) => { evt.target.onerror = null; evt.target.src = 'https://via.placeholder.com/300?text=Error'; }}
                    />
                  </div>
                ))
              ) : (
                <div className="col-12 py-5 text-center">
                   <p className="text-muted">Memuat foto atau album kosong...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        .hover-zoom:hover { transform: scale(1.05); cursor: zoom-in; }
      `}</style>
    </div>
  );
}