<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reminder;
use Illuminate\Http\Request;

class ReminderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Hien thi thong tin tat ca reminder
        $reminder = Reminder::all();
        return response()->json($reminder);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //Tao moi reminder
        $reminder = new Reminder();
        $reminder->event_id = $request->input('event_id');
        $reminder->method = $request->input('method');
        $reminder->time = $request->input('time');
        $reminder->kind_of_time = $request->input('kind_of_time');
        $reminder->save();
        return response()->json([
            'message' => 'Reminder created',
            'data' => $reminder,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //Hien thi thong tin reminder theo id
        $reminder = Reminder::findOrFail($id);
        return response()->json($reminder);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //Cap nhat Reminder theo id
        $reminder = Reminder::findOrFail($id);
        $reminder->event_id = $request->input('event_id');
        $reminder->method = $request->input('method');
        $reminder->time = $request->input('time');
        $reminder->kind_of_time = $request->input('kind_of_time');
        $reminder->save();
        return response()->json([
            'message' => 'Reminder updated',
            'data' => $reminder,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //Xoa Reminder theo id
        $reminder = Reminder::findOrFail($id);
        //Xoa mem
        $reminder->delete();
        //Xoa cung
        //$calendar->forceDelete();
        return response()->json(['message' => 'Reminder deleted']);
    }
}
