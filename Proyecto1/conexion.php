<?php

$servidor = "localhost";
$usuario = "root";
$password = "garfieldXD";
$basedatos = "crud_vue";

$conn = new mysqli($servidor, $usuario, $password, $basedatos);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

?>