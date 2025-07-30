import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css"; // Stil dosyasını import ediyoruz

function Navbar() {
  // Kullanıcı durumunu, sayfa her render olduğunda localStorage'dan alıyoruz.
  // 'useContext' veya 'App' referansı YOK.
  const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = !!localStorage.getItem("authToken");
  const isAdmin = user?.is_admin;

  // Çıkış yapma fonksiyonu
  const handleLogout = () => {
    // Tarayıcı hafızasını temizle
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // Login sayfasına yönlendir ve sayfayı yenileyerek Navbar'ın güncellenmesini sağla.
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          {/* Logoları public klasörüne koyduğunuzu varsayıyoruz */}
          {/* <img src="/logo1.png" alt="Belediye Logosu" className="navbar-logo" /> */}
          {/* <img src="/logo2.png" alt="Kurs Logosu" className="navbar-logo" /> */}
          <span className="navbar-title">KURS KAYIT SİSTEMİ</span>
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink to="/courses" className="nav-link">
              Tüm Kurslar
            </NavLink>
          </li>

          {isAuthenticated ? (
            // --- Giriş Yapmış Kullanıcı ---
            <>
              {isAdmin ? (
                <li className="nav-item">
                  <NavLink to="/admin" className="nav-link">
                    Admin Paneli
                  </NavLink>
                </li>
              ) : (
                <li className="nav-item">
                  <NavLink to="/my-courses" className="nav-link">
                    Kurslarım
                  </NavLink>
                </li>
              )}
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-button-logout">
                  Çıkış Yap
                </button>
              </li>
            </>
          ) : (
            // --- Misafir Kullanıcı ---
            <>
              <li className="nav-item">
                <NavLink to="/login" className="nav-link">
                  Giriş Yap
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/register" className="nav-link">
                  Kayıt Ol
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
