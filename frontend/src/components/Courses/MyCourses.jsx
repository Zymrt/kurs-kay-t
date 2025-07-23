import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../App';

function MyCourses() {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { updateUserCourses } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyCourses = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5001/api/users/my-courses');
        setMyCourses(res.data);
      } catch (error) {
        console.error("Kurslarım yüklenemedi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  const handleUnenroll = async (courseId, courseTitle) => {
    if (window.confirm(`'${courseTitle}' kursundan ayrılmak istediğinizden emin misiniz?`)) {
      try {
        const res = await axios.post(`http://localhost:5001/api/users/unenroll/${courseId}`);
        updateUserCourses(res.data.myCourses); // App context'ini güncelle
        // Listeyi anında güncellemek için state'i de güncelle
        setMyCourses(prevCourses => prevCourses.filter(course => course._id !== courseId));
        alert(`'${courseTitle}' kursundan başarıyla ayrıldınız.`);
      } catch (error) {
        alert(error.response?.data?.message || "Kurstan ayrılırken bir hata oluştu.");
      }
    }
  };

  if (loading) return <p>Kurslarınız yükleniyor...</p>;

  return (
    <div>
      <h1>Katıldığım Kurslar</h1>
      <div className="my-courses">
        {myCourses.length > 0 ? (
          myCourses.map(course => (
            <div key={course._id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p className="instructor">Eğitmen: {course.instructor}</p>
              <div className="card-buttons">
                <button
                  className="btn btn-delete"
                  onClick={() => handleUnenroll(course._id, course.title)}
                >
                  Kurstan Ayrıl
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Henüz hiçbir kursa katılmadınız.</p>
        )}
      </div>
    </div>
  );
}

export default MyCourses;