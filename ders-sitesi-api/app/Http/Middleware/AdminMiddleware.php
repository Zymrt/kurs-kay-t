<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Gelen isteği işle.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. JWT ile giriş yapmış bir kullanıcı var mı?
        // 2. Ve bu kullanıcının 'is_admin' alanı 'true' mu?
        if (Auth::guard('api')->check() && Auth::guard('api')->user()->is_admin) {
            // Eğer her iki koşul da doğruysa, isteğin devam etmesine izin ver.
            return $next($request);
        }

        // Eğer koşullar sağlanmıyorsa, yetkisiz erişim hatası döndür.
        return response()->json([
            'error' => 'Unauthorized. Bu işlemi yapmak için admin yetkisine sahip olmalısınız.'
        ], 403); // 403 Forbidden, bu durum için 401'den daha doğru bir koddur.
    }
}