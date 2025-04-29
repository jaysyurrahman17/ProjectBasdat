<?php
include('db.php'); // Include the database connection

$sql = "SELECT * FROM parameters";
$result = $conn->query($sql);

$parameters = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $parameters[] = $row;
    }
}

echo json_encode($parameters); // Output the data as JSON
?>
