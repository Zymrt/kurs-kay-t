import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../../utils/api'; // fetchAPI yardımcısını import ediyoruz

const MyCourses = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getMyCourses = async () => {
      try {
        // Bu endpoint'in kullanıcıya özel kursları döndürdüğünü varsayıyoruz.
        // Bu korumalı bir rota olduğu için fetchAPI token'ı otomatik ekleyecektir.
        const data = await fetchAPI('/my-courses'); // API endpoint: GET /api/my-courses
        setMyCourses(data.data || data);
      } catch (err) {
        setError('Kurslarınız yüklenirken bir hata oluştu.');
        console.error("Kurslarım yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };
    getMyCourses();
  }, []);
  
  const handleUnenroll = async (courseId) => {
    if (window.confirm("Bu kurstan ayrılmak istediğinize emin misiniz?")) {
        try {
            const response = await fetchAPI(`/courses/${courseId}/unenroll`, 'POST');
            alert(response.message || 'Kurstan başarıyla ayrıldınız.');
            // Listeyi anında güncelle
            setMyCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
        } catch (err) {
            alert(err.message || 'Kurstan ayrılırken bir hata oluştu.');
        }
    }
  };

  if (loading) return <div className="loading">Kurslarım Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="my-courses-page">
      <h1>Katıldığım Kurslar</h1>
      <div className="course-grid">
        {myCourses.length > 0 ? (
          myCourses.map(course => (
            <div key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="course-meta">
                 <span>Eğitmen: {course.instructor?.name || 'Belirtilmemiş'}</span>
              </div>
              <button onClick={() => handleUnenroll(course.id)} className="btn btn-delete">
                  Kurstan Ayrıl
              </button>
            </div>
          ))
        ) : (
          <p>Henüz hiçbir kursa kayıtlı değilsiniz. <a href="/courses">Tüm kursları</a> inceleyebilirsiniz.</p>
        )}
      </div>
    </div>
  );
};

export default MyCourses;