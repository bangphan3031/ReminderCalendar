<?php

namespace App\Http\Controllers;

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
