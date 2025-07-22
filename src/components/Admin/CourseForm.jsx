import React, { useState } from 'react';
import axios from 'axios';

function CourseForm({ onCourseAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    if (!title || !description || !instructor) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5001/api/courses', { title, description, instructor });
      setMessage(`'${res.data.title}' başarıyla eklendi!`);
      setTitle('');
      setDescription('');
      setInstructor('');
      if(onCourseAdded) onCourseAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Kurs eklenirken bir hata oluştu.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {message && <p style={{color: 'green'}}>{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="title">Kurs Başlığı</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="description">Açıklama</label>
        <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="instructor">Eğitmen</label>
        <input type="text" id="instructor" value={instructor} onChange={(e) => setInstructor(e.target.value)} />
      </div>
      <button type="submit" className="btn">Kurs Ekle</button>
    </form>
  );
}

export default CourseForm;