import React from "react";

// Admin panelinin alt bileşenlerini import ediyoruz
import AddInstructorForm from "./AddInstructorForm.jsx";
import ManageInstructors from "./ManageInstructors.jsx";
import AddCourseForm from "./AddCourseForm.jsx";
import ManageCoursesPage from "./ManageCoursesPage.jsx";
import EnrollmentRequests from "./EnrollmentRequests.jsx";

// İlgili stil dosyasını import ediyoruz
import "./AdminPanel.css"; // Ortak bir stil dosyası kullanabiliriz

const AdminPage = () => {
  return (
    <div className="admin-container">
      <h1>Admin Yönetim Paneli</h1>

      <div className="admin-layout">
        {/* Sol Sütun: Ekleme Formları */}
        <div className="form-column">
          <section className="admin-section">
            <h2>Yeni Eğitmen Ekle</h2>
            <AddInstructorForm />
          </section>
          <section className="admin-section">
            <h2>Yeni Ders Ekle</h2>
            <AddCourseForm />
          </section>
        </div>

        {/* Sağ Sütun: Yönetim Listeleri */}
        <div className="list-column">
          <section className="admin-section">
            <h2>Mevcut Eğitmenler</h2>
            <ManageInstructors />
          </section>
          <section className="admin-section">
            <h2>Mevcut Dersler</h2>
            <ManageCoursesPage />
          </section>
        </div>
      </div>

      {/* Alt Kısım: Onay Bekleyen Başvurular (tam genişlik) */}
      <section className="admin-section enrollment-section">
        <h2>Onay Bekleyen Başvurular</h2>
        <EnrollmentRequests />
      </section>
    </div>
  );
};

export default AdminPage;
