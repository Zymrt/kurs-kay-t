import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAPI } from '../../utils/api'; // fetchAPI yardımcısını import ediyoruz

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    const getCourses = async () => {
      try {
        const data = await fetchAPI('/courses'); // API endpoint: GET /api/courses
        setCourses(data.data || data); // API cevabı sayfalama içeriyorsa data.data kullan
      } catch (err) {
        setError('Kurslar yüklenirken bir hata oluştu.');
        console.error("Kurslar yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };
    getCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    if (!user) {
      alert("Kursa katılmak için lütfen giriş yapın.");
      navigate('/login');
      return;
    }
    
    try {
      // Laravel'de kursa katılma endpoint'inin bu şekilde olduğunu varsayıyoruz
      // Bu korumalı bir rota olduğu için fetchAPI token'ı otomatik ekleyecektir.
      const response = await fetchAPI(`/courses/${courseId}/enroll`, 'POST');
      alert(response.message || 'Kursa başarıyla katıldınız!');
      // TODO: Arayüzü anında güncellemek için kullanıcının kurs listesini
      // App Context veya benzeri bir yöntemle yenilemek en iyisidir.
    } catch (err) {
      alert(err.message || 'Kursa katılırken bir hata oluştu.');
    }
  };

  if (loading) return <div className="loading">Kurslar Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="course-list-page">
      <h1>Tüm Kurslar</h1>
      <div className="course-grid">
        {courses.length > 0 ? (
          courses.map(course => (
            <div key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="course-meta">
                <span>Eğitmen: {course.instructor?.name || 'Belirtilmemiş'}</span>
                <span>Kapasite: {course.capacity}</span>
              </div>
              {user && !user.is_admin && (
                 <button 
                    onClick={() => handleEnroll(course.id)} 
                    className="btn btn-join"
                    // Optional: Kullanıcının zaten kayıtlı olup olmadığını kontrol et
                    // disabled={user.enrolled_courses?.some(c => c.id === course.id)}
                 >
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
  );
};

export default CourseList;