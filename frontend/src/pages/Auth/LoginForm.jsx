import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../App";
import { fetchAPI } from "../../utils/api";
import "./Login.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // login fonksiyonunu context'ten al

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await fetchAPI("/auth/login", "POST", { email, password });
      
      // Artık localStorage'a doğrudan yazmıyoruz.
      // App'teki merkezi state'i güncelleyen fonksiyonu çağırıyoruz.
      login(data);

      if (data.user.is_admin) {
        navigate("/admin");
      } else {
        navigate("/dashboard"); // Veya /courses
      }
    } catch (err) {
      setError(err.message || "Giriş başarısız.");
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
