import React from "react";

// 1. ADIM: Gerekli yönlendirme bileşenlerini TEK BİR SATIRDA import et.
// BrowserRouter'ı buradan kaldırıyoruz, çünkü en iyi yeri index.js'dir.
import { Routes, Route, Navigate } from "react-router-dom";

// 2. ADIM: Projenin ihtiyaç duyduğu tüm "sayfa" bileşenlerini import et.
import Navbar from "./Navbar";
import HomePage from "./pages/Home.jsx";
import AdminPage from "./pages/Admin/AdminPage.jsx";
import LoginForm from "./pages/Auth/LoginForm.jsx";
import RegisterForm from "./pages/Auth/RegisterForm.jsx";
import CourseList from "./pages/Courses/CourseList.jsx";
import CourseDetail from "./pages/Courses/CourseDetail.jsx";
import MyCourses from "./pages/Courses/MyCourses.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

// 3. ADIM: Ana stil dosyasını import et.
import "./App.css";

// 4. ADIM: Korumalı Rota Yardımcı Bileşenleri
// Bu bileşenler, rota mantığını temiz ve yeniden kullanılabilir tutar.
const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("authToken");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.is_admin;
  return isAdmin ? children : <Navigate to="/" />; // Yetkisi yoksa ana sayfaya yönlendir
};

// --- Ana Uygulama Bileşeni ---
function App() {
  return (
    // <BrowserRouter> buradan kaldırıldı. Bu, index.js dosyasında olmalı.
    <div className="App">
      <Navbar />

      <main className="container">
        {/* 5. ADIM: Tüm rotaları <Routes> bloğu içinde tanımla. */}
        <Routes>
          {/* Herkese Açık Rotalar */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/course/:courseId" element={<CourseDetail />} />

          {/* Sadece Giriş Yapmış Kullanıcıların Erişebileceği Rotalar */}
          <Route
            path="/my-courses"
            element={
              <PrivateRoute>
                <MyCourses />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />

          {/* Sadece Adminlerin Erişebileceği Rota */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />

          {/* Eşleşmeyen tüm diğer yolları ana sayfaya yönlendir */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
