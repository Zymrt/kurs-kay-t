<?php

namespace App\Http\Controllers;

use App\Models\Instructor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InstructorController extends Controller
{
    /**
     * Tüm eğitmenleri listeler.
     * Bu rota genellikle herkese açık olabilir veya sadece adminlerin
     * ders ekleme formunda kullanması için korunabilir. Rota tanımına bağlıdır.
     */
    public function index()
    {
        // Sayfalama, çok sayıda eğitmen olduğunda performansı korur.
        $instructors = Instructor::latest()->paginate(15); 
        return response()->json($instructors);
    }

    /**
     * Yeni bir eğitmen oluşturur. Sadece adminler erişebilir.
     */
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

    /**
     * Belirtilen bir eğitmeni, verdiği derslerle birlikte gösterir.
     */
    public function show(Instructor $instructor) // Route-Model Binding kullanıyoruz
    {
        // Eğitmeni, ilişkili dersleriyle birlikte yükleyip döndürüyoruz.
        return response()->json($instructor->load('courses'));
    }

    /**
     * Mevcut bir eğitmeni günceller. Sadece adminler erişebilir.
     */
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

    /**
     * Bir eğitmeni siler. Sadece adminler erişebilir.
     */
    public function destroy(Instructor $instructor)
    {
        // GÜVENLİK KONTROLÜ: Eğitmenin aktif bir dersi varsa silinmesini engelle.
        if ($instructor->courses()->exists()) {
            return response()->json([
                'error' => 'Bu eğitmen aktif dersler verdiği için silinemez. Lütfen önce derslerini başka bir eğitmene atayın.'
            ], 409); // 409 Conflict - Çakışma durumu
        }

        $instructor->delete();

        return response()->json(['message' => 'Eğitmen başarıyla silindi.'], 200);
    }
}