import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../App';
import './Login.css';

function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5001/api/users/register', { name, email, password });
      loginUser(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Bir hata oluştu.');
    }
  };
  // ... (JSX kısmı aynı kalacak)
  return (
    <div className="login-container">
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group"><label htmlFor="name">İsim Soyisim</label><input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <div className="form-group"><label htmlFor="email">E-posta</label><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div className="form-group"><label htmlFor="password">Şifre</label><input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
        <button type="submit" className="btn">Kayıt Ol</button>
      </form>
      <div className="form-footer"><p>Zaten bir hesabın var mı? <Link to="/login">Giriş Yap</Link></p></div>
    </div>
  );
}

export default RegisterForm;