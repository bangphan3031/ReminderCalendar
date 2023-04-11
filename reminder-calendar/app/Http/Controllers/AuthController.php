<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
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
            'email' => 'email|required|string',
            'name' => 'required|string',
            'password' => 'required|string|min:6'
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(),400);
        }

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'is_admin' => 0,
        ]);

        $credential = $request->only('email', 'password');

        // Generate a JWT token
        $verifyToken = JWTAuth::attempt($credential);

        return response()->json(
            [
                'message' => 'Register successfull',
                'verifyToken' => $verifyToken,
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
            return response()->json(['error' => 'Email does not exist'], 401);
        }
        if(!Hash::check($request->password, $user->password, [])){
            return response()->json(['error' => 'Wrong password'], 401);
        }
        if($user->email_verified_at == null){
            return response()->json(['error' => 'Your email address is not verified'], 401);
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
            'access_token' => $token,
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
            'access_token' => $newToken,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60
        ]);
    }

    //get profile
    public function profile()
    {
        return response()->json(auth()->user());
    }
    
}