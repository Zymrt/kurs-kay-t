import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { fetchAPI } from "../../utils/api";

const AddCourseForm = ({ onCourseAdded }) => {
  // 1. State tanımlamaları (Doğru ve temizlenmiş)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [capacity, setCapacity] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 2. Eğitmenleri yüklemek için TEK bir useEffect bloğu (Doğru hali)
  useEffect(() => {
    const loadInstructors = async () => {
      try {
        const data = await fetchAPI("/instructors");
        setInstructors(data.data || data);
      } catch (error) {
        console.error("Eğitmen listesi alınamadı:", error);
        setMessage(
          "Eğitmen listesi yüklenemedi. Formu kullanabilmek için lütfen sayfayı yenileyin."
        );
        setIsError(true);
      }
    };
    loadInstructors();
  }, []); // Boş bağımlılık dizisi ile sadece ilk render'da çalışır

  // 3. Formu gönderme mantığı (Doğru ve axios ile dosya yükleme mantığı)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("capacity", capacity);
    formData.append("instructor_id", instructorId);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const token = localStorage.getItem("authToken");
      // Dosya yükleme için axios kullanıyoruz.
      await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/courses`,
        formData,
        {
          headers: {
            // FormData gönderirken bu başlık önemlidir.
            // Axios bunu genellikle otomatik ayarlar ama belirtmekte fayda var.
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Ders başarıyla eklendi!");
      // Formu temizle
      setTitle("");
      setDescription("");
      setCategory("");
      setCapacity("");
      setInstructorId("");
      setImageFile(null);
      // Input type file'ı temizlemek için:
      document.getElementById("course-image").value = null;

      if (onCourseAdded) {
        onCourseAdded();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(" ")
        : error.response?.data?.message || "Ders eklenemedi.";
      setMessage(errorMsg);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. JSX/HTML Kısmı (Aynı ve doğru hali)
  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="form-group">
        <label htmlFor="course-title">Ders Başlığı</label>
        <input
          id="course-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="course-description">Ders Açıklaması</label>
        <textarea
          id="course-description"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="course-category">Kategori</label>
        <input
          id="course-category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Eğitmenin uzmanlığı ile aynı olmalı"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="course-capacity">Kapasite</label>
        <input
          id="course-capacity"
          type="number"
          min="1"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="course-image">Ders Resmi (Opsiyonel)</label>
        <input
          id="course-image"
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        {imageFile && <p className="file-info">Seçilen: {imageFile.name}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="course-instructor">Eğitmen</label>
        <select
          id="course-instructor"
          value={instructorId}
          onChange={(e) => setInstructorId(e.target.value)}
          required
        >
          <option value="" disabled>
            -- Bir eğitmen seçin --
          </option>
          {Array.isArray(instructors) &&
            instructors.map((instructor) => (
              <option
                key={instructor.id || instructor._id}
                value={instructor.id || instructor._id}
              >
                {instructor.name} ({instructor.specialty})
              </option>
            ))}
        </select>
      </div>
      <button type="submit" className="submit-button" disabled={isLoading}>
        {isLoading ? "Ekleniyor..." : "Dersi Ekle"}
      </button>
      {message && (
        <p className={`form-message ${isError ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </form>
  );
}; // Fonksiyon burada bitiyor

// 'export default' en sonda olmalı
export default AddCourseForm;
