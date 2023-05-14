<?php

namespace App\Http\Controllers;

use App\Models\Attendee;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function profile()
    {
        //hien thi thong tin nguoi dung dang dang nhap
        return response()->json(auth()->user());
    }

    public function getAllUser()
    {
        $users = User::select('id', 'name', 'email')->where('id', '<>', auth()->user()->id)->get();
        return response()->json($users);
    }

    public function getUserWithEventId($event_id)
    {
        $user_id = Attendee::where('event_id', $event_id)->pluck('user_id')->toArray();
        $user = User::select('id', 'name', 'email')->whereIn('id', $user_id)->get();
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        //cap thong tin nguoi dung
        $user = User::findOrFail(auth()->user()->id);
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->phone = $request->input('phone');
        $user->save();

        return response()->json([
            'message' => 'User updated',
            'data' => $user,
        ], 200);
    }
    
    public function uploadImage(Request $request)
    {
        $user = User::findOrFail(auth()->user()->id);
        if($request->has('image')){
            $image = $request->file('image');
            $filename = time() . '.' . $image->getClientOriginalExtension();
            $image->move('uploads/', $filename);
            $user->image = $filename;
            $user->save();
            return response()->json(['image' => asset('uploads/'.$filename)], 200);
        }
    }

}
