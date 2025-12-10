import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function SignUp() {
  const [input, setInput] = useState({ username: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();
  const API = 'http://127.0.0.1:5000';

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (input.password !== input.confirmPassword) {
      alert('Password konfirmasi tidak cocok!');
      return;
    }

    try {
      const res = await axios.post(`${API}/api/signup`, {
        username: input.username,
        password: input.password,
      });

      if (res.data.success) {
        alert('Registrasi Berhasil! Silakan Login.');
        navigate('/login');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal Mendaftar.');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-elviro-blue">
      <div className="card shadow border-0 p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center fw-bold mb-4 text-elviro-blue">Daftar Admin Baru</h3>
        <form onSubmit={handleSignUp}>
          <div className="mb-3">
            <label>Username</label>
            <input type="text" className="form-control" onChange={(e) => setInput({ ...input, username: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control" onChange={(e) => setInput({ ...input, password: e.target.value })} required />
          </div>
          <div className="mb-4">
            <label>Konfirmasi Password</label>
            <input type="password" className="form-control" onChange={(e) => setInput({ ...input, confirmPassword: e.target.value })} required />
          </div>
          <button className="btn btn-warning w-100 py-2 fw-bold">DAFTAR</button>
          <div className="text-center mt-3">
            <small>
              Sudah punya akun? <Link to="/login">Login disini</Link>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
}
