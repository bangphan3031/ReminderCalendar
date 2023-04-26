@extends('app')
<style>
    .divider:after,
    .divider:before {
    content: "";
    flex: 1;
    height: 1px;
    background: #eee;
    }
    .h-custom {
    height: calc(100% - 73px);
    }
    @media (max-width: 450px) {
    .h-custom {
    height: 100%;
    }
}
</style>
@csrf
<section class="vh-100">
<div class="container-fluid h-custom">
    <div class="row d-flex justify-content-center align-items-center h-100">
    <div class="col-md-9 col-lg-6 col-xl-5">
        <img src="/uploads/calendarbanner5.png" class="img-fluid">
    </div>
    <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
        <form method="POST" action="{{ route('login') }}">
        <div class="d-flex flex-row align-items-center justify-content-center">
            <p class="lead fw-normal mb-0 me-3">Sign in with</p>
            <a href="{{ route('loginGoogle') }}" class="btn btn-danger btn-floating mx-1">
            <i class="bi bi-google"></i>
            </a>
        </div>

        <div class="divider d-flex align-items-center my-4">
            <p class="text-center fw-bold mx-3 mb-0">Or</p>
        </div>

        <!-- Email input -->
        <div class="form-outline mb-4">
            <input type="email" id="form3Example3" name="email" class="form-control form-control-lg"
            placeholder="Enter a valid email address" />
            <label class="form-label" for="form3Example3">Email address</label>
        </div>

        <!-- Password input -->
        <div class="form-outline mb-3">
            <input type="password" id="form3Example4" name="password" class="form-control form-control-lg"
            placeholder="Enter password" />
            <label class="form-label" for="form3Example4">Password</label>
        </div>

        <div class="d-flex justify-content-between align-items-center">
            <!-- Checkbox -->
            <div class="form-check mb-0">
            <input class="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
            <label class="form-check-label" for="form2Example3">
                Remember me
            </label>
            </div>
            <a href="#!" class="text-body">Forgot password?</a>
        </div>

        <div class="text-center text-lg-start mt-4 pt-2">
            <button type="submit" class="btn btn-primary btn-lg"
            style="padding-left: 2.5rem; padding-right: 2.5rem;">Login</button>
            <p class="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <a href="{{route('register.page')}}"
                class="link-danger">Register</a></p>
        </div>

        </form>
    </div>
    </div>
</div>
</section>
@if (session('message'))
    <div class="alert alert-danger mt-3">
        {{ session('message') }}
    </div>
@endif