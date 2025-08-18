import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAPI } from '../../utils/api';
import { toast } from 'react-toastify';

const EditCoursePage = () => {
    const { courseId } = useParams(); // URL'den kurs ID'sini al
    const navigate = useNavigate();

    // Form state'leri
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [instructorId, setInstructorId] = useState('');
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Eğitmenleri ve mevcut kurs bilgilerini yükle
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            // Promise.all ile iki isteği aynı anda atıyoruz
            const [courseData, instructorsData] = await Promise.all([
                fetchAPI(`/courses/${courseId}`),
                fetchAPI('/instructors')
            ]);
            
            // Mevcut kurs bilgileriyle formu doldur
            setTitle(courseData.title);
            setDescription(courseData.description);
            setInstructorId(courseData.instructor_id);
            setInstructors(instructorsData.data || instructorsData);
            
        } catch (error) {
            toast.error("Veriler yüklenirken bir hata oluştu.");
            navigate('/admin/dersleri-yonet');
        } finally {
            setLoading(false);
        }
    }, [courseId, navigate]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await fetchAPI(`/admin/courses/${courseId}`, 'PUT', {
                title,
                description,
                instructor_id: instructorId
            });
            toast.success("Ders başarıyla güncellendi!");
            navigate('/admin/dersleri-yonet'); // Başarılı güncelleme sonrası listeye dön
        } catch (error) {
            toast.error(error.message || "Güncelleme sırasında bir hata oluştu.");
        } finally {
            setUpdating(false);
        }
    };
    
    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div className="admin-content">
            <h1>Dersi Düzenle</h1>
            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                    <label>Ders Başlığı</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Açıklama</label>
                    <textarea rows="4" value={description} onChange={e => setDescription(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Eğitmen</label>
                    <select value={instructorId} onChange={e => setInstructorId(e.target.value)} required>
                        <option value="" disabled>-- Eğitmen Seçin --</option>
                        {instructors.map(inst => (
                            <option key={inst.id} value={inst.id}>{inst.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="submit-button" disabled={updating}>
                    {updating ? "Güncelleniyor..." : "Değişiklikleri Kaydet"}
                </button>
            </form>
        </div>
    );
};

export default EditCoursePage;