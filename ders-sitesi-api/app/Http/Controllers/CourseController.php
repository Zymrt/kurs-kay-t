<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Instructor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\CourseResource;
use Illuminate\Support\Facades\Auth;
use App\Models\Enrollment;
use App\Http\Controllers\CourseController;


class CourseController extends Controller
{
    public function index(Request $request)
    {
        $query = Course::with('instructor');

        if ($request->has('instructor_id')) {
            $query->where('instructor_id', $request->input('instructor_id'));
        }

        $courses = $query->latest()->get();

        return CourseResource::collection($courses);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title'         => 'required|string|max:255|unique:courses',
            'description'   => 'required|string',
            'instructor_id' => 'required|string|exists:instructors,_id',
            'category'      => 'required|string',
            'capacity'      => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $instructor = Instructor::find($request->input('instructor_id'));

        if ($instructor->specialty !== $request->input('category')) {
            return response()->json([
                'errors' => [
                    'category' => ["Bu eğitmen sadece '{$instructor->specialty}' alanında ders verebilir."]
                ]
            ], 422);
        }

        $validatedData = $validator->validated();
        $validatedData['enrolled_students'] = 0;

        $course = Course::create($validatedData);

        return new CourseResource($course->load('instructor'));
    }

    public function show(Course $course)
    {
        return new CourseResource($course->load('instructor'));
    }

    public function update(Request $request, $id)
{
    $course = Course::find($id);
    if (!$course) {
        return response()->json(['error' => 'Ders bulunamadı.'], 404);
    }

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

    // Eğitmen ve kategori kontrolü (zorunlu değilse kaldırabilirsin)
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
    return new CourseResource($course->load('instructor'));
}


    public function destroy($id)
{
    $course = Course::find($id);
    if (!$course) {
        return response()->json(['error' => 'Ders bulunamadı.'], 404);
    }

    Enrollment::where('course_id', $course->id)->delete();
    $course->delete();

    return response()->json(['message' => 'Kurs başarıyla silindi.']);
}

}
