<!-- Form nhập thông tin sự kiện -->
<form>
    <label for="title">Title:</label>
    <input type="text" id="title" name="title"><br>

    <label for="is_all_day">Is all day:</label>
    <input type="checkbox" id="is_all_day" name="is_all_day"><br>

    <label for="start_time">Start time:</label>
    <input type="datetime-local" id="start_time" name="start_time"><br>

    <label for="end_time">End time:</label>
    <input type="datetime-local" id="end_time" name="end_time"><br>

    <label for="location">Location:</label>
    <input type="text" id="location" name="location"><br>

    <input type="submit" value="Submit">
</form>

<script>
    // Bắt sự kiện khi checkbox được thay đổi
    document.getElementById("is_all_day").addEventListener("change", function() {
        // Nếu checkbox được chọn, thay đổi giá trị của thuộc tính "type" của các trường thời gian thành "date"
        if (this.checked) {
            document.getElementById("start_time").type = "date";
            document.getElementById("end_time").type = "date";
        } else {
        // Nếu checkbox không được chọn, thay đổi lại giá trị của thuộc tính "type" thành "datetime-local"
            document.getElementById("start_time").type = "datetime-local";
            document.getElementById("end_time").type = "datetime-local";
        }
    });
</script>