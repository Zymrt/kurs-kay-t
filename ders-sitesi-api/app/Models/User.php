<?php

namespace App\Models;

// Gerekli sınıfları ve arayüzleri 'use' ile çağırıyoruz
use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject; // JWT için en önemli kısım bu

class User extends Model implements AuthenticatableContract, JWTSubject
{
    // Authenticatable ve Notifiable 'trait'lerini kullanıyoruz
    use Authenticatable, Notifiable;

    /**
     * Veritabanı bağlantısı.
     */
    protected $connection = 'mongodb';

    /**
     * Modelin ilişkili olduğu koleksiyon.
     */
    protected $collection = 'users';

    /**
     * Toplu atama ile doldurulabilir alanlar.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
    ];

    /**
     * JSON'a çevrilirken gizlenmesi gereken alanlar.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Otomatik tip dönüşümü yapılacak alanlar.
     */
    protected $casts = [
        'is_admin' => 'boolean',
        'password' => 'hashed', // Şifrenin otomatik hash'lenmesini sağlar
    ];

    // --- JWT İÇİN ZORUNLU METODLAR ---

    /**
     * JWT (JSON Web Token) için kullanıcı kimliğini (subject claim) alır.
     * Bu genellikle kullanıcının birincil anahtarıdır (primary key).
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * JWT token'ına eklenecek özel 'claim'leri (ek bilgileri) döndürür.
     * Boş bir dizi döndürmek, ekstra bir bilgi eklenmeyeceği anlamına gelir.
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
}