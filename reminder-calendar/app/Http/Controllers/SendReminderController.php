<?php

namespace App\Http\Controllers;

use App\Jobs\SendReminderJob;
use App\Mail\ReminderMail;
use App\Models\Attendee;
use App\Models\Calendar;
use App\Models\Event;
use App\Models\Reminder;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;

class SendReminderController extends Controller
{
    //gui nhac nho theo reminder id
    public function sendReminder(string $id)
    {
        $reminder = Reminder::find($id);
        $event = Event::find($reminder->event_id);
        $calendar = Calendar::find($event->calendar_id);
        $user_id = User::where('id', $calendar->user_id)->pluck('id')->toArray();

        //lay ra email de gui nhac nho theo id
        $email = User::whereIn('id', $user_id)->pluck('email')->toArray();
        //lay ra so dien thoai de gui nhac nho theo id
        $phone = User::whereIn('id', $user_id)->pluck('phone')->toArray();

        //lay cac thong tin de gui nhac nho
        $reminder_id = "rmd".$id;
        $title = $event->title;
        $start_time = $event->start_time;
        $end_time = $event->end_time;
        $location = $event->location;
        $description = $event->description;
        $method = $reminder->method;
        $create_user = User::where('id', $calendar->user_id)->first();

        //tinh toan thoi gian gui nhac nho
        $carbon_start_time = Carbon::parse($start_time);
        $carbon_time_to_send = $carbon_start_time->sub($reminder->time, $reminder->kind_of_time);
        $time_to_send = $carbon_time_to_send->format('Y-m-d H:i:s');
        $delay = Carbon::parse(now())->diffInSeconds($time_to_send, false);
        
        if ($method === 'Email' && $reminder->send !== 1) {
            foreach ($email as $e) {
                SendReminderJob::dispatch($e, $title, $start_time, $end_time, $location, $description, $create_user, $reminder_id, $method)
                ->onQueue('send-reminders')
                ->delay($delay);
            }
            $reminder->send = 1;
            $reminder->save();
        }
        if ($method === 'Sms' && $reminder->send !== 1) {
            foreach ($phone as $p) {
                SendReminderJob::dispatch($p, $title, $start_time, $end_time, $location, $description, $create_user, $reminder_id, $method)
                ->onQueue('send-reminders')
                ->delay($delay);
            }
            $reminder->send = 1;
            $reminder->save();
        }
        return response()->json(['message' => 'Set to send reminder successful'], 200);
    }
}
