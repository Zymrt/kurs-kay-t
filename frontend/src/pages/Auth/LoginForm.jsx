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
    <div className="login-container">
      <h2>Giriş Yap</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">E-posta</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Şifre</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
      <div className="form-footer">
        <p>
          Hesabın yok mu? <Link to="/register">Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
