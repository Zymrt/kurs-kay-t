import React, { useState, useEffect, useCallback } from "react";
import { fetchAPI } from "../utils/api"; // Merkezi API fonksiyonumuz
import "./DashboardPage.css"; // Birazdan oluşturacağımız stil dosyası

const DashboardPage = () => {
  // Kullanıcı bilgisini localStorage'dan alıyoruz
  const user = JSON.parse(localStorage.getItem("user"));

  // State'leri tanımlıyoruz
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kullanıcının kendi başvurularını API'den çekme fonksiyonu
  const fetchMyEnrollments = useCallback(async () => {
    setLoading(true);
    try {
      // Backend'deki /my-enrollments adresine istek atıyoruz.
      // fetchAPI, token'ı otomatik olarak ekleyeceği için bu korumalı rota çalışacaktır.
      const data = await fetchAPI("/my-enrollments");
      setEnrollments(data.data || data); // Sayfalama varsa .data
    } catch (err) {
      setError("Başvurularınız yüklenirken bir hata oluştu.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyEnrollments();
  }, [fetchMyEnrollments]);

  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "status-approved";
      case "pending":
        return "status-pending";
      case "rejected":
        return "status-rejected";
      default:
        return "";
    }
  };

  // Durum metnini Türkçeleştiren yardımcı fonksiyon
  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Onaylandı";
      case "pending":
        return "Onay Bekliyor";
      case "rejected":
        return "Reddedildi";
      default:
        return status;
    }
  };

  if (loading)
    return <p className="loading-message">Paneliniz Yükleniyor...</p>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Panelim</h1>
        <p>
          Hoş Geldin, <strong>{user?.name || "Kullanıcı"}</strong>!
        </p>
      </div>

      <section className="dashboard-section">
        <h2>Başvurduğum Dersler</h2>
        {error && <p className="error-message">{error}</p>}

        {enrollments.length === 0 && !error ? (
          <p>Henüz hiçbir derse başvurmadınız.</p>
        ) : (
          <table className="enrollments-table">
            <thead>
              <tr>
                <th>Ders Adı</th>
                <th>Eğitmen</th>
                <th>Kategori</th>
                <th>Başvuru Durumu</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id || enrollment._id}>
                  <td>{enrollment.course?.title || "N/A"}</td>
                  <td>{enrollment.course?.instructor?.name || "N/A"}</td>
                  <td>{enrollment.course?.category || "N/A"}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusClass(
                        enrollment.status
                      )}`}
                    >
                      {getStatusText(enrollment.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
