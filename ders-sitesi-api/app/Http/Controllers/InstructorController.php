<?php

namespace App\Http\Controllers;

use App\Models\Instructor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InstructorController extends Controller
{
    /**
     * Tüm eğitmenleri listeler.
     */
    public function index()
    {
        
        $instructors = Instructor::latest()->paginate(15); 
        return response()->json($instructors);
    }

    // Sadece adminler erişebilir.

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:instructors',
            'specialty' => 'required|string|max:100',
            'bio' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $instructor = Instructor::create($validator->validated());

        return response()->json([
            'message' => 'Eğitmen başarıyla oluşturuldu.',
            'data' => $instructor
        ], 201);
    }

    public function show(Instructor $instructor) 
    {
        
        return response()->json($instructor->load('courses'));
    }

    public function update(Request $request, Instructor $instructor)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255|unique:instructors,name,'.$instructor->id,
            'specialty' => 'sometimes|string|max:100',
            'bio' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $instructor->update($validator->validated());

        return response()->json([
            'message' => 'Eğitmen bilgileri güncellendi.',
            'data' => $instructor
        ]);
    }

    
    public function destroy(Instructor $instructor)
    {
        if ($instructor->courses()->exists()) {
            return response()->json([
                'error' => 'Bu eğitmen aktif dersler verdiği için silinemez. Lütfen önce derslerini başka bir eğitmene atayın.'
            ], 409);
        }

        $instructor->delete();

        return response()->json(['message' => 'Eğitmen başarıyla silindi.'], 200);
    }
}