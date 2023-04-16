<?php

namespace App\Http\Controllers;

use App\Models\Attendee;
use App\Models\Calendar;
use App\Models\Event;
use Carbon\Carbon;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class EventController extends Controller
{
    //Lay danh sach su kien trong thang cua user
    public function getEventInMonth($date)
    {
        $dateTime = new DateTime($date);
        $month = $dateTime->format('m'); // lấy ra ngày
        $year = $dateTime->format('Y'); // lấy ra năm
        // Tạo đối tượng Carbon từ giá trị của tháng và năm
        $startOfMonth = Carbon::createFromDate($year, $month, 1);
        $endOfMonth = Carbon::createFromDate($year, $month, 1)->endOfMonth();

        $user = auth()->user();
        // Lấy ra mảng id của các calendar mà user đã tạo
        $calendar_id = Calendar::where('user_id', $user->id)->pluck('id')->toArray();
        // Lấy ra các sự kiện trong tháng của user
        $events = Event::whereIn('calendar_id', $calendar_id)
            ->whereBetween('start_time', [$startOfMonth, $endOfMonth])
            ->get();

        return response()->json([
            'message' => 'Get events successful',
            'data' => $events,
        ], 200);
    }

    //Lay danh sach su kien trong tuan
    public function getEventInWeek($date)
    {
        $dateTime = new DateTime($date);
        $week = $dateTime->format('W'); // Lấy ra giá trị tuần
        $year = $dateTime->format('Y'); // Lấy ra năm

        // Tạo đối tượng Carbon từ giá trị của tuần và năm
        $startOfWeek = Carbon::createFromDate($year, 1, 1)->setISODate($year, $week);
        $endOfWeek = Carbon::createFromDate($year, 1, 1)->setISODate($year, $week)->endOfWeek();

        $user = auth()->user();
        // Lấy ra mảng id của các calendar mà user đã tạo
        $calendar_id = Calendar::where('user_id', $user->id)->pluck('id')->toArray();
        // Lấy ra các sự kiện trong tuần của user
        $events = Event::whereIn('calendar_id', $calendar_id)
            ->whereBetween('start_time', [$startOfWeek, $endOfWeek])
            ->get();

        return response()->json([
            'message' => 'Get events successful',
            'data' => $events,
        ], 200);
    }

    //Lay danh sach su kien trong ngay
    public function getEventInDay($date)
    {
        $user = auth()->user();
        $calendar_id = Calendar::where('user_id', $user->id)->pluck('id')->toArray();
        $events = Event::whereIn('calendar_id', $calendar_id)
                        ->whereDate('start_time', $date)
                        ->get();
        return response()->json([
            'message' => 'Get events successful',
            'data' => $events,
        ], 200);
    }

    //Lay danh sach cac su kien theo id calendar
    public function getEventWithCalendar(string $calendar_id)
    {
        $user = auth()->user();
        $calendar = Calendar::where('user_id', $user->id)->find($calendar_id);
        if (!$calendar) {
            return response()->json([
                'message' => 'Calendar not found',
            ], 404);
        }
        $events = Event::where('calendar_id', $calendar->id)->get();
        return response()->json([
            'message' => 'Get events successful',
            'data' => $events,
        ], 200);
    }

    // Lay tat ca event cua user
    public function getAllEvent()
    {
        $user = auth()->user();
        $calendar_id = Calendar::where('user_id', $user->id)->pluck('id')->toArray();
        if (!$calendar_id) {
            return response()->json([
                'message' => 'Calendar not found',
            ], 404);
        }
        $event_id = Attendee::where('user_id', $user->id)->pluck('event_id')->toArray();
        $events = Event::whereIn('calendar_id', $calendar_id)->orWhereIn('id', $event_id)->get();
        return response()->json([
            'message' => 'Get events successful',
            'data' => $events,
        ], 200);
    }

    // Lay ra cac su kien sap dien ra (trong vong 3 ngay)
    public function getUpcomingEvent()
    {
        $now = Carbon::now('Asia/Ho_Chi_Minh')->toDateTimeString();
        $now3 = Carbon::now('Asia/Ho_Chi_Minh')->addDays(3)->toDateTimeString();
        $user = auth()->user();
        $calendar_id = Calendar::where('user_id', $user->id)->pluck('id')->toArray();
        if (!$calendar_id) {
            return response()->json([
                'message' => 'Calendar not found',
            ], 404);
        }
        $event_id = Attendee::where('user_id', $user->id)->pluck('event_id')->toArray();
        $events_id = Event::whereIn('calendar_id', $calendar_id)
                        ->orWhereIn('id', $event_id)
                        ->pluck('id')->toArray();
        $events_upcomming = Event::whereIn('id', $events_id)
                                ->where('start_time', '>', $now)
                                ->where('start_time', '<=', $now3)
                                ->orderBy('start_time', 'asc')
                                ->get();
        return response()->json([
            'message' => 'Get events successful',
            'data' => $events_upcomming,
        ], 200);
    }

    //Tim kiem event theo ten
    public function getEventWithTitle($keyword)
    {
        $user = auth()->user();
        $calendar_id = Calendar::where('user_id', $user->id)->pluck('id')->toArray();
        if (!$calendar_id) {
            return response()->json([
                'message' => 'Calendar not found',
            ], 404);
        }
        $event_id = Attendee::where('user_id', $user->id)->pluck('event_id')->toArray();
        $events_id = Event::whereIn('calendar_id', $calendar_id)->orWhereIn('id', $event_id)->pluck('id')->toArray();
        $result = Event::whereIn('id', $events_id)->where('title', 'like', '%'.$keyword.'%')->get();
        return response()->json([
            'message' => 'Get events successful',
            'data' => $result,
        ], 200);
    }


    // Tao moi event
    public function createEvent(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'title' => 'required|string',
            'is_all_day' => 'required',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after_or_equal:start_time'
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(),400);
        }

        $user = auth()->user();
        $calendar = Calendar::where('user_id', $user->id)->find($request->calendar_id);
        if(!$calendar){
            return response()->json([
                'message' => 'Calendar not found',
            ], 404);
        }
        
        $event = Event::create([
            'calendar_id' => $request->calendar_id,
            'title' => $request->title,
            'is_all_day' => $request->is_all_day,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'location' => $request->location,
            'description' => $request->description,
            'status' => 'incomplete',
        ]);
        return response()->json([
            'message' => 'Event created',
            'data' => $event,
        ], 200);
    }

    // Show event theo id
    public function showEvent(string $id)
    {
        $user = auth()->user();
        $calendar_id = Calendar::where('user_id', $user->id)->pluck('id')->toArray();
        if (!$calendar_id) {
            return response()->json([
                'message' => 'Calendar not found',
            ], 404);
        }
        $event = Event::whereIn('calendar_id', $calendar_id)->find($id);
        if(!$event) {
            return response()->json([
                'message' => 'Event not found',
            ], 404);
        }
        return response()->json([
            'message' => 'Get event successful',
            'data' => $event,
        ], 200);
    }

    // Cap nhat event
    public function updateEvent(Request $request, string $id)
    {
        $validator = Validator::make($request->all(),[
            'title' => 'required|string',
            'is_all_day' => 'required',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after_or_equal:start_time'
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(),400);
        }

        $user = auth()->user();
        $calendar = Calendar::where('user_id', $user->id)->find($request->calendar_id);
        if(!$calendar){
            return response()->json([
                'message' => 'Calendar not found',
            ], 404);
        }

        $event = Event::where('calendar_id', $calendar->id)->find($id);
        if(!$calendar) {
            return response()->json([
                'message' => 'Event not found',
            ], 404);
        }
        
        $event->calendar_id = $request->calendar_id;
        $event->title = $request->title;
        $event->is_all_day = $request->is_all_day;
        $event->start_time = $request->start_time;
        $event->end_time = $request->end_time;
        $event->location = $request->location;
        $event->description = $request->description;
        $event->status = $request->status;
        $event->save();
        return response()->json([
            'message' => 'Event updated',
            'data' => $event,
        ], 200);
    }

    // Xoa event (xoa mem)
    public function deleteEvent(string $id)
    {
        $user = auth()->user();
        $calendar_id = Calendar::where('user_id', $user->id)->pluck('id')->toArray();
        if(!$calendar_id){
            return response()->json([
                'message' => 'Calendar not found',
            ], 404);
        }
        $event = Event::whereIn('calendar_id', $calendar_id)->find($id);
        if(!$event){
            return response()->json([
                'message' => 'Event not found',
            ], 404);
        }
        $event->delete();
        return response()->json(['message' => 'Event deleted']);
    }


}
