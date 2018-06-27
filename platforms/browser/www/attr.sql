/*INSERT INTO mercado (nome, telefone, latitude, longitude) VALUES ('açai', '49004222', 44.5, -40.0005);
INSERT INTO evento (nome, dataHora, fk_lista, fk_mercado) VALUES('Compras do mês','2018/06/26 14:10',20,1);
INSERT INTO usuario (nome, email, telefone, senha) VALUES ('www', 'asda@gmail.com', '5959595629', 'koakoakoa');*/
SELECT * FROM evento;
SELECT * FROM mercado;
SELECT * FROM lista;
SELECT * FROM item;
SELECT * FROM usuario;
select nome, DATE_FORMAT(dataHora, "%d/%m %H:%i"), fk_lista, fk_mercado, 
(select latitude from mercado where pk_id = evento.fk_mercado) as lat, 
(select longitude from mercado where pk_id = evento.fk_mercado) as lng, 
(select usuario.nome from usuario join lista 
where (lista.pk_id = evento.fk_lista) AND (lista.fk_usuario = usuario.pk_id)) as usuario from evento;