import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css"; // Bu JSX'i stilendirecek olan CSS dosyasını import ediyoruz.

// --- YARDIMCI İKON BİLEŞENLERİ ---
// Bu küçük, yeniden kullanılabilir bileşenleri ana bileşenin DIŞINDA tanımlıyoruz.
const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon phone-icon"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon search-icon"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

// --- ANA NAVBAR BİLEŞENİ ---
function Navbar() {
  // Kullanıcının kimlik durumunu ve rolünü tarayıcı hafızasından (localStorage) okuyoruz.
  // Bu, sayfa her yenilendiğinde veya render olduğunda en güncel bilgiyi almamızı sağlar.
  const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = !!localStorage.getItem("authToken");
  const isAdmin = user?.is_admin;

  // Çıkış yapma fonksiyonu
  const handleLogout = () => {
    // Güvenli çıkış için önce tarayıcı hafızasını temizliyoruz.
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // Kullanıcıyı login sayfasına yönlendiriyoruz ve sayfayı tamamen yeniliyoruz.
    // Bu, uygulamanın tüm state'lerinin sıfırlanmasını garantiler.
    window.location.href = "/login";
  };

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <img
              src="https://mezitli.bel.tr/wp-content/uploads/2020/07/mezbellogo-1.png"
              alt="Atatürk"
              className="ataturk-logo"
            />
          </Link>

          <ul className="nav-menu-center">
            <li>
              <NavLink to="/courses">KURS MERKEZLERİ</NavLink>
            </li>
            {/* Buraya gelecekte "Hizmetler", "İletişim" gibi statik linkler eklenebilir */}
          </ul>

          <div className="nav-right-section">
            <div className="action-icons">
              <PhoneIcon />
              <SearchIcon />
            </div>

            <img
              src="https://mezitli.bel.tr/wp-content/uploads/elementor/thumbs/ataturkbanner-p5cqm43v2khi30o2dx2vv9xpqyvj4ef97idtx88vr8.png"
              alt="Atatürk"
              className="ataturk-logo"
            />

            <ul className="nav-menu-user">
              {isAuthenticated ? (
                // --- Kullanıcı Giriş Yaptıysa ---
                <>
                  {isAdmin ? (
                    // Admin ise "Admin Paneli" linkini göster
                    <li>
                      <NavLink to="/admin">Admin Paneli</NavLink>
                    </li>
                  ) : (
                    // Normal kullanıcı ise "Kurslarım" linkini göster
                    <li>
                      <NavLink to="/my-courses">Kurslarım</NavLink>
                    </li>
                  )}
                  <li>
                    <button onClick={handleLogout} className="logout-button">
                      Çıkış Yap
                    </button>
                  </li>
                </>
              ) : (
                // --- Misafir (Giriş Yapmamış) Kullanıcı ---
                <>
                  <li>
                    <NavLink to="/login">Giriş Yap</NavLink>
                  </li>
                  <li>
                    <NavLink to="/register" className="register-link">
                      Kayıt Ol
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
