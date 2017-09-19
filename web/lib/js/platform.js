
function make_platform_data(obj)
{
	var code = '';

	$.each(obj,
		   function(idx,o){
			   code = code + '<div class="row">';
			   code = code + '<div class="col-sm-4"><p class="font-weight-bold">'+o.title+'</p></div>';
			   if( $.isArray(o.value) ){
				   var i,len;
				   len = o.value.length
				   code = code + '<div class="col-sm-4"><p class="font-weight-normal">';
				   for( i = 0; i < len; i++ ){
					   code = code + o.value[i];
					   if ( i < len -1 ){
						   code = code + ' / ';
					   }
				   }
				   code = code + '</p></div>';
			   }else{
				   code = code + '<div class="col-sm-8"><p class="font-weight-normal">'+o.value+'</p></div>';
			   }
			   code = code + '</div>';
		   }
		  );


	return code;
}

function confirm_remove_platform()
{
	console.log($(this).data("pid"));
}
function show_platform()
{
	
	var basic = build_basic_info("GetPlatformRequest");
    var property = new Object();
	var request = build_dfl_request(basic, property);
    var request_str = JSON.stringify(request);

	r = normal_call('../cgi/api.cgi', request_str);
	var default_platform = $.urlparam('platform');

	set_body_title("Platform", "");
	btn = make_link_button('add_platform.html', 'ADD', "add_button");
	append_left(btn);
	btn = make_link_button('mod_platform.html', 'MOD', "modify_button");
	append_left(btn);
	btn = make_link_button('#', 'DEL', "delete_button");
	append_left(btn);
	r.done(
		function(data){
			console.log(data);
			if( data.return.code != 0 ){
				console.log('receive fail');
			}else{
				
				
				var lcode = '<div class="list-group">';
				var rcode = '';
				var platform_list = data.properties.platform
				var rflag = 1;
				var lflag = 1;
				if ( platform_list.length < 1){
					$("#modify_button").attr("disabled", true);
				}
				append_left('<hr>');
				$.each(platform_list,
					   function(idx,obj){
						   if ( default_platform == null){
							   if( rflag == 1){
								   rcode = make_platform_data(obj);
								   append_right(rcode);
								   rflag = 0;
							   }
						   }
						   
						   $.each(obj,
								  function(i,o){
									  
									  // lcode 
									  if( o.name == 'platformname' ){
										  if( o['value'] == default_platform ){
											  rcode = make_platform_data(obj);
											  append_right(rcode);
											  lcode = lcode + '<a href="platform.html?platform='+o['value']+'" class="list-group-item list-group-item-action font-weight-bold">'  + o['value'] + '</a>';
											  $("#modify_button").attr("href", "mod_platform.html?platform="+o['value']);
											  $("#delete_button").attr("data-pid", o['value']);
										  }else{
											  if( default_platform == null && lflag == 1){
												  lcode = lcode + '<a href="platform.html?platform='+o['value']+'" class="list-group-item list-group-item-action font-weight-bold">'  + o['value'] + '</a>';
												  $("#modify_button").attr("href", "mod_platform.html?platform="+o['value']);
												  $("#delete_button").attr("data-pid", o['value']);
												  lflag = 0;
											  }else{
												  lcode = lcode + '<a href="platform.html?platform='+o['value']+'" class="list-group-item list-group-item-action ">'  + o['value'] + '</a>';
											  }
										  }
									  }
								  }
								 );
					   }
					  );
				lcode = lcode + '</div>';
				
				append_left(lcode);
				$("#delete_button").click(confirm_remove_platform);
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

//			code = code + make_form_text('Platform Name', 'platformname','S3l55m');
//			code = code + make_form_text('Platform description', 'platformdesc','Ambarella S3lm series, 2M');
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
//	name.name = 'platformname';
//	name.title = 'Platform Name';
//	name.value = get_text_value('platformname');
//	desc.name = 'platformdesc';
//	desc.title = 'Platform description';
//	desc.value = get_text_value('platformdesc');

	p = get_all_form(pl);
//	p.push(name);
//	p.push(desc);
//	p.unshift(desc);
//	p.unshift(name);
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
