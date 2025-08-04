import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// axios ve AuthContext'e ihtiyacımız yok.
import "./Login.css"; // Stil dosyası Login ile aynı olabilir, tutarlılık için.
import { fetchAPI } from "../../utils/api";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState(""); // Şifre onayı için
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== passwordConfirmation) {
      setError("Şifreler eşleşmiyor!");
      setLoading(false);
      return;
    }

    try {
      const data = await fetchAPI("/auth/register", "POST", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      // Başarılı kayıtta otomatik giriş yap
      localStorage.setItem("authToken", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Kullanıcıyı dashboard'a veya kurslar sayfasına yönlendir
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Bir hata oluştu.");
      console.error("Kayıt hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
    <div className="auth-container">
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
          <i className="fas fa-user"></i>
          <input type="text" placeholder="İsim Soyisim" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="input-group">
          <i className="fas fa-envelope"></i>
          <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="input-group">
          <i className="fas fa-lock"></i>
          <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="input-group">
          <i className="fas fa-lock"></i>
          <input type="password" placeholder="Şifre Tekrar" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required />
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Kayıt Olunuyor..." : "Kayıt Ol"}
        </button>
      </form>
      <div className="form-footer">
        <p>Zaten bir hesabın var mı? <Link to="/login">Giriş Yap</Link></p>
      </div>
    </div>
  </div>
  );
}

export default RegisterForm;
