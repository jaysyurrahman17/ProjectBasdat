<?php
include('db.php'); // Include the database connection

$sql = "SELECT students.name, chapters.title, nilai.score FROM nilai 
        JOIN students ON nilai.student_id = students.id
        JOIN chapters ON nilai.chapter_id = chapters.id";
$result = $conn->query($sql);

$grades = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $grades[] = $row;
    }
}

echo json_encode($grades); // Output the data as JSON
?>
