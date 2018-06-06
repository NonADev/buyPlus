<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
$conn = new mysqli('localhost', 'root', '', 'buyPlus');
 
$request = $_SERVER['REQUEST_METHOD'] == 'GET' ? $_GET : $_POST;
 
switch ($request['acao']) {
	case "usuarios":
		if (mysqli_connect_errno()) trigger_error(mysqli_connect_error());
		
		//Consultando banco de dados
		$vetor;
		$qryLista = mysqli_query($conn, "SELECT * FROM usuario");    
		while($resultado = mysqli_fetch_assoc($qryLista)){
			$vetor[] = array_map('utf8_encode', $resultado); 
		}    
		
		//Passando vetor em forma de json
		echo json_encode($vetor);
	break;
	/* ----------------------------- */
	case "registrarUsuario":
		$nome = addslashes($_POST['nome']);
		$email = addslashes($_POST['email']);
		$telefone = addslashes($_POST['telefone']);
		$senha = addslashes($_POST['senha']);	
		$sql = "INSERT INTO usuario (nome, email, telefone, senha) VALUES ('$nome', '$email', '$telefone', '$senha')";
		$arr = array();
		$arr['result'] = false;
		$arr['err'] = 'vazio';
		if ($conn->query($sql) === TRUE) {			
			$arr['result'] = true;
			$arr['err'] = "New record created successfully";
		} else {
			$arr['result'] = false;
			$arr['err'] = "Error: '$sql'";
		}	
		echo json_encode($arr);		
	break;
	/* ----------------------------- */
	case "logarUsuario":
		$email = addslashes($_POST['email']);
		$senha = addslashes($_POST['senha']);	
		$qryLista = mysqli_query($conn, "select * from usuarios where usuario = '{$usuario}' and senha = '{$senha}'");    
		if($resultado = mysqli_fetch_assoc($qryLista)){
			$vetor[] = array_map('utf8_encode', $resultado); 			
		}		 
	break;
}
?>