import React, { useState, useEffect } from "react";
import { fetchAPI } from "../../utils/api";
import { Link } from "react-router-dom"; // Link bileşenini import edelim
// import './MyCourses.css'; // İsteğe bağlı olarak stil dosyası eklenebilir

const MyCourses = () => {
  // 1. State'lerimiz: enrollments, loading ve error
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // String yerine null ile başlatmak daha standarttır

  useEffect(() => {
    const fetchMyEnrollments = async () => {
      setLoading(true);
      setError(null);
      try {
        const responseData = await fetchAPI("/my-enrollments");
        setEnrollments(responseData.data || responseData || []);
      } catch (err) {
        setError("Kurslarınız yüklenirken bir hata oluştu.");
        console.error("Kurslarım yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyEnrollments();
  }, []);

  // 'Kurstan Ayrıl' işlevini şimdilik devre dışı bırakıyoruz, çünkü backend'de karşılığı yok.
  // Gelecekte eklenebilir.
  // const handleUnenroll = async (enrollmentId) => { ... }

  if (loading) return <div className="loading">Kurslarım Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  // 2. JSX kısmı: 'myCourses' yerine 'enrollments' state'ini kullanıyoruz.
  return (
    <div className="my-courses-page">
      <h1>Katıldığım Kurslar ve Başvurularım</h1>

      {enrollments.length > 0 ? (
        <div className="course-grid">
          {" "}
          {/* CourseList'tekiyle aynı stili kullanabiliriz */}
          {enrollments.map((enrollment) =>
            // Her bir 'enrollment' objesi bir başvuru/kayıttır
            enrollment.course ? ( // Güvenlik kontrolü: course verisi var mı?
              <div
                key={enrollment.id || enrollment._id}
                className="course-card"
              >
                {/* Ders bilgilerine enrollment.course objesi üzerinden ulaşıyoruz */}
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

                {/* Başvuru durumunu gösteren bölüm */}
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

                {/* Kurstan Ayrıl butonu, sadece onaylanmışsa görünebilir. 
                    Bu özellik eklendiğinde yorum satırı kaldırılabilir. */}
                {/* 
                {enrollment.status === 'approved' && (
                  <button
                    onClick={() => handleUnenroll(enrollment.id)}
                    className="btn btn-delete"
                  >
                    Kurstan Ayrıl
                  </button>
                )}
                */}
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
