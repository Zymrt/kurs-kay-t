import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../../utils/api";
import { toast } from "react-toastify";
// SADECE var olan CSS dosyasını import ediyoruz.
import "./ManagementList.css";

// --- YARDIMCI BİLEŞEN: Onay Modalı ---
const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <div className="confirm-modal-overlay">
    <div className="confirm-modal">
      <h3>İşlemi Onayla</h3>
      <p>{message}</p>
      <div className="confirm-modal-actions">
        <button onClick={onConfirm} className="btn btn-delete">
          Evet, Onaylıyorum
        </button>
        <button onClick={onCancel} className="btn btn-cancel">
          İptal
        </button>
      </div>
    </div>
  </div>
);

// --- ANA YÖNETİM BİLEŞENİ ---
const ManageInstructors = () => {
  // Liste için state'ler
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Ekleme Formu için state'ler
  const [newName, setNewName] = useState("");
  const [newSpecialty, setNewSpecialty] = useState("");
  const [newBio, setNewBio] = useState("");

  // Düzenleme Modalı için state'ler
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [editFormState, setEditFormState] = useState({
    name: "",
    specialty: "",
    bio: "",
  });

  // Silme Modalı için state'ler
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [instructorToDelete, setInstructorToDelete] = useState(null);

  // Veri çekme fonksiyonu
  const fetchInstructors = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAPI("/instructors");
      setInstructors(data.data || data);
    } catch (err) {
      setError("Eğitmenler yüklenirken bir hata oluştu.");
      if (err.message.includes("Unauthenticated")) navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  // --- CRUD FONKSİYONLARI ---

  // YENİ EĞİTMEN EKLEME
  const handleAddInstructor = async (e) => {
    e.preventDefault();
    try {
      await fetchAPI("/admin/instructors", "POST", {
        name: newName,
        specialty: newSpecialty,
        bio: newBio,
      });
      toast.success("Eğitmen başarıyla eklendi!");
      setNewName("");
      setNewSpecialty("");
      setNewBio("");
      fetchInstructors(); // Listeyi anında yenile
    } catch (error) {
      toast.error(`Hata: ${error.message}`);
    }
  };

  // SİLME
  const handleDeleteClick = (instructor) => {
    setInstructorToDelete(instructor);
    setShowConfirmModal(true);
  };
  const handleConfirmDelete = async () => {
    if (!instructorToDelete) return;
    try {
      await fetchAPI(
        `/admin/instructors/${instructorToDelete.id || instructorToDelete._id}`,
        "DELETE"
      );
      toast.success(`'${instructorToDelete.name}' başarıyla silindi.`);
      fetchInstructors();
    } catch (error) {
      toast.error(`Hata: ${error.message}`);
    } finally {
      setShowConfirmModal(false);
      setInstructorToDelete(null);
    }
  };

  // GÜNCELLEME
  const handleEditClick = (instructor) => {
    setEditingInstructor(instructor);
    setEditFormState({
      name: instructor.name,
      specialty: instructor.specialty,
      bio: instructor.bio || "",
    });
  };
  const handleEditFormChange = (e) => {
    setEditFormState({ ...editFormState, [e.target.name]: e.target.value });
  };
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingInstructor) return;
    try {
      await fetchAPI(
        `/admin/instructors/${editingInstructor.id || editingInstructor._id}`,
        "PUT",
        editFormState
      );
      toast.success("Eğitmen başarıyla güncellendi.");
      setEditingInstructor(null);
      fetchInstructors();
    } catch (error) {
      toast.error(`Güncelleme başarısız: ${error.message}`);
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="management-page">
      {showConfirmModal && (
        <ConfirmDialog
          message={`'${instructorToDelete?.name}' adlı eğitmeni kalıcı olarak silmek istiyor musunuz? Bu işlem geri alınamaz.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}

      {editingInstructor && (
        <div className="edit-form-modal">
          <form onSubmit={handleUpdateSubmit} className="edit-form">
            <h3>Eğitmen Bilgilerini Düzenle</h3>
            <div className="form-group">
              <label>Ad Soyad</label>
              <input
                name="name"
                type="text"
                value={editFormState.name}
                onChange={handleEditFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Uzmanlık Alanı</label>
              <input
                name="specialty"
                type="text"
                value={editFormState.specialty}
                onChange={handleEditFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Biyografi</label>
              <textarea
                name="bio"
                rows="3"
                value={editFormState.bio}
                onChange={handleEditFormChange}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-save">
                Kaydet
              </button>
              <button
                type="button"
                onClick={() => setEditingInstructor(null)}
                className="btn btn-cancel"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <h1>Eğitmenleri Yönet</h1>

      <div className="add-form-container admin-section">
        <h2>Yeni Eğitmen Ekle</h2>
        <form onSubmit={handleAddInstructor} className="admin-form-inline">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Ad Soyad"
            required
          />
          <input
            type="text"
            value={newSpecialty}
            onChange={(e) => setNewSpecialty(e.target.value)}
            placeholder="Uzmanlık Alanı"
            required
          />
          <button type="submit">Ekle</button>
        </form>
      </div>

      <div className="list-container admin-section">
        <h3>Mevcut Eğitmenler</h3>
        {instructors.length === 0 ? (
          <p>Sistemde yönetilecek eğitmen bulunmamaktadır.</p>
        ) : (
          <table className="management-table">
            <thead>
              <tr>
                <th>İsim</th>
                <th>Uzmanlık Alanı</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((instructor) => (
                <tr key={instructor.id || instructor._id}>
                  <td>{instructor.name}</td>
                  <td>{instructor.specialty}</td>
                  <td className="action-buttons">
                    <button
                      onClick={() => handleEditClick(instructor)}
                      className="btn btn-edit"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDeleteClick(instructor)}
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

export default ManageInstructors;
