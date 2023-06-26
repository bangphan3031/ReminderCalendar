<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Xác thực email</title>
</head>
<body>
	<div style="max-width: 400px; margin: 0 auto; padding: 30px; background-color: #f5f5f5; border-radius: 2px;">
		<h1 style="text-align: center; font-size: 25px; font-weight: bold; margin-bottom: 20px;">Xác thực email</h1>
		<p>Xin chào {{ $user->name }}</p>
		<p>Vui lòng nhấn vào nút bên dưới để xác thực email của bạn</p>
		<div style="display: flex; justify-content: center; width: 100%; margin-top: 50px;">
			<a href="{{ URL::temporarySignedRoute('verification.verify', now()->addMinute(30), ['id' => $user->id]) }}" style="display: flex; justify-content: center; align-items: center; padding: 10px 20px; font-size: 18px; font-weight: bold; text-align: center; color: #fff; background-color: #2E2E2E; border-radius: 5px; text-decoration: none; width: 100%;">
				<span style="display: inline-block; text-align: center; width: 100%;">Xác thực</span>
			</a>
		</div>
	</div>
</body>
</html>