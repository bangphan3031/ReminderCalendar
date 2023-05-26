<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Nhắc nhở công việc</title>
	<style>
		body {
			font-family: Arial, sans-serif;
			margin: 0;
			padding: 0;
		}
		.container {
			max-width: 600px;
			margin: 0 auto;
			padding: 20px;
			background-color: #f7f7f7;
		}
		h1 {
			font-size: 24px;
			font-weight: bold;
			margin-top: 0;
			margin-bottom: 10px;
		}
		.time {
			font-weight: bold;
			color: #444444;
			margin-bottom: 5px;
		}
		.location {
			margin-bottom: 5px;
		}
		.description {
			margin-bottom: 10px;
		}
		.button {
			display: inline-block;
			padding: 10px 20px;
			background-color: #4285f4;
			color: #ffffff;
			text-decoration: none;
			border-radius: 5px;
			font-weight: bold;
		}
		.button:hover {
			background-color: #3367d6;
		}
	</style>
</head>
<body>
	<div class="container">
		<h1>Nhắc nhở công việc</h1>
		<h2>Tiêu đề công việc: {{$title}}</h2>
		<p class="time">Thời gian: Từ {{ $start_time }} đến {{ $end_time }}</p>
		<p class="location">Địa điểm: {{ $location }}</p>
		<p class="description">Mô tả công việc: {{ $description }}</p>
		<a href="#" class="button">Xác nhận</a>
	</div>
</body>
</html>