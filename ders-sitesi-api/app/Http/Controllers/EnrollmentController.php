<?php
    namespace App\Http\Controllers;

    use App\Models\Course;
    use App\Models\Enrollment;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Auth;

    class EnrollmentController extends Controller
    {
        /*
        * Giriş yapmış kullanıcının bir derse kayıt talebi göndermesini sağlar.
        * Bu işlem bir "başvuru" oluşturur ve durumu 'pending' olarak ayarlar.
        * Rota: POST /enroll/{course}
        */
        public function store(Request $request, Course $course) 
        {
            $user = Auth::user();

            
            if ($course->isFull()) {
                return response()->json(['message' => 'Bu dersin kontenjanı dolu, başvuru yapılamaz.'], 409); 
            }

        
            $existingEnrollment = Enrollment::where('user_id', $user->id)
                                            ->where('course_id', $course->id)
                                            ->first();

            if ($existingEnrollment) {
                return response()->json(['message' => "Bu derse zaten başvurdunuz. Durum: {$existingEnrollment->status}"], 409);
            }

            $enrollment = Enrollment::create([
                'user_id' => $user->id,
                'course_id' => $course->id,
                'status' => 'pending', 
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
                ->enrollments() 
                ->with('course.instructor') 
                ->latest()
                ->paginate(10);

            return response()->json($enrollments);
        }

        public function cancelEnrollment(Request $request, Enrollment $enrollment)
    {
        // GÜVENLİK KONTROLÜ: Kullanıcı, sadece kendi başvurusunu silebilir.
        // Giriş yapmış kullanıcının ID'si ile başvurunun user_id'si eşleşiyor mu?
        if ($request->user()->id !== $enrollment->user_id) {
            // Eğer eşleşmiyorsa, bu isteği reddet.
            return response()->json(['error' => 'Bu işlemi yapmak için yetkiniz yok.'], 403); // 403 Forbidden
        }

        // KONTENJAN GÜNCELLEME: Eğer iptal edilen başvuru daha önce 'onaylanmış' idiyse,
        // dersin kontenjanındaki kayıtlı öğrenci sayısını 1 azalt.
        if ($enrollment->status === 'approved') {
            // course() ilişkisi null değilse devam et
            if ($enrollment->course) {
                 $enrollment->course->decrement('enrolled_students');
            }
        }

        // Başvuruyu veritabanından sil.
        $enrollment->delete();

        return response()->json(['message' => 'Başvurunuz başarıyla iptal edildi.'], 200);
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

    $newStatus = $request->input('status');
    $oldStatus = $enrollment->status;

    if ($oldStatus === $newStatus) {
        return response()->json(['message' => "Kayıt zaten '{$newStatus}' durumunda."], 200);
    }

    // İlgili kursu, kilitleyerek (pessimistic locking) alalım.
    // Bu, aynı anda iki adminin aynı kontenjanı artırmasını engeller.
    $course = Course::where('_id', $enrollment->course_id)->lockForUpdate()->first();

    if ($newStatus === 'approved') {
        // Kontenjan kontrolü
        if ($course->isFull()) {
            return response()->json(['message' => "Onaylanamadı: '{$course->title}' dersinin kontenjanı dolu."], 409);
        }
        
        // Sadece eski durumu 'approved' değilken öğrenci sayısını 1 artır.
        if ($oldStatus !== 'approved') {
            $course->increment('enrolled_students');
        }
    } 
    // Onay geri çekiliyorsa...
    else if ($oldStatus === 'approved') {
        $course->decrement('enrolled_students');
    }
    
    // Önce başvuru durumunu veritabanında güncelle.
    $enrollment->status = $newStatus;
    $enrollment->save();
    
    // Course objesindeki değişiklikleri (increment/decrement) kaydetmeye GEREK YOK,
    // çünkü increment/decrement komutları bunu zaten anında yapar.

    return response()->json([
        'message' => 'Kayıt durumu başarıyla güncellendi.', 
        'enrollment' => $enrollment->load(['user', 'course'])
    ]);
}
    }