import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// const API = 'http://127.0.0.1:5000';

export default function Login() {
  const [input, setInput] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // const res = await axios.post(`${API}/api/login`, input);
      const res = await axios.post('/api/login', input);
      if (res.data.success) {
        localStorage.setItem('isAdmin', 'true'); // Simpan status login
        navigate('/admin');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Login Gagal. Cek koneksi server.');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-elviro-blue">
      <div className="card shadow border-0 p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center fw-bold mb-4 text-elviro-blue">Admin Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Username</label>
            <input type="text" className="form-control" onChange={(e) => setInput({ ...input, username: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control" onChange={(e) => setInput({ ...input, password: e.target.value })} required />
          </div>
          <button className="btn btn-elviro w-100 py-2">MASUK</button>

          <div className="text-center mt-3 d-flex flex-column gap-2">
            <small>
              Belum punya akun? <Link to="/signup">Daftar Admin</Link>
            </small>
            <Link to="/" className="text-muted small text-decoration-none">
              &larr; Kembali ke Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
