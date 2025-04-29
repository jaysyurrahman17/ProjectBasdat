<?php
include('db.php'); // Include the database connection

$sql = "SELECT * FROM chapters";
$result = $conn->query($sql);

$chapters = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $chapters[] = $row;
    }
}

echo json_encode($chapters); // Output the data as JSON
?>
