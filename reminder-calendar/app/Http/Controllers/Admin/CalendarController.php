<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Calendar;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Hien thi thong tin tat ca calendar
        $calendars = Calendar::all();
        return response()->json($calendars);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //Tao moi calendar
        $calendar = new Calendar();
        $calendar->user_id = $request->input('user_id');
        $calendar->name = $request->input('name');
        $calendar->description = $request->input('description');
        $calendar->color = $request->input('color');
        $calendar->save();
        return response()->json([
            'message' => 'Calendar created',
            'data' => $calendar,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //Hien thi thong tin calendar theo id
        $calendar = Calendar::findOrFail($id);
        return response()->json($calendar);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //cap nhat calendar theo id
        $calendar = Calendar::findOrFail($id);
        $calendar->user_id = $request->input('user_id');
        $calendar->name = $request->input('name');
        $calendar->description = $request->input('description');
        $calendar->color = $request->input('color');
        $calendar->save();
        return response()->json([
            'message' => 'Calendar updated',
            'data' => $calendar,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //Xoa calendar theo id
        $calendar = Calendar::findOrFail($id);
        //Xoa mem
        $calendar->delete();
        //Xoa cung
        //$calendar->forceDelete();
        return response()->json(['message' => 'Calendar deleted']);
    }
}
