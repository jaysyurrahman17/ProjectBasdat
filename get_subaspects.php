<?php
include('db.php'); // Include the database connection

// Query to fetch subaspects along with the chapter details
$sql = "SELECT subaspects.subaspect_name, subaspects.description, chapters.title 
        FROM subaspects 
        JOIN chapters ON subaspects.chapter_id = chapters.id";

$result = $conn->query($sql);

$subaspects = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $subaspects[] = $row;
    }
}

echo json_encode($subaspects); // Output the data as JSON
?>
