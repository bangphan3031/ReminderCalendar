<?php

namespace App\Http\Controllers;

use App\Models\Calendar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CalendarController extends Controller
{
    //Lay ra danh sach calendar cuar user dang dang nhap
    public function getCalendar()
    {
        $user = auth()->user();
        $calendars = Calendar::where('user_id', $user->id)->select('name', 'color')->get();
        return response()->json([
            'message' => 'get calendar successful',
            'data' => $calendars,
        ], 200);
    }

    //Them moi calendar (user)
    public function addCalendar(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'name' => 'required|string',
            'color' => 'required'
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(),400);
        }
        $user = auth()->user();
        $calendar = Calendar::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'description' => $request->description,
            'color' => $request->color,
        ]);
        return response()->json([
            'message' => 'Calendar created',
            'data' => $calendar,
        ], 200);
    }

    //Show calendar de chinh sua
    public function showCalendar(string $id)
    {
        $user = auth()->user();
        $calendar = Calendar::where('user_id', $user->id)->find($id);
        if(!$calendar) {
            return response()->json([
                'message' => 'Calendar not found',
            ], 404);
        }
        return response()->json([
            'message' => 'Get calendar successful',
            'data' => $calendar,
        ], 200);
    }

    //Chinh sua calendar (user)
    public function updateCalendar(Request $request, string $id)
    {
        $validator = Validator::make($request->all(),[
            'name' => 'required|string',
            'color' => 'required'
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(),400);
        }
        $user = auth()->user();
        $calendar = Calendar::where('user_id', $user->id)->find($id);
        if(!$calendar) {
            return response()->json([
                'message' => 'Calendar not found',
            ], 404);
        }
        $calendar->name = $request->input('name');
        $calendar->description = $request->input('description');
        $calendar->color = $request->input('color');
        $calendar->save();
        return response()->json([
            'message' => 'Calendar updated',
            'data' => $calendar,
        ], 200);
    }

    //Xoa calendar theo id (xoa mem)
    public function deleteCalendar(string $id)
    {
        $user = auth()->user();
        $calendar = Calendar::where('user_id', $user->id)->find($id);
        if(!$calendar){
            return response()->json([
                'message' => 'Calendar not found',
            ], 404);
        }
        $calendar->delete();
        return response()->json(['message' => 'Calendar deleted']);
    }
}
