import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // --- STATE DATA ---
  const [applicants, setApplicants] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [events, setEvents] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [config, setConfig] = useState({ start_date: '', end_date: '', message: '' });

  // --- STATE FILTER & EDIT ---
  const [selectedTeamYear, setSelectedTeamYear] = useState('All');

  // Edit State untuk Achievement
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);

  // Edit State untuk Team (BARU)
  const [editTeamMode, setEditTeamMode] = useState(false);
  const [editTeamData, setEditTeamData] = useState(null);

  const navigate = useNavigate();
  const API = 'http://127.0.0.1:5000';

  useEffect(() => {
    if (!localStorage.getItem('isAdmin')) navigate('/login');
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get(`${API}/api/applicants`).then((res) => setApplicants(res.data));
    axios.get(`${API}/api/team`).then((res) => setTeamList(res.data));
    axios.get(`${API}/api/gallery/events`).then((res) => setEvents(res.data));
    axios.get(`${API}/api/achievements`).then((res) => setAchievements(res.data));
    axios.get(`${API}/api/config`).then((res) =>
      setConfig({
        start_date: res.data.start,
        end_date: res.data.end,
        message: res.data.message,
      })
    );
  };

  const uniqueYears = ['All', ...new Set(teamList.map((t) => t.period))].sort().reverse();
  const filteredTeamList = selectedTeamYear === 'All' ? teamList : teamList.filter((t) => t.period === selectedTeamYear);

  const handleDeleteApplicant = async (id) => {
    if (confirm('Yakin hapus data pendaftar ini?')) {
      try {
        await axios.delete(`${API}/api/admin/applicant/delete/${id}`);
        fetchData();
      } catch (error) {
        alert('Gagal menghapus data.');
      }
    }
  };

  const handleUpload = async (e, type) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      if (type === 'Achievement' && editMode) {
        formData.append('id', editData.id);
        await axios.post(`${API}/api/admin/achievement/update`, formData);
        alert('Prestasi Berhasil Diupdate!');
        setEditMode(false);
        setEditData(null);
      } else if (type === 'Tim' && editTeamMode) {
        // LOGIC UPDATE TEAM BARU
        formData.append('id', editTeamData.id);
        await axios.post(`${API}/api/admin/team/update`, formData);
        alert('Data Tim Berhasil Diupdate!');
        setEditTeamMode(false);
        setEditTeamData(null);
      } else {
        await axios.post(`${API}/admin/upload`, formData);
        alert(`Data ${type} Berhasil Disimpan!`);
      }
      e.target.reset();
      fetchData();
    } catch (err) {
      alert('Gagal Menyimpan Data');
    }
  };

  const handleUpdateSchedule = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/api/admin/config`, config);
    alert('Pengaturan Oprec Disimpan!');
    fetchData();
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  const pageVariant = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  const MenuItem = ({ id, icon, label }) => (
    <button onClick={() => setActiveTab(id)} className={`btn w-100 text-start d-flex align-items-center mb-2 px-3 py-2 rounded-3 transition-all ${activeTab === id ? 'btn-warning fw-bold shadow' : 'text-white-50 hover-light'}`}>
      <i className={`bi ${icon} me-3 fs-5`}></i> {label}
    </button>
  );

  const isOprecOpen = new Date() >= new Date(config.start_date) && new Date() <= new Date(config.end_date);

  return (
    <div className="d-flex min-vh-100 bg-light font-sans">
      <div className="d-flex flex-column flex-shrink-0 p-3 text-white" style={{ width: '280px', background: '#0f172a' }}>
        <div className="d-flex align-items-center mb-4 px-2">
          <span className="fs-4 fw-bold text-warning">
            ⚡ ELVIRO{' '}
            <span className="text-white small d-block fw-normal" style={{ fontSize: '12px' }}>
              ADMIN CONSOLE
            </span>
          </span>
        </div>
        <hr className="border-secondary" />
        <div className="nav nav-pills flex-column mb-auto">
          <MenuItem id="dashboard" icon="bi-speedometer2" label="Overview" />
          <MenuItem id="pendaftar" icon="bi-person-lines-fill" label="Manajemen Pendaftar" />
          <MenuItem id="tim" icon="bi-person-badge-fill" label="Manajemen Tim" />
          <MenuItem id="berita" icon="bi-newspaper" label="Posting Berita" />
          <MenuItem id="gallery" icon="bi-images" label="Kelola Galeri" />
          <MenuItem id="prestasi" icon="bi-trophy-fill" label="Kelola Prestasi" />
        </div>
        <hr className="border-secondary" />
        <button onClick={handleLogout} className="btn btn-danger w-100 fw-bold">
          <i className="bi bi-box-arrow-right me-2"></i> LOGOUT
        </button>
      </div>

      <div className="flex-grow-1 p-4 overflow-auto" style={{ maxHeight: '100vh', background: '#f1f5f9' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dash" variants={pageVariant} initial="hidden" animate="visible" exit="exit">
              <h2 className="fw-bold text-dark mb-4">Dashboard Overview</h2>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm h-100 p-3 border-start border-5 border-primary">
                    <div className="card-body">
                      <h6 className="text-muted text-uppercase">Total Pendaftar</h6>
                      <h2 className="fw-bold mb-0">{applicants.length}</h2>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm h-100 p-3 border-start border-5 border-warning">
                    <div className="card-body">
                      <h6 className="text-muted text-uppercase">Status Oprec</h6>
                      <h4 className={`fw-bold mb-0 ${isOprecOpen ? 'text-success' : 'text-danger'}`}>{isOprecOpen ? 'OPEN' : 'CLOSED'}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm h-100 p-3 border-start border-5 border-success">
                    <div className="card-body">
                      <h6 className="text-muted text-uppercase">Total Anggota Tim</h6>
                      <h2 className="fw-bold mb-0">{teamList.length}</h2>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'pendaftar' && (
            <motion.div key="pendaftar" variants={pageVariant} initial="hidden" animate="visible" exit="exit">
              <h3 className="fw-bold mb-4">Manajemen Pendaftaran</h3>
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-header bg-white py-3 border-0">
                  <h5 className="fw-bold text-primary mb-0">
                    <i className="bi bi-sliders me-2"></i> Jadwal Open Recruitment
                  </h5>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={handleUpdateSchedule}>
                    <div className="row g-3">
                      <div className="col-md-3">
                        <label className="fw-bold small text-muted">Buka</label>
                        <input type="date" className="form-control" value={config.start_date} onChange={(e) => setConfig({ ...config, start_date: e.target.value })} />
                      </div>
                      <div className="col-md-3">
                        <label className="fw-bold small text-muted">Tutup</label>
                        <input type="date" className="form-control" value={config.end_date} onChange={(e) => setConfig({ ...config, end_date: e.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="fw-bold small text-muted">Pesan Tutup</label>
                        <div className="input-group">
                          <input type="text" className="form-control" value={config.message} onChange={(e) => setConfig({ ...config, message: e.target.value })} />
                          <button className="btn btn-primary fw-bold">SIMPAN</button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold text-dark mb-0">Data Masuk ({applicants.length})</h5>
                  <div className="d-flex gap-2">
                    <a href={`${API}/api/admin/export`} target="_blank" className="btn btn-success btn-sm fw-bold">
                      <i className="bi bi-file-earmark-excel me-2"></i> Excel
                    </a>
                    <button className="btn btn-secondary btn-sm fw-bold" onClick={() => window.print()}>
                      <i className="bi bi-printer me-2"></i> PDF
                    </button>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-dark text-white">
                      <tr>
                        <th className="ps-3">Nama & NRP</th>
                        <th>Jurusan</th>
                        <th>Fisik</th>
                        <th>Kontak</th>
                        <th>Berkas</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicants.map((a, i) => (
                        <tr key={i}>
                          <td className="ps-3">
                            <div className="fw-bold">{a.name}</div>
                            <small className="text-muted">
                              {a.nrp} ({a.batch})
                            </small>
                          </td>
                          <td>
                            {a.major}
                            <br />
                            <small className="text-muted">{a.department}</small>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border me-1">TB: {a.height}</span>
                            <span className="badge bg-light text-dark border">BB: {a.weight}</span>
                          </td>
                          <td>
                            {a.phone}
                            <br />
                            <small className="text-muted">{a.email}</small>
                          </td>
                          <td>
                            <a href={`${API}/uploads/cv/${a.cv_path}`} target="_blank" className="btn btn-xs btn-outline-primary me-1">
                              CV
                            </a>
                            {a.portfolio && (
                              <a href={a.portfolio} target="_blank" className="btn btn-xs btn-outline-dark">
                                Porto
                              </a>
                            )}
                          </td>
                          <td>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteApplicant(a.id)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {applicants.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center py-5 text-muted">
                            Belum ada pendaftar.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'tim' && (
            <motion.div key="tim" variants={pageVariant} initial="hidden" animate="visible" exit="exit">
              <div className="row">
                <div className="col-md-4">
                  <div className={`card border-0 shadow-sm p-4 rounded-4 mb-4 ${editTeamMode ? 'border-warning border border-2' : ''}`}>
                    <h5 className={`fw-bold mb-3 ${editTeamMode ? 'text-warning' : 'text-primary'}`}>{editTeamMode ? 'Edit Data Tim' : 'Upload Anggota'}</h5>
                    <form onSubmit={(e) => handleUpload(e, 'Tim')}>
                      <input type="hidden" name="add_team" value="1" />
                      <div className="mb-2">
                        <input type="text" name="name" className="form-control" placeholder="Nama" defaultValue={editTeamData?.name || ''} required />
                      </div>
                      <div className="mb-2">
                        <input type="text" name="position" className="form-control" placeholder="Posisi" defaultValue={editTeamData?.position || ''} required />
                      </div>
                      <div className="row g-2 mb-2">
                        <div className="col">
                          <input type="text" name="period" className="form-control" placeholder="Tahun" defaultValue={editTeamData?.period || ''} required />
                        </div>
                        <div className="col">
                          <input type="text" name="batch" className="form-control" placeholder="Angkatan" defaultValue={editTeamData?.batch || ''} required />
                        </div>
                      </div>
                      <div className="mb-2">
                        <input type="text" name="nrp" className="form-control" placeholder="NRP" defaultValue={editTeamData?.nrp || ''} required />
                      </div>
                      <div className="mb-2">
                        <input type="text" name="major" className="form-control" placeholder="Jurusan" defaultValue={editTeamData?.major || ''} required />
                      </div>
                      <div className="mb-3">
                        <label className="small text-muted">Foto</label>
                        <input type="file" name="photo" className="form-control" accept="image/*" required={!editTeamMode} />
                      </div>
                      <div className="d-flex gap-2">
                        <button className={`btn w-100 fw-bold ${editTeamMode ? 'btn-warning' : 'btn-primary'}`}>{editTeamMode ? 'UPDATE' : 'TAMBAH'}</button>
                        {editTeamMode && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                              setEditTeamMode(false);
                              setEditTeamData(null);
                              document.querySelector('form').reset();
                            }}
                          >
                            Batal
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="card border-0 shadow-sm p-4 rounded-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="fw-bold mb-0">Daftar Tim</h5>
                      <div className="d-flex align-items-center">
                        <span className="me-2 small fw-bold">Filter Tahun:</span>
                        <select className="form-select form-select-sm" style={{ width: 'auto' }} value={selectedTeamYear} onChange={(e) => setSelectedTeamYear(e.target.value)}>
                          {uniqueYears.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                      <table className="table table-hover align-middle">
                        <thead className="table-light sticky-top">
                          <tr>
                            <th>Nama</th>
                            <th>Tahun</th>
                            <th>Tampil Home?</th>
                            <th>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTeamList.map((t) => (
                            <tr key={t.id}>
                              <td>
                                <strong>{t.name}</strong>
                                <br />
                                <small className="text-muted">{t.position}</small>
                              </td>
                              <td>
                                <span className="badge bg-secondary">{t.period}</span>
                              </td>
                              <td>
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={t.show_on_home}
                                    onChange={async (e) => {
                                      await axios.post(`${API}/api/admin/team/toggle`, { id: t.id, show: e.target.checked });
                                      fetchData();
                                    }}
                                  />
                                </div>
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm btn-warning me-1"
                                  onClick={() => {
                                    setEditTeamMode(true);
                                    setEditTeamData(t);
                                  }}
                                >
                                  <i className="bi bi-pencil-square"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={async () => {
                                    if (confirm('Hapus?')) {
                                      await axios.delete(`${API}/api/admin/team/delete/${t.id}`);
                                      fetchData();
                                    }
                                  }}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                          {filteredTeamList.length === 0 && (
                            <tr>
                              <td colSpan="4" className="text-center py-3 text-muted">
                                Tidak ada data.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'berita' && (
            <motion.div key="berita" variants={pageVariant} initial="hidden" animate="visible" exit="exit">
              <h3 className="fw-bold mb-4">Posting Berita Baru</h3>
              <div className="card border-0 shadow-sm p-4 rounded-4">
                <form onSubmit={(e) => handleUpload(e, 'Berita')}>
                  <input type="hidden" name="add_news" value="1" />
                  <div className="mb-3">
                    <label className="fw-bold">Judul</label>
                    <input type="text" name="title" className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold">Isi</label>
                    <textarea name="content" className="form-control" rows="6" required></textarea>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label>Thumbnail</label>
                      <input type="file" name="thumbnail" className="form-control" />
                    </div>
                    <div className="col-md-4">
                      <label>Dokumen</label>
                      <input type="file" name="document" className="form-control" />
                    </div>
                    <div className="col-md-4">
                      <label>Link</label>
                      <input type="text" name="link" className="form-control" />
                    </div>
                  </div>
                  <button className="btn btn-primary w-100 mt-4 fw-bold py-2">PUBLISH</button>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div key="gallery" variants={pageVariant} initial="hidden" animate="visible" exit="exit">
              <h3 className="fw-bold mb-4">Kelola Galeri</h3>
              <div className="row g-4">
                <div className="col-md-5">
                  <div className="card border-0 shadow-sm p-4 rounded-4 h-100">
                    <h5 className="text-primary fw-bold mb-3">
                      <i className="bi bi-folder-plus me-2"></i> Buat Event Baru
                    </h5>
                    <form onSubmit={(e) => handleUpload(e, 'Event')}>
                      <input type="hidden" name="add_event" value="1" />
                      <div className="mb-2">
                        <input type="text" name="title" className="form-control" placeholder="Nama Event" required />
                      </div>
                      <div className="mb-2">
                        <input type="text" name="year" className="form-control" placeholder="Tahun" required />
                      </div>
                      <div className="mb-3">
                        <input type="text" name="location" className="form-control" placeholder="Lokasi" required />
                      </div>
                      <div className="mb-3">
                        <label className="small text-muted">Cover Album</label>
                        <input type="file" name="thumbnail" className="form-control" accept="image/*" required />
                      </div>
                      <button className="btn btn-warning w-100 fw-bold">BUAT ALBUM</button>
                    </form>
                  </div>
                </div>
                <div className="col-md-7">
                  <div className="card border-0 shadow-sm p-4 rounded-4 h-100">
                    <h5 className="text-success fw-bold mb-3">
                      <i className="bi bi-images me-2"></i> Isi Foto ke Event
                    </h5>
                    <form onSubmit={(e) => handleUpload(e, 'Foto')}>
                      <input type="hidden" name="add_photo" value="1" />
                      <div className="mb-3">
                        <label className="form-label">Pilih Event</label>
                        <select name="event_id" className="form-select" required>
                          <option value="">-- Pilih Album --</option>
                          {events.map((e) => (
                            <option key={e.id} value={e.id}>
                              {e.title} ({e.year})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Pilih Foto (Bisa Banyak)</label>
                        <input type="file" name="photos" className="form-control" accept="image/*" multiple required />
                      </div>
                      <button className="btn btn-success w-100 fw-bold">UPLOAD FOTO</button>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'prestasi' && (
            <motion.div key="prestasi" variants={pageVariant} initial="hidden" animate="visible" exit="exit">
              <h3 className="fw-bold mb-4">Kelola Prestasi</h3>
              <div className="row">
                <div className="col-md-4">
                  <div className={`card border-0 shadow-sm p-4 rounded-4 mb-4 ${editMode ? 'border-warning border border-2' : ''}`}>
                    <h5 className={`fw-bold mb-3 ${editMode ? 'text-warning' : 'text-primary'}`}>{editMode ? 'Edit Prestasi' : 'Tambah Prestasi Baru'}</h5>
                    <form onSubmit={(e) => handleUpload(e, 'Achievement')}>
                      <input type="hidden" name="add_achievement" value="1" />
                      <div className="mb-2">
                        <label className="small">Tahun</label>
                        <input type="number" name="year" className="form-control" defaultValue={editData?.year || ''} required />
                      </div>
                      <div className="mb-2">
                        <label className="small">Event</label>
                        <input type="text" name="event" className="form-control" defaultValue={editData?.event || ''} required />
                      </div>
                      <div className="mb-2">
                        <label className="small">Kategori</label>
                        <input type="text" name="category" className="form-control" defaultValue={editData?.category || ''} required />
                      </div>
                      <div className="mb-2">
                        <label className="small">Hasil</label>
                        <input type="text" name="result" className="form-control" defaultValue={editData?.result || ''} required />
                      </div>
                      <div className="mb-2">
                        <label className="small">Deskripsi</label>
                        <textarea name="description" className="form-control" rows="3" defaultValue={editData?.description || ''}></textarea>
                      </div>
                      <div className="mb-3">
                        <label className="small">Foto</label>
                        <input type="file" name="photo" className="form-control" accept="image/*" required={!editMode} />
                      </div>
                      <div className="d-flex gap-2">
                        <button className={`btn w-100 fw-bold ${editMode ? 'btn-warning' : 'btn-primary'}`}>{editMode ? 'UPDATE' : 'SIMPAN'}</button>
                        {editMode && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                              setEditMode(false);
                              setEditData(null);
                              document.querySelector('form').reset();
                            }}
                          >
                            Batal
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="card border-0 shadow-sm p-4 rounded-4">
                    <h5 className="fw-bold mb-3">Daftar Prestasi</h5>
                    <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                      <table className="table table-hover align-middle">
                        <thead className="table-light sticky-top">
                          <tr>
                            <th>Tahun</th>
                            <th>Event</th>
                            <th>Foto</th>
                            <th>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {achievements.map((a) => (
                            <tr key={a.id}>
                              <td>
                                <span className="badge bg-dark">{a.year}</span>
                              </td>
                              <td>
                                <strong>{a.event}</strong>
                                <br />
                                <small className="text-muted">{a.result}</small>
                              </td>
                              <td>{a.photo && <img src={`${API}/uploads/achievement/${a.photo}`} width="50" className="rounded" />}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-warning me-1"
                                  onClick={() => {
                                    setEditMode(true);
                                    setEditData(a);
                                  }}
                                >
                                  <i className="bi bi-pencil-square"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={async () => {
                                    if (confirm('Hapus?')) {
                                      await axios.delete(`${API}/api/admin/achievement/delete/${a.id}`);
                                      fetchData();
                                    }
                                  }}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style>{`.hover-light:hover { background: rgba(255,255,255,0.1); color: white !important; }`}</style>
    </div>
  );
}
