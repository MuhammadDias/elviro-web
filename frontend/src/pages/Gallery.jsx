import { useState, useEffect } from 'react';
import axios from 'axios';
import { Tilt } from 'react-tilt';

export default function Gallery() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // Event yg sedang dibuka
  const [photos, setPhotos] = useState([]); // Foto di dalam event
  const API = 'http://127.0.0.1:5000';

  useEffect(() => {
    axios.get(`${API}/api/gallery/events`).then((res) => setEvents(res.data));
  }, []);

  const openEvent = async (event) => {
    setSelectedEvent(event);
    const res = await axios.get(`${API}/api/gallery/photos/${event.id}`);
    setPhotos(res.data);
  };

  return (
    <div>
      {/* Header */}
      <div className="py-5 text-center text-white" style={{ background: '#0f172a' }}>
        <h1 className="fw-bold display-4 text-warning">GALLERY</h1>
        <p className="lead text-white-50">Our Journey & Moments</p>
      </div>

      <div className="container my-5">
        {/* VIEW 1: LIST EVENT (CARD) */}
        {!selectedEvent && (
          <div className="row g-4">
            {events.map((e, idx) => (
              <div className="col-md-4" key={idx}>
                <Tilt options={{ max: 10, scale: 1.02 }}>
                  <div className="card h-100 border-0 shadow-sm overflow-hidden" onClick={() => openEvent(e)} style={{ cursor: 'pointer' }}>
                    <img src={`${API}/uploads/gallery_thumb/${e.thumbnail}`} className="card-img-top" style={{ height: '250px', objectFit: 'cover' }} />
                    <div className="card-body text-center bg-white">
                      <h5 className="fw-bold mb-1">{e.title}</h5>
                      <small className="text-muted">
                        {e.location} | {e.year}
                      </small>
                    </div>
                  </div>
                </Tilt>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 2: DETAIL FOTO */}
        {selectedEvent && (
          <div>
            <button onClick={() => setSelectedEvent(null)} className="btn btn-outline-dark mb-4">
              &larr; Back to Albums
            </button>
            <h2 className="fw-bold mb-4">
              {selectedEvent.title} <span className="text-warning">Photos</span>
            </h2>

            <div className="row g-3">
              {photos.length > 0 ? (
                photos.map((p, idx) => (
                  <div className="col-md-3 col-6" key={idx}>
                    <img src={`${API}/uploads/gallery_photo/${p.photo}`} className="img-fluid rounded shadow-sm" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  </div>
                ))
              ) : (
                <p className="text-muted">Belum ada foto di event ini.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
