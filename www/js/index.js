var app = {
	ip: '127.0.0.1',
    db: null,
    varCountTrigger: false,
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
	    this.loginTable();
		this.dbAutoLogin();
        document.getElementById('btnListSalvar').addEventListener('click', this.btnSalvarLista);
        document.getElementById('btnNewItem').addEventListener('click', this.newItem);
        document.getElementById('btnSair').addEventListener('click', this.exitApp);
		document.getElementById('btnManterDados').addEventListener('click', function(){$.mobile.changePage('#pageManterDados')});
        document.getElementById('btnGoToRegister').addEventListener('click', this.goToPageRegister);
        document.getElementById('btnRegisterUser').addEventListener('click', this.dbRegisterUser);
        document.getElementById('btnLogin').addEventListener('click', this.dbMakeLogin);
    },
	
	goToPageRegister: function(){
        $.mobile.changePage("#pageRegister");
	},

    goToPageListas: function(){
	    app.inserirListas();
	    $.mobile.changePage('#pageListas');
    },

    newItem: function(){
	    $('#listaItens').append(
			'<hr>' +
			'<div class="ui-input-text ui-body-inherit ui-corner-all ui-custom ui-shadow-inset">' +
            "<input type='text' placeholder='nome do item *' name='itemNome'>" +
			"</div>" +
			'<div class="ui-input-text ui-body-inherit ui-corner-all ui-custom ui-shadow-inset">' +
            "<input type='text' placeholder='marca' name='itemMarca'>" +
			"</div>" +
			'<div class="ui-input-text ui-body-inherit ui-corner-all ui-custom ui-shadow-inset">' +
            "<input type='text' placeholder='preco' name='itemPreco'>" +
			"</div>" +
			'<div class="ui-input-text ui-body-inherit ui-corner-all ui-custom ui-shadow-inset">' +
            "<input type='text' placeholder='quantidade para atacado' name='itemQtd'>" +
			"</div>" +
			'<div class="ui-input-text ui-body-inherit ui-corner-all ui-custom ui-shadow-inset">' +
            "<input type='text' placeholder='categoria' name='itemTipo'>" +
			"</div>"
			);
    },

    btnSalvarLista: function(){
	    var nomes = new Array();
	    var marcas = new Array();
        var precos = new Array();
        var qtds = new Array();
        var tipos = new Array();
        var items = new Array();
        items.temValor = false;
	    nomes = app.domGetNomesItens();
        marcas = app.domGetMarcasItens();
        precos = app.domGetPrecosItens();
        qtds = app.domGetQtdsItens();
        tipos = app.domGetTiposItens();

        for(var i=0; i<nomes.length;i++){
            if(nomes[i]) {
                items.push(new Array(nomes[i], marcas[i], precos[i], qtds[i], tipos[i]));
                items.temValor = true;
            }
        }
        if(document.getElementById('listName').value!="" && items.temValor == true) {
            var identifier = 'n';
            app.db.transaction(function(tx){
                tx.executeSql("select * from logado", [], function (tx, values){
                    identifier = values.rows[0].pk_id;
                });
            }, function(err){
                console.log(err);
            }, function(){
                $.ajax({
                    type: "POST",
                    url: "http://" + app.ip + "/index.php",
                    data: {
                        acao: 'saveList',
                        id: identifier,
                        nome: document.getElementById('listName').value,
                        categoria: document.getElementById('listCategory').value,
                        itens: items
                    },
                    dataType: "json",
                    success: function (json) {
                        console.log("%c"+json,"color: green;");
                        console.log("client::listaSalva");
                    },
                    error: function (ext) {
                        console.log(ext);
                        console.log("##cliente::SaveListAndItensError");
                    }
                });
                app.goToPageListas();
            });
        }
        else if(document.getElementById('listName').value!="" && items.temValor == false){
            var identifier = 'n';
            app.db.transaction(function(tx){
                tx.executeSql("select * from logado", [], function (tx, values){
                    identifier = values.rows[0].pk_id;
                });
            }, function(err){
                console.log(err);
            }, function(){
                $.ajax({
                    type: "POST",
                    url: "http://" + app.ip + "/index.php",
                    data: {
                        acao: 'saveList',
                        id: identifier,
                        nome: document.getElementById('listName').value,
                        categoria: document.getElementById('listCategory').value
                    },
                    dataType: "json",
                    success: function (json) {
                        console.log(json);
                    },
                    error: function (ext) {
                        console.log(ext);
                    }
                });
            });
        }
        else{
            alert('Nome da Lista Inválida');
        }
        //console.log(items);
    },

    domGetTiposItens: function(){
        var inputTipos = document.getElementsByName('itemTipo');
        var arr = new Array();
        for(var i=0; i<inputTipos.length; i++){
            arr[i]= inputTipos[i].value;
        }
        return arr;
    },

    domGetQtdsItens: function(){
        var inputQtds = document.getElementsByName('itemQtd');
        var arr = new Array();
        for(var i=0; i<inputQtds.length; i++){
            arr[i]= inputQtds[i].value;
        }
        return arr;
    },

    domGetPrecosItens: function(){
        var inputPrecos = document.getElementsByName('itemPreco');
        var arr = new Array();
        for(var i=0; i<inputPrecos.length; i++){
            arr[i]= inputPrecos[i].value;
        }
        return arr;
    },

    domGetMarcasItens: function(){
        var inputMarcas = document.getElementsByName('itemMarca');
        var arr = new Array();
        for(var i=0; i<inputMarcas.length; i++){
            arr[i]= inputMarcas[i].value;
        }
        return arr;
    },

    domGetNomesItens: function(){
        var inputNames = document.getElementsByName('itemNome');
        var arr = new Array();
        for(var i=0; i<inputNames.length; i++){
            arr[i]= inputNames[i].value;
        }
        return arr;
    },

    inserirListas: function(){
	    var vId;
        app.db.transaction(function (tx) {
            tx.executeSql("select * from logado", [], function (tx, result) {
                vId = result.rows[0].pk_id;
            });
        }, function (err) {
            console.log(err);
        }, function() {
            $.ajax({
                type: "POST",
                url: "http://" + app.ip + "/index.php",
                data: {
                    acao: 'listasById',
                    id: vId
                },
                dataType: "json",
                success: function (json) {
					if (json.result == true) {
					    $('#listListas').html("");
						for (var i=0;i<json.length;i++) {
							var button =
                            '<a id="lista' + json[i].pk_id + '" dt-id="'+ json[i].pk_id +'" dt-nome="'+ json[i].nome +'" dt-categoria="'+ json[i].categoria +'" class="ui-btn ui-icon-bullets ui-btn-icon-left" role="button" style="margin: unset;">' +
                                '<span style="float: left; font-weight: bolder;">' + json[i].nome + '</span><br>' +
                                '<span style="font-weight: normal; float: left;">' + json[i].categoria + '</span>' +
                                '<span style="float: right; font-weight: normal;">' + json[i].items + ' items</span>' +
                            '</a>';
							$('#listListas').append(button);
							document.getElementById("lista" + json[i].pk_id).addEventListener('onmousedown', function(e) {
							    alert(e.currentTarget.id);
                            });
							$("#lista" + json[i].pk_id).click(function(e) {
                                var ddados = {id: $(e.currentTarget).attr('dt-id'),nome: $(e.currentTarget).attr('dt-nome'), categoria: $(e.currentTarget).attr('dt-categoria')};
							    var id = e.currentTarget.id.substring(5);
								app.showList(id, ddados);
							});
					    }
					}
                    else {
                        console.log(json.err);
                    }
                },
                error: function (ext) {
                    console.log("##cliente::GetListasError");
                    console.log(ext);
                }
            });
        });
    },

    showList: function(idLista, dados){
	    $.ajax({
            type: "POST",
            url: "http://"+app.ip+"/index.php",
            data: {
                acao: 'itensLista',
                idLista: idLista
            },
            dataType: "json",
            success: function (json) {
                $("#showItens").html("");
                $('#showItens').append(
                    '<a href="#'+ dados.id +'" data-rel="popup" class="ui-btn" style="margin: unset;">' +
                        '<span id="spanNomeLista">'+ dados.nome +'</span><br>' +
                        '<span id="spanCategoriaLista" style="font-weight:normal;">'+ dados.categoria +'</span>' +
                    '</a>'
                );
                if(app.varCountTrigger==false){
                    $('#myPopup').html('').append(
                        '<div id="' + dados.id + '" data-role="popup" data-dismissible="false" data-history="false" >' +
                        '<div data-role="header" data-theme="a">' +
                        '<h1>Atualizar Lista</h1>' +
                        '</div>' +
                        '<div role="main" class="ui-content">' +
                        '<h4 class="ui-title">nome da lista</h4>' +
                        '<input id="txtDataNome" type="text" value="' + dados.nome + '">' +
                        '<h4 class="ui-title">categoria da lista</h4>' +
                        '<input id="txtDataCategoria" type="text" value="' + dados.categoria + '">' +
                        '<a class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back" style="background-color: #9400D3; border-color: #9400D3;">Cancelar</a>' +
                        '<a id="atualizar' + dados.id + '" dt-id="' + dados.id + '" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back" style="background-color: #9400D3; border-color: #9400D3;">Salvar</a>' +
                        '</div>' +
                        '</div>'
                    );
                }
                else
                {
                    $('#myPopup').html('').append(
                        '<div id="' + dados.id + '" data-role="popup" data-dismissible="false" data-history="false" >' +
                        '<div data-role="header" data-theme="a">' +
                        '<h1>Atualizar Lista</h1>' +
                        '</div>' +
                        '<div role="main" class="ui-content">' +
                        '<h4 class="ui-title">nome da lista</h4>' +
                        '<input id="txtDataNome" type="text" value="' + dados.nome + '">' +
                        '<h4 class="ui-title">categoria da lista</h4>' +
                        '<input id="txtDataCategoria" type="text" value="' + dados.categoria + '">' +
                        '<a class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back" style="background-color: #9400D3; border-color: #9400D3;">Cancelar</a>' +
                        '<a id="lista' + dados.id + '" dt-id="' + dados.id + '" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back" style="background-color: #9400D3; border-color: #9400D3;">Salvar</a>' +
                        '</div>' +
                        '</div>'
                    ).trigger('create');
                }
                document.getElementById("lista"+dados.id).addEventListener('click', function(e){
                    var vNome = document.getElementById('txtDataNome').value;
                    var vCategoria = document.getElementById('txtDataCategoria').value;
                    if(vNome==""){
                        alert('nome precisa ser um campo válido');
                    }
                    else{
                        app.atualizarLista($(e.currentTarget).attr('dt-id'), vNome, vCategoria);
                    }
                });
                for(var i=0;i<json.length;i++) {
                    var varMarca;
                    if(json[i].marca == "") varMarca = 'não definido';
                    else varMarca = json[i].marca;
                    $('#showItens').append(
                        '<a href="#i'+ json[i].pk_id +'" data-rel="popup" class="ui-btn ui-icon-tag ui-btn-icon-right" style="margin: unset;">'+
                            '<span id="spanNome'+ json[i].pk_id +'" style="font-weight: bold; float: left;">'+ json[i].nome +'</span><br>'+
                            '<span id="spanMarca'+ json[i].pk_id +'" style="font-weight: normal; float: left;">'+ varMarca +' ◆ </span>'+ '<span style="float: left; font-weight: normal;margin-left: 1vw;"> '+ json[i].qtdMinimaAtacado +'</span>'+
                        '</a>'
                    );
                    if(app.varCountTrigger==false) {
                        $('#myPopup').append(
                            '<div id="i' + json[i].pk_id + '" data-role="popup" data-dismissible="false" data-history="false" >' +
                            '<div data-role="header" data-theme="a">' +
                            '<h1>Atualizar Item</h1>' +
                            '</div>' +
                            '<div role="main" class="ui-content">' +
                            '<h4 class="ui-title">nome do item</h4>' +
                            '<input id="itemNome' + json[i].pk_id + '" type="text" value="' + json[i].nome + '">' +
                            '<h4 class="ui-title">marca do item</h4>' +
                            '<input id="itemMarca' + json[i].pk_id + '" type="text" value="' + json[i].marca + '">' +
                            '<h4 class="ui-title">preco do item</h4>' +
                            '<input id="itemPreco' + json[i].pk_id + '" type="number" value="' + json[i].preco + '">' +
                            '<h4 class="ui-title">tipo do item</h4>' +
                            '<input id="itemTipo' + json[i].pk_id + '" type="text" value="' + json[i].tipo + '">' +
                            '<h4 class="ui-title">quantidade minima para atacado</h4>' +
                            '<input id="itemQtdAtacado' + json[i].pk_id + '" type="number" value="' + json[i].qtdMinimaAtacado + '">' +
                            '<a class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back" style="background-color: #9400D3; border-color: #9400D3;">Cancelar</a>' +
                            '<a id="btnItem' + json[i].pk_id + '" dt-id="' + json[i].pk_id + '" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back" style="background-color: #9400D3; border-color: #9400D3;">Salvar</a>' +
                            '</div>' +
                            '</div>'
                        );
                    }
                    else{
                        //append de cima com .trigger('create');
                        $('#myPopup').append(
                            '<div id="i' + json[i].pk_id + '" data-role="popup" data-dismissible="false" data-history="false" >' +
                            '<div data-role="header" data-theme="a">' +
                            '<h1>Atualizar Item</h1>' +
                            '</div>' +
                            '<div role="main" class="ui-content">' +
                            '<h4 class="ui-title">nome do item</h4>' +
                            '<input id="itemNome' + json[i].pk_id + '" type="text" value="' + json[i].nome + '">' +
                            '<h4 class="ui-title">marca do item</h4>' +
                            '<input id="itemMarca' + json[i].pk_id + '" type="text" value="' + json[i].marca + '">' +
                            '<h4 class="ui-title">preco do item</h4>' +
                            '<input id="itemPreco' + json[i].pk_id + '" type="number" value="' + json[i].preco + '">' +
                            '<h4 class="ui-title">tipo do item</h4>' +
                            '<input id="itemTipo' + json[i].pk_id + '" type="text" value="' + json[i].tipo + '">' +
                            '<h4 class="ui-title">quantidade minima para atacado</h4>' +
                            '<input id="itemQtdAtacado' + json[i].pk_id + '" type="number" value="' + json[i].qtdMinimaAtacado + '">' +
                            '<a class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back" style="background-color: #9400D3; border-color: #9400D3;">Cancelar</a>' +
                            '<a id="btnItem' + json[i].pk_id + '" dt-id="' + json[i].pk_id + '" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back" style="background-color: #9400D3; border-color: #9400D3;">Salvar</a>' +
                            '</div>' +
                            '</div>'
                        ).trigger('create');
                    }
                    document.getElementById('btnItem'+json[i].pk_id).addEventListener('click', function (e) {
                        var idItem = $(e.currentTarget).attr('dt-id');
                        var vvNome = document.getElementById('itemNome'+idItem).value;
                        var vvMarca = document.getElementById('itemMarca'+idItem).value;
                        var vvPreco = document.getElementById('itemPreco'+idItem).value;
                        var vvTipo = document.getElementById('itemTipo'+idItem).value;
                        var vvQtdAtacado = document.getElementById('itemQtdAtacado'+idItem).value;
                        if(vvNome==""){
                            alert("o item precisa de um nome valido");
                        }
                        else if(vvPreco<0){
                            alert("o valor do item precisa ser positivo ou nulo");
                        }
                        else if(vvQtdAtacado<0){
                            alert("a quantidade de itens para atacado só pode ser positivo ou nulo");
                        }
                        else {
                            app.atualizarItem(idItem, vvNome, vvMarca, vvPreco, vvQtdAtacado, vvTipo);
                        }
                    });
                }
                app.varCountTrigger=true;
                //$("#showItens").trigger( "updatelayout" ); //nao sei pra que serve, aparentemente nada
                $.mobile.changePage('#pageListaDeItens');
            },
            error: function(ext){
                console.log(ext);
                console.log("##cliente::showItemsError");
            }
        });
    },

    atualizarItem: function(idItem, nome, marca, preco, qtdMinima, tipo){
        $.ajax({
            type: "POST",
            url: "http://" + app.ip + "/index.php",
            data: {
                acao: 'updateItem',
                idItem: idItem,
                nomeItem: nome,
                marcaItem: marca,
                precoItem: preco,
                qtdItem: qtdMinima,
                tipoItem: tipo
            },
            dataType: "json",
            success: function (json) {
                console.log(json);
                document.getElementById('spanNome'+idItem).textContent  = nome;
                document.getElementById('spanMarca'+idItem).textContent = marca + '◆';
            },
            error: function (ext) {
                console.log(ext);
            }
        });
    },

    atualizarLista: function(idLista, nomeLista, categoriaLista){
	    $.ajax({
            type: "POST",
            url: "http://" + app.ip + "/index.php",
            data: {
                acao: 'updateLista',
                idLista: idLista,
                nomeLista: nomeLista,
                categoriaLista: categoriaLista
            },
            dataType: "json",
            success: function (json) {
                console.log(json);
                document.getElementById('spanNomeLista').textContent  = nomeLista;
                document.getElementById('spanCategoriaLista').textContent = categoriaLista;
            },
            error: function (ext) {
                console.log(ext);
            }
        });
    },

    gotoNewList: function(){
	    $.mobile.changePage('#pageNewList');
    },

    exitApp: function(){
	    app.db.transaction(function (tx) {
            tx.executeSql("delete from logado where pk_id = pk_id");
            $.mobile.changePage("#pageLogin");
        });
    },

    loginTable: function(){
	    app.db = window.openDatabase('loginMagicTable', 1.0, 'nope', 10000000);
	    app.db.transaction(function(tx) {
            //tx.executeSql("DROP TABLE IF EXISTS logado");
            tx.executeSql("CREATE TABLE IF NOT EXISTS logado (pk_id INTEGER, nome VARCHAR(50), telefone VARCHAR(20), email VARCHAR(50), senha VARCHAR(50))");
        });
    },
	
	dbAutoLogin: function(){
        var vEmail;
        var vSenha;
	    app.db.transaction(function(tx) {
            tx.executeSql("select * from logado", [], function(tx, result){
				if(result.rows.length==1){
					vEmail = result.rows[0].email;
					vSenha = result.rows[0].senha;
				}
				else{
					console.log("##cliente::noData:AutoLogin");
				}
			});			
        },function (err) {
            console.log(err);
        }, function tryAjaxAutoLogin(){
            $.ajax({
                type: "POST",
                url: "http://"+app.ip+"/index.php",
                data: {
                    acao: 'login',
                    email: vEmail,
                    senha: vSenha
                },
                dataType: "json",
                success: function (json) {
                    if(json.result == true){
                        console.log(json.err);
                        app.db.transaction(function (tx) {
                            var sql = "INSERT INTO logado (pk_id, nome, email, telefone, senha) VALUES ('"+json.pk_id+"', '"+json.nome+"', '"+json.email+"', '"+json.telefone+"', '"+json.senha+"')";
                            console.log("%c"+sql,"color: green;");
                            console.log("##cliente::Logado");
                            tx.executeSql("delete from logado where pk_id = pk_id");
                            tx.executeSql(sql);
                            app.getLatLong(); //Abre o mapa só quando logado para economizar dados e processamento
                            $.mobile.changePage("#pagePerfil");
							app.inserirListas();
                        });
                    }
                    else if(json.result == false && json.alert == true){
                        alert(json.err);
                        app.db.transaction(function (tx) {
                            tx.executeSql("delete from logado where pk_id = pk_id");
                        });
                        $.mobile.changePage('#pageLogin');
                    }
                    else{
                        console.log(json.err);
                        app.db.transaction(function (tx) {
                            tx.executeSql("delete from logado where pk_id = pk_id");
                        });
                        $.mobile.changePage('#pageLogin');
                    }					
                },
                error: function(ext){
                    console.log(ext);
                    console.log("##cliente::AutoLoginError");
                }
            });
        });
	},

    dbMakeLogin: function(){
        var vNome;
        var vEmail = document.getElementById('loginEmail').value;
        var vTelefone;
        var vSenha = document.getElementById('loginSenha').value;
        $.ajax({
            type: "POST",
            url: "http://"+app.ip+"/index.php",
            data: {
                acao: 'login',
                email: vEmail,
                senha: vSenha
            },
            dataType: "json",
            success: function (json) {
                if(json.result == true){
                    console.log(json.err);
                    app.db.transaction(function (tx) {
                        var sql = "INSERT INTO logado (pk_id, nome, email, telefone, senha) VALUES ('"+json.pk_id+"', '"+json.nome+"', '"+json.email+"', '"+json.telefone+"', '"+json.senha+"')";
                        console.log("##cliente::Logado>"+sql);
						tx.executeSql("delete from logado where pk_id = pk_id");
                        tx.executeSql(sql);
                        app.getLatLong(); //Abre o mapa só quando logado para economizar dados e processamento
                        $.mobile.changePage("#pagePerfil");
						app.inserirListas();
                    });
                }
                else if(json.result == false && json.alert == true){
                    alert(json.err);
                }
            },
            error: function(){
                console.log("##cliente::error");
            }
        });		
    },
	
	dbRegisterUser: function(){
		var vNome = document.getElementById('registerNome').value;
		var vEmail = document.getElementById('registerEmail').value;
		var vTelefone= document.getElementById('registerTelefone').value;
		var vSenha = document.getElementById('registerSenha').value;
		var vSSenha = document.getElementById('registerConfirmarSenha').value;
		if(vNome==""){
            alert('O campo nome deve estar preenchido');
        }
        else if(vEmail==""){
            alert('O campo email deve estar preenchido');
        }
        else if(vEmail.search('@')<1){
            alert('O campo email deve conter um email valido');
        }
        else if(vTelefone==""){
		    alert('O campo telefone deve estar preenchido');
        }
        else if(vTelefone.length<9){
		    alert('O campo telefone deve conter um telefone válido');
        }
        else if(vSenha==""){
            alert('O campo senha deve estar preenchido');
        }
        else if(vSSenha==""){
            alert('O campo confirmar senha deve estar preenchido');
        }
        else if(vSenha!=vSSenha){
		    alert('As senhas não se correspondem');
        }
		else{
			$.ajax({
				type: "POST",
				url: "http://"+app.ip+"/index.php",
				data: {
					acao: 'registrarUsuario',
					nome: vNome,
					email: vEmail,
					telefone: vTelefone,
					senha: vSenha
				},
				dataType: "json", 
				success: function (json) {
					if(json.result == true){
						console.log(json.err);
					}
					else{
						console.log(json.err);
					}
					if(json.alert == true){
					    alert(json.err);
                    }
                    else if(json.result == true){
					    alert('cadastrado com sucesso');
                        document.getElementById('registerNome').value = "";
                        document.getElementById('registerEmail').value = "";
                        document.getElementById('registerTelefone').value = "";
                        document.getElementById('registerSenha').value = "";
                        document.getElementById('registerConfirmarSenha').value = "";
					    $.mobile.changePage('#pageLogin');
                    }
				},
				error: function(){
					console.log("##error");
				}
			});
		}
	},
	
    getLatLong:function() {
        var lat = 51.49575692748839;
        var lon = -0.14600197187496633;
        navigator.geolocation.getCurrentPosition(function(position) {
            this.lat = position.coords.latitude;
            this.lon = position.coords.longitude;
            app.loadMap(this.lat, this.lon);
        });
    },

    loadMap:function (lat, lon) {
        var div;
        var map;
        div = document.getElementById("theMap");
        map = new google.maps.Map(div, {
            center: {lat: lat, lng: lon},
            zoom: 18 //quanto maior mais proximo
        });
    }
};
app.initialize();
