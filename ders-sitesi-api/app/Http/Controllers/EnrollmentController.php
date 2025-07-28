<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnrollmentController extends Controller
{
    /**
     * Giriş yapmış kullanıcının bir derse kayıt talebi göndermesini sağlar.
     * Bu işlem bir "başvuru" oluşturur ve durumu 'pending' olarak ayarlar.
     * Rota: POST /enroll/{course}
     */
    public function store(Request $request, Course $course) // Route-Model Binding kullanıyoruz
    {
        $user = Auth::user();

        // KURAL 1: Dersin kontenjanı dolu mu?
        if ($course->isFull()) {
            return response()->json(['message' => 'Bu dersin kontenjanı dolu, başvuru yapılamaz.'], 409); // Conflict
        }

        // KURAL 2: Kullanıcı bu derse zaten başvurmuş mu?
        $existingEnrollment = Enrollment::where('user_id', $user->id)
                                         ->where('course_id', $course->id)
                                         ->first();

        if ($existingEnrollment) {
            return response()->json(['message' => "Bu derse zaten başvurdunuz. Durum: {$existingEnrollment->status}"], 409);
        }

        // Başvuru kaydını oluştur.
        $enrollment = Enrollment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'status' => 'pending', // Başlangıç durumu her zaman 'onay bekliyor'
        ]);

        return response()->json([
            'message' => 'Başvurunuz başarıyla alındı. Admin onayı bekleniyor.',
            'enrollment' => $enrollment
        ], 201);
    }

    /**
     * Giriş yapmış kullanıcının kendi ders başvurularını listeler.
     * Rota: GET /my-enrollments
     */
    public function myEnrollments()
    {
        $enrollments = Auth::user()
            ->enrollments() // User modelinde tanımlayacağımız ilişkiyi kullanıyoruz
            ->with('course.instructor') // Başvurunun dersini ve dersin eğitmenini de getir
            ->latest()
            ->paginate(10);

        return response()->json($enrollments);
    }

    /**
     * [ADMIN] Sistemdeki tüm kayıt taleplerini listeler.
     * Rota: GET /admin/enrollments
     */
    public function listAllEnrollments()
    {
        $enrollments = Enrollment::with(['user', 'course.instructor'])
            ->latest()
            ->paginate(10);

        return response()->json($enrollments);
    }

    /**
     * [ADMIN] Bir kayıt talebinin durumunu günceller (onaylar veya reddeder).
     * Rota: PATCH /admin/enrollments/{enrollment}
     */
    public function updateStatus(Request $request, Enrollment $enrollment)
    {
        $request->validate(['status' => 'required|in:approved,rejected']);

        $course = $enrollment->course; // İlişki sayesinde dersi kolayca alıyoruz
        $newStatus = $request->input('status');

        if ($enrollment->status === $newStatus) {
            return response()->json(['message' => "Kayıt zaten '{$newStatus}' durumunda."], 200);
        }

        // ONLİNE KONTROL MANTIĞI
        if ($newStatus === 'approved') {
            if ($course->isFull()) {
                return response()->json(['message' => "Onaylanamadı: '{$course->title}' dersinin kontenjanı dolu."], 409);
            }
            // Sadece eski durumu 'approved' değilken sayıyı artır.
            if ($enrollment->status !== 'approved') {
                $course->increment('enrolled_students');
            }
        } 
        // Eğer bir onay geri çekiliyorsa (onaylıdan reddedildiye veya bekliyora)
        else if ($enrollment->status === 'approved') {
            $course->decrement('enrolled_students');
        }
        
        $enrollment->status = $newStatus;
        $enrollment->save();

        return response()->json(['message' => 'Kayıt durumu başarıyla güncellendi.', 'enrollment' => $enrollment->load(['user', 'course'])]);
    }
}