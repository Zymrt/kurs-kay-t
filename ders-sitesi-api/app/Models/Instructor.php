<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model; 

class Instructor extends Model
{
    use HasFactory;

   
    protected $connection = 'mongodb';
    protected $collection = 'instructors';

  
    protected $fillable = [
        'name',                  
        'specialty',   
    ];
}