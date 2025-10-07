<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
   

    /**
     * Yeni bir kullanıcı kaydeder.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // User modelindeki 'hashed' cast'i sayesinde şifre otomatik olarak hash'lenir.
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => $request->password, // bcrypt() veya Hash::make() GEREKMEZ
            'is_admin' => false,
        ]);
        
        // Kullanıcıyı oluşturduktan hemen sonra giriş yaptır ve token'ını al
        $token = Auth::guard('api')->login($user);

        // Standart cevap formatımızı kullanarak başarılı bir cevap döndür
        return $this->respondWithToken($token, 'Kayıt başarılı, giriş yapıldı.');
    }

    /**
     * Kullanıcı girişi yapar ve JWT token'ı döndürür.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $credentials = $validator->validated();

        if (! $token = Auth::guard('api')->attempt($credentials)) {
            return response()->json(['error' => 'Geçersiz giriş bilgileri. Email veya şifre hatalı.'], 401);
        }

        return $this->respondWithToken($token, 'Giriş başarılı.');
    }

    /**
     * Kullanıcı çıkışı yapar (token'ı geçersiz kılar).
     */
    public function logout()
    {
        Auth::guard('api')->logout();
        return response()->json(['message' => 'Başarıyla çıkış yapıldı.']);
    }

    /**
     * Giriş yapmış kullanıcının profil bilgilerini getirir.
     */
    public function me()
    {
        return response()->json(Auth::guard('api')->user());
    }
    
    
    protected function respondWithToken($token, $message = 'İşlem başarılı.')
    {
        return response()->json([
            'message'       => $message,
            'access_token'  => $token,
            'token_type'    => 'bearer',
            'expires_in'    => Auth::guard('api')->factory()->getTTL() * 60,
            'user'          => Auth::guard('api')->user()
        ]);
    }
}