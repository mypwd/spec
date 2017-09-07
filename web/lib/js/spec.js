
function delete_cookie( name ) {
	document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function build_basic_info(user, facilityid, mesg)
{
	var basic_information = new Object();
	basic_information.version = 1.0;
	basic_information.facilityid = facilityid;
	basic_information.message = mesg;

	return basic_information;
}

function build_dfl_request(basic, property)
{
	var request = new Object();
	
	request.basic_information = basic;
	request.properties = property;

	return request;
}

function tr_wrap(contents)
{
	var tr = '<tr>' + contents + '</tr>';
	return tr;
}
function table_wrap(clss, contents)
{
	var table = '<table class="' + clss + '">';
	table = table + contents + '</table>';
	return table;
}



function check_auth( data )
{
	if (data.properties.return.code == -1){
		console.log("unauthorized access");
		return -1;
	}else{
		return 0;
	}
}


function normal_call( target, data )
{
	var request = jQuery.ajax( 
		{
			type:"POST", 
			url:target,
			data: data,
			dataType:"JSON"
		}
	);
	return request;
}


function login_request(id, pass)
{
	var user  = getCookie("user_id");
	var basic = build_basic_info(user, "", "LoginRequest");
	var property = new Object();
	property.userid = id;
	property.password = pass;
	var request = build_dfl_request(basic, property);
	var request_str = JSON.stringify(request);
	console.log(request_str);
	var r = normal_call( "/v1.0/auth.cgi", request_str);

	$("#LoginModal").unbind('keypress'); 

	r.done( 
		function(data)
		{
			console.log(data);
			console.log('result' + data.properties.return.code)
			if ( data.properties.return.code == 0 ){
				$("#login_info").empty();
				$("#LoginModal").delay(1000).modal('hide');
				$("#login_link").text("Logout");
				$("#login_button").unbind('click'); 

				check_facility();
				$(location).attr("href", "index.html");
			}else if( data.properties.return.code == -101){
				$("#login_info").empty();
				$("#login_info").append('<div class="alert alert-info">일치하는 ID가 없거나 Password가 정확하지 않습니다</div>');
				
			}else if( data.properties.return.code == -102){
				$("#login_info").empty();
				$("#login_info").append('<div class="alert alert-info">이미 로그인된 상태입니다</div>');
				$("#login_button").unbind('click'); 
			}
		} 
	);
	r.fail( function(hr, textStatus){ console.log('connection fail') } ); 
}

function display_login()
{
	$("#LoginModal").modal({backdrop:'static'});
	$("#login_info").empty();
	//	$("#user_id").focus();

	$("#login_button").click( 
		function()
		{
			login_request( $("#user_id").val(), $("#user_password").val());
		}
	)
	$("#LoginModal").on('shown.bs.modal', 
						  function(){
							  $("#user_id").focus();
						  } 
					   );
	$("#LoginModal").keypress( 
		function(event) 
		{
			if (event.which == 13 ){
				login_request( $("#user_id").val(), $("#user_password").val());
			}
		}
	);
}

function logout()
{
	var user  = getCookie("user_id");
	var basic = build_basic_info(user, "", "LogoutRequest");
	var property = new Object();
	var request = build_dfl_request(basic, property);
	var request_str = JSON.stringify(request);
	var r = normal_call( "/v1.0/auth.cgi", request_str);

	r.done( 
		function(data){
			console.log('log out');
			delete_cookie('sid');
		}

	);
}

function manual_login()
{
	var curr = $("#login_link").text();
	if ( curr == "Login" ){
		display_login();
	}else{
		logout();
		$("#login_link").text("Login");
	}
}

