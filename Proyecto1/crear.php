<?php

include("conexion.php");

// Verificar que llegaron todos los datos necesarios
if (
    empty($_POST['nombre']) ||
    empty($_POST['apellido']) ||
    empty($_POST['email']) ||
    empty($_POST['clave'])
) {
    echo json_encode(["error" => "Todos los campos son obligatorios"]);
    exit();
}

// Obtener y limpiar los datos
$nombre   = trim($_POST['nombre']);
$apellido = trim($_POST['apellido']);
$email    = trim($_POST['email']);
$clave    = $_POST['clave'];
$rol      = isset($_POST['rol']) ? trim($_POST['rol']) : 'usuario';

// Validar formato de email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["error" => "El email no tiene un formato válido"]);
    exit();
}

// Verificar que el email no esté registrado ya
$checkStmt = $conn->prepare("SELECT id FROM usuario WHERE email = ?");
$checkStmt->bind_param("s", $email);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    echo json_encode(["error" => "El email ya está registrado"]);
    $checkStmt->close();
    exit();
}
$checkStmt->close();

// Hashear la contraseña
$claveHash = password_hash($clave, PASSWORD_BCRYPT);

// Insertar con prepared statement (protección contra SQL injection)
$stmt = $conn->prepare("INSERT INTO usuario (nombre, apellido, email, clave, rol) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $nombre, $apellido, $email, $claveHash, $rol);

if ($stmt->execute()) {
    echo json_encode(["mensaje" => "Usuario creado correctamente"]);
} else {
    echo json_encode(["error" => "Error al crear el usuario"]);
}

$stmt->close();
$conn->close();

?>