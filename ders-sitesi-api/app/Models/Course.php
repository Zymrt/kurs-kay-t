<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model; // Bu satırın doğru olduğundan emin olun

class Course extends Model
{
    use HasFactory;

    protected $connection = 'mongodb';
    protected $collection = 'courses';

    protected $fillable = [
        'title',
        'description',
        'instructor_id', // İlişki için anahtar alan
        'category',
        'capacity',
        'enrolled_students',
    ];

    /**
     * --- İŞTE EKSİK OLAN VE HATAYI ÇÖZECEK OLAN KISIM ---
     * 
     * Bu fonksiyon, bir dersin hangi eğitmene ait olduğunu tanımlar.
     * Laravel'e "Bu ders, bir eğitmene aittir (belongsTo)" der.
     * 
     * Controller'da with('instructor') yazdığımızda, Laravel bu fonksiyonu çalıştırır.
     */
    public function instructor()
    {
        // Course modeli, Instructor modeline 'instructor_id' alanı üzerinden bağlıdır.
        return $this->belongsTo(Instructor::class, 'instructor_id');
    }

    /**
     * Bu dersin kontenjanının dolu olup olmadığını kontrol eden yardımcı fonksiyon.
     */
    public function isFull(): bool
    {
        return $this->enrolled_students >= $this->capacity;
    }
}