<?php

namespace App\Http\Controllers;

use App\Models\Attendee;
use App\Models\Calendar;
use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AttendeeController extends Controller
{
    //Lay ra danh sach tat ca attendee theo tung event
    public function getAllAttendee()
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
        $attendee = Attendee::whereIn('event_id', $event_id)->get();
        return response()->json([
            'message' => 'get attendee successful',
            'data' => $attendee,
        ], 200);
    }

    // Show reminder theo event_id
    public function getAttendeeWithEvent(string $event_id)
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
        $attendee = Attendee::where('event_id', $event->id)->get();
        return response()->json([
            'message' => 'get attendee successful',
            'data' => $attendee,
        ], 200);
    }

    // Them attendee vao event
    public function addAttendee(Request $request, string $event_id)
    {
        $validator = Validator::make($request->all(),[
            'user_id' => 'required',
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
        $check_user = User::where('id', $request->user_id)->first();
        if(!$check_user) {
            return response()->json([
                'message' => 'User not exist',
            ], 404);
        }        
        $check_attendee = Attendee::where('event_id', $event->id)->where('user_id', $request->user_id)->first();
        if($check_attendee) {
            return response()->json([
                'message' => 'attendee already exist',
            ], 404);
        }  
        if($user->id == $request->user_id) {
            return response()->json([
                'message' => "You can't attend your own event",
            ], 404);
        }
        $attendee = Attendee::create([
            'event_id' => $event->id,
            'user_id' => $request->user_id,
        ]);
        $attendee_calendar_id = Calendar::where('user_id', $request->user_id)->first();
        $newEvent = Event::create([
            'event_id' => $event_id,
            'calendar_id' => $attendee_calendar_id->id,
            'title' => $event->title,
            'is_all_day' => $event->is_all_day,
            'start_time' => $event->start_time,
            'end_time' => $event->end_time,
            'location' => $event->location,
            'description' => $event->description,
            'status' => 'incomplete',
        ]);
        return response()->json([
            'message' => 'Add attendee successful',
            'data' => $newEvent,
        ], 200);
    }

    // Xoa attendee (xoa mem)
    public function deleteAttendee(string $id)
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

        $attendee = Attendee::whereIn('event_id', $event_id)->find($id);
        if (!$attendee) {
            return response()->json([
                'message' => 'Attendee not found',
            ], 404);
        }
        // Lấy ra id các calendar của user được mời
        $calendarIds = Calendar::where('user_id', $attendee->user_id)->pluck('id')->toArray();
        // Lấy ra event cần xóa
        $event = Event::where('event_id', $attendee->event_id)
                    ->whereIn('calendar_id', $calendarIds)
                    ->first();
        $event->delete();
        $attendee->delete();
        return response()->json(['message' => 'Attendee deleted', 'data' => $attendee]);
    }
}
