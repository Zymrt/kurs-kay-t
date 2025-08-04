import React, { useState } from "react";
import AddInstructorForm from "./AddInstructorForm.jsx";
import ManageInstructors from "./ManageInstructors.jsx";
import AddCourseForm from "./AddCourseForm.jsx";
import ManageCoursesPage from "./ManageCoursesPage.jsx";
import EnrollmentRequests from "./EnrollmentRequests.jsx";
import "./AdminPanel.css";

const AdminPage = () => {
  // Bu state'ler, listelerin yenilenmesini tetiklemek için kullanılacak
  const [refreshInstructorsKey, setRefreshInstructorsKey] = useState(0);
  const [refreshCoursesKey, setRefreshCoursesKey] = useState(0);

  return (
    <div className="admin-container">
      <h1>Admin Yönetim Paneli</h1>
      <div className="admin-layout">
        <div className="form-column">
          <section className="admin-section">
            <h2>Yeni Eğitmen Ekle</h2>
            {/* Eğitmen eklenince, refresh key'i değiştirerek listeyi yenile */}
            <AddInstructorForm
              onInstructorAdded={() => setRefreshInstructorsKey((k) => k + 1)}
            />
          </section>
          <section className="admin-section">
            <h2>Yeni Ders Ekle</h2>
            {/* Ders eklenince, refresh key'i değiştirerek listeyi yenile */}
            <AddCourseForm
              onCourseAdded={() => setRefreshCoursesKey((k) => k + 1)}
            />
          </section>
        </div>
        <div className="list-column">
          <section className="admin-section">
            <h2>Mevcut Eğitmenler</h2>
            <ManageInstructors refreshKey={refreshInstructorsKey} />
          </section>
          <section className="admin-section">
            <h2>Mevcut Dersler</h2>
            <ManageCoursesPage refreshKey={refreshCoursesKey} />
          </section>
        </div>
      </div>
      <section className="admin-section enrollment-section">
        <h2>Onay Bekleyen Başvurular</h2>
        <EnrollmentRequests />
      </section>
    </div>
  );
};

export default AdminPage;
