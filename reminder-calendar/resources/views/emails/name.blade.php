<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Xác thực email</title>
</head>
<style>
	.container {
		max-width: 400px;
		margin: 0 auto;
		padding: 30px;
		background-color: #f5f5f5;
		border-radius: 2px;
	}

	h1 {
		text-align: center;
		font-size: 25px;
		font-weight: bold;
		margin-bottom: 20px;
	}

	p {
		font-size: 18px;
		margin-bottom: 20px;
	}

	.button {
		display: flex; 
		justify-content: center;
		padding: 10px 20px;
		font-size: 18px;
		font-weight: bold;
		text-align: center;
		color: #fff;
		background-color: #2E2E2E;
		border-radius: 5px;
		text-decoration: none;
	}

	.button:hover {
		background-color: #1C1C1C;
	}
</style>
<body>
	<div class="container">
		<h1>Xác thực email</h1>
		<p>Xin chào {{ $user->name }}</p>
		<p>Vui lòng nhấn vào nút bên dưới để xác thực email của bạn</p>
		<a href="{{ URL::temporarySignedRoute('verification.verify', now()->addMinute(30), ['id' => $user->id]) }}" class="button button-primary">Xác thực</a>
	</div>
</body>
</html>