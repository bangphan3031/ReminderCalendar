<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Calendar;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Hien thi thong tin tat ca user
        //return User::all();
        $users = User::all();
        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //Tao moi user
        $user = new User();
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->email_verified_at = now();
        $user->password = Hash::make($request->password);
        $user->phone = $request->input('phone');
        $user->is_admin = 0;
        $user->save();
        $calendar = new Calendar();
        $calendar->user_id = $user->id;
        $calendar->name = $user->name;
        $calendar->color = 'blue';
        $calendar->save();
        return response()->json([
            'message' => 'User created',
            'data' => $user,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //Hien thi thong tin user theo id
        //return User::find($id);
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //Cap nhat thong tin user theo id
        $user = User::findOrFail($id);
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->email_verified_at = now();
        $user->password = Hash::make($request->password);
        $user->phone = $request->input('phone');
        $user->is_admin = 0;
        $user->save();
        return response()->json([
            'message' => 'User updated',
            'data' => $user,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //Xoa thong tin user theo id
        $user = User::findOrFail($id);
        //Xoa mem
        $user->delete();
        //Xoa cung
        //$user->forceDelete();
        return response()->json(['message' => 'User deleted']);
    }
}
