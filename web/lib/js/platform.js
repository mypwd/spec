
function make_platform_data(obj)
{
	console.log(obj);
	var code = '';
	var i;
	var param = obj['param'];

	code = code + '<div class="alert alert-success"><h1>' + obj['name'] + '</h1><p>'+obj['desc'] + '</div>';
	
	for ( i = 0; i < param.length; i++){
		code = code + '<div class="row">';
		code = code + '<div class="col-sm-4"><p class="font-weight-bold">'+param[i]['title']+'</p></div>';
		if( $.isArray(param[i]['value']) ){
			var j,len;
			len = param[i]['value'].length
			code = code + '<div class="col-sm-4"><p class="font-weight-normal">';
			for( j = 0; j < len; j++ ){
				code = code + param[i]['value'][j];
				if ( j < len -1 ){
					code = code + ' / ';
				}
			}
			code = code + '</p></div>';
		}else{
			code = code + '<div class="col-sm-8"><p class="font-weight-normal">'+param[i]['value']+'</p></div>';
		}
		code = code + '</div>';
	}




	return code;
}

function platform_delete_submit(e)
{
	
	var p = {};

	p['platform'] = e.data.pid;
	// 전송
	var basic = build_basic_info("DelPlatformRequest");
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
			$("#RemoveModal").modal('hide');
		}
	);
	r.fail( function(hr, textStatus){ console.log('connection fail') } );
	

}
function confirm_remove_platform()
{
	console.log($(this).data("pid"));
	var d = new Object();
	d.pid = $(this).data("pid");
	$("#RemoveModal").modal( {backdrop:"static"});
	$("#remove_title").empty();
	$("#remove_title").append('Remove Platform Data');
	$("#remove_info").empty();
	$("#remove_info").append(d.pid + ' data will be removed');
	$("#remove_check_button").unbind('click');
	$("#remove_check_button").click(d, platform_delete_submit);
}


function show_platform()
{
	
	var basic = build_basic_info("GetPlatformRequest");
    var property = new Object();
	var request = build_dfl_request(basic, property);
    var request_str = JSON.stringify(request);

	r = normal_call('../cgi/api.cgi', request_str);
	var target_platform = $.urlparam('platform');

	set_body_title("Platform", "");
	btn = make_link_button('add_platform.html', 'ADD', "add_button");
	append_left(btn);
	btn = make_link_button('mod_platform.html', 'MOD', "modify_button");
	append_left(btn);
	btn = make_link_button('#', 'DEL', "delete_button");
	append_left(btn);
	append_left('<hr>');
	r.done(
		function(data){
			console.log(data);
			if( data.return.code != 0 ){
				console.log('receive fail');
				return;
			}
			
			var lcode = '<div class="list-group">';
			var rcode = '';
			var platform_list = data.properties.platform
			var rflag = 1;
			var lflag = 1;
			var selected_platform_index = 0;
			if ( platform_list.length < 1){
				$("#modify_button").bind('click', false);
				$("#delete_button").bind('click', false);
				return;
			}
			// make left
			for( i = 0; i < platform_list.length; i++ ){
				if ( target_platform == null ){
					if( i == 0 ){
 						lcode = lcode + '<a href="platform.html?platform='+platform_list[i]['name']+'" class="list-group-item list-group-item-action font-weight-bold">'  + platform_list[i]['name'] + '</a>';
						selected_platform_index = i;
					}else{
						lcode = lcode + '<a href="platform.html?platform='+platform_list[i]['name']+'" class="list-group-item list-group-item-action">'  + platform_list[i]['name'] + '</a>';
					}
				}else{
					if( platform_list[i]['name'] == target_platform){
 						lcode = lcode + '<a href="platform.html?platform='+platform_list[i]['name']+'" class="list-group-item list-group-item-action font-weight-bold">'  + platform_list[i]['name'] + '</a>';
						selected_platform_index = i;
					}else{
						lcode = lcode + '<a href="platform.html?platform='+platform_list[i]['name']+'" class="list-group-item list-group-item-action">'  + platform_list[i]['name'] + '</a>';
					}
				}
			}
			lcode = lcode + '</div>';
			append_left(lcode);

			// make right
			rcode = make_platform_data(platform_list[selected_platform_index]);
			append_right(rcode);

			$("#modify_button").attr("href", "mod_platform.html?platform="+platform_list[selected_platform_index]['name']);
			$("#delete_button").attr("data-pid", platform_list[selected_platform_index]['name']);
			$("#delete_button").click(confirm_remove_platform);
		}
	);
	r.fail( function(hr, textStatus){ console.log('connection fail') } );
}
function platform_mod_submit(event)
{
	var p = {};
	var pl = event.data.param;
	var name = {};
	var desc = {};
	console.log(pl);

	// 수집
	p['name'] = event.data.name;
	p['desc'] = event.data.desc;
	console.log(p['name']);
	console.log(p['desc']);

	p['param'] = get_all_form(pl);
	// 필수 요소 체크. --> 생략. modify 기능 이용 
	
	// 전송
	var basic = build_basic_info("ModifyPlatformRequest");
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

function show_mod_platform()
{
	var basic = build_basic_info("GetParamRequest");
    var property = new Object();
	var request = build_dfl_request(basic, property);
    var request_str = JSON.stringify(request);
	var target_platform = $.urlparam('platform');
	var platform;
	var platform_data;
	var r2;
	var i;
	r = normal_call('../cgi/api.cgi', request_str);
	set_body_title("Platform Modify", "");
	r.done(
		function(data){
			console.log(data);
			if ( data.return.code != 0 ){
				
				return;
			}
			platform_param = data.properties.platform;
			basic = build_basic_info("GetPlatformDataRequest");
			property['platform'] = target_platform;
			request = build_dfl_request(basic, property);
			request_str = JSON.stringify(request);
			
			r2 = normal_call('../cgi/api.cgi', request_str);
			r2.done(
				function(data){
					console.log(data);
					if ( data.return.code != 0 ){

						return;
					}
					platform_data = data.properties;
					console.log(platform_data);
					var code = '';
					code = code + '<div class="alert alert-success"><h1>' + target_platform + '</h1><p>'+ platform_data['desc']  + '</div>';

					
					code = code + make_form_each(platform_param);
					code = code + make_action_button('platform_mod_button', 'MODIFY');
					
					$("#right_frame").append(code);
					var msg = new Object();
					msg.name = target_platform;
					msg.desc = platform_data['desc'];
					msg.param = platform_param;
					$('#platform_mod_button').click(msg,platform_mod_submit);
					
					// fill and check target platform data
					var platform_param_array = platform_data['param'];

					for( i = 0 ; i < platform_param.length; i++){
						fill_check_param(platform_param[i]['name'],platform_param[i]['type'], platform_param_array);
					}
				}
			);

		}

	);
	


	
	
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

				return;
			}
			var platform = data.properties.platform;
			var code = '';

			code = code + make_form_text('Platform Name', 'platformname','S3l55m');
			code = code + make_form_text('Platform description', 'platformdesc','Ambarella S3lm series, 2M');
			code = code + make_form_each(platform);
			code = code + make_action_button('platform_add_button', 'ADD');

			$("#right_frame").append(code);
			
			$('#platform_add_button').click(platform,platform_add_submit);
		}

	);
}


function platform_add_submit(event)
{
	var p = {};
	var pl = event.data;
	var name = {};
	var desc = {};
	// 수집
	p['name'] = get_text_value('platformname');
	p['desc'] = get_text_value('platformdesc');

	p['param'] = get_all_form(pl);
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
