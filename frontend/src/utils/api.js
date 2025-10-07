/**
 * utils/api.js
 *
 * Bu dosya, backend API'mızla iletişim kurmak için merkezi bir fonksiyon içerir.
 * Tüm fetch istekleri bu yardımcı fonksiyon üzerinden yapılır.
 * Bu, token yönetimini, dosya yüklemeyi ve hata işlemeyi tek bir yerden kontrol etmemizi sağlar.
 */

// .env dosyasından backend API'mızın ana adresini alıyoruz.
const API_URL = process.env.REACT_APP_API_URL;

/**
 * API'ye istek atmak için kullanılan ana fonksiyon.
 * @param {string} endpoint - /courses, /auth/login gibi gidilecek yol.
 * @param {string} [method='GET'] - HTTP metodu (GET, POST, PUT, DELETE, PATCH).
 * @param {object|FormData|null} [body=null] - POST/PUT gibi isteklerde gönderilecek veri.
 * @returns {Promise<any>} - API'den dönen JSON verisi.
 */
export const fetchAPI = async (endpoint, method = "GET", body = null) => {
  // 1. Her istekten önce tarayıcı hafızasından güncel token'ı oku.
  const token = localStorage.getItem("authToken");

  // 2. HTTP Başlıklarını (Headers) hazırla.
  const headers = {
    Accept: "application/json",
  };

  // ÖNEMLİ İYİLEŞTİRME: Eğer bir dosya (FormData) gönderiyorsak,
  // 'Content-Type' başlığını tarayıcının kendisinin belirlemesine izin vermeliyiz.
  // Aksi takdirde dosya yükleme işlemi başarısız olur.
  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // 3. Eğer token varsa, onu 'Authorization' başlığına ekle.
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // 4. fetch isteği için yapılandırma (config) objesini oluştur.
  const config = {
    method,
    headers,
  };

  // 5. Gövdeyi (body) doğru formatta ayarla.
  if (body) {
    config.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  try {
    // 6. API isteğini 'fetch' ile gönder.
    const response = await fetch(`${API_URL}${endpoint}`, config);

    // 7. EN ÖNEMLİ İYİLEŞTİRME: Hata yönetimini daha akıllı hale getir.
    if (!response.ok) {
      // Eğer hata 401 (Unauthenticated) ise, bu "oturum süresi doldu" demektir.
      // Kullanıcıyı otomatik olarak logout yapıp login sayfasına yönlendirelim.
      if (response.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        window.location.href = "/login"; // Sayfayı yenileyerek yönlendir.
        // Anlaşılır bir hata fırlat.
        throw new Error("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");
      }

      // Diğer hatalar için (403, 404, 422, 500 vb.), backend'den gelen JSON'u okumaya çalış.
      const errorData = await response.json();
      const errorMessage =
        errorData.message ||
        (errorData.errors
          ? Object.values(errorData.errors).flat().join(" ")
          : "Bir sunucu hatası oluştu.");
      throw new Error(errorMessage);
    }

    // Eğer cevapta içerik yoksa (örn: DELETE sonrası 204 No Content), null dön.
    if (response.status === 204) {
      return null;
    }

    // Başarılı cevabı JSON'a çevirip döndür.
    return await response.json();
  } catch (error) {
    console.error(`API çağrısı hatası: ${method} ${endpoint}`, error);
    // Hata mesajını, onu çağıran fonksiyona geri fırlat.
    throw error;
  }
};
