import React, { useState, useEffect, createContext } from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './pages/Home.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import LoginForm from './components/Auth/LoginForm.jsx';
import RegisterForm from './components/Auth/RegisterForm.jsx';
import MyCourses from './components/Courses/MyCourses.jsx';
import setAuthToken from './utils/SetAuthToken';
import './App.css';

export const AuthContext = createContext(null);

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && localStorage.token) {
      setAuth(prev => ({ ...prev, isAuthenticated: true, user: user, loading: false }));
    } else {
      setAuth(prev => ({ ...prev, isAuthenticated: false, user: null, loading: false }));
    }
  }, []);

  const loginUser = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setAuthToken(data.token);
    setAuth({
      token: data.token,
      isAuthenticated: true,
      loading: false,
      user: data.user,
    });
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken(null);
    setAuth({ token: null, isAuthenticated: false, loading: false, user: null });
  };

  const updateUserCourses = (courseIdArray) => {
    const updatedUser = { ...auth.user, myCourses: courseIdArray };
    setAuth(prev => ({ ...prev, user: updatedUser }));
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };
  
  if (auth.loading) {
    return <div style={{textAlign: 'center', marginTop: '50px'}}>Yükleniyor...</div>;
  }

  return (
    <AuthContext.Provider value={{ ...auth, loginUser, logoutUser, updateUserCourses }}>
      <div className="App">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/kurslarim" element={auth.isAuthenticated ? <MyCourses /> : <Navigate to="/login" />} />
            <Route path="/admin" element={auth.isAuthenticated && auth.user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </AuthContext.Provider>
  );
}

// index.js'te BrowserRouter varsa buraya gerek yok, ama yoksa eklemek en güvenlisi.
const AppWrapper = () => (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

export default App; // index.js'te AppWrapper kullanmıyorsanız bunu kullanın.
// export default AppWrapper; // index.js'te <AppWrapper /> kullanacaksanız bunu export edin.