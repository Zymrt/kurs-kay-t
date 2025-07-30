import React, { useState, useEffect, useCallback } from "react";
import { fetchAPI } from "../../utils/api";
// import './ManageItems.css'; // Ortak bir stil dosyası kullanabiliriz

const ManageInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Eğitmenleri API'den çekme fonksiyonu
  const fetchInstructors = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAPI("/instructors");
      setInstructors(data.data || data); // Sayfalama varsa .data
    } catch (err) {
      setError("Eğitmenler yüklenemedi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  // Bir eğitmeni silme fonksiyonu
  const handleDelete = async (instructorId, instructorName) => {
    // Kullanıcıya onay sorusu soralım
    if (
      window.confirm(
        `'${instructorName}' adlı eğitmeni silmek istediğinizden emin misiniz?`
      )
    ) {
      try {
        // Backend'e DELETE isteği atıyoruz
        await fetchAPI(`/admin/instructors/${instructorId}`, "DELETE");

        // Başarılı silme sonrası listeyi yeniden çekerek güncelliyoruz
        fetchInstructors();
        alert(`'${instructorName}' başarıyla silindi.`);
      } catch (error) {
        // Backend'den gelen "aktif dersi var" gibi özel hataları göster
        alert(`Hata: ${error.message}`);
        console.error(error);
      }
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="management-list">
      {instructors.length === 0 ? (
        <p>Sistemde kayıtlı eğitmen bulunmamaktadır.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>İsim</th>
              <th>Uzmanlık Alanı</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((instructor) => (
              <tr key={instructor.id}>
                <td>{instructor.name}</td>
                <td>{instructor.specialty}</td>
                <td className="action-buttons">
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(instructor.id, instructor.name)}
                  >
                    Sil
                  </button>
                  {/* Gelecekte buraya "Düzenle" butonu eklenebilir */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageInstructors;
