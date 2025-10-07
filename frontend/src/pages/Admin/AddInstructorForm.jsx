import React, { useState } from "react";
import { fetchAPI } from "../../utils/api";
import { toast } from "react-toastify";
import "./AdminForms.css"; // Yeni ve ortak stil dosyamızı import ediyoruz

const AddInstructorForm = ({ onInstructorAdded }) => {
  // Form alanları için state'ler
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Formu gönderme fonksiyonu
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await fetchAPI("/admin/instructors", "POST", { name, specialty, bio });

      toast.success(`'${name}' başarıyla eklendi!`);

      // Formu temizle
      setName("");
      setSpecialty("");
      setBio("");

      // AdminPage'deki listeyi yenilemesi için haber ver
      if (onInstructorAdded) {
        onInstructorAdded();
      }
    } catch (error) {
      // Backend'den gelen unique gibi validasyon hatalarını da göster
      toast.error(`Hata: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-form-container">
      <h3>Yeni Eğitmen Ekle</h3>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="instructor-name">Ad Soyad</label>
          <input
            id="instructor-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Örn: Prof. Dr. Ayşe Yılmaz"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="instructor-specialty">Uzmanlık Alanı</label>
          <input
            id="instructor-specialty"
            type="text"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder="Örn: Veri Bilimi"
            required
          />
          <p className="form-note">Ders kategorileri ile eşleşmelidir.</p>
        </div>

        <div className="form-group">
          <label htmlFor="instructor-bio">Biyografi (Opsiyonel)</label>
          <textarea
            id="instructor-bio"
            rows="4"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Eğitmen hakkında kısa bilgi, deneyimleri vb."
          />
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Ekleniyor..." : "Eğitmeni Ekle"}
        </button>
      </form>
    </div>
  );
};

export default AddInstructorForm;
