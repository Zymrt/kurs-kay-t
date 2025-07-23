<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;

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

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'Kayıt başarılı',
            'user'    => $user,
            'token'   => $token
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only(['email', 'password']);

        if (! $token = JWTAuth::attempt($credentials)) {
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
        JWTAuth::invalidate(JWTAuth::getToken()); 
        return response()->json(['message' => 'Başarıyla çıkış yapıldı']);
    }

    public function me()
    {
        return response()->json(auth()->user());
    }
}
