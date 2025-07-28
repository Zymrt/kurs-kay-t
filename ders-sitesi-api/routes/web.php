<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// routes/web.php
Route::get('/check-mongo', function () {
    if (extension_loaded('mongodb')) {
        return 'MongoDB sürücüsü YÜKLÜ ve AKTİF.';
    } else {
        return 'HATA: MongoDB sürücüsü bulunamadı!';
    }
});