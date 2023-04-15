<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AttendeePermission;
use Illuminate\Http\Request;

class AttendeePermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Hien thi thong tin tat ca attendee permission
        $attendee_permission = AttendeePermission::all();
        return response()->json($attendee_permission);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //Tao moi attendee permission
        $attendee_permission = new AttendeePermission();
        $attendee_permission->attendee_id = $request->input('attendee_id');
        $attendee_permission->permission = $request->input('permission');
        $attendee_permission->save();
        return response()->json([
            'message' => 'attendee permission created',
            'data' => $attendee_permission,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //Hien thi thong tin attendee permission theo id
        $attendee_permission = AttendeePermission::findOrFail($id);
        return response()->json($attendee_permission);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //Cap nhat attendee permission theo id
        $attendee_permission = AttendeePermission::findOrFail($id);
        $attendee_permission->attendee_id = $request->input('attendee_id');
        $attendee_permission->permission = $request->input('permission');
        $attendee_permission->save();
        return response()->json([
            'message' => 'attendee permission updated',
            'data' => $attendee_permission,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //Xoa attendee permission theo id
        $attendee_permission = AttendeePermission::findOrFail($id);
        //Xoa mem
        $attendee_permission->delete();
        //Xoa cung
        //$calendar->forceDelete();
        return response()->json(['message' => 'attendee permission deleted']);
    }
}
