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
        $users = auth()->user();
        $user = User::findOrFail($users->id);
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->phone = $request->input('phone');
        $user->image = $request->input('image');
        $user->save();

        return response()->json([
            'message' => 'User updated',
            'data' => $user,
        ], 200);
    }

}
