import React from 'react';
import CourseForm from './CourseForm';

function AdminDashboard({ onCourseAdded }) {
  return (
    <div>
      <h2>Yeni kurs ekle</h2>
      <CourseForm onCourseAdded={onCourseAdded} />
    </div>
  );
}

export default AdminDashboard;