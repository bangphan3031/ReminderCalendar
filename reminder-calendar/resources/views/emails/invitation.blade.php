<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Yêu cầu công việc</title>
</head>
<body>
	<div style="max-width: 500px; margin: 0 auto; padding: 30px; background-color: #f5f5f5; border-radius: 2px;">
		<h1 style="font-size: 24px; font-weight: bold; margin-top: 0; margin-bottom: 10px; text-align: center;">Bạn có một công việc cần thực hiện</h1>
		<h2 style="font-size: 18px; font-weight: bold; margin-top: 0; margin-bottom: 5px;">Tiêu đề công việc: {{$title}}</h2>
		<p style="font-weight: bold; color: #444444; margin-bottom: 5px;">Thời gian: {{ $time }}</p>
		<p style="margin-bottom: 5px;">Địa điểm: {{ $location }}</p>
		<p style="margin-bottom: 10px;">Mô tả công việc: {{ $description }}</p>
        <p style="margin-bottom: 0;">Người tạo: {{ $create_user }}</p>
	</div>
</body>
</html>