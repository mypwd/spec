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
				var code = '<ul class="list-group">';
				var platform_list = data.properties.platform
				$.each(platform_list,
					   function(idx,obj){
						   $.each(obj,
								  function(i,o){
									  console.log(o);
									  if( o.name == 'platformname' ){
										  code = code + '<li class="list-group-item">'  + o['value'] + '</li>';
									  }
								  }
								 );
					   }
					  );
				code = code + '</ul>';
				console.log(code);
				append_left(code);
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
			if ( data.return.code != 0 ){
				display_login();
				return;
			}
			var platform = data.properties.platform;
			var code = '';

			code = code + make_form_text('Platform Name', 'platformname','S3l55m');
			code = code + make_form_text('Platform description', 'platformdesc','Ambarella S3lm series, 2M');
			code = code + make_form_each(platform);
			code = code + make_action_button('platform_add_button', 'ADD');

			$("#platform_form").append(code);
			
			$('#platform_add_button').click(platform,platform_add_submit);
		}

	);
}


function platform_add_submit(event)
{
	var p;
	var pl = event.data;
	var name = {};
	var desc = {};
	// 수집
	name.name = 'platformname';
	name.title = 'Platform Name';
	name.value = get_text_value('platformname');
	desc.name = 'platformdesc';
	desc.title = 'Platform description';
	desc.value = get_text_value('platformdesc');

	p = get_all_form(pl);
	p.push(name);
	p.push(desc);
	
	// 필수 요소 체크. --> 생략. modify 기능 이용 
	
	// 전송
	var basic = build_basic_info("AddPlatformRequest");
	var request = build_dfl_request(basic, p);
    var request_str = JSON.stringify(request);
	console.log(request_str);

	r = normal_call('../cgi/api.cgi', request_str);
	
	r.done(
		function(data){
			console.log(data);
			if( data.return.code != 0 ){
				console.log('receive fail');
			}else{
				window.location.href="platform.html";
			}
		}
	);
	r.fail( function(hr, textStatus){ console.log('connection fail') } );
	
	


}
