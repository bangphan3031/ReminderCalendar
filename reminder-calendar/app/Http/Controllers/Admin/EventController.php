<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Hien thi thong tin tat ca event
        $event = Event::all();
        return response()->json($event);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //Tao moi event
        $event = new Event();
        $event->calendar_id = $request->input('calendar_id');
        $event->title = $request->input('title');
        $event->is_all_day = $request->input('is_all_day');
        $event->start_time = $request->input('start_time');
        $event->end_time = $request->input('end_time');
        $event->location = $request->input('location');
        $event->description = $request->input('description');
        $event->save();
        return response()->json([
            'message' => 'Event created',
            'data' => $event,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //Hien thi thong tin event theo id
        $event = Event::findOrFail($id);
        return response()->json($event);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //Cap nhat event theo id
        $event = Event::findOrFail($id);
        $event->calendar_id = $request->input('calendar_id');
        $event->title = $request->input('title');
        $event->is_all_day = $request->input('is_all_day');
        $event->start_time = $request->input('start_time');
        $event->end_time = $request->input('end_time');
        $event->location = $request->input('location');
        $event->description = $request->input('description');
        $event->status = $request->input('status');
        $event->save();
        return response()->json([
            'message' => 'Event updated',
            'data' => $event,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //Xoa event theo id
        $event = Event::findOrFail($id);
        //Xoa mem
        $event->delete();
        //Xoa cung
        //$calendar->forceDelete();
        return response()->json(['message' => 'Event deleted']);
    }
}
