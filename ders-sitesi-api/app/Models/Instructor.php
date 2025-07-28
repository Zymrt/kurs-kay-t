<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;

class Instructor extends Model
{
    use HasFactory;

    /**
     * Veritabanı bağlantısı.
     * @var string
     */
    protected $connection = 'mongodb';

    /**
     * Modelin ilişkili olduğu koleksiyon.
     * @var string
     */
    protected $collection = 'instructors';

    /**
     * Toplu atama ile doldurulabilir alanlar.
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'specialty',
        'bio', // Gelecekte ekleyebileceğin biyografi alanı için şimdiden ekleyebiliriz.
    ];
    
    /**
     * --- YENİ EKLENEN KISIM ---
     * 
     * Bu eğitmenin verdiği tüm dersleri getiren ilişkiyi tanımlar.
     * Bu, "bir eğitmenin birden çok dersi vardır" (hasMany) ilişkisidir.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function courses()
    {
        // Instructor modeli, Course modeline 'instructor_id' alanı üzerinden bağlıdır.
        return $this->hasMany(Course::class, 'instructor_id');
    }
}