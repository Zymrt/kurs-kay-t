import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// axios importuna artık ihtiyacımız yok.
// AuthContext yerine localStorage kullanacağımız için onu da kaldırıyoruz.
import "./Login.css";
import { fetchAPI } from "../../utils/api";

function LoginForm() {
  // State'ler aynı kalıyor, bir de yükleme durumu ekleyelim
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Kullanıcı deneyimi için
  const navigate = useNavigate();

  // loginUser fonksiyonuna artık ihtiyacımız yok.

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await fetchAPI("/auth/login", "POST", {
        email,
        password,
      });

      localStorage.setItem("authToken", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Rol kontrolünü bizim backend'in cevabına göre yap
      if (data.user.is_admin) {
        navigate("/admin");
      } else {
        navigate("/courses");
      }
    } catch (err) {
      setError(
        err.message || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin."
      );
      console.error("Giriş hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
    <div className="auth-container">
      <h2>Kullanıcı Girişi</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        
        <div className="input-group">
          <i className="fas fa-envelope"></i> {/* FontAwesome ikonları için */}
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="input-group">
          <i className="fas fa-lock"></i> {/* FontAwesome ikonları için */}
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Giriş Yapılıyor..." : "GİRİŞ"}
        </button>
      </form>
      <div className="form-footer">
        <p>Hesabın yok mu? <Link to="/register">Kayıt Ol</Link></p>
        <p style={{marginTop: '10px'}}><a href="#">Kullanıcı Adı ve Şifre Unuttum</a></p>
      </div>
    </div>
  </div>
  );
}

export default LoginForm;
