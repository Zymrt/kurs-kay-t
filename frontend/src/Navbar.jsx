import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from './App';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="navbar-wrapper">
      <div className="top-bar"></div>
      <nav className="navbar">
        <div className="navbar-container">
          
          {/* --- SOL TARAF: LOGO VE MARKA ADI --- */}
          <Link to="/courses" className="navbar-brand">
            <img src="https://mezitli.bel.tr/wp-content/uploads/2020/07/mezbellogo-1.png" alt="Belediye Logosu" className="navbar-logo" />
            <div className="brand-text">
              <span>MEZİTLİ BELEDİYESİ</span>
              <span>KURS MERKEZİ</span>
            </div>
          </Link>

          {/* --- ORTA KISIM: NAVİGASYON LİNKLERİ --- */}
          <ul className="nav-menu-center">
            <li>
              <a href="https://mezitli.bel.tr/" target="_blank" rel="noopener noreferrer">
                Ana Sayfa
              </a>
            </li>
            <li><NavLink to="/courses" className={({ isActive }) => isActive ? "active" : ""}>Tüm Kurslar</NavLink></li>
            
            {/* ==================== DEĞİŞİKLİK BURADA ==================== */}
            
            {/* Eğer kullanıcı giriş yapmışsa VE admin DEĞİLSE "Kurslarım" linkini göster */}
            {isAuthenticated && !user?.is_admin && (
              <li><NavLink to="/my-courses" className={({ isActive }) => isActive ? "active" : ""}>Kurslarım</NavLink></li>
            )}

            {/* Eğer kullanıcı giriş yapmışsa VE admin İSE "Admin Paneli" linkini göster */}
            {isAuthenticated && user?.is_admin && (
              <li><NavLink to="/admin" className={({ isActive }) => isActive ? "active" : ""}>Admin Paneli</NavLink></li>
            )}
            
            {/* ========================================================== */}
          </ul>

          {/* --- SAĞ TARAF: İKONLAR, ATATÜRK VE KULLANICI İŞLEMLERİ --- */}
          <div className="nav-right-section">
            
            {/* 1. SOSYAL MEDYA İKONLARI */}
            <div className="social-icons-nav">
               <a href="https://www.facebook.com/Mezitlibel" target="_blank" rel="noopener noreferrer" title="Facebook">
                 <i className="fab fa-facebook-f"></i>
               </a>
               <a href="https://twitter.com/MezitliBel" target="_blank" rel="noopener noreferrer" title="Twitter">
                 <i className="fab fa-twitter"></i>
               </a>
               <a href="https://www.instagram.com/Mezitlibel" target="_blank" rel="noopener noreferrer" title="Instagram">
                 <i className="fab fa-instagram"></i>
               </a>
            </div>

            {/* 2. ATATÜRK LOGOSU */}
            <img src="https://mezitli.bel.tr/wp-content/uploads/elementor/thumbs/ataturkbanner-p5cqm43v2khi30o2dx2vv9xpqyvj4ef97idtx88vr8.png" alt="Atatürk" className="ataturk-logo" />
            
            {/* 3. KULLANICI GİRİŞ/KAYIT/ÇIKIŞ BÖLÜMÜ (EN SAĞDA) */}
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
          </div>

        </div>
      </nav>
    </div>
  );
}

export default Navbar;