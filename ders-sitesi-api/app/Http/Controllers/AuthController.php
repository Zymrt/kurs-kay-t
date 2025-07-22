<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth; // <-- BURASI
use App\Models\Enrollment;
use App\Http\Controllers\AuthController;



class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => bcrypt($request->password),
            'is_admin' => false
        ]);

        $token = JWTAuth::fromUser($user); // 🟢 Artık çalışır

        return response()->json([
            'message' => 'Kayıt başarılı',
            'user'    => $user,
            'token'   => $token
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only(['email', 'password']);

        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Geçersiz giriş bilgileri'], 401);
        }

        $user = auth()->user();

        return response()->json([
            'message' => 'Giriş başarılı',
            'user'    => [
                'id'       => $user->_id,
                'name'     => $user->name,
                'email'    => $user->email,
                'is_admin' => $user->is_admin
            ],
            'token'   => $token
        ]);
    }

    public function logout()
    {
        Auth::guard('api')->logout();
        return response()->json(['message' => 'User successfully signed out']);
    }

    public function me()
    {
        return response()->json(['message' => 'me endpoint working']);
    }
}
