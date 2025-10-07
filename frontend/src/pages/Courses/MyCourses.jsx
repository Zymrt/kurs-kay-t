import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchAPI } from "../../utils/api";
import { toast } from "react-toastify";

const MyCourses = () => {
  // --- BÖLÜM 1: JAVASCRIPT MANTIĞI (State'ler ve Fonksiyonlar) ---

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchMyEnrollments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const responseData = await fetchAPI("/my-enrollments");

      // --- EN ÖNEMLİ DÜZELTME BURADA ---
      let enrollmentsArray = []; // Varsayılan olarak boş bir dizi

      // Gelen verinin içinde '.data' anahtarı varsa ve o bir diziyse, onu kullan.
      if (responseData && Array.isArray(responseData.data)) {
        enrollmentsArray = responseData.data;
      }
      // Veya gelen verinin kendisi bir diziyse, onu kullan.
      else if (Array.isArray(responseData)) {
        enrollmentsArray = responseData;
      }

      // State'i her zaman bir dizi ile güncelle.
      setEnrollments(enrollmentsArray);
      // --- DÜZELTME BİTTİ ---
    } catch (err) {
      setError("Kurslarınız yüklenirken bir hata oluştu.");
      console.error("Kurslarım yüklenemedi:", err);
      // ... (hata yönetimi aynı) ...
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchMyEnrollments();
  }, [fetchMyEnrollments]);

  // Başvuruyu İptal Etme Fonksiyonu (Çalışan versiyon)
  const handleCancelEnrollment = async (enrollmentId, courseTitle) => {
    if (window.confirm(/* ... */)) {
      try {
        await fetchAPI(`/enrollments/${enrollmentId}`, "DELETE");
        setEnrollments(/* ... */);
        // alert() yerine:
        toast.success("Başvurunuz başarıyla iptal edildi.");
      } catch (err) {
        // alert() yerine:
        toast.error(`İptal işlemi sırasında bir hata oluştu: ${err.message}`);
      }
    }
  };

  if (loading) return <div className="loading">Kurslarım Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  // --- BÖLÜM 2: JSX (TASARIM) - SENİN GÖNDERDİĞİN ORİJİNAL YAPI KORUNDU ---

  return (
    <div className="my-courses-page">
      <h1>Katıldığım Kurslar ve Başvurularım</h1>

      {enrollments.length > 0 ? (
        <div className="course-grid">
          {" "}
          {/* CourseList'tekiyle aynı stili kullanabiliriz */}
          {enrollments.map((enrollment) =>
            enrollment.course ? (
              <div
                key={enrollment.id || enrollment._id}
                className="course-card" // Senin orijinal sınıf adın
              >
                <h3>{enrollment.course.title}</h3>
                <p className="course-description">
                  {enrollment.course.description}
                </p>
                <div className="course-meta">
                  <span>
                    Eğitmen:{" "}
                    {enrollment.course.instructor?.name || "Belirtilmemiş"}
                  </span>
                </div>
                <div className="enrollment-status">
                  <strong>Başvuru Durumu:</strong>
                  <span className={`status-badge status-${enrollment.status}`}>
                    {enrollment.status === "approved"
                      ? "Onaylandı"
                      : enrollment.status === "pending"
                      ? "Onay Bekliyor"
                      : "Reddedildi"}
                  </span>
                </div>
                <div className="card-actions">
                  <button
                    // Buton, ID ve başlığı doğru bir şekilde fonksiyona gönderiyor
                    onClick={() =>
                      handleCancelEnrollment(
                        enrollment._id || enrollment.id,
                        enrollment.course.title
                      )
                    }
                    className="btn-cancel" // Senin orijinal sınıf adın
                  >
                    Başvuruyu İptal Et
                  </button>
                </div>
              </div>
            ) : null
          )}
        </div>
      ) : (
        <p>
          Henüz hiçbir kursa kayıtlı değilsiniz veya başvuruda bulunmadınız.{" "}
          <Link to="/courses">Tüm kursları inceleyebilirsiniz.</Link>
        </p>
      )}
    </div>
  );
};

export default MyCourses;
