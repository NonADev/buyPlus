<?php
header('Content-Type: charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
$conn = new mysqli('localhost', 'root', '', 'buyPlus');
 
$request = $_SERVER['REQUEST_METHOD'] == 'GET' ? $_GET : $_POST;

 
switch ($request['acao']) {
	case "itensLista":
		$idLista = $_POST['idLista'];
		$sql = "select * from item where fk_lista = $idLista";		
		$resultSet = mysqli_query($conn, $sql);
		$returnVetor = Array();
		while($rr = mysqli_fetch_assoc($resultSet)){
			$returnVetor[] = array_map('utf8_encode', $rr); 			
		}
		echo json_encode($returnVetor, JSON_UNESCAPED_UNICODE);		
		//else echo("#server::NoItens");
	break;
	case "debug":			
		$sql = "SELECT * FROM lista";
		$rr = mysqli_query($conn, $sql);
		$rrr;
		while($rrr = mysqli_fetch_array($rr)){
			echo utf8_encode($rrr[1]);
		}
		echo 'iai';
		echo "num vai dar nao";
	break;
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
		$idUser = utf8_decode($_POST['id']);
		$nomeLista = utf8_decode($_POST['nome']);
		$categoriaLista = utf8_decode($_POST['categoria']);
		
		$sql = "INSERT INTO lista (nome, categoria, fk_usuario) VALUES ('$nomeLista', '$categoriaLista', '$idUser')";
		if($conn->query($sql)){
			if($temItems==false){
				echo json_encode("##server:nãoTeveItens;-;",  JSON_UNESCAPED_UNICODE);
			}
			else{
				/*if(){
					$sqlIten = "INSERT INTO item (nome, marca, preco, qtdMinimaAtacado, tipo) VALUES ()";
				}
				echo json_encode('##server::ListaSalva>$sql');	*/
				//echo json_encode(count($items));/*count($items)*/
				$allItems=Array();
				$fk_lista = mysqli_insert_id($conn);
				for($i=0;$i<count($items);$i++){
					$iNome = utf8_decode($items[$i][0]);
					$iNome = "'".$iNome."'";
					$iMarca = $items[$i][1];
					if($iMarca==""){
						$iMarca = "''";
					}
					$iPreco = $items[$i][2];
					if($iPreco==""){
						$iPreco = 0;
					}
					$iQtd = $items[$i][3];
					if($iQtd==""){
						$iQtd = 0;
					}				
					$iTipo = $items[$i][4];
					if($iTipo==""){
						$iTipo = "''";
					}
					$sqlIten = "INSERT INTO item (nome, marca, preco, qtdMinimaAtacado, tipo, fk_lista) VALUES ($iNome,$iMarca,$iPreco,$iQtd,$iTipo,$fk_lista)";	
					if($conn->query($sqlIten)){
						$allItems[$i]=$sqlIten;
					}
				}
				echo json_encode($allItems, JSON_UNESCAPED_UNICODE);	
			}
		}
		else{
			echo json_encode('##server::ListError>$sql', JSON_UNESCAPED_UNICODE);				
		}
		
		
	break;
	case "debugando";
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
		echo json_encode($vetor, JSON_UNESCAPED_UNICODE);
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
		echo json_encode($vetor, JSON_UNESCAPED_UNICODE);
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
		echo json_encode($arr, JSON_UNESCAPED_UNICODE);		
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
		echo json_encode($arr, JSON_UNESCAPED_UNICODE);		
	break;
	/* ----------------------------- */
}
?>