<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EmailVerificationController;
use Laravel\Sanctum\Sanctum;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->middleware('verified');
Route::post('email/verification-notification', [EmailVerificationController::class, 'sendVerificationEmail']);
Route::get('verify-email/{id}/{hash}', [EmailVerificationController::class, 'verify'])->name('verification.verify');


Route::group(['middleware'=>'auth:api'], function($router){
    Route::apiResource('user', 'App\Http\Controllers\Admin\UserController');
    Route::apiResource('calendar', 'App\Http\Controllers\Admin\CalendarController');
    Route::apiResource('event', 'App\Http\Controllers\Admin\EventController');
    Route::apiResource('reminder', 'App\Http\Controllers\Admin\ReminderController');
    Route::apiResource('attendee', 'App\Http\Controllers\Admin\AttendeeController');
    Route::apiResource('attendee-permission', 'App\Http\Controllers\Admin\AttendeePermissionController');
});

Route::group(['middleware'=>'auth:api'], function($router){
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
});



