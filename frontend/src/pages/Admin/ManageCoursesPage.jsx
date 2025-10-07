import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { fetchAPI } from "../../utils/api";
import { toast } from "react-toastify";
import "./ManagementList.css";
import "./AdminForms.css";

// --- YARDIMCI BİLEŞEN: Onay Modalı ---
const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <div className="confirm-modal-overlay">
    <div className="confirm-modal">
      <h3>İşlemi Onayla</h3>
      <p>{message}</p>
      <div className="confirm-modal-actions">
        <button onClick={onConfirm} className="btn btn-delete">
          Evet, Sil
        </button>
        <button onClick={onCancel} className="btn btn-cancel">
          İptal
        </button>
      </div>
    </div>
  </div>
);

const ManageCoursesPage = () => {
  // Liste için state'ler
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ekleme Formu için state'ler
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState("");
  const [category, setCategory] = useState("");

  // Düzenleme ve Silme Modalları için state'ler
  const [editingCourse, setEditingCourse] = useState(null);
  const [editFormState, setEditFormState] = useState({
    title: "",
    capacity: "",
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  // Veri çekme fonksiyonu
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const coursesData = await fetchAPI("/courses");
      const instructorsData = await fetchAPI("/instructors");
      setCourses(coursesData.data || coursesData);
      setInstructors(instructorsData.data || instructorsData);
    } catch (err) {
      setError("Veriler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Eğitmen seçildiğinde kategoriyi otomatik dolduran fonksiyon
  const handleInstructorChange = (e) => {
    const selectedId = e.target.value;
    setSelectedInstructorId(selectedId);
    const selectedInstructor = instructors.find(
      (inst) => (inst.id || inst._id) === selectedId
    );
    if (selectedInstructor) setCategory(selectedInstructor.specialty);
  };

  // Yeni Ders Ekleme Fonksiyonu
  const handleAddCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("capacity", capacity);
    formData.append("instructor_id", selectedInstructorId);
    if (imageFile) formData.append("image", imageFile);

    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/courses`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Ders başarıyla eklendi!");
      setTitle("");
      setDescription("");
      setCategory("");
      setCapacity("");
      setSelectedInstructorId("");
      setImageFile(null);
      document.getElementById("course-image-input").value = null;
      fetchData(); // Listeyi yenile
    } catch (error) {
      toast.error(
        `Hata: ${error.response?.data?.message || "Ders eklenemedi."}`
      );
    }
  };

  // Silme Mantığı
  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;
    try {
      await fetchAPI(
        `/admin/courses/${courseToDelete.id || courseToDelete._id}`,
        "DELETE"
      );
      toast.success(`'${courseToDelete.title}' başarıyla silindi.`);
      fetchData();
    } catch (error) {
      toast.error(`Hata: ${error.message}`);
    } finally {
      setShowConfirmModal(false);
      setCourseToDelete(null);
    }
  };

  // Düzenleme Mantığı
  const handleEditClick = (course) => {
    setEditingCourse(course);
    setEditFormState({ title: course.title, capacity: course.capacity });
  };

  const handleEditFormChange = (e) => {
    setEditFormState({ ...editFormState, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingCourse) return;
    try {
      await fetchAPI(
        `/admin/courses/${editingCourse.id || editingCourse._id}`,
        "PUT",
        {
          title: editFormState.title,
          capacity: parseInt(editFormState.capacity),
        }
      );

      toast.success("Ders başarıyla güncellendi.");
      setEditingCourse(null);
      fetchData();
    } catch (error) {
      toast.error(`Güncelleme başarısız: ${error.message}`);
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="management-page">
      <h1>Dersleri Yönet</h1>

      {/* Modallar */}
      {showConfirmModal && (
        <ConfirmDialog
          message={`'${courseToDelete?.title}' adlı dersi silmek istediğinizden emin misiniz?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
      {editingCourse && (
        <div className="edit-form-modal">
          <form onSubmit={handleUpdateSubmit} className="edit-form">
            <h3>Ders Bilgilerini Düzenle</h3>
            <div className="form-group">
              <label>Ders Başlığı</label>
              <input
                name="title"
                type="text"
                value={editFormState.title}
                onChange={handleEditFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Kapasite</label>
              <input
                name="capacity"
                type="number"
                min="1"
                value={editFormState.capacity}
                onChange={handleEditFormChange}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-save">
                Kaydet
              </button>
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="btn btn-cancel"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="add-form-container admin-section">
        <h3>Yeni Ders Ekle</h3>
        {/* Form JSX'i aynı, sadece handleAddCourse fonksiyonuna bağlandı */}
        <form onSubmit={handleAddCourse} className="admin-form">
          <div className="form-grid-2-col">
            <div className="form-group">
              <label htmlFor="title">Ders Başlığı</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="instructor">Eğitmen</label>
              <select
                id="instructor"
                value={selectedInstructorId}
                onChange={handleInstructorChange}
                required
              >
                <option value="" disabled>
                  -- Eğitmen Seçin --
                </option>
                {instructors.map((inst) => (
                  <option key={inst.id || inst._id} value={inst.id || inst._id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="category">Kategori (Otomatik)</label>
              <input
                id="category"
                type="text"
                value={category}
                readOnly
                placeholder="Eğitmen seçince dolacak"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="capacity">Kapasite</label>
              <input
                id="capacity"
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="description">Ders Açıklaması</label>
            <textarea
              id="description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="course-image-input">Ders Resmi</label>
            <input
              id="course-image-input"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>
          <button type="submit" className="submit-button">
            Dersi Ekle
          </button>
        </form>
      </div>

      <div className="list-container admin-section">
        <h3>Mevcut Dersler</h3>
        {courses.length === 0 ? (
          <p>Sistemde ders bulunmamaktadır.</p>
        ) : (
          <table className="management-table">
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
                <tr key={course.id || course._id}>
                  <td>{course.title}</td>
                  <td>{course.instructor?.name || "N/A"}</td>
                  <td>
                    {course.enrolled_students || 0} / {course.capacity}
                  </td>
                  <td className="action-buttons">
                    <button
                      onClick={() => handleEditClick(course)}
                      className="btn btn-edit"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDeleteClick(course)}
                      className="btn btn-delete"
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
    </div>
  );
};

export default ManageCoursesPage;
