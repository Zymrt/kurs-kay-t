import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Toast bildirimleri için gerekli importlar
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Ana Sayfalar ve Bileşenler
import Navbar from "./Navbar";
import HomePage from "./pages/Home.jsx";
import LoginForm from "./pages/Auth/LoginForm.jsx";
import RegisterForm from "./pages/Auth/RegisterForm.jsx";
import CourseList from "./pages/Courses/CourseList.jsx";
import MyCourses from "./pages/Courses/MyCourses.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

// Admin Paneli ve Alt Sayfaları
import AdminPage from "./pages/Admin/AdminPage.jsx";
import ManageCoursesPage from "./pages/Admin/ManageCoursesPage.jsx";
import ManageInstructors from "./pages/Admin/ManageInstructors.jsx";
import EnrollmentRequests from "./pages/Admin/EnrollmentRequests.jsx";

import "./App.css";

// Context'i oluştur ve export et
export const AuthContext = createContext(null);

// Korumalı Rota Yardımcı Bileşenleri
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = React.useContext(AuthContext);
  if (loading) return null; // Yükleme sırasında bir şey render etme
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = React.useContext(AuthContext);
  if (loading) return null; // Yükleme sırasında bir şey render etme
  return isAuthenticated && user?.is_admin ? children : <Navigate to="/" />;
};

// Ana Uygulama Bileşeni
function App() {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem("authToken") || null,
    isAuthenticated: null,
    user: null,
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      setAuthState({ token, isAuthenticated: true, user, loading: false });
    } else {
      setAuthState({ token: null, isAuthenticated: false, user: null, loading: false });
    }
  }, []);

  const login = (data) => {
    localStorage.setItem("authToken", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setAuthState({
      token: data.access_token,
      isAuthenticated: true,
      user: data.user,
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setAuthState({ token: null, isAuthenticated: false, user: null, loading: false });
  };

  if (authState.loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      <Router>
        <div className="App">
          {/* TOAST BİLDİRİMLERİ İÇİN KONTEYNER ARTIK DOĞRU YERDE VE ÇALIŞIR DURUMDA */}
          <ToastContainer
            position="bottom-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />

          <Navbar />
          <main className="container">
            <Routes>
              {/* === Genel Rotalar === */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/courses" element={<CourseList />} />

              {/* === Kullanıcıya Özel Rotalar === */}
              <Route path="/my-courses" element={<PrivateRoute><MyCourses /></PrivateRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />

              {/* === Admin Paneli ve İç İçe Rotaları === */}
              <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>}>
                <Route index element={<Navigate to="dersleri-yonet" replace />} />
                <Route path="dersleri-yonet" element={<ManageCoursesPage />} />
                <Route path="egitmenleri-yonet" element={<ManageInstructors />} />
                <Route path="kayit-talepleri" element={<EnrollmentRequests />} />
              </Route>

              {/* === Bulunamayan Sayfalar === */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;