<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\InstructorController;



// Kullanıcı Kayıt ve Giriş İşlemleri
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Dersleri ve Eğitmenleri Listeleme İşlemleri
// Misafir kullanıcılar da derslere ve eğitmenlere göz atabilmelidir.
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{course}', [CourseController::class, 'show']);
Route::get('/instructors', [InstructorController::class, 'index']);
Route::get('/instructors/{instructor}', [InstructorController::class, 'show']);



Route::middleware('auth:api')->group(function () {

    // --- KULLANICI İŞLEMLERİ (Tüm giriş yapmış kullanıcılar için) ---

    // Profil ve Çıkış
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Derse Başvurma ve Kendi Başvurularını Görme
    


    //ders düzenleme ve silme
    

    // --- SADECE ADMİNLERİN ERİŞEBİLECEĞİ ROTALAR (İç İçe Koruma) ---
    // Bu gruptaki rotalar, hem giriş yapmayı (auth:api) hem de admin olmayı (admin) gerektirir.
    
    Route::middleware('admin')->group(function () {
        
        // Admin: Ders Yönetimi
        Route::post('/courses', [CourseController::class, 'store']);
        Route::put('/courses/{course}', [CourseController::class, 'update']);
        Route::delete('/courses/{course}', [CourseController::class, 'destroy']);

        // Admin: Eğitmen Yönetimi
        Route::post('/instructors', [InstructorController::class, 'store']);
        Route::put('/instructors/{instructor}', [InstructorController::class, 'update']); // Güncelleme rotası da ekleyelim
        Route::delete('/instructors/{instructor}', [InstructorController::class, 'destroy']); // Silme rotası da ekleyelim

        // Admin: Kayıt Yönetimi
        Route::post('/enroll/{courseId}', [EnrollmentController::class, 'enroll']);
        Route::get('/admin/enrollments', [EnrollmentController::class, 'index']);
        Route::get('/admin/enrollments', [EnrollmentController::class, 'listAllEnrollments']);
    });
});