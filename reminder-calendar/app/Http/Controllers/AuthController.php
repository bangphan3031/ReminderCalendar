<?php

namespace App\Http\Controllers;

use App\Models\Calendar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
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
            'email' => 'email|required|unique:users,email',
            'name' => 'required',
            'phone' => 'required|unique:users,phone',
            'password' => 'required|min:6|confirmed'
        ]);
        
        if($validator->fails()){
            return response()->json($validator->errors(),400);
        }
        
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'is_admin' => 0,
        ]);
        $calendar = new Calendar();
        $calendar->user_id = $user->id;
        $calendar->name = $user->name;
        $calendar->color = 'blue';
        $calendar->save();

        $credential = $request->only('email', 'password');

        // Generate a JWT token
        $token = JWTAuth::attempt($credential);

        return response()->json(
            [
                'message' => 'Register successfull',
                'token' => $token,
            ],
            200
        );
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
            return response()->json(['error' => 'Email does not exists'], 400);
        }
        if(!Hash::check($request->password, $user->password, [])){
            return response()->json(['error' => 'Wrong password'], 400);
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
    
}