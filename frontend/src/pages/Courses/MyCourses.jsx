import React, { useState, useEffect, useCallback } from "react";
import { fetchAPI } from "../../utils/api"; // Merkezi API fonksiyonumuzu kullanıyoruz
// import { AuthContext } from '../../App'; // Artık buna ihtiyacımız yok

const MyCourses = () => {
  // State tanımlamaları
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kullanıcının kendi başvurularını API'den çekme
  const fetchMyEnrollments = useCallback(async () => {
    setLoading(true);
    try {
      // /my-enrollments adresi, backend'de giriş yapmış kullanıcının
      // token'ına göre doğru kayıtları döndürecektir.
      const data = await fetchAPI("/my-enrollments");
      setEnrollments(data.data || data);
    } catch (err) {
      setError("Dersleriniz yüklenirken bir hata oluştu.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyEnrollments();
  }, [fetchMyEnrollments]);

  if (loading) return <p>Dersleriniz yükleniyor...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="my-courses-container">
      <h1>Kayıtlı Olduğum Dersler</h1>

      {enrollments.length === 0 ? (
        <p>Henüz herhangi bir derse kayıtlı değilsiniz.</p>
      ) : (
        <div className="courses-grid">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="course-card">
              <h3>{enrollment.course?.title || "Bilinmeyen Ders"}</h3>
              <p>Eğitmen: {enrollment.course?.instructor?.name || "N/A"}</p>
              <p>
                Durum:
                <span className={`status-badge status-${enrollment.status}`}>
                  {enrollment.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
