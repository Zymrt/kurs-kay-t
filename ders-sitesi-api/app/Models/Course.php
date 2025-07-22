<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model; 

class Course extends Model
{
    use HasFactory;

    protected $connection = 'mongodb';
    protected $collection = 'courses';

    protected $fillable = [
        'title',
        'description',
        'instructor_id', 
        'category',
        'capacity',
        'enrolled_students',
    ];

    
    public function instructor()
    {
        return $this->belongsTo(Instructor::class, 'instructor_id');
    }


    public function isFull(): bool
    {
        return $this->enrolled_students >= $this->capacity;
    }
}