import React, { useState, useEffect } from "react"; // <-- DÜZELTİLMİŞ SATIR
import { Link } from "react-router-dom";
import { fetchAPI } from "../../utils/api";
import "./CourseList.css";

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
    <div className="course-list-page">
      <h1>Tüm Kurslar</h1>

      {loading && <p>Yükleniyor...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="course-grid">
          {courses.length === 0 ? (
            <p>Gösterilecek ders bulunmamaktadır.</p>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="course-card">
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}${course.image_url}`}
                  alt={course.title}
                  className="course-card-image"
                />
                <div className="course-card-content">
                  <span className="course-card-category">
                    {course.category}
                  </span>
                  <h3 className="course-card-title">{course.title}</h3>
                  <p className="course-card-instructor">
                    Eğitmen: {course.instructor?.name || "Belirtilmemiş"}
                  </p>
                  <div className="course-card-meta">
                    <span className="capacity">
                      Kontenjan: {course.enrolled_students} / {course.capacity}
                    </span>
                  </div>
                  <Link
                    to={`/course/${course.id}`}
                    className="course-card-button"
                  >
                    İncele
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CourseList;
