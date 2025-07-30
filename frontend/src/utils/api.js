const API_URL = process.env.REACT_APP_API_URL;

export const fetchAPI = async (endpoint, method = "GET", body = null) => {
  // Tarayıcı hafızasından token'ı al
  const token = localStorage.getItem("authToken");

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // Backend'den gelen detaylı hata mesajını yakala ve fırlat
      const errorMessage =
        data.message ||
        (data.errors
          ? Object.values(data.errors).flat().join(" ")
          : "Bir hata oluştu.");
      throw new Error(errorMessage);
    }

    return data; // Başarılı olursa, veriyi döndür
  } catch (error) {
    console.error(`API çağrısı hatası: ${method} ${endpoint}`, error);
    // Hata mesajını tekrar fırlatarak çağıran bileşenin yakalamasını sağla
    throw error;
  }
};
