<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Instructor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class CourseController extends Controller
{
    /**
     * Dersleri, eğitmen bilgileriyle birlikte listeler.
     */
    public function index(Request $request)
    {
        $query = Course::with('instructor');

        if ($request->has('instructor_id')) {
            $query->where('instructor_id', $request->input('instructor_id'));
        }

        $courses = $query->latest()->paginate(10);

        // API Resource kullanmadığımız için, sayfalama verisini manuel olarak formatlayabiliriz.
        return response()->json($courses);
    }

    /**
     * Yeni bir ders oluşturur. Sadece adminler erişebilir.
     */
    public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'title' => 'required|string|max:255|unique:courses',
        'description' => 'required|string',
        'instructor_id' => 'required|string|exists:instructors,_id',
        'category' => 'required|string',
        'capacity' => 'required|integer|min:1',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // YENİ: Resim doğrulama kuralları
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    // ... (Mevcut uzmanlık alanı kontrolü burada kalacak) ...
    
    $validatedData = $validator->validated();
    $validatedData['enrolled_students'] = 0;
    
    // --- YENİ RESİM YÜKLEME MANTIĞI ---
    if ($request->hasFile('image')) {
        // Gelen dosyayı 'courses' klasörünün içine, public diskini kullanarak kaydet.
        $path = $request->file('image')->store('courses', 'public');
        // Veritabanına kaydedilecek tam URL'yi oluştur.
        $validatedData['image_url'] = Storage::url($path);
    } else {
        // Eğer resim gönderilmezse, varsayılan bir resim ata.
        $validatedData['image_url'] = '/default-course.jpg'; // Bu resmi public klasörüne koyman gerekir.
    }
    
    // 'image' alanını create işleminden önce çıkaralım, çünkü veritabanında yok.
    unset($validatedData['image']);

    $course = Course::create($validatedData);

    return response()->json([
        'message' => 'Ders başarıyla oluşturuldu.',
        'data' => $course->load('instructor')
    ], 201);
}

    /**
     * Belirtilen bir dersi, eğitmen bilgisiyle birlikte gösterir.
     */
    public function show(Course $course)
    {
        return response()->json($course->load('instructor'));
    }

    /**
     * Mevcut bir dersi günceller. Sadece adminler erişebilir.
     */
    public function update(Request $request, Course $course)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255|unique:courses,title,' . $course->id,
            'description' => 'sometimes|string',
            'instructor_id' => 'sometimes|string|exists:instructors,_id',
            'category' => 'sometimes|string',
            'capacity' => 'sometimes|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();

        // İŞ KURALI: Eğer eğitmen veya kategori değişiyorsa, uzmanlık kontrolünü tekrar yap.
        if (isset($validatedData['instructor_id']) || isset($validatedData['category'])) {
            $newInstructorId = $validatedData['instructor_id'] ?? $course->instructor_id;
            $newCategory = $validatedData['category'] ?? $course->category;
            $instructor = Instructor::find($newInstructorId);
            
            if ($instructor && $instructor->specialty !== $newCategory) {
                 return response()->json([
                    'errors' => ['category' => ["Bu eğitmen sadece '{$instructor->specialty}' alanında ders verebilir."]]
                ], 422);
            }
        }

        $course->update($validatedData);

        return response()->json([
            'message' => 'Ders bilgileri güncellendi.',
            'data' => $course->load('instructor')
        ]);
    }

    /**
     * Bir dersi siler. Sadece adminler erişebilir.
     */
    public function destroy(Course $course)
    {
        // Önce bu derse ait tüm kayıtları (enrollments) sil.
        $course->enrollments()->delete();
        
        // Sonra dersin kendisini sil.
        $course->delete();

        return response()->json(['message' => 'Ders ve ilişkili tüm başvurular başarıyla silindi.'], 200);
    }
}