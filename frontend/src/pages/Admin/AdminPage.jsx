import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './AdminPanel.css'; // Yeni CSS dosyamızı import ediyoruz

const AdminPage = () => {
  return (
    <div className="admin-panel">
      {/* Sol Taraftaki Navigasyon Menüsü */}
      <aside className="admin-sidebar">
        <h2>Yönetim Paneli</h2>
        <ul className="admin-nav">
          <li>
            <NavLink to="/admin/dersleri-yonet" className={({ isActive }) => (isActive ? 'active' : '')}>
              Dersleri Yönet
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/egitmenleri-yonet" className={({ isActive }) => (isActive ? 'active' : '')}>
              Eğitmenleri Yönet
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/kayit-talepleri" className={({ isActive }) => (isActive ? 'active' : '')}>
              Kayıt Talepleri
            </NavLink>
          </li>
        </ul>
      </aside>

      {/* Sağ Tarafta Değişecek İçerik Alanı */}
      <main className="admin-content">
        <Outlet /> 
        {/* Outlet, iç içe rotaların bileşenlerini burada render eder */}
      </main>
    </div>
  );
};

export default AdminPage;