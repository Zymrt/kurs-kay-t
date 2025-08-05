// ManageCoursesPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { fetchAPI } from "../../utils/api";
import AddCourseForm from './AddCourseForm'; // Ekleme formunu import et

const ManageCoursesPage = () => {
    // ... (mevcut state ve fonksiyonların aynı kalacak)
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    // ...

    const fetchCourses = useCallback(async () => {
        // ... (bu fonksiyon da aynı kalacak)
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    // ... (handleDelete ve diğer fonksiyonlar aynı kalacak)

    return (
        <div>
            <h1>Ders Yönetimi</h1>
            
            {/* Önce ders ekleme formunu gösterelim */}
            <AddCourseForm onCourseAdded={fetchCourses} />

            <hr style={{margin: '40px 0'}} />

            <h2>Mevcut Dersler</h2>
            <div className="management-list">
                {/* ... (dersleri listeleyen tablo JSX'in aynı kalacak) ... */}
            </div>
        </div>
    );
};

export default ManageCoursesPage;