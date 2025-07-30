import React, { useState, useEffect } from "react"; // <-- DÜZELTİLMİŞ SATIR
import { Link } from "react-router-dom";
import { fetchAPI } from "../../utils/api";
// import './CourseList.css';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const responseData = await fetchAPI("/courses");
        setCourses(responseData.data || responseData);
      } catch (err) {
        setError(
          "Dersler yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin."
        );
        console.error("Ders yükleme hatası:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  if (loading) {
    return <div className="loading-message">Dersler Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="courses-container">
      <h1>Tüm Dersler</h1>

      {courses.length === 0 ? (
        <div className="no-courses-message">
          <p>Şu anda gösterilecek ders bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p className="course-category">Kategori: {course.category}</p>
              <p className="course-description">{course.description}</p>
              <div className="course-instructor">
                <strong>Eğitmen:</strong>{" "}
                {course.instructor?.name || "Belirtilmemiş"}
              </div>
              <div className="course-meta">
                <span>
                  <strong>Kapasite:</strong> {course.enrolled_students} /{" "}
                  {course.capacity}
                </span>
              </div>
              <Link to={`/course/${course.id}`} className="details-button">
                Detayları Gör
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
