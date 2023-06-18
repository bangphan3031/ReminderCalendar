<?php

namespace App\Http\Controllers;

use App\Models\Attendee;
use App\Models\Calendar;
use App\Models\Event;
use App\Models\Reminder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ReminderController extends Controller
{
    //Lay ra danh sach tat ca reminder cuar user dang dang nhap
    public function getAllReminder()
    {
        $user = auth()->user();
        $calendar_id = Calendar::where('user_id', $user->id)->pluck('id')->toArray();
        if (!$calendar_id) {
            return response()->json([
                'message' => 'Calendar not found',
            ], 404);
        }
        $event_id = Event::whereIn('calendar_id', $calendar_id)->pluck('id')->toArray();
        if (!$event_id) {
            return response()->json([
                'message' => 'Event not found',
            ], 404);
        }
        $attendee_id = Attendee::where('user_id', $user->id)->pluck('event_id')->toArray();
        $reminder = Reminder::whereIn('event_id', $event_id)->orWhereIn('event_id', $attendee_id)->get();
        return response()->json([
            'message' => 'get reminder successful',
            'data' => $reminder,
        ], 200);
    }

    // Show reminder theo event_id
    public function getReminderWithEvent(string $event_id)
    {
        $user = auth()->user();
        $calendar_id = Calendar::where('user_id', $user->id)->pluck('id')->toArray();
        if (!$calendar_id) {
            return response()->json([
                'message' => 'Calendar not found',
            ], 404);
        }
        $event = Event::whereIn('calendar_id', $calendar_id)->find($event_id);
        if (!$event) {
            return response()->json([
                'message' => 'Event not found',
            ], 404);
        }
        $reminder = Reminder::where('event_id', $event->id)->get();
        return response()->json([
            'message' => 'get reminder successful',
            'data' => $reminder,
        ], 200);
    }

    // Show reminder theo id
    public function showReminder(string $id)
    {
        $user = auth()->user();
        $calendar_id = Calendar::where('user_id', $user->id)->pluck('id')->toArray();
        if (!$calendar_id) {
            return response()->json([
                'message' => 'Calendar not found',
            ], 404);
        }
        $event_id = Event::whereIn('calendar_id', $calendar_id)->pluck('id')->toArray();
        if (!$event_id) {
            return response()->json([
                'message' => 'Event not found',
            ], 404);
        }
        $reminder = Reminder::whereIn('event_id', $event_id)->find($id);
        if (!$reminder) {
            return response()->json([
                'message' => 'Reminder not found',
            ], 404);
        }
        return response()->json([
            'message' => 'get reminder successful',
            'data' => $reminder,
        ], 200);
    }

    // Tao moi reminder cho event
    public function createReminder(Request $request, string $event_id)
    {
        $validator = Validator::make($request->all(),[
            'method' => 'required|string',
            'time' => 'required',
            'kind_of_time' => 'required',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(),400);
        }

        $user = auth()->user();
        $calendar_id = Calendar::where('user_id', $user->id)->pluck('id')->toArray();
        if (!$calendar_id) {
            return response()->json([
                'message' => 'Calendar not found',
            ], 404);
        }

        $event = Event::whereIn('calendar_id', $calendar_id)->find($event_id);
        if (!$event) {
            return response()->json([
                'message' => 'Event not found',
            ], 404);
        }

        $reminder = Reminder::where([
            'event_id' => $event->id,
            'method' => $request->method,
            'time' => $request->time,
            'kind_of_time' => $request->kind_of_time,
        ])->first();
        
        if ($reminder) {
            return response()->json([
                'message' => 'Reminder already exists',
                'data' => $reminder,
            ], 200);
        }
        
        $reminder = Reminder::create([
            'event_id' => $event->id,
            'method' => $request->method,
            'time' => $request->time,
            'kind_of_time' => $request->kind_of_time,
            'send' => 0
        ]);
        return response()->json([
            'message' => 'Reminder created',
            'data' => $reminder,
        ], 200);
    }

    // Cap nhat reminder cho event theo id
    public function updateReminder(Request $request, string $event_id, string $id)
    {
        $validator = Validator::make($request->all(),[
            'method' => 'required|string',
            'time' => 'required',
            'kind_of_time' => 'required',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(),400);
        }

        $user = auth()->user();
        $calendar_id = Calendar::where('user_id', $user->id)->pluck('id')->toArray();
        if (!$calendar_id) {
            return response()->json([
                'message' => 'Calendar not found',
            ], 404);
        }

        $event = Event::whereIn('calendar_id', $calendar_id)->find($event_id);
        if (!$event) {
            return response()->json([
                'message' => 'Event not found',
            ], 404);
        }

        $reminder = Reminder::where('event_id', $event->id)->find($id);
        if (!$reminder) {
            return response()->json([
                'message' => 'Reminder not found',
            ], 404);
        }
        
        $reminder->event_id = $event->id;
        $reminder->method = $request->method;
        $reminder->time = $request->time;
        $reminder->kind_of_time = $request->kind_of_time;
        $reminder->save();
        return response()->json([
            'message' => 'Reminder update',
            'data' => $reminder,
        ], 200);
    }

    // Xoa reminder (xoa mem)
    public function deleteReminder(string $id)
    {
        $user = auth()->user();
        $calendar_id = Calendar::where('user_id', $user->id)->pluck('id')->toArray();
        if (!$calendar_id) {
            return response()->json([
                'message' => 'Calendar not found',
            ], 404);
        }

        $event_id = Event::whereIn('calendar_id', $calendar_id)->pluck('id')->toArray();
        if (!$event_id) {
            return response()->json([
                'message' => 'Event not found',
            ], 404);
        }

        $reminder = Reminder::whereIn('event_id', $event_id)->find($id);
        if (!$reminder) {
            return response()->json([
                'message' => 'Reminder not found',
            ], 404);
        }

        $reminder_id = "rmd".$id;
        $jobIds = DB::table('jobs')
            ->where('payload', 'like', "%".$reminder_id."%")
            ->pluck('id');
        foreach ($jobIds as $jobId) {
            DB::table('jobs')->where('id', $jobId)->delete();
        }

        $reminder->delete();
        
        return response()->json(['message' => 'Reminder deleted']);
        
    }

}
