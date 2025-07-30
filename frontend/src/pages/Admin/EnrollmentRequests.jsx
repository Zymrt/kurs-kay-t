import React, { useState, useEffect, useCallback } from "react";
import { fetchAPI } from "../../utils/api";
// import './EnrollmentRequests.css'; // Özel stil dosyası

const EnrollmentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAPI("/admin/enrollments");
      setRequests(
        (data.data || data).filter((req) => req.status === "pending")
      );
    } catch (err) {
      setError("Başvurular yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleUpdateRequest = async (enrollmentId, newStatus) => {
    try {
      await fetchAPI(`/admin/enrollments/${enrollmentId}`, "PATCH", {
        status: newStatus,
      });
      // Başarılı işlem sonrası listeyi yenile
      fetchRequests();
    } catch (error) {
      alert(`İşlem başarısız: ${error.message}`);
    }
  };

  if (loading) return <p>Başvurular yükleniyor...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="enrollment-list-container">
      {requests.length === 0 ? (
        <p>Onay bekleyen başvuru bulunmamaktadır.</p>
      ) : (
        <table className="enrollment-table">
          <thead>
            <tr>
              <th>Öğrenci</th>
              <th>Başvurulan Ders</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>{request.user?.name || "Bilinmiyor"}</td>
                <td>{request.course?.title || "Bilinmiyor"}</td>
                <td className="action-buttons">
                  <button
                    className="btn btn-approve"
                    onClick={() => handleUpdateRequest(request.id, "approved")}
                  >
                    Onayla
                  </button>
                  <button
                    className="btn btn-reject"
                    onClick={() => handleUpdateRequest(request.id, "rejected")}
                  >
                    Reddet
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EnrollmentRequests;
