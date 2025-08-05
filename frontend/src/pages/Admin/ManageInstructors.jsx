// ManageInstructors.jsx
import React, { useState, useEffect, useCallback } from "react";
import { fetchAPI } from "../../utils/api";
import AddInstructorForm from './AddInstructorForm'; // Ekleme formunu import et

const ManageInstructors = () => {
    // ... (mevcut state ve fonksiyonların aynı kalacak)
    const [instructors, setInstructors] = useState([]);
    // ...
    
    const fetchInstructors = useCallback(async () => {
        // ... (bu fonksiyon da aynı kalacak)
    }, []);
    
    useEffect(() => {
        fetchInstructors();
    }, [fetchInstructors]);

    // ... (handleDelete fonksiyonu aynı kalacak)

    return (
        <div>
            <h1>Eğitmen Yönetimi</h1>
            
            {/* Önce eğitmen ekleme formunu gösterelim */}
            <AddInstructorForm onInstructorAdded={fetchInstructors} />

            <hr style={{margin: '40px 0'}} />
            
            <h2>Mevcut Eğitmenler</h2>
            <div className="management-list">
                {/* ... (eğitmenleri listeleyen tablo JSX'in aynı kalacak) ... */}
            </div>
        </div>
    );
};

export default ManageInstructors;