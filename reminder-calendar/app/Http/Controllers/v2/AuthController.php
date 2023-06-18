<?php

namespace App\Http\Controllers\v2;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Mail\UserVerification;
use App\Models\Calendar;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    //
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users,email',
            'name' => 'required',
            'phone' => 'required|unique:users,phone',
            'password' => 'required|min:6|confirmed'
        ]);
        
        if($validator->fails()){
            return response()->json($validator->errors(),400);
        }
        $defaultAvatar = 'default.png';
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'image' => $defaultAvatar,
            'is_admin' => 0,
        ]);
        $calendar = new Calendar();
        $calendar->user_id = $user->id;
        $calendar->name = $user->name;
        $calendar->color = '#0d6efd';
        $calendar->save();
        if($user) {
            try{
                Mail::mailer('smtp')->to($user->email)->send(new UserVerification($user));

                return response()->json(
                    [
                        'message' => 'Register successfull, verify your email address to login',
                    ], 200
                );
            } catch (\Exception $err){

                return response()->json(
                    [
                        'message' => 'Could not send email verification, please try again',
                    ], 500
                );
            }
        }
    }

    //login
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'email' => 'required|email|string',
            'password' => 'required|string|min:6'
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(),400);
        }
        
        $user = User::where('email', $request->email)->first();
        if(!$user){
            return response()->json(['email' => 'Email does not exists'], 400);
        }
        if(!Hash::check($request->password, $user->password, [])){
            return response()->json(['password' => 'Wrong password'], 400);
        }

        $credentials = $request->only('email', 'password');

        // Generate a JWT token
        $token = JWTAuth::attempt($credentials);

        // Return the token as a response
        return $this->respondWithToken($token);
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'message' => 'Login successfull in v2',
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
        ]);
    }
}
