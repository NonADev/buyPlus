DROP DATABASE IF EXISTS buyPlus;
CREATE DATABASE IF NOT EXISTS buyPlus;
USE buyPlus;
CREATE TABLE usuario(
	pk_id INT AUTO_INCREMENT PRIMARY KEY,
	nome NVARCHAR(50) NOT NULL,
    email NVARCHAR(50) NOT NULL UNIQUE,
    telefone NVARCHAR(50) NOT NULL UNIQUE, 
    senha NVARCHAR(50) NOT NULL
);
CREATE TABLE admUSer(
	pk_id INT AUTO_INCREMENT PRIMARY KEY,
    fk_usuario INT NOT NULL REFERENCES usuario(pk_id)
);
CREATE TABLE lista(
	pk_id INT AUTO_INCREMENT PRIMARY KEY,
    nome NVARCHAR(45) NOT NULL,
    categoria NVARCHAR(45),
    fk_usuario INT NOT NULL REFERENCES usuario(pk_id)
);
CREATE TABLE item(
	pk_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(45) NOT NULL,
    marca VARCHAR(45),
    preco DOUBLE,
    qtdMinimaAtacado DOUBLE,
    tipo NVARCHAR(45),
    fk_lista INT NOT NULL REFERENCES lista(pk_id)
);
CREATE TABLE mercado(
	pk_id INT AUTO_INCREMENT PRIMARY KEY,
	nome NVARCHAR(45) NOT NULL,
    telefone NVARCHAR(20) NOT NULL,
    latitude DOUBLE,
    longitude DOUBLE
);
CREATE TABLE evento(
	pk_id INT AUTO_INCREMENT PRIMARY KEY,
	nome NVARCHAR(45) NOT NULL,
    dataHora DATETIME NOT NULL,
    fk_lista INT NOT NULL REFERENCES lista(pk_id),
    fk_mercado INT NOT NULL REFERENCES mercado(pk_id)
);
CREATE TABLE participacaoEvento(
	pk_id INT AUTO_INCREMENT PRIMARY KEY,
    fk_usuario INT NOT NULL REFERENCES usuario(pk_id),
    fk_evento INT NOT NULL REFERENCES evento(pk_id)
);
