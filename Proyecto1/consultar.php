<?php

include("conexion.php");

// Consultar todos los usuarios (sin devolver la clave por seguridad)
$sql = "SELECT id, nombre, apellido, email, rol, created_at FROM usuario";
$resultado = $conn->query($sql);

$usuarios = array();

while ($fila = $resultado->fetch_assoc()) {
    $usuarios[] = $fila;
}

// Devolver los datos como JSON
echo json_encode($usuarios);

$conn->close();

?>