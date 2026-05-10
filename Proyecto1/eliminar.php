<?php

include("conexion.php");

$id = $_POST['id'];

$sql = "DELETE FROM usuario WHERE id = '$id'";

if ($conn->query($sql) === TRUE) {
    echo "Usuario eliminado correctamente";
} else {
    echo "Error al eliminar usuario";
}

$conn->close();

?>