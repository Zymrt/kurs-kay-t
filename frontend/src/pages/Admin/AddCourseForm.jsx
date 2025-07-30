import React, { useState, useEffect } from "react";
import { fetchAPI } from "../../utils/api";

const AddCourseForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [capacity, setCapacity] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [instructors, setInstructors] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadInstructors = async () => {
      try {
        // Bu rota herkese açık, token gerekmez.
        const data = await fetchAPI("/instructors");
        setInstructors(data.data || data); // Sayfalama varsa .data
      } catch (error) {
        console.error("Eğitmen listesi alınamadı:", error);
        setMessage("Eğitmen listesi yüklenemedi.");
        setIsError(true);
      }
    };
    loadInstructors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setIsLoading(true);

    try {
      await fetchAPI("/admin/courses", "POST", {
        title,
        description,
        category,
        capacity: parseInt(capacity),
        instructor_id: instructorId,
      });
      setMessage("Ders başarıyla eklendi!");
      setTitle("");
      setDescription("");
      setCategory("");
      setCapacity("");
      setInstructorId("");
      // TODO: Ders listesini güncellemeyi tetikle
    } catch (error) {
      setMessage(error.message || "Ders eklenemedi.");
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
        <label htmlFor="course-category">Ders Kategorisi</label>
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
        <label htmlFor="course-description">Açıklama</label>
        <textarea
          id="course-description"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
          {instructors.map((instructor) => (
            <option key={instructor.id} value={instructor.id}>
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
};

export default AddCourseForm;
