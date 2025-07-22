<?php
namespace App\Http\Controllers;

use App\Models\Instructor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Enrollment;


class InstructorController extends Controller
{
    public function index()
    {
        return response()->json(Instructor::all());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'specialty' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $instructor = Instructor::create($validator->validated());
        return response()->json($instructor, 201);
    }
}