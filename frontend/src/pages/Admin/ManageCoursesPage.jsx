import React, { useState, useEffect, useCallback } from "react";
import { fetchAPI } from "../../utils/api";
// import './ManageItems.css';

const ManageCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Düzenleme modu için state'ler
  const [editingCourse, setEditingCourse] = useState(null); // Hangi dersin düzenlendiğini tutar
  const [newCapacity, setNewCapacity] = useState("");

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAPI("/courses");
      setCourses(data.data || data);
    } catch (err) {
      setError("Dersler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Bir dersi silme fonksiyonu
  const handleDelete = async (courseId, courseTitle) => {
    if (
      window.confirm(
        `'${courseTitle}' adlı dersi ve tüm başvurularını silmek istediğinizden emin misiniz?`
      )
    ) {
      try {
        await fetchAPI(`/admin/courses/${courseId}`, "DELETE");
        fetchCourses(); // Listeyi yenile
        alert(`'${courseTitle}' başarıyla silindi.`);
      } catch (error) {
        alert(`Hata: ${error.message}`);
      }
    }
  };

  // Düzenleme formunu açan fonksiyon
  const handleEditClick = (course) => {
    setEditingCourse(course);
    setNewCapacity(course.capacity);
  };

  // Kapasite güncelleme formunu gönderen fonksiyon
  const handleUpdateCapacity = async (e) => {
    e.preventDefault();
    if (!editingCourse) return;
    try {
      await fetchAPI(`/admin/courses/${editingCourse.id}`, "PUT", {
        capacity: parseInt(newCapacity, 10),
      });
      setEditingCourse(null); // Formu kapat
      fetchCourses(); // Listeyi yenile
    } catch (error) {
      alert(`Güncelleme başarısız: ${error.message}`);
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="management-list">
      {/* Düzenleme Formu (Modal) */}
      {editingCourse && (
        <div className="edit-form-modal">
          <form onSubmit={handleUpdateCapacity} className="edit-form">
            <h3>"{editingCourse.title}" Kapasitesini Düzenle</h3>
            <div className="form-group">
              <label htmlFor="capacity">Yeni Kapasite:</label>
              <input
                id="capacity"
                type="number"
                min="1"
                value={newCapacity}
                onChange={(e) => setNewCapacity(e.target.value)}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-save">
                Kaydet
              </button>
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="btn-cancel"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {courses.length === 0 ? (
        <p>Sistemde kayıtlı ders bulunmamaktadır.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Ders Adı</th>
              <th>Eğitmen</th>
              <th>Kayıt/Kapasite</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.title}</td>
                <td>{course.instructor?.name || "N/A"}</td>
                <td>
                  {course.enrolled_students} / {course.capacity}
                </td>
                <td className="action-buttons">
                  <button
                    onClick={() => handleEditClick(course)}
                    className="btn-edit"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(course.id, course.title)}
                    className="btn-delete"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageCoursesPage;
