<?php

namespace App\Listeners;

use App\Events\UserRegistered;
use App\Models\Calendar;
use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CreateDefaultCalendar
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  UserRegistered  $event
     * @return void
     */
    public function handle(UserRegistered $event)
    {
        $user = $event->user;
        // Tạo calendar mặc định cho user
        $calendar = new Calendar();
        $calendar->name = $user->name;
        $calendar->user_id = $user->id;
        $calendar->save();
    }
}
