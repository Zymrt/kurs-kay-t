<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;


class Enrollment extends Model
{
    use HasFactory;

    protected $connection = 'mongodb';
    protected $collection = 'enrollments';

    protected $fillable = [
        'user_id',
        'course_id',
        'status', 
    ];

    // Bu kayıt hangi kullanıcıya ait
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Bu kayıt hangi derse ait
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}