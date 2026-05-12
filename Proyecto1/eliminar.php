<?php

include("conexion.php");

// Verificar que llegó el id
if (empty($_POST['id'])) {
    echo json_encode(["error" => "El id es obligatorio"]);
    exit();
}

// Obtener el id como entero
$id = intval($_POST['id']);

// Verificar que el usuario existe antes de eliminar
$checkStmt = $conn->prepare("SELECT id FROM usuario WHERE id = ?");
$checkStmt->bind_param("i", $id);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows === 0) {
    echo json_encode(["error" => "El usuario no existe"]);
    $checkStmt->close();
    exit();
}
$checkStmt->close();

// Eliminar con prepared statement
$stmt = $conn->prepare("DELETE FROM usuario WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["mensaje" => "Usuario eliminado correctamente"]);
} else {
    echo json_encode(["error" => "Error al eliminar el usuario"]);
}

$stmt->close();
$conn->close();

?>