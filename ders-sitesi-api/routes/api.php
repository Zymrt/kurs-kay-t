<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\InstructorController;


use Illuminate\Support\Facades\DB;

Route::get('/_health', fn() => ['ok' => true]);

Route::get('/_dbping', function () {
    try {
        $client = DB::connection('mongodb')->getMongoClient();
        $db = $client->selectDatabase(env('DB_DATABASE','kurs-kayit-db'));
        $res = $db->command(['ping' => 1])->toArray();
        return ['ok' => $res[0]->ok ?? null];
    } catch (\Throwable $e) {
        return response()->json(['err' => $e->getMessage()], 500);
    }
});





Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/courses', [CourseController::class, 'index']);
// {course} -> CourseController'daki 'Course $course' ile eşleşir (Route-Model Binding)
Route::get('/courses/{course}', [CourseController::class, 'show']); 

Route::get('/instructors', [InstructorController::class, 'index']);
Route::get('/instructors/{instructor}', [InstructorController::class, 'show']);


// =========================================================================
//  BÖLÜM 2: GİRİŞ YAPMAYI GEREKTİREN KORUMALI ROTALAR
// =========================================================================

Route::middleware('auth:api')->group(function () {

    // --- Kullanıcı İşlemleri ---
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // --- Başvuru İşlemleri (Kullanıcı Tarafı) ---
    // POST /enrollments/{course} -> Bir derse başvuru oluşturur. Controller metodu: store
    Route::post('/enrollments/{course}', [EnrollmentController::class, 'store']);
    Route::get('/my-enrollments', [EnrollmentController::class, 'myEnrollments']);
    Route::delete('/enrollments/{enrollment}', [EnrollmentController::class, 'cancelEnrollment']);



    
    //   SADECE ADMİNLERİN ERİŞEBİLECEĞİ ROTALAR
   
    
    // '/admin' ön eki, tüm admin rotalarının /api/admin/... şeklinde başlamasını sağlar.
    Route::prefix('admin')->middleware('admin')->group(function () {
        
        // Admin: Ders Yönetimi (/api/admin/courses)
        Route::post('/courses', [CourseController::class, 'store']);
        Route::put('/courses/{course}', [CourseController::class, 'update']);
        Route::delete('/courses/{course}', [CourseController::class, 'destroy']);

        // Admin: Eğitmen Yönetimi (/api/admin/instructors)
        Route::post('/instructors', [InstructorController::class, 'store']);
        Route::put('/instructors/{instructor}', [InstructorController::class, 'update']);
        Route::delete('/instructors/{instructor}', [InstructorController::class, 'destroy']);

        // Admin: Kayıt Yönetimi (/api/admin/enrollments)
        Route::get('/enrollments', [EnrollmentController::class, 'listAllEnrollments']);
        // Bir başvurunun durumunu güncellemek için PATCH metodu daha uygundur.
        Route::patch('/enrollments/{enrollment}', [EnrollmentController::class, 'updateStatus']);
    });
});