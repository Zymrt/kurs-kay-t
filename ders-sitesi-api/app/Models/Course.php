<?php

namespace App\Models;

use Illuminate.Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    /**
     * Veritabanı bağlantısı ve koleksiyon adı.
     */
    protected $connection = 'mongodb';
    protected $collection = 'courses';

    /**
     * Toplu atama (mass assignment) ile doldurulabilecek alanlar.
     */
    protected $fillable = [
        'title',
        'description',
        'instructor_id',
        'category',
        'capacity',
        'image_url', // Resim URL'si için de bir alan eklemek iyi bir fikir
    ];
    
    /**
     * JSON'a dönüştürülürken otomatik olarak yüklenecek ilişkiler.
     * Bu sayede her kursla birlikte kayıtlı öğrenci sayısı da gelir.
     */
    protected $withCount = ['enrollments'];


    /**
     * Bu dersin eğitmenini (Instructor) getiren ilişki.
     * Bir ders, bir eğitmene aittir (belongsTo).
     */
    public function instructor()
    {
        return $this->belongsTo(Instructor::class, 'instructor_id');
    }

    /**
     * --- İŞTE HATAYI ÇÖZEN FONKSİYON ---
     * 
     * Bu derse yapılan başvuruları (Enrollment) getiren ilişki.
     * Bir dersin, birden çok başvurusu olabilir (hasMany).
     *
     * Controller'da bir kurs silinirken, Laravel önce bu ilişkiyi kullanarak
     * bağlı tüm başvuruları siler. Bu fonksiyon olmadan,
     * "$course->enrollments()->delete()" gibi bir kod çalışmaz ve hata verir.
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    /**
     * Bu dersin kontenjanının dolu olup olmadığını kontrol eden yardımcı fonksiyon.
     * Not: enrolled_students alanı yerine enrollments_count'u kullanmak daha güvenilirdir.
     */
    public function isFull(): bool
    {
        // withCount sayesinde 'enrollments_count' otomatik olarak gelir.
        return $this->enrollments_count >= $this->capacity;
    }
}