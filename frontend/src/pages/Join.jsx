import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Join() {
  const [config, setConfig] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // Tambahan: Loading state agar user tau sedang proses
  
  const [formData, setFormData] = useState({
    name: '',
    nrp: '',
    major: '',
    department: '',
    batch: '',
    email: '',
    phone: '',
    height: '',
    weight: '',
    portfolio: '',
  });

  useEffect(() => {
    // Ambil config menggunakan path relatif
    axios.get('/api/config')
      .then((res) => setConfig(res.data))
      .catch((err) => {
        console.error("Gagal mengambil config:", err);
        // Default config jika error agar tidak blank
        setConfig({ is_open: false, message: "Gagal terhubung ke server." });
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Mulai loading

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    
    // Pastikan file ada sebelum dikirim
    if (file) {
      data.append('cv', file);
    }

    try {
      // PERBAIKAN UTAMA: Gunakan path '/api/join' (bukan http://127.0.0.1:5000)
      // Ini wajib agar request melewati Proxy Vite/Cloudflare
      await axios.post('/api/join', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Pendaftaran Berhasil Terkirim!');
      window.location.href = '/';
      
    } catch (error) {
      console.error("Error submit:", error); // Cek detail error di Console (F12)
      
      // Tampilkan pesan error yang lebih spesifik jika ada respon dari backend
      const serverMessage = error.response?.data?.message || 'Gagal mengirim data. Pastikan semua file terisi dan server menyala.';
      alert(serverMessage);
    } finally {
      setLoading(false); // Selesai loading
    }
  };

  if (!config) return <div className="text-center py-5">Checking Schedule...</div>;

  // --- TAMPILAN JIKA DITUTUP (MENAMPILKAN PESAN ADMIN) ---
  if (!config.is_open) {
    return (
      <div className="container py-5 mt-5">
        <div className="card border-0 shadow-lg text-center p-5 rounded-4 mx-auto" style={{ maxWidth: '700px' }}>
          <div className="mb-4">
            <i className="bi bi-calendar-x display-1 text-muted"></i>
          </div>
          <h2 className="fw-bold text-elviro-blue mb-3">INFORMASI PENDAFTARAN</h2>
          <div className="alert alert-warning border-0 text-dark fw-medium p-4 fs-5" style={{ whiteSpace: 'pre-line' }}>
            {config.message || 'Pendaftaran sedang tidak tersedia.'}
          </div>
          <div className="mt-4">
            <Link to="/" className="btn btn-outline-dark rounded-pill px-4">
              &larr; Kembali ke Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- TAMPILAN FORMULIR ---
  return (
    <div className="container py-5 mt-4">
      <div className="row justify-content-center">
        <div className="col-md-9">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
            <div className="card-header text-white p-4 text-center" style={{ background: 'linear-gradient(45deg, #0f172a, #334155)' }}>
              <h3 className="mb-0 fw-bold">Formulir Open Recruitment</h3>
              <p className="mb-0 text-white-50 small">Isi data diri dengan lengkap dan benar.</p>
            </div>
            <div className="card-body p-5">
              <form onSubmit={handleSubmit}>
                <h5 className="text-warning fw-bold mb-3">Data Pribadi</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Nama Lengkap</label>
                    <input type="text" name="name" className="form-control bg-light" onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">NRP</label>
                    <input type="text" name="nrp" className="form-control bg-light" onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Jurusan</label>
                    <input type="text" name="major" className="form-control" onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Departemen</label>
                    <input type="text" name="department" className="form-control" onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Angkatan</label>
                    <input type="text" name="batch" className="form-control" onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Tinggi Badan (cm)</label>
                    <input type="number" name="height" className="form-control" onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Berat Badan (kg)</label>
                    <input type="number" name="weight" className="form-control" onChange={handleChange} required />
                  </div>
                </div>

                <h5 className="text-warning fw-bold mb-3">Kontak & Berkas</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" className="form-control" onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">No. WhatsApp</label>
                    <input type="text" name="phone" className="form-control" onChange={handleChange} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Link Portofolio (Gdrive/Behance/Github)</label>
                    <input type="text" name="portfolio" className="form-control" onChange={handleChange} placeholder="https://..." />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">Upload CV (Format PDF)</label>
                    <input type="file" className="form-control form-control-lg" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} required />
                    <div className="form-text">Maksimal 2MB. Pastikan nama file mengandung nama Anda.</div>
                  </div>
                </div>

                <button 
                  className="btn btn-warning w-100 py-3 fw-bold shadow-sm hover-scale" 
                  disabled={loading} // Disable tombol saat loading
                >
                  {loading ? (
                    <span><span className="spinner-border spinner-border-sm me-2"></span>Mengirim...</span>
                  ) : (
                    <span>KIRIM PENDAFTARAN <i className="bi bi-send-fill ms-2"></i></span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}