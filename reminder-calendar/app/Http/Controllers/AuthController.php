<?php

namespace App\Http\Controllers;

use App\Mail\ResetPasswordMail;
use App\Mail\UserVerification;
use App\Models\Calendar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    // public function __construct()
    // {
    //     $this->middleware('auth:', ['except' => ['login','register','refresh']]);
    // }

    //register
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
            'message' => 'Login successfull',
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
        ]);
    }

    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    //Refresh a token.
    public function refresh()
    {
        $currentToken = JWTAuth::getToken();
        $newToken = JWTAuth::refresh($currentToken);

        // Return the new token in a JSON response
        return response()->json([
            'token' => $newToken,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60
        ]);
    }

    public function changePassword(Request $request)
    {
        // Validate request data
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:6',
            'confirm_password' => 'required|same:new_password',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 401);
        }

        $user = User::findOrFail(auth()->user()->id);
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Password changed successfully'], 200);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Email not found'], 404);
        }

        $newPassword = $this->generateRandomPassword();

        $user->password = Hash::make($newPassword);
        $user->save();

        Mail::to($user->email)->send(new ResetPasswordMail($newPassword));

        return response()->json(['message' => 'Password reset email sent'], 200);
    }

    private function generateRandomPassword()
    {
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        $newPassword = '';
        for ($i = 0; $i < 8; $i++) {
            $randomIndex = rand(0, strlen($characters) - 1);
            $newPassword .= $characters[$randomIndex];
        }
        return $newPassword;
    }

}