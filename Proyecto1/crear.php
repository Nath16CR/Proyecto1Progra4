<?php

include("conexion.php");

$nombre = $_POST['nombre'];
$apellido = $_POST['apellido'];
$email = $_POST['email'];
$clave = $_POST['clave'];

$sql = "INSERT INTO usuario (nombre, apellido, email, clave)
VALUES ('$nombre', '$apellido', '$email', '$clave')";

if ($conn->query($sql) === TRUE) {
    echo "Usuario creado correctamente";
} else {
    echo "Error al crear usuario";
}

$conn->close();

?>