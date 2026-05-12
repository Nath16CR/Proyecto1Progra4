<?php

include("conexion.php");

// Verificar que llegaron los datos necesarios
if (
    empty($_POST['id']) ||
    empty($_POST['nombre']) ||
    empty($_POST['apellido']) ||
    empty($_POST['email'])
) {
    echo json_encode(["error" => "Todos los campos son obligatorios"]);
    exit();
}

// Obtener y limpiar los datos
$id       = intval($_POST['id']);
$nombre   = trim($_POST['nombre']);
$apellido = trim($_POST['apellido']);
$email    = trim($_POST['email']);
$rol      = isset($_POST['rol']) ? trim($_POST['rol']) : 'usuario';

// Validar formato de email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["error" => "El email no tiene un formato válido"]);
    exit();
}

// Verificar que el email no esté en uso por OTRO usuario
$checkStmt = $conn->prepare("SELECT id FROM usuario WHERE email = ? AND id != ?");
$checkStmt->bind_param("si", $email, $id);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    echo json_encode(["error" => "El email ya está en uso por otro usuario"]);
    $checkStmt->close();
    exit();
}
$checkStmt->close();

// Si viene nueva clave la actualizamos, si no dejamos la actual
if (!empty($_POST['clave'])) {
    $claveHash = password_hash($_POST['clave'], PASSWORD_BCRYPT);
    $stmt = $conn->prepare("UPDATE usuario SET nombre=?, apellido=?, email=?, clave=?, rol=? WHERE id=?");
    $stmt->bind_param("sssssi", $nombre, $apellido, $email, $claveHash, $rol, $id);
} else {
    $stmt = $conn->prepare("UPDATE usuario SET nombre=?, apellido=?, email=?, rol=? WHERE id=?");
    $stmt->bind_param("ssssi", $nombre, $apellido, $email, $rol, $id);
}

if ($stmt->execute()) {
    echo json_encode(["mensaje" => "Usuario actualizado correctamente"]);
} else {
    echo json_encode(["error" => "Error al actualizar el usuario"]);
}

$stmt->close();
$conn->close();

?>