<?php
header('Content-Type: charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
$conn = new mysqli('localhost', 'root', '', 'buyPlus');
 
$request = $_SERVER['REQUEST_METHOD'] == 'GET' ? $_GET : $_POST;

 
switch ($request['acao']) {
	case "deleteParticipacao":
		$idEvento = utf8_decode($_POST['idEvento']);
		$idUsuario = utf8_decode($_POST['idUsuario']);
		$sql = "delete from participacaoEvento where fk_evento = $idEvento AND fk_usuario = $idUsuario";
		if($conn->query($sql)){
			echo json_encode("##server::sucessEventParticipationDelete", JSON_UNESCAPED_UNICODE);		
		}
		else{
			echo json_encode("##server::errorEventParticipationDelete", JSON_UNESCAPED_UNICODE);					
		}
	break;
	case "itensLista":
		$idLista = $_POST['idLista'];
		$sql = "select * from item where fk_lista = $idLista";		
		$resultSet = mysqli_query($conn, $sql);
		$returnVetor = Array();
		if(isset($returnVetor)){
			while($rr = mysqli_fetch_assoc($resultSet)){
				$returnVetor[] = array_map('utf8_encode', $rr); 			
			}
			echo json_encode($returnVetor, JSON_UNESCAPED_UNICODE);		
		}
		else{			
			echo json_encode("#server::NoItens", JSON_UNESCAPED_UNICODE);
		}
	break;
	case "participacoesById":
		$pk = utf8_decode($_POST['id']);
		$sql = "select (select nome from evento where pk_id = ll.fk_evento) as nome, pk_id, (select pk_id from evento where pk_id = ll.fk_evento) as pk_idEvento, (select fk_lista from evento where pk_id = ll.fk_evento) as fk_lista,(select count(*) from participacaoEvento as l where l.fk_evento = ll.fk_evento) as participacoes, (select nome from evento where pk_id = ll.fk_evento) as nome, (select DATE_FORMAT(dataHora, '%d/%m %H:%i') from evento where pk_id = ll.fk_evento) as dataHora, (select (select latitude from mercado where pk_id = evento.fk_mercado) from evento where pk_id = ll.fk_evento) as latitude, (select (select longitude from mercado where pk_id = evento.fk_mercado) from evento where pk_id = ll.fk_evento) as longitude from participacaoEvento as ll where fk_usuario = $pk AND fk_evento > 0";
		//$sql = "select (select nome from evento where pk_id = ll.fk_evento) as nome, (select pk_id from evento where pk_id = ll.fk_evento) as pk_id, (select pk_id from evento where pk_id = ll.fk_evento) as pk_idEvento, (select fk_lista from evento where pk_id = ll.fk_evento) as fk_lista,(select count(*) from participacaoEvento as l where l.fk_evento = ll.fk_evento) as participacoes, (select nome from evento where pk_id = ll.fk_evento) as nome, (select DATE_FORMAT(dataHora, '%d/%m %H:%i') from evento where pk_id = ll.fk_evento) as dataHora, (select (select latitude from mercado where pk_id = evento.fk_mercado) from evento where pk_id = ll.fk_evento) as latitude, (select (select longitude from mercado where pk_id = evento.fk_mercado) from evento where pk_id = ll.fk_evento) as longitude from participacaoEvento as ll where fk_usuario = $pk AND fk_evento > 0";
		$vetor=[];
		if($result = $conn->query($sql)){
			while($rr = mysqli_fetch_assoc($result)){
				$vetor[] = array_map('utf8_encode', $rr);
			}
		}
		else{
			$vetor = "##server::errorParticipacoes";
		}
		echo json_encode($vetor, JSON_UNESCAPED_UNICODE);
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
	case "deleteItem":
		$id = utf8_decode($_POST['id']);
		$sql = "delete from item where pk_id = $id";
		if($conn->query($sql)){
			echo json_encode($id,JSON_UNESCAPED_UNICODE);			
		}
		else{
			echo json_encode("##server::DeleteError>$sql",JSON_UNESCAPED_UNICODE);
		}
	break;
	case "updateUser":
		$id = utf8_decode($_POST['id']);
		$senha = utf8_decode($_POST['senha']);
		$telefone = utf8_decode($_POST['telefone']);
		$nome = utf8_decode($_POST['nome']);
		$sql = "update usuario set nome = '$nome', senha = '$senha', telefone = '$telefone' where pk_id = $id";
		if($conn->query($sql)){
			$vetor['nome'] = $nome;
			$vetor['senha'] = $senha;
			$vetor['id'] = $id;
			$vetor['telefone'] = $telefone;
			echo json_encode($vetor, JSON_UNESCAPED_UNICODE);
		}
		else{
			echo json_encode("##server::userUpdatedError>$sql", JSON_UNESCAPED_UNICODE);
		}
	break;
	case "deleteLista":
		$id = utf8_decode($_POST['id']);
		$sql = "delete from item where fk_lista = $id";
		$vetor=[];
		if($conn->query($sql)){
			$vetor['items'] = true;
			$sql = "delete from lista where pk_id = $id";
			if($conn->query($sql)){
				$vetor['lista'] = true;
				$vetor['id'] = $id;
				echo json_encode($vetor,JSON_UNESCAPED_UNICODE);		
			}	
		}
		else{
			echo json_encode("##server::DeleteError>$sql",JSON_UNESCAPED_UNICODE);
		}			
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
					$iMarca = $items[$i][1];
					$iPreco = $items[$i][2];
					if($iPreco==""){
						$iPreco = 0;
					}
					$iQtd = $items[$i][3];
					if($iQtd==""){
						$iQtd = 0;
					}				
					$iTipo = $items[$i][4];
					$sqlIten = "INSERT INTO item (nome, marca, preco, qtdMinimaAtacado, tipo, fk_lista) VALUES ('$iNome','$iMarca',$iPreco,$iQtd,'$iTipo',$fk_lista)";	
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
	case "debugando":
	break;
	case "createTicket":
		$us = utf8_decode($_POST['fk_user']);;
		$ev = utf8_decode($_POST['fk_evento']);;
		$sql = "insert into participacaoEvento (fk_usuario, fk_evento) values ($us, $ev)";
		$sqlT = "select * from participacaoEvento where fk_usuario = $us && fk_evento = $ev";
		$vetor = [];
		$vetor['result']=false;
		$vetor['msg']="##server::databaseError>$sql";
		if(mysqli_num_rows($conn->query($sqlT))>0){
			$vetor['result']=false;
			$vetor['alert']=true;
			$vetor['msg']="já está participando do evento";
			echo json_encode($vetor, JSON_UNESCAPED_UNICODE);
		}		
		else if($conn->query($sql)){
			$vetor['result']=true;
			$vetor['alert']=true;
			$vetor['msg']="Boas Compras";			
			echo json_encode($vetor, JSON_UNESCAPED_UNICODE);
		}
		else{
			$vetor['result']=false;
			$vetor['alert']=true;
			echo json_encode($vetor, JSON_UNESCAPED_UNICODE);
		}
	break;
	case "getMercados":
		$sql = "select * from mercado";
		$result;		
		if($result = $conn->query($sql)){
			$vetor = [];
			while($ffetch = mysqli_fetch_assoc($result)){
				$vetor[] = array_map('utf8_encode', $ffetch); 
			}
			if(isset($vetor)){
				echo json_encode($vetor, JSON_UNESCAPED_UNICODE);
			}
		}	
		else{
			echo json_encode("##server::listarMercadosError", JSON_UNESCAPED_UNICODE);
		}	
	break;
	case "inserirEvento":		
		$idUsuario= utf8_decode($_POST['idUsuario']);
		$idMercado=  utf8_decode($_POST['idMercado']);
		$idLista= utf8_decode($_POST['idLista']);
		$nome=  utf8_decode($_POST['nome']);
		$dataHora=  utf8_decode($_POST['dataHora']);	
		$sql = "insert into evento (nome, dataHora, fk_lista, fk_mercado) values ('$nome', '$dataHora', $idLista, $idMercado)";
		$vetor=[];
		$vetor['result'] = false;
		$vetor['msg']="##server::clienteNotSaved";
		if($conn->query($sql)){
			$vetor['msg'] = "##server::clienteSaved";
			$vetor['result'] = true;
			echo json_encode($vetor, JSON_UNESCAPED_UNICODE);
		}
		else{
			$vetor['result'] = false;
			echo json_encode($vetor, JSON_UNESCAPED_UNICODE);			
		}
		$mKey = mysqli_insert_id($conn);
		$sql = "insert into participacaoEvento (fk_usuario, fk_evento) values ($idUsuario, $mKey)";
		if($conn->query($sql)){
			//faz nada
		}
	break;
	case "listarEventos":
		$sql = "select pk_id, nome, DATE_FORMAT(dataHora, '%d/%m %H:%i') as dataHora, fk_lista, fk_mercado, (select latitude from mercado where pk_id = evento.fk_mercado) as lat, (select longitude from mercado where pk_id = evento.fk_mercado) as lng, (select usuario.nome from usuario join lista where (lista.pk_id = evento.fk_lista) AND (lista.fk_usuario = usuario.pk_id)) as usuario, (select count(*) from participacaoEvento where fk_evento = evento.pk_id) as participacoes from evento;";
		$result;
		$vetor;
		if($result = $conn->query($sql)){
			while($ffetch = mysqli_fetch_assoc($result)){
				$vetor[] = array_map('utf8_encode', $ffetch); 
			}
			if(isset($vetor)){
				echo json_encode($vetor, JSON_UNESCAPED_UNICODE);
			}
			else{			
				$vetor['result']=false;
				echo json_encode("##server::ERROR", JSON_UNESCAPED_UNICODE);
			}
		}		
		else{
			$vetor['result']=false;
			echo json_encode("##server::listarEventosError", JSON_UNESCAPED_UNICODE);
		}
	break;
	case "oneItem":		
		$idLista = utf8_decode($_POST['idLista']);
		$nomeItem = utf8_decode($_POST['nomeItem']);
		$marcaItem = utf8_decode($_POST['marcaItem']);
		$precoItem = utf8_decode($_POST['precoItem']);
		$qtdItem = utf8_decode($_POST['qtdItem']);
		$tipoItem = utf8_decode($_POST['tipoItem']);
		if($precoItem==""){
			$precoItem = 0;
		}
		if($qtdItem == ""){
			$qtdItem = 0;
		}
		$sql = "INSERT INTO item (fk_lista, nome, marca, preco, qtdMinimaAtacado, tipo) VALUES ($idLista,'$nomeItem','$marcaItem','$precoItem','$qtdItem','$tipoItem')";
		if($conn->query($sql)){
			$idItem = 5;
			$idItem = mysqli_insert_id($conn);
			$vetor['idItem'] = $idItem;
			$vetor['err'] = "##server::oneItemSaved";
			echo json_encode($vetor, JSON_UNESCAPED_UNICODE);
		}
		else{
			echo json_encode("##server::oneItemError", JSON_UNESCAPED_UNICODE);						
		}
	break;
	case "updateItem":
		$idItem = utf8_decode($_POST['idItem']);
		$nomeItem = utf8_decode($_POST['nomeItem']);
		$marcaItem = utf8_decode($_POST['marcaItem']);
		$precoItem = utf8_decode($_POST['precoItem']);
		$qtdItem = utf8_decode($_POST['qtdItem']);
		$tipoItem = utf8_decode($_POST['tipoItem']);	
		$sql="update item set nome = '$nomeItem', marca = '$marcaItem', preco = '$precoItem', qtdMinimaAtacado = '$qtdItem', tipo = '$tipoItem' where pk_id = $idItem";
		if($conn->query($sql)){
			echo json_encode("##server::ItemSaved",JSON_UNESCAPED_UNICODE);
		}
		else{
			echo json_encode("##server::error:$sql",JSON_UNESCAPED_UNICODE);
		}
	break;
	case "updateLista":
		$idLista = utf8_decode($_POST['idLista']);
		$nomeLista = utf8_decode($_POST['nomeLista']);
		$categoriaLista = utf8_decode($_POST['categoriaLista']);
		$sql = "update lista set nome = '$nomeLista', categoria = '$categoriaLista' where pk_id = $idLista";
		if($conn->query($sql)){
			echo json_encode("##server::SucessListUpdate", JSON_UNESCAPED_UNICODE);
		}
		else{		
			echo json_encode("##server::failListUpdate", JSON_UNESCAPED_UNICODE);
		}
	break;
	case "listasById":
		$vetor;
		$iden = addslashes($_POST['id']);
		$qquery = "SELECT * FROM lista where fk_usuario='$iden' order by nome";
		$qquery = "select *,  (select count(*) from item where item.fk_lista = lista.pk_id) as items from lista where lista.fk_usuario = '$iden' order by items desc";
		$qryLista = mysqli_query($conn, $qquery); 
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