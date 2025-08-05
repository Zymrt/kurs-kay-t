import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from './App'; // App.jsx'ten AuthContext'i import et
import './Navbar.css'; // Navbar için özel CSS dosyasını import et

function Navbar() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Context'teki logout fonksiyonunu çağırır
    navigate('/');
  };

  return (
    <div className="navbar-wrapper">
      <div className="top-bar"></div>
      <nav className="navbar">
        <div className="navbar-container">
          
          {/* --- SOL TARAF: LOGO VE MARKA ADI --- */}
          <Link to="/" className="navbar-brand">
            <img src="https://mezitli.bel.tr/wp-content/uploads/2020/07/mezbellogo-1.png" alt="Belediye Logosu" className="navbar-logo" />
            <div className="brand-text">
              <span>MEZİTLİ BELEDİYESİ</span>
              <span>KURS MERKEZİ</span>
            </div>
          </Link>

          {/* --- ORTA KISIM: NAVİGASYON LİNKLERİ --- */}
          <ul className="nav-menu-center">
            <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Ana Sayfa</NavLink></li>
            <li><NavLink to="/courses" className={({ isActive }) => isActive ? "active" : ""}>Tüm Kurslar</NavLink></li>
            {isAuthenticated && (
              <li><NavLink to="/my-courses" className={({ isActive }) => isActive ? "active" : ""}>Kurslarım</NavLink></li>
            )}
            {isAuthenticated && user?.is_admin && (
              <li><NavLink to="/admin" className={({ isActive }) => isActive ? "active" : ""}>Admin Paneli</NavLink></li>
            )}
          </ul>

          {/* --- SAĞ TARAF: KULLANICI İŞLEMLERİ VE ATATÜRK LOGOSU --- */}
          <div className="nav-right-section">
            <ul className="nav-menu-user">
              {isAuthenticated ? (
                <>
                  <li><span>Hoş geldin, {user?.name}!</span></li>
                  <li><button onClick={handleLogout} className="logout-button">Çıkış Yap</button></li>
                </>
              ) : (
                <>
                  <li><Link to="/login">Giriş Yap</Link></li>
                  <li><Link to="/register" className="register-link">Kayıt Ol</Link></li>
                </>
              )}
            </ul>
            <img src="https://mezitli.bel.tr/wp-content/uploads/elementor/thumbs/ataturkbanner-p5cqm43v2khi30o2dx2vv9xpqyvj4ef97idtx88vr8.png" alt="Atatürk" className="ataturk-logo" />
          </div>

        </div>
      </nav>
    </div>
  );
}

export default Navbar;