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
SELECT * FROM usuario;
SELECT * FROM usuario WHERE email = 'wesley@gmail.com' && senha = 'aionaion'