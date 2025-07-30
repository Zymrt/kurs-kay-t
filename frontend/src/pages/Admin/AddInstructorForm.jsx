import React, { useState } from "react";
import { fetchAPI } from "../../utils/api";

const AddInstructorForm = () => {
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setIsLoading(true);

    try {
      await fetchAPI("/admin/instructors", "POST", { name, specialty, bio });
      setMessage("Eğitmen başarıyla eklendi!");
      setName("");
      setSpecialty("");
      setBio("");
      // TODO: Eğitmen listesini güncellemeyi tetikle
    } catch (error) {
      setMessage(error.message || "Bir hata oluştu.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="form-group">
        <label htmlFor="instructor-name">Eğitmen Adı Soyadı</label>
        <input
          id="instructor-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="instructor-specialty">Uzmanlık Alanı</label>
        <input
          id="instructor-specialty"
          type="text"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="instructor-bio">Biyografi (Opsiyonel)</label>
        <textarea
          id="instructor-bio"
          rows="3"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
      <button type="submit" className="submit-button" disabled={isLoading}>
        {isLoading ? "Ekleniyor..." : "Eğitmeni Ekle"}
      </button>
      {message && (
        <p className={`form-message ${isError ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </form>
  );
};

export default AddInstructorForm;
