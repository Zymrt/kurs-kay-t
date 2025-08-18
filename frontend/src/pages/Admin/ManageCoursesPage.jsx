import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate'i import et
import { fetchAPI } from "../../utils/api";
import { toast } from 'react-toastify';
// ... (ConfirmDialog bileşenini buraya da ekleyebiliriz veya ayrı bir dosyadan import edebiliriz)

const ManageCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // useNavigate'i kullanıma hazırla

    const fetchCourses = useCallback(async () => {
        // ... (bu fonksiyon aynı)
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    // Bir dersi silme fonksiyonu
    const handleDelete = async (courseId, courseTitle) => {
        if (window.confirm(`'${courseTitle}' adlı dersi silmek istediğinizden emin misiniz?`)) {
            try {
                await fetchAPI(`/admin/courses/${courseId}`, "DELETE");
                toast.success(`'${courseTitle}' başarıyla silindi.`);
                fetchCourses(); // Listeyi yenile
            } catch (error) {
                toast.error(`Hata: ${error.message}`);
            }
        }
    };
    
    // Düzenle butonuna tıklandığında çalışacak fonksiyon
    const handleEdit = (courseId) => {
        navigate(`/admin/edit-course/${courseId}`);
    };

    if (loading) return <p>Yükleniyor...</p>;

    return (
        <div className="management-list">
            {/* ... (Ders Ekleme Formu burada olabilir) ... */}
            
            <h2>Mevcut Dersler</h2>
            <table>
                <thead>
                    {/* ... (tablo başlıkları) ... */}
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.id}>
                            <td>{course.title}</td>
                            <td>{course.instructor?.name || "N/A"}</td>
                            <td>{course.enrollments_count ?? 0} / {course.capacity}</td>
                            <td className="action-buttons">
                                <button
                                    onClick={() => handleEdit(course.id)}
                                    className="btn-edit"
                                >
                                    Düzenle
                                </button>
                                <button
                                    onClick={() => handleDelete(course.id, course.title)}
                                    className="btn-delete"
                                >
                                    Sil
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageCoursesPage;