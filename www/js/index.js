var app = {
	ip: '127.0.0.1',
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
        this.inserirListas();
        document.getElementById('btnSair').addEventListener('click', this.exitApp);
		document.getElementById('btnManterDados').addEventListener('click', function(){$.mobile.changePage('#pageManterDados')});
        document.getElementById('btnGoToRegister').addEventListener('click', this.goToPageRegister);
        document.getElementById('btnRegisterUser').addEventListener('click', this.dbRegisterUser);
        document.getElementById('btnLogin').addEventListener('click', this.dbMakeLogin);
    },
	
	goToPageRegister: function(){
        $.mobile.changePage("#pageRegister");
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
                        for (var i=0;i<json.length;i++) {
                            $('#pageListas').append(
                                "<div class='oneList'>" +
                                "<label class='title'>" + json[i].nome + " </label>" +
                                "<label class='itens'>" + json[i].categoria + "</label>" +
                                "</div>");
                        }
                        $('#pageListas').append("<div id='newButton'><input id='newList' type='button' data-mini='true' data-icon='plus' data-iconpos='top' data-wrapper-class='ui-custom'></div>");
                    }
                    else {
                        console.log(json.err);
                    }
                },
                error: function () {
                    console.log("##cliente::GetListasError");
                }
            });
        });
    },

    exitApp: function(){
	    app.db.transaction(function (tx) {
            tx.executeSql("delete * from logado where pk_id = pk_id");
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
                        });
                    }
                    else if(json.result == false && json.alert == true){
                        alert(json.err);
                    }
                    else{
                        console.log(json.err);
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