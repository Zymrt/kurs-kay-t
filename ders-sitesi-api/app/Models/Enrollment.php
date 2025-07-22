<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model; // MongoDB kullanıyorsan bu
// use Illuminate\Database\Eloquent\Model; // SQL kullanıyorsan bunu aktif et

class Enrollment extends Model
{
    protected $connection = 'mongodb'; // MongoDB kullanıyorsan
    protected $collection = 'enrollments'; // Koleksiyon adı

    protected $fillable = [
        'user_id',
        'course_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
