<?php
include('db.php'); // Include the database connection

$sql = "SELECT * FROM students";
$result = $conn->query($sql);

$students = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $students[] = $row;
    }
}

echo json_encode($students); // Output the data as JSON
?>
