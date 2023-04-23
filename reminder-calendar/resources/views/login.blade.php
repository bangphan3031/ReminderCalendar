<form method="POST" action="{{ route('login') }}">
    @csrf
    
    <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email" name="email" value="{{ old('email') }}" required>
    </div>
    
    <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" id="password" name="password" required>
    </div>
    
    <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="remember" name="remember">
        <label class="form-check-label" for="remember">Remember me</label>
    </div>
    
    <button type="submit" class="btn btn-primary">Login</button>
    
    <hr>
    
    <div>
        <a href="{{ route('loginGoogle') }}" class="btn btn-google">Login with Google</a>
    </div>
    
    @if (session('message'))
        <div class="alert alert-danger mt-3">
            {{ session('message') }}
        </div>
    @endif
</form>
