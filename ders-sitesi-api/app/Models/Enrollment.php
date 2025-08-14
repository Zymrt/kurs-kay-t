<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;

    /**
     * Veritabanı bağlantısı ve koleksiyon adı.
     */
    protected $connection = 'mongodb';
    protected $collection = 'enrollments';

    /**
     * Toplu atama ile doldurulabilecek alanlar.
     */
    protected $fillable = [
        'user_id',
        'course_id',
        'status', // Örn: 'pending', 'approved', 'rejected'
    ];

    /**
     * Bu başvurunun hangi kullanıcıya (User) ait olduğunu belirtir.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Bu başvurunun hangi kursa (Course) ait olduğunu belirtir.
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}