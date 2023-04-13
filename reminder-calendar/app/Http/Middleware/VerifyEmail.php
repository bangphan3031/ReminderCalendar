<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyEmail
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // if (!$request->user() || !$request->user()->hasVerifiedEmail()) {
        //     return response()->json(['error' => 'Please verify your email address.'], 403);
        // }

        $user = User::where('email', $request->email)->first();
        if($user->email_verified_at == null){
            return response()->json(['error' => 'Your email address is not verified.'], 401);
        }
    
        return $next($request);
    }
}
