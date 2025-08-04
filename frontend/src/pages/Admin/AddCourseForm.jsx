import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { fetchAPI } from "../../utils/api";

const AddCourseForm = ({ onCourseAdded }) => {
  // State tanımlamaları
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

  const loadInstructors = useCallback(async () => {
    try {
      // Rota herkese açıksa token gerekmez. fetchAPI yine de token varsa gönderir.
      const data = await fetchAPI("/instructors");
      setInstructors(data.data || data);
      if ((data.data || data).length === 0) {
        setMessage("Lütfen önce bir eğitmen ekleyin.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Eğitmen listesi alınamadı:", error);
      setMessage(`Eğitmen listesi yüklenemedi: ${error.message}`);
      setIsError(true);
    }
  }, []);

  useEffect(() => {
    loadInstructors();
  }, [loadInstructors]);

  // useEffect ile eğitmenleri yükleme (Bu kısım doğruydu)
  useEffect(() => {
    const loadInstructors = async () => {
      try {
        const data = await fetchAPI("/instructors");
        setInstructors(data.data || data);
      } catch (error) {
        console.error("Eğitmen listesi alınamadı:", error);
      }
    };
    loadInstructors();
  }, []);

  // Formu gönderme mantığı (Bu kısım da doğruydu)
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
      await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/courses`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Ders başarıyla eklendi!");

      setTitle("");
      setDescription("");
      setCategory("");
      setCapacity("");
      setInstructorId("");
      setImageFile(null);

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
        <label htmlFor="course-title">Ders Açıklaması</label>
        <input
          id="course-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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

          {/* Array.isArray ile instructors'ın bir dizi olduğundan %100 emin ol */}
          {Array.isArray(instructors) &&
            instructors.map((instructor) => (
              // Benzersiz key için instructor'ın ID'sini kullan
              <option
                key={instructor.id || instructor._id}
                value={instructor.id || instructor._id}
              >
                {instructor.name} ({instructor.specialty})
              </option>
            ))}
        </select>
      </div>

      {/* ... diğer tüm form elemanları ... */}
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
};

export default AddCourseForm;
