import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../../utils/api";
import { AuthContext } from "../../App"; // AuthContext'i import ediyoruz
import { toast } from 'react-toastify'; // Toast bildirimleri için

// Onay Kutusu (Confirm Dialog) Bileşeni
const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <div className="confirm-dialog-overlay">
    <div className="confirm-dialog">
      <h3>Emin misiniz?</h3>
      <p>{message}</p>
      <div className="confirm-dialog-buttons">
        <button onClick={onConfirm} className="btn-confirm-yes">Evet, Sil</button>
        <button onClick={onCancel} className="btn-confirm-no">Hayır, İptal</button>
      </div>
    </div>
  </div>
);


const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext); // localStorage yerine context'ten alıyoruz
  const navigate = useNavigate();

  // Silme onayı için state
  const [showConfirm, setShowConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const getCourses = async () => {
    try {
      const data = await fetchAPI("/courses");
      setCourses(data.data || data);
    } catch (err) {
      setError("Kurslar yüklenirken bir hata oluştu.");
      console.error("Kurslar yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    // ... (Bu fonksiyon aynı kalabilir) ...
  };
  
  // SİLME İŞLEMLERİ
  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setShowConfirm(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;
    
    try {
      await fetchAPI(`/admin/courses/${courseToDelete.id}`, "DELETE");
      toast.success(`'${courseToDelete.title}' kursu başarıyla silindi!`);
      setShowConfirm(false);
      setCourseToDelete(null);
      getCourses(); // Listeyi yenile
    } catch (error) {
      toast.error(error.message || "Kurs silinirken bir hata oluştu.");
      setShowConfirm(false);
      setCourseToDelete(null);
    }
  };

  if (loading) return <div className="loading">Kurslar Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      {showConfirm && (
        <ConfirmDialog 
          message={`'${courseToDelete?.title}' adlı kursu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="course-list-page">
        <h1>Tüm Kurslar</h1>
        <div className="course-grid">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div key={course.id} className="course-card">
                {/* <img src={course.image_url || 'default-image.png'} alt={course.title} className="course-image" /> */}
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="course-meta">
                  <span>
                    <i className="fas fa-user-tie"></i> {course.instructor?.name || "N/A"}
                  </span>
                  <span>
                    <i className="fas fa-users"></i> {course.enrolled_students_count ?? 0} / {course.capacity}
                  </span>
                </div>
                
                {/* Kullanıcı ve Admin için farklı butonlar göster */}
                {user ? (
                  user.is_admin ? (
                    // Admin Butonları
                    <div className="admin-card-buttons">
                      <button className="btn btn-edit">Düzenle</button>
                      <button onClick={() => handleDeleteClick(course)} className="btn btn-delete">Sil</button>
                    </div>
                  ) : (
                    // Kullanıcı Butonu
                    <button onClick={() => handleEnroll(course.id)} className="btn btn-join">
                      Kursa Katıl
                    </button>
                  )
                ) : (
                  // Giriş Yapmamış Kullanıcı Butonu
                  <button onClick={() => handleEnroll(course.id)} className="btn btn-join">
                    Kursa Katıl
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>Şu anda mevcut kurs bulunmamaktadır.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseList;