<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Tymon\JWTAuth\Facades\JWTAuth;

class GoogleAuthController extends Controller
{
    
    public function __construct()
    {
        $this->middleware('web');
    }

    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callbackGoogle()
    {
        try {
            $google_user = Socialite::driver('google')->user();
            $user = User::where('email', $google_user->email)->first();
        
            if(!$user){
                $new_user = User::create([
                    'name' => $google_user->getName(),
                    'email' => $google_user->getEmail(),
                    'image' => $google_user->getAvatar(),
                    'google_id' => $google_user->getId(),
                    'password' => \bcrypt('password'), // provide a default password value
                    'phone' => 'null',
                    'is_admin' => 0,
                ]);
        
                // Generate JWT token for new user
                $token = JWTAuth::attempt([
                    'email' => $new_user->email,
                    'password' => 'password',
                ]);            
            } else {
                // Generate JWT token for existing user
                $token = JWTAuth::attempt([
                    'email' => $user->email,
                    'password' => 'password',
                ]);
                return redirect()->to('http://localhost:8000/home');
                return response()->json([
                    'message' => 'Login successful',
                    'access_token' => $token,
                    'token_type' => 'bearer',
                    'expires_in' => JWTAuth::factory()->getTTL() * 60,
                ], 200);
            }
        } catch (\Throwable $th) {
            \dd('Something went wrong!'. $th->getMessage());
        }
    }
}
