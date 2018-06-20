var app = {
	ip: '127.0.0.1',
	idItens: new Array(),
    db: null,
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

    newItem: function(){
	    $('#listaItens').append(
	        "<hr>" +
            "<label>Nome</label>" +
            "<input type='text' name='itemNome'>" +
            "<label>Marca</label>" +
            "<input type='text' name='itemMarca'>" +
            "<label>Preco</label>" +
            "<input type='text' name='itemPreco'>" +
            "<label>Minimo para Atacado</label>" +
            "<input type='text' name='itemQtd'>" +
            "<label>Tipo</label >" +
            "<input type='text' name='itemTipo'>");
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
                        console.log(json);
                    },
                    error: function (ext) {
                        console.log(ext);
                        console.log("##cliente::SaveListAndItensError");
                    }
                });
            });
        }
        else if(document.getElementById('listName').value!=""){
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
	
	clickLista: function(e){
		alert(""+e);
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
                    /*if (json.result == true) {
                        for (var i=0;i<json.length;i++) {
                            $('#pageListas').append(
                                "<div class='oneList' id='"+json[i].pk_id+"'>" +
                                "<label class='title'>" + json[i].nome + " </label>" +
                                "<label class='itens'>" + json[i].categoria + "</label>" +
                                "</div>");
								
								$( "#" + lista + json[i].pk_id).click(function() {
								  alert( "Handler for .click() called." );
								});
                        }*/
						
					if (json.result == true) {
						for (var i=0;i<json.length;i++) {
							app.idItens[i] = json[i].pk_id;
							var cod = '<div class=\'oneList\' id="lista' + json[i].pk_id + '">\n' +
							'\t\t\t\t\t<label class=\'title\'>' + json[i].nome + ' </label>\n' +
							'\t\t\t\t\t<label class=\'itens\'>' + json[i].categoria + '</label>\n' +
							'\t\t\t\t\t</div>';
							$('#pageListas').append(cod);
							$("#lista" + json[i].pk_id).click(function(e) {		
								app.clickLista(e.currentTarget.id);
							});
					}
						
						
						}
                    else {
                        console.log(json.err);
                    }
                    $('#pageListas').append("<div id='newButton'><input onclick='app.gotoNewList()' value='MORE' id='newList' type='button' data-mini='true' data-icon='plus' data-iconpos='top' data-wrapper-class='ui-custom'></div>");
                },
                error: function () {
                    console.log("##cliente::GetListasError");
                    $('#pageListas').append("<div id='newButton'><input onclick='app.gotoNewList()' value='MORE' id='newList' type='button' data-mini='true' data-icon='plus' data-iconpos='top' data-wrapper-class='ui-custom'></div>");
                }
            });
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
                            console.log("##cliente::Logado:\n"+sql);
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
                error: function(){
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
