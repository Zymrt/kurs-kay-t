<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Instructor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\CourseResource;
use App\Models\Enrollment;

class CourseController extends Controller
{
    // Dersleri listeleme
    public function index(Request $request)
    {
        $query = Course::with('instructor');

        // Eğitmen ID'ye göre filtreleme
        if ($request->has('instructor_id')) {
            $query->where('instructor_id', $request->input('instructor_id'));
        }

        // Sayfalama ekledik (ihtiyaç durumunda 10 ders)
        $courses = $query->latest()->paginate(10);

        return CourseResource::collection($courses);
    }

    // Yeni ders oluşturma
    public function store(Request $request)
    {
        // Validasyon işlemi
        $validator = Validator::make($request->all(), [
            'title'         => 'required|string|max:255|unique:courses',
            'description'   => 'required|string',
            'instructor_id' => 'required|string|exists:instructors,_id',
            'category'      => 'required|string',
            'capacity'      => 'required|integer|min:1',
        ]);

        // Eğer validasyon başarısızsa hata döndür
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Eğitmen bilgilerini alıyoruz
        $instructor = Instructor::find($request->input('instructor_id'));

        // Eğer eğitmen yoksa hata döndür
        if (!$instructor) {
            return response()->json(['error' => 'Eğitmen bulunamadı.'], 404);
        }

        // Eğitmenin alanı ile dersin kategorisini kontrol et
        if ($instructor->specialty !== $request->input('category')) {
            return response()->json([
                'errors' => [
                    'category' => ["Bu eğitmen sadece '{$instructor->specialty}' alanında ders verebilir."]
                ]
            ], 422);
        }

        // Veriyi validasyondan geçtikten sonra kursu oluşturuyoruz
        $validatedData = $validator->validated();
        $validatedData['enrolled_students'] = 0;  // Dersin başlangıçtaki öğrenci sayısı

        // Ders kaydını oluşturuyoruz
        $course = Course::create($validatedData);

        return new CourseResource($course->load('instructor'));
    }

    // Tek bir kursu gösterme
    public function show($id)
    {
        // Kursu buluyoruz
        $course = Course::find($id);
        if (!$course) {
            return response()->json(['error' => 'Kurs bulunamadı.'], 404);
        }

        return new CourseResource($course->load('instructor'));
    }

    // Kursu güncelleme
    public function update(Request $request, $id)
    {
        // Güncellenmek istenen kursu buluyoruz
        $course = Course::find($id);
        if (!$course) {
            return response()->json(['error' => 'Ders bulunamadı.'], 404);
        }

        // Validasyon işlemi
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255|unique:courses,title,' . $course->id,
            'description' => 'sometimes|string',
            'instructor_id' => 'sometimes|string|exists:instructors,_id',
            'category' => 'sometimes|string',
            'capacity' => 'sometimes|integer|min:1',
        ]);

        // Eğer validasyon başarısızsa hata döndür
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Eğitmen ve kategori kontrolü
        if (isset($request->instructor_id) || isset($request->category)) {
            $newInstructorId = $request->instructor_id ?? $course->instructor_id;
            $newCategory = $request->category ?? $course->category;
            $instructor = Instructor::find($newInstructorId);

            if ($instructor && $instructor->specialty !== $newCategory) {
                return response()->json([
                    'errors' => ['category' => ["Bu eğitmen sadece '{$instructor->specialty}' alanında ders verebilir."]]
                ], 422);
            }
        }

        // Kursu güncelliyoruz
        $course->update($validator->validated());

        return new CourseResource($course->load('instructor'));
    }

    // Kursu silme
    public function destroy($id)
    {
        // Kursu buluyoruz
        $course = Course::find($id);
        if (!$course) {
            return response()->json(['error' => 'Ders bulunamadı.'], 404);
        }

        // Başvuruları sil
        Enrollment::where('course_id', $course->id)->delete();

        // Kursu siliyoruz
        $course->delete();

        return response()->json(['message' => 'Kurs başarıyla silindi.']);
    }
}
