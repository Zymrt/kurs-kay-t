import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar"; // Navbar'ın doğru yolda olduğundan emin ol
import HomePage from "./pages/Home.jsx";
import AdminPage from "./pages/Admin/AdminPage.jsx";
import LoginForm from "./pages/Auth/LoginForm.jsx";
import RegisterForm from "./pages/Auth/RegisterForm.jsx";
import CourseList from "./pages/Courses/CourseList.jsx";
import MyCourses from "./pages/Courses/MyCourses.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import "./App.css";

// 1. AuthContext'i oluştur ve export et
export const AuthContext = createContext(null);

// 2. Korumalı Rota Yardımcı Bileşenleri
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  return user?.is_admin ? children : <Navigate to="/" />;
};

// 3. Ana Uygulama Bileşeni
function App() {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem("authToken") || null,
    isAuthenticated: null,
    user: null,
    loading: true, // Sayfa ilk yüklendiğinde durumu kontrol etmek için
  });

  // Sayfa ilk yüklendiğinde localStorage'ı kontrol et
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      setAuthState({
        token: token,
        isAuthenticated: true,
        user: user,
        loading: false,
      });
    } else {
      setAuthState({
        token: null,
        isAuthenticated: false,
        user: null,
        loading: false,
      });
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
    setAuthState({
      token: null,
      isAuthenticated: false,
      user: null,
      loading: false,
    });
  };

  // Yükleme sırasında boş bir ekran göster (isteğe bağlı)
  if (authState.loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      <Router> {/* BrowserRouter'ı en tepeye taşıdık */}
        <div className="App">
          <Navbar />
          <main className="container">
            <Routes>
              {/* Rotaların aynı kalabilir, sadece PrivateRoute ve AdminRoute artık context'ten beslenecek */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/courses" element={<CourseList />} />
              
              <Route
                path="/my-courses"
                element={<PrivateRoute><MyCourses /></PrivateRoute>}
              />
              <Route
                path="/dashboard"
                element={<PrivateRoute><DashboardPage /></PrivateRoute>}
              />
              <Route
                path="/admin"
                element={<AdminRoute><AdminPage /></AdminRoute>}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;