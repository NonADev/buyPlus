<?php
class lista
{
	public $id;
	public $nome;
	public $fk_usuario;
	public $observacoes;
}
class produto
{
	public $id;
	public $fk_lista;
	public $nome;
	public $marca;
	public $preco;
	public $qtdMinimaAtacado;
}
class evento
{
	public $id;
	public $nome;
	public $datahora;
	public $fk_mercado;
}
class mercado
{
	public $id;
	public $nomeFantasia;
	public $lat;
	public $lon;
}
class usuario
{
	public $id;
	public $nome;
	function setNome($n){
		this.$nome = $n;
	}
	public $email;
	public $telefone;
	public $senha;
}
?>
