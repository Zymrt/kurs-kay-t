import React, { useState } from 'react';
import AdminDashboard from '../components/Admin/AdminDashboard';
import CourseList from '../components/Courses/CourseList';

function AdminPanel() {
    // Kurs eklendiğinde CourseList'in yeniden yüklenmesini tetiklemek için bir state
    const [key, setKey] = useState(0); 

    const handleCourseAdded = () => {
        setKey(prevKey => prevKey + 1);
    };

    return (
        <div>
            <h1>YÖNETİM PANELİ</h1>
            <AdminDashboard onCourseAdded={handleCourseAdded} />
            <hr style={{margin: '40px 0'}} />
            {/* key prop'unu değiştirerek CourseList bileşenini yeniden render etmeye zorluyoruz */}
            <CourseList key={key} /> 
        </div>
    );
}

export default AdminPanel;