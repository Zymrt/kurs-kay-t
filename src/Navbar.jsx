import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './App';

function Navbar() {
  const { isAuthenticated, user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src="https://mezitli.bel.tr/wp-content/uploads/2020/07/mezbellogo-1.png" alt="Belediye Logosu" className="navbar-logo" />
        <img src="https://mezitli.bel.tr/wp-content/uploads/elementor/thumbs/ataturkbanner-p5cqm43v2khi30o2dx2vv9xpqyvj4ef97idtx88vr8.png" alt="Kurs Logosu" className="navbar-logo" />
        <span className="navbar-title">BELEDİYE KURS KAYIT SİSTEMİ</span>
      </Link>
      <ul className="nav-links">
        <li><Link to="/">Ana Sayfa</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link to="/kurslarim">Kurslarım</Link></li>
            {user?.role === 'admin' && (
              <li><Link to="/admin">Admin Paneli</Link></li>
            )}
            <li><button onClick={handleLogout}>Çıkış Yap</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Giriş Yap</Link></li>
            <li><Link to="/register">Kayıt Ol</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;