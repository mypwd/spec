
////////////////////////////////////////////////////////////////
//
//   Login part
//
////////////////////////////////////////////////////////////////

function login_request(id, pass)
{
	var user  = getCookie("user_id");
	var basic = build_basic_info( "LoginRequest");
	var property = new Object();
	property.userid = id;
	property.password = pass;
	var request = build_dfl_request(basic, property);
	var request_str = JSON.stringify(request);
	console.log(request_str);
	var r = normal_call( "../cgi/auth.cgi", request_str);

	$("#LoginModal").unbind('keypress'); 

	r.done( 
		function(data)
		{
			console.log(data);
			console.log('result' + data.return.code)
			if ( data.return.code == 0 ){
				$("#login_info").empty();
				$("#LoginModal").delay(1000).modal('hide');
				$("#login_link").text("Logout");
				$("#login_button").unbind('click'); 

				$(location).attr("href", "index.html");
			}else if( data.return.code == -101){
				$("#login_info").empty();
				$("#login_info").append('<div class="alert alert-info">일치하는 ID가 없거나 Password가 정확하지 않습니다</div>');
				
			}else if( data.return.code == -102){
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
	var r = normal_call( "../cgi/auth.cgi", request_str);

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
function check_login()
{
//	if (user == ''){
//		set_page_not_login();
//		return;
//	}
//	logout();
	var basic = build_basic_info("LogPingRequest");
	var property = new Object();
	property = '';
	var request = build_dfl_request(basic, property);
	var request_str = JSON.stringify(request);
	console.log(request);
	var r = normal_call( "../cgi/auth.cgi", request_str);
	
	r.done(
		function(data)
		{
			console.log(data);
			code = data.return.code;
			if( code == "-101" ){
				set_page_not_login();
		
			}else{
				set_page_login();
			}
		}
	);
	r.fail(
		function(hr, status){
			set_page_not_login();
		}
	)

}

function set_page_not_login()
{
	$("#login_link").text("Login");

}
function set_page_login()
{
	$("#login_link").text("Logout");

}

