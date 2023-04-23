<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;

class EmailVerificationController extends Controller
{
    public function sendVerificationEmail(Request $request)
    {
        if($request->user()->hasVerifiedEmail()){
            return [
                'message' => 'Already verified'
            ];
        }
        $request->user()->sendEmailVerificationNotification();
        return ['status' => 'verification-link-send'];
    }
    public function verify($user_id, Request $request)
    {
        if(!$request->hasValidSignature()) {
            return response()->json(["msg" => "Invalid/Expierd url provider"], 401);
        }
        $user = User::findOrFail($user_id);

        if(!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        } else {
            // return response()->json([
            //     'message' => 'Email already verified'
            // ], 400);
            return redirect()->to('http://localhost:3000/email-verified')->with('fail', 'Email already verified');
        }
        // return response()->json([
        //     'message' => 'Email verified successfully'
        // ], 200);
        return redirect()->to('http://localhost:3000/email-verified')->with('success', 'Email verified successfully');
    }
}
