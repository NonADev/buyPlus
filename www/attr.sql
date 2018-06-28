/*INSERT INTO mercado (nome, telefone, latitude, longitude) VALUES ('açai', '49004222', 44.5, -40.0005);
INSERT INTO evento (nome, dataHora, fk_lista, fk_mercado) VALUES('Compras do mês','2018/06/26 14:10',20,1);
INSERT INTO usuario (nome, email, telefone, senha) VALUES ('www', 'asda@gmail.com', '5959595629', 'koakoakoa');*//*
SELECT * FROM evento;
SELECT * FROM participacaoEvento;
SELECT * FROM mercado;
SELECT * FROM lista;
SELECT * FROM item;
SELECT * FROM usuario;
select * from participacaoEvento where fk_usuario = 1 && fk_evento = 9;
INSERT INTO participacaoEvento (fk_usuario, fk_evento) VALUES (1,9);
select nome, DATE_FORMAT(dataHora, "%d/%m %H:%i"), fk_lista, fk_mercado, 
(select latitude from mercado where pk_id = evento.fk_mercado) as lat, 
(select longitude from mercado where pk_id = evento.fk_mercado) as lng, 
(select usuario.nome from usuario join lista 
where (lista.pk_id = evento.fk_lista) AND (lista.fk_usuario = usuario.pk_id)) as usuario from evento;
select pk_id, nome, dataHora, fk_lista, fk_mercado, (select count(*) from participacaoEvento where fk_evento = evento.pk_id) as participantes from evento;
select fk_evento, (select nome from evento where pk_id = participacaoEvento.fk_evento) from participacaoEvento where fk_usuario = 1;
select (select nome from evento where pk_id = ll.fk_evento) as nome,pk_id, (select fk_lista from evento where pk_id = ll.fk_evento) as fk_lista,(select count(*) from participacaoEvento as l where l.fk_evento = ll.fk_evento) as participacoes, (select nome from evento where pk_id = ll.fk_evento) as nome, (select dataHora from evento where pk_id = ll.fk_evento) as dataHora, (select (select latitude from mercado where pk_id = evento.fk_mercado) from evento where pk_id = ll.fk_evento) as latitude, (select (select longitude from mercado where pk_id = evento.fk_mercado) from evento where pk_id = ll.fk_evento) as longitude from participacaoEvento as ll where fk_usuario = 1 AND fk_evento > 0*/
select (select nome from evento where pk_id = ll.fk_evento) as nome,pk_id, (select fk_lista from evento where pk_id = ll.fk_evento) as fk_lista,(select count(*) from participacaoEvento as l where l.fk_evento = ll.fk_evento) as participacoes, (select nome from evento where pk_id = ll.fk_evento) as nome, (select dataHora from evento where pk_id = ll.fk_evento) as dataHora, (select (select latitude from mercado where pk_id = evento.fk_mercado) from evento where pk_id = ll.fk_evento) as latitude, (select (select longitude from mercado where pk_id = evento.fk_mercado) from evento where pk_id = ll.fk_evento) as longitude from participacaoEvento as ll where fk_usuario = 1 AND fk_evento > 0