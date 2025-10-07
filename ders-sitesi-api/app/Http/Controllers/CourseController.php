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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // --- Düzeltilmiş Veri Hazırlama Mantığı ---
        
        // Önce, doğrulanan tüm metin tabanlı verileri alalım.
        // 'image' dosyası bu dizide olmayacak.
        $dataToCreate = $validator->validated();

        // Uzmanlık alanı kontrolünü yap
        $instructor = Instructor::find($dataToCreate['instructor_id']);
        if ($instructor->specialty !== $dataToCreate['category']) {
             return response()->json([
                'errors' => ['category' => ["Bu eğitmen sadece '{$instructor->specialty}' alanında ders verebilir."]]
            ], 422);
        }

        // Diğer varsayılan değerleri ekle
        $dataToCreate['enrolled_students'] = 0;
        
        // Resim Yükleme Mantığı
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            $path = $request->file('image')->store('courses', 'public');
            $dataToCreate['image_url'] = Storage::url($path);
        } else {
            // Eğer resim gönderilmezse, varsayılan bir URL ata.
            $dataToCreate['image_url'] = '/images/default-course.jpg';
        }
        
        // 'image' anahtarını (eğer validated() tarafından eklendiyse) create işleminden önce çıkar.
        unset($dataToCreate['image']);

        // VERİTABANINA KAYDETME
        $course = Course::create($dataToCreate);

        return response()->json([
            'message' => 'Ders başarıyla oluşturuldu.',
            'data' => $course->load('instructor')
        ], 201);
    }

    
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
        // Dersi silmeden önce, ilişkili tüm enrollment kayıtlarını sil.
        // Course modelinde 'enrollments()' ilişkisi tanımlı olmalıdır.
        $course->enrollments()->delete();
        
        // Eğer dersin bir resmi varsa, onu da storage'dan silmek iyi bir pratiktir.
        if ($course->image_url && $course->image_url !== '/images/default-course.jpg') {
            // URL'den dosya yolunu çıkar: '/storage/courses/abc.jpg' -> 'courses/abc.jpg'
            $imagePath = str_replace('/storage/', '', $course->image_url);
            Storage::disk('public')->delete($imagePath);
        }
        
        // Son olarak dersin kendisini sil.
        $course->delete();

        return response()->json(['message' => 'Ders ve ilişkili tüm veriler başarıyla silindi.'], 200);
    }
}