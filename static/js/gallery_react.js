const { useState, useEffect } = React;

const GalleryApp = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null); // State untuk tahun yang dipilih

  useEffect(() => {
    fetch('/api/gallery')
      .then((response) => response.json())
      .then((data) => {
        setGalleries(data);
        setLoading(false);
      })
      .catch((error) => console.error('Error fetching gallery:', error));
  }, []);

  // LOGIC: Mengelompokkan data berdasarkan Tahun agar unik
  // Mengambil satu contoh foto per tahun sebagai cover album
  const uniqueYears = [...new Set(galleries.map((item) => item.year))].sort((a, b) => b - a);

  const getAlbumCover = (year) => {
    const item = galleries.find((g) => g.year === year);
    // Jika foto default/placeholder, ganti dengan gambar random mobil agar cantik
    if (item.photo === 'default_gallery.jpg') return 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png';
    return `/uploads/gallery/${item.photo}`;
  };

  const getAlbumInfo = (year) => galleries.find((g) => g.year === year);

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning"></div>
      </div>
    );

  // --- TAMPILAN 2: DETAIL FOTO (Jika ada tahun dipilih) ---
  if (selectedYear) {
    const photosInYear = galleries.filter((g) => g.year === selectedYear);
    const albumInfo = getAlbumInfo(selectedYear);

    return (
      <div className="container" data-aos="fade-up">
        <button onClick={() => setSelectedYear(null)} className="btn btn-outline-dark mb-4">
          &larr; Kembali ke Album
        </button>
        <h2 className="fw-bold mb-2">{albumInfo.title}</h2>
        <p className="text-muted mb-4">
          <i className="bi bi-geo-alt-fill"></i> {albumInfo.location}
        </p>

        <div className="row">
          {photosInYear.map((item, idx) => (
            <div key={idx} className="col-md-4 mb-4">
              <div className="card border-0 shadow-sm">
                <img src={item.photo === 'default_gallery.jpg' ? 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png' : `/uploads/gallery/${item.photo}`} className="card-img-top" style={{ height: '250px', objectFit: 'cover' }} />
              </div>
            </div>
          ))}
          {photosInYear.length === 0 && <p>Belum ada foto di tahun ini.</p>}
        </div>
      </div>
    );
  }

  // --- TAMPILAN 1: LIST ALBUM TAHUNAN ---
  return (
    <div className="row">
      {uniqueYears.map((year, index) => {
        const info = getAlbumInfo(year);
        return (
          <div key={index} className="col-md-4 col-sm-6 mb-4" data-aos="fade-up" data-aos-delay={index * 50}>
            <div className="card border-0 shadow h-100 gallery-card" style={{ cursor: 'pointer', overflow: 'hidden' }} onClick={() => setSelectedYear(year)}>
              <div className="position-relative">
                <img src={getAlbumCover(year)} className="card-img-top" style={{ height: '220px', objectFit: 'cover', filter: 'brightness(0.9)' }} alt={year} />
                <div className="card-img-overlay d-flex align-items-end p-0">
                  <div className="bg-white w-100 p-3 opacity-90">
                    <h5 className="fw-bold text-dark mb-0">{info.title}</h5>
                    <small className="text-primary fw-bold">{info.location}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('react-gallery-root'));
root.render(<GalleryApp />);
