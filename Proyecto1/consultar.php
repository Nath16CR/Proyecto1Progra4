<?php

include("conexion.php");

$sql = "SELECT * FROM usuario";
$resultado = $conn->query($sql);

$usuarios = array();

while($fila = $resultado->fetch_assoc()) {
    $usuarios[] = $fila;
}

echo json_encode($usuarios);

$conn->close();

?>