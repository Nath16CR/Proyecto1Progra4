<?php

// Datos de conexión a la base de datos
$servidor = "localhost";
$usuario = "root";
$password = "626177"; // Cambien por su contraseña de MySQL
$basedatos = "proy_crud";

// Crear conexión
$conn = new mysqli($servidor, $usuario, $password, $basedatos);

// Verificar conexión
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión: " . $conn->connect_error]);
    exit();
}

// Establecer charset UTF-8 para evitar problemas con caracteres especiales
$conn->set_charset("utf8");

?>