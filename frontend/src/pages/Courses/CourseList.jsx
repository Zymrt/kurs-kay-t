import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../../utils/api";
import { AuthContext } from "../../App"; // AuthContext importu
import { toast } from 'react-toastify'; // react-toastify importu

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
  const { user, isAuthenticated } = useContext(AuthContext); // user ve isAuthenticated'ı context'ten al
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [courseToAction, setCourseToAction] = useState(null);

  const getCourses = async () => {
    setLoading(true); // Her çağırdığımızda yüklemeyi başlat
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
    if (!isAuthenticated) { // localStorage yerine context'teki isAuthenticated'ı kontrol et
      toast.warn("Kursa katılmak için lütfen giriş yapınız.");
      navigate("/login");
      return;
    }
    try {
      const response = await fetchAPI(`/enrollments/${courseId}`, "POST");
      toast.success(response.message || "Başvurunuz başarıyla alındı!");
    } catch (error) {
      toast.error(error.message || "Başvuru yapılamadı.");
    }
  };

  const handleDeleteClick = (course) => {
    setCourseToAction(course);
    setShowConfirm(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!courseToAction) return;
    try {
      await fetchAPI(`/admin/courses/${courseToAction.id}`, "DELETE");
      toast.success(`'${courseToAction.title}' kursu başarıyla silindi!`);
      setShowConfirm(false);
      setCourseToAction(null);
      getCourses(); // Listeyi yenile
    } catch (error) {
      toast.error(error.message || "Kurs silinirken bir hata oluştu.");
      setShowConfirm(false);
      setCourseToAction(null);
    }
  };

  const handleEditClick = (courseId) => {
    navigate(`/admin/dersleri-yonet`, { state: { editCourseId: courseId } });
  };

  if (loading) return <div className="loading">Kurslar Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      {showConfirm && (
        <ConfirmDialog 
          message={`'${courseToAction?.title}' adlı kursu silmek istediğinize emin misiniz?`}
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
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="course-meta">
                  <span><i className="fas fa-user-tie"></i> {course.instructor?.name || "N/A"}</span>
                  <span><i className="fas fa-users"></i> {course.enrolled_students_count ?? 0} / {course.capacity}</span>
                </div>
                
                {user?.is_admin ? (
                  // Admin Butonları
                  <div className="admin-card-buttons">
                    <button onClick={() => handleEditClick(course.id)} className="btn btn-edit">Düzenle</button>
                    <button onClick={() => handleDeleteClick(course)} className="btn btn-delete">Sil</button>
                  </div>
                ) : (
                  // Kullanıcı ve Misafir Butonları
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