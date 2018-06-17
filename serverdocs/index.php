<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
$conn = new mysqli('localhost', 'root', '', 'buyPlus');
 
$request = $_SERVER['REQUEST_METHOD'] == 'GET' ? $_GET : $_POST;

 
switch ($request['acao']) {
	case "saveList":
		$items;
		$temItems;
		if(isset($_POST['itens'])){
			$temItems = true;
		}
		else{
			$temItems = false;
		}
		if($temItems==true){			
			$items = $_POST['itens'];
		}
		$idUser;
		$nomeLista;
		$categoriaLista;		
		$idUser = addslashes($_POST['id']);
		$nomeLista = addslashes($_POST['nome']);
		$categoriaLista = addslashes($_POST['categoria']);

		
		echo json_encode('a');
	break;
	case "listasById":
		$vetor;
		$iden = addslashes($_POST['id']);
		$qryLista = mysqli_query($conn, "SELECT * FROM lista where fk_usuario='$iden' order by categoria");   
		$length = $qryLista->num_rows;
		if($length){
			while($resultado = mysqli_fetch_assoc($qryLista)){
				$vetor[] = array_map('utf8_encode', $resultado); 
			}    			
			$vetor['result']=true;
			$vetor['length'] = $length;
		}
		else{
			$vetor['result']=false;
			$vetor['err']="##server::noResults";
		}
		echo json_encode($vetor);
	break;
	case "usuarios":
		if (mysqli_connect_errno()) trigger_error(mysqli_connect_error());
		
		//Consultando banco de dados
		$vetor;
		$qryLista = mysqli_query($conn, "SELECT * FROM usuario");    
		while($resultado = mysqli_fetch_assoc($qryLista)){
			$vetor[] = array_map('utf8_encode', $resultado); 
		}    
		$arr['result']==true;
		
		//Passando vetor em forma de json
		echo json_encode($vetor);
	break;
	/* ----------------------------- */
	case "login":
		$email = addslashes($_POST['email']);
		$senha = addslashes($_POST['senha']);
		$sql = "SELECT pk_id, nome, email, telefone, senha FROM usuario WHERE email = '$email' && senha = '$senha'";
		$arr = array();	
		$arr['result'] = false;
		$arr['err'] = 'vazio';
		$rr = $conn->query($sql);
		if(mysqli_num_rows($rr)==1){
			$arr['result'] = true;
			$arr['alert'] = false;
			$arr['err'] = '##server::Logado';
			$rowz = mysqli_fetch_row($rr);
			$arr['pk_id'] = $rowz[0];
			$arr['nome'] = $rowz[1];
			$arr['email'] = $rowz[2];
			$arr['telefone'] = $rowz[3];
			$arr['senha'] = $rowz[4];
		} 
		else{
			$arr['result'] = false;
			$arr['alert'] = true;
			$arr['err'] = 'O nome de usuário ou senha está incorreta, ou não existe';			
		}
		echo json_encode($arr);		
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
		$duplicata = $conn->query("SELECT * FROM usuario WHERE email = '$email'");
		$cc = $duplicata->num_rows;
		$duplicata2 = $conn->query("SELECT * FROM usuario WHERE telefone = '$telefone'");
		$cc2 = $duplicata2->num_rows;
		if($cc>0){
			$arr['result'] = false;
			$arr['alert'] = true;
			$arr['err'] = "Email já cadastrado";
		}
		else if($cc2>0){		
			$arr['result'] = false;
			$arr['alert'] = true;
			$arr['err'] = "Telefone já cadastrado";			
		}
		else if ($conn->query($sql)) {			
			$arr['result'] = true;
			$arr['alert'] = false;
			$arr['err'] = "##server::New record created successfully";
		} 
		else {
			$arr['result'] = false;
			$arr['alert'] = true;
			$arr['err'] = "##server::Unknown Error: '$sql'";
		}	
		echo json_encode($arr);		
	break;
	/* ----------------------------- */
}
?>