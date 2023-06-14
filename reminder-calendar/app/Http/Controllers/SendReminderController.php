<?php

namespace App\Http\Controllers;

use App\Jobs\SendReminderJob;
use App\Mail\InvitationEmail;
use App\Mail\ReminderMail;
use App\Models\Attendee;
use App\Models\Calendar;
use App\Models\Event;
use App\Models\Reminder;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;
use Twilio\Rest\Client;

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

        $allday = $event->is_all_day;
        $start_time = Carbon::parse($event->start_time)->format('d-m-Y');
        $end_time = Carbon::parse($event->end_time)->format('d-m-Y');
        $start_time_hs = Carbon::parse($event->start_time)->format('h:i A');
        $end_time_hs = Carbon::parse($event->end_time)->format('h:i A');

        if ($allday == 1 && $start_time == $end_time) {
            $formattedTime = Carbon::parse($event->start_time)->format('d-m-Y');
        } elseif ($allday == 1 && $start_time != $end_time) {
            $formattedTime = Carbon::parse($event->start_time)->format('d-m-Y') . ' - ' . Carbon::parse($event->end_time)->format('d-m-Y');
        } elseif ($allday == 0 && $start_time == $end_time && $start_time_hs == $end_time_hs) {
            $formattedTime = $start_time . ', ' . Carbon::parse($event->start_time)->format('h:i A');
        } elseif ($allday == 0 && $start_time == $end_time && $start_time_hs != $end_time_hs) {
            $formattedTime = $start_time . ', ' . Carbon::parse($event->start_time)->format('h:i A') . ' - ' . Carbon::parse($event->end_time)->format('h:i A');
        } else {
            $formattedTime = Carbon::parse($event->start_time)->format('d-m-Y, h:i A') . ' - ' . Carbon::parse($event->end_time)->format('d-m-Y, h:i A');
        }

        //lay cac thong tin de gui nhac nho
        $reminder_id = "rmd".$id;
        $title = $event->title;
        $time = $formattedTime;
        $location = $event->location;
        $description = $event->description;
        $method = $reminder->method;
        $create_user = User::where('id', $calendar->user_id)->first();

        //tinh toan thoi gian gui nhac nho
        $carbon_start_time = Carbon::parse($event->start_time);
        $carbon_time_to_send = $carbon_start_time->sub($reminder->time, $reminder->kind_of_time);
        $time_to_send = $carbon_time_to_send->format('Y-m-d H:i:s');
        $delay = Carbon::parse(now())->diffInSeconds($time_to_send, false);
        
        if ($method === 'Email' && $reminder->send !== 1 && $delay >= 0) {
            foreach ($email as $e) {
                SendReminderJob::dispatch($e, $title, $time, $location, $description, $create_user, $reminder_id, $method)
                ->onQueue('send-reminders')
                ->delay($delay);
            }
            $reminder->send = 1;
            $reminder->save();
        }
        if ($method === 'Sms' && $reminder->send !== 1 && $delay >= 0) {
            foreach ($phone as $p) {
                SendReminderJob::dispatch($p, $title, $time, $location, $description, $create_user, $reminder_id, $method)
                ->onQueue('send-reminders')
                ->delay($delay);
            }
            $reminder->send = 1;
            $reminder->save();
        }
        return response()->json(['message' => 'Set to send reminder successful'], 200);
    }

    public function sendInvite(string $id)
    {
        $attendee = Attendee::find($id);
        $event = Event::where('id', $attendee->event_id)->first();
        $user = User::where('id', $attendee->user_id)->first();
        $create_user = $event->calendar->user;
        $email = $user->email;

        // Xử lý format thời gian
        $allday = $event->is_all_day;
        $start_time = Carbon::parse($event->start_time)->format('d-m-Y');
        $end_time = Carbon::parse($event->end_time)->format('d-m-Y');
        $start_time_hs = Carbon::parse($event->start_time)->format('h:i A');
        $end_time_hs = Carbon::parse($event->end_time)->format('h:i A');

        if ($allday == 1 && $start_time == $end_time) {
            $formattedTime = Carbon::parse($event->start_time)->format('d-m-Y');
        } elseif ($allday == 1 && $start_time != $end_time) {
            $formattedTime = Carbon::parse($event->start_time)->format('d-m-Y') . ' - ' . Carbon::parse($event->end_time)->format('d-m-Y');
        } elseif ($allday == 0 && $start_time == $end_time && $start_time_hs == $end_time_hs) {
            $formattedTime = $start_time . ', ' . Carbon::parse($event->start_time)->format('h:i A');
        } elseif ($allday == 0 && $start_time == $end_time && $start_time_hs != $end_time_hs) {
            $formattedTime = $start_time . ', ' . Carbon::parse($event->start_time)->format('h:i A') . ' - ' . Carbon::parse($event->end_time)->format('h:i A');
        } else {
            $formattedTime = Carbon::parse($event->start_time)->format('d-m-Y, h:i A') . ' - ' . Carbon::parse($event->end_time)->format('d-m-Y, h:i A');
        }

        //lay cac thong tin de gui nhac nho
        $title = $event->title;
        $time = $formattedTime;
        $location = $event->location;
        $description = $event->description;
        $create_user = $event->calendar->user->email;

        $invitationEmail = new InvitationEmail($title, $time, $location, $description, $create_user);
        
        Mail::to($email)->send($invitationEmail);
        
        return response()->json(['message' => 'Assigning tasks successful'], 200);
    }

    // public function sendSMSReminder()
    // {
    //     $account_sid = config('services.twilio.sid');
    //     $auth_token = config('services.twilio.auth_token');
    //     $twilio_number = config('services.twilio.phone_number');

    //     $client = new Client($account_sid, $auth_token);
    //     $client->messages->create('+84364911017', [
    //         'from' => $twilio_number, 
    //         'body' => 'test message'
    //     ]);
    // }

}
