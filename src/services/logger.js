// Bu fonksiyon, yapılan her önemli işlemi localStorage'a kaydeder.

export const logAction = (action, details, actor) => {
  try {
    // Mevcut logları al, yoksa boş bir dizi oluştur
    const logs = JSON.parse(localStorage.getItem('app_logs')) || [];

    // Yeni log girdisini oluştur
    const newLogEntry = {
      timestamp: new Date().toISOString(), // İşlemin yapıldığı zaman (ISO formatında)
      action: action, // Ne yapıldığı (Örn: 'KURS EKLENDİ')
      details: details, // İşlemle ilgili detay (Örn: 'Kurs Adı: Temel Python')
      actor: actor ? `${actor.name} (${actor.email})` : 'Sistem/Giriş Yapılmamış', // İşlemi kimin yaptığı
    };

    // Yeni logu listenin başına ekle
    logs.unshift(newLogEntry);

    // Log dosyasının çok büyümesini engellemek için son 200 kaydı tut
    if (logs.length > 200) {
      logs.splice(200);
    }

    // Güncellenmiş logları tekrar localStorage'a kaydet
    localStorage.setItem('app_logs', JSON.stringify(logs));

  } catch (error) {
    console.error('Loglama sırasında bir hata oluştu:', error);
  }
};