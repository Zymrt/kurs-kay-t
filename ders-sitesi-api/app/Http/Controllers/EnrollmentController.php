<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Enrollment;

class EnrollmentController extends Controller
{
    public function enroll($courseId)
    {
        $user = auth()->user();

        // Daha önce kayıt yapılmış mı kontrol et
        $existing = Enrollment::where('user_id', $user->id)
                              ->where('course_id', $courseId)
                              ->first();

        if ($existing) {
            return response()->json(['message' => 'Zaten bu kursa kayıtlısınız.'], 400);
        }

        // Yeni kayıt oluştur
        Enrollment::create([
            'user_id' => $user->id,
            'course_id' => $courseId,
        ]);

        return response()->json(['message' => 'Başvuru başarıyla kaydedildi!']);
    }

    public function index()
    {
        $enrollments = Enrollment::with(['user', 'course'])->get();
        return response()->json($enrollments);
    }

    public function listAllEnrollments()
{
    // Tüm başvuruları derse ve kullanıcıya göre getir
    $enrollments = Enrollment::with(['course', 'user'])->get();

    return response()->json($enrollments);
}

}
