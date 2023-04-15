<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendee;
use Illuminate\Http\Request;


class AttendeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Hien thi thong tin tat ca attendee
        $attendee = Attendee::all();
        return response()->json($attendee);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //Tao moi attendee
        $attendee = new Attendee();
        $attendee->event_id = $request->input('event_id');
        $attendee->user_id = $request->input('user_id');
        $attendee->save();
        return response()->json([
            'message' => 'attendee created',
            'data' => $attendee,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //Hien thi thong tin attendee theo id
        $attendee = Attendee::findOrFail($id);
        return response()->json($attendee);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //Cap nhat attendee theo id
        $attendee = Attendee::findOrFail($id);
        $attendee->event_id = $request->input('event_id');
        $attendee->user_id = $request->input('user_id');
        $attendee->save();
        return response()->json([
            'message' => 'attendee updated',
            'data' => $attendee,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //Xoa attendee theo id
        $attendee = Attendee::findOrFail($id);
        //Xoa mem
        $attendee->delete();
        //Xoa cung
        //$calendar->forceDelete();
        return response()->json(['message' => 'attendee deleted']);
    }
}
