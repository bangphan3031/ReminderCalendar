<?php

use App\Http\Controllers\AttendeeController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EmailVerificationController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\ReminderController;
use App\Http\Controllers\SendReminderController;
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
Route::post('email/verification-notification', [EmailVerificationController::class, 'sendVerificationEmail']);
Route::get('verify-email/{id}', [EmailVerificationController::class, 'verify'])->name('verification.verify');
Route::post('/login', [AuthController::class, 'login'])->middleware('verified')->name('login');
Route::get('auth/google', [GoogleAuthController::class, 'redirect'])->name('loginGoogle');
Route::get('auth/google/callback', [GoogleAuthController::class, 'callbackGoogle']);


Route::group(['middleware'=>'auth:api'], function($router){
    Route::apiResource('admin/user', 'App\Http\Controllers\Admin\UserController');
    Route::apiResource('admin/calendar', 'App\Http\Controllers\Admin\CalendarController');
    Route::apiResource('admin/event', 'App\Http\Controllers\Admin\EventController');
    Route::apiResource('admin/reminder', 'App\Http\Controllers\Admin\ReminderController');
    Route::apiResource('admin/attendee', 'App\Http\Controllers\Admin\AttendeeController');
    Route::apiResource('admin/attendee-permission', 'App\Http\Controllers\Admin\AttendeePermissionController');
});

Route::group(['middleware'=>'auth:api'], function($router){
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/profile', [UserController::class, 'update']);
    Route::put('/profile/upload', [UserController::class, 'uploadImage']);
    Route::post('/profile/upload', [UserController::class, 'uploadImage']);
    Route::post('/refresh', [AuthController::class, 'refresh']);

    //calendar api
    Route::get('/calendar',[CalendarController::class, 'getCalendar']);
    Route::get('/calendar/{id}',[CalendarController::class, 'showCalendar']);
    Route::put('/calendar/{id}',[CalendarController::class, 'updateCalendar']);
    Route::post('/calendar',[CalendarController::class, 'addCalendar']);
    Route::delete('/calendar/{id}',[CalendarController::class, 'deleteCalendar']);

    //event api
    Route::get('/event/month/{date}', [EventController::class, 'getEventInMonth']);
    Route::get('/event/week/{date}', [EventController::class, 'getEventInWeek']);
    Route::get('/event/day/{date}', [EventController::class, 'getEventInDay']);
    Route::get('/event/calendar/{calendar_id}', [EventController::class, 'getEventWithCalendar']);
    Route::get('event', [EventController::class, 'getAllEvent']);
    Route::get('event/upcoming', [EventController::class, 'getUpcomingEvent']);
    Route::get('event/find/{keyword}', [EventController::class, 'getEventWithTitle']);
    Route::get('/event/{id}', [EventController::class, 'showEvent']);
    Route::post('/event', [EventController::class, 'createEvent']);
    Route::put('/event/{id}', [EventController::class, 'updateEvent']);
    Route::delete('/event/{id}', [EventController::class, 'deleteEvent']);

    //reminder api
    Route::get('/reminder', [ReminderController::class, 'getAllReminder']);
    Route::get('/reminder/{event_id}', [ReminderController::class, 'getReminderWithEvent']);
    Route::post('/reminder/{event_id}', [ReminderController::class, 'createReminder']);
    Route::get('/reminder/show/{id}', [ReminderController::class, 'showReminder']);
    Route::put('/reminder/{event_id}/{id}', [ReminderController::class, 'updateReminder']);
    Route::delete('/reminder/{id}', [ReminderController::class, 'deleteReminder']);

    //attendee api
    Route::get('/attendee', [AttendeeController::class, 'getAllAttendee']);
    Route::get('/attendee/{event_id}', [AttendeeController::class, 'getAttendeeWithEvent']);
    Route::post('/attendee/{event_id}', [AttendeeController::class, 'addAttendee']);
    Route::get('/attendee/show/{id}', [AttendeeController::class, 'showAttendee']);
    //Route::put('attendee/{event_id}/{id}', [ReminderController::class, 'updateReminder']);
    Route::delete('/attendee/{id}', [AttendeeController::class, 'deleteAttendee']);
});
Route::get('/sendReminder/{id}', [SendReminderController::class, 'sendReminder']);

