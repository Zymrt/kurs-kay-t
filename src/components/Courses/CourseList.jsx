import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../App';
import { useNavigate } from 'react-router-dom';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, updateUserCourses } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5001/api/courses');
      setCourses(res.data);
    } catch (error) {
      console.error("Kurslar yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    if (!isAuthenticated) {
      alert("Kursa katılmak için giriş yapmalısınız.");
      navigate('/login');
      return;
    }
    try {
      const res = await axios.post(`http://localhost:5001/api/users/enroll/${courseId}`);
      updateUserCourses(res.data.myCourses); // App context'ini güncelle
      alert("Kursa başarıyla katıldınız!");
    } catch (error) {
      alert(error.response?.data?.message || 'Kursa katılırken bir hata oluştu.');
    }
  };

  const handleDelete = async (courseId, courseTitle) => {
    if (window.confirm(`'${courseTitle}' adlı kursu silmek istediğinizden emin misiniz?`)) {
      try {
        await axios.delete(`http://localhost:5001/api/courses/${courseId}`);
        alert(`'${courseTitle}' kursu başarıyla silindi.`);
        fetchCourses(); // Listeyi yenile
      } catch (error) {
        alert(error.response?.data?.message || "Kurs silinirken bir hata oluştu.");
      }
    }
  };

  if (loading) return <p>Kurslar yükleniyor...</p>;

  return (
    <div>
      <h1>Tüm Kurslar</h1>
      <div className="course-list">
        {courses.map(course => {
          const isEnrolled = user?.myCourses?.includes(course._id);

          return (
            <div key={course._id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p className="instructor">Eğitmen: {course.instructor}</p>
              <div className="card-buttons">
                {isAuthenticated && user.role !== 'admin' && (
                  <button
                    className="btn btn-join"
                    onClick={() => handleEnroll(course._id)}
                    disabled={isEnrolled}
                  >
                    {isEnrolled ? 'Kayıtlısınız' : 'Kursa Katıl'}
                  </button>
                )}
                {isAuthenticated && user.role === 'admin' && (
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(course._id, course.title)}
                  >
                    Sil
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CourseList;