import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [input, setInput] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/login', input);
      if (res.data.success) {
        // Simpan status login di LocalStorage browser
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin');
      } else {
        alert('Password Salah!');
      }
    } catch (error) {
      alert('Gagal Login. Cek Username/Password.');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
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
          <a href="/" className="d-block text-center mt-3 text-muted small text-decoration-none">
            Kembali ke Home
          </a>
        </form>
      </div>
    </div>
  );
}
