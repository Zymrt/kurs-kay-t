import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../../utils/api";
import { toast } from "react-toastify";
import "./CourseList.css";

const CourseList = () => {
  // 1. STATE TANIMLAMALARI: Dersler, yükleme ve hata durumları için.
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 2. KULLANICI BİLGİSİNİ ALMA: Sayfa render edilmeden önce,
  // kimlik durumunu tek seferde öğrenelim.
  const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = !!localStorage.getItem("authToken");

  // 3. VERİ ÇEKME FONKSİYONU
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Tarayıcı önbelleğini atlatmak için her isteği benzersiz yapalım.
      const cacheBuster = `?_cache=${new Date().getTime()}`;
      const responseData = await fetchAPI(`/courses${cacheBuster}`);
      // Gelen verinin sayfalama (pagination) içerip içermediğini kontrol et.
      setCourses(responseData.data || responseData || []);
    } catch (err) {
      setError("Dersler yüklenirken bir sorun oluştu.");
      console.error("Dersler yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Bileşen ilk yüklendiğinde dersleri çekmek için useEffect.
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // 4. DERSE BAŞVURMA FONKSİYONU
  const handleEnroll = async (courseId, courseTitle) => {
    if (!isAuthenticated) {
      toast.warn("Derse başvurmak için lütfen giriş yapınız.");
      navigate("/login");
      return;
    }

    // Adminin kurslara başvurmasını engellemek iyi bir kontrol olabilir.
    if (user?.is_admin) {
      toast.info("Admin olarak kurslara başvuramazsınız.");
      return;
    }

    try {
      const response = await fetchAPI(`/enrollments/${courseId}`, "POST");
      toast.success(response.message || "Başvurunuz başarıyla alındı!");
    } catch (error) {
      toast.error(error.message || "Başvuru yapılamadı.");
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <p>Dersler Yükleniyor...</p>
      </div>
    );
  if (error)
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );

  // 5. JSX (TASARIM) KISMI
  return (
    <div className="course-list-page">
      <h1>Tüm Kurslar</h1>

      {courses.length === 0 ? (
        <p className="no-courses-message">
          Şu anda mevcut kurs bulunmamaktadır.
        </p>
      ) : (
        <div className="course-grid">
          {courses.map((course) => {
            const courseId = course.id || course._id;
            // Kontenjan kontrolü
            const isFull =
              course.is_full ?? course.enrolled_students >= course.capacity;

            return (
              <div key={courseId} className="course-card">
                <img
                  // .env'den backend adresini alıp, veritabanından gelen resim yoluyla birleştiriyoruz.
                  src={`${process.env.REACT_APP_BACKEND_URL}${course.image_url}`}
                  alt={course.title}
                  className="course-card-image"
                  // Resim yüklenemezse çalışacak bir yedek (iyi bir pratiktir)
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-course.jpg";
                  }}
                />
                <div className="course-card-content">
                  <h3 className="course-card-title">{course.title}</h3>
                  <p className="course-card-instructor">
                    Eğitmen: {course.instructor?.name || "N/A"}
                  </p>
                  <div className="course-card-meta">
                    <span>
                      Kontenjan: {course.enrolled_students || 0} /{" "}
                      {course.capacity}
                    </span>
                  </div>
                  <div className="course-card-actions">
                    {/* Sadece giriş yapmış ve admin olmayan kullanıcılar başvuru butonlarını görür */}
                    {isAuthenticated &&
                      !user?.is_admin &&
                      (isFull ? (
                        <button className="enroll-button disabled" disabled>
                          Kontenjan Dolu
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEnroll(courseId, course.title)}
                          className="enroll-button"
                        >
                          Kursa Katıl
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseList;
