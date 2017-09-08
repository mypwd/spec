function show_platform()
{
	
	var basic = build_basic_info("GetPlatformRequest");
    var property = new Object();
	var request = build_dfl_request(basic, property);
    var request_str = JSON.stringify(request);

	r = normal_call('../cgi/api.cgi', request_str);
	
	set_body_title("Platform", "");
	btn = make_link_button('add_platform.html', 'ADD');
	append_left(btn);
	r.done(
		function(data){
			console.log(data);
			if( data.return.code != 0 ){
				console.log('receive fail');
			}else{
				var platform_list = data.properties.platform
				$.each(platform_list,
					   function(idx,obj){
						   
					   }
					  );
			}
		}
	);
	r.fail( function(hr, textStatus){ console.log('connection fail') } );
}
function show_mod_platform()
{
	
}
function show_add_platform()
{
	var basic = build_basic_info("GetParamRequest");
    var property = new Object();
	var request = build_dfl_request(basic, property);
    var request_str = JSON.stringify(request);

	r = normal_call('../cgi/api.cgi', request_str);
	
	set_body_title("Platform Add", "");
	r.done(
		function(data){
			console.log(data);
			console.log(data.properties.platform.dnr)
		}

	);
}
