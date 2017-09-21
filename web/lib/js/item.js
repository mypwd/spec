function _get_command(comm, item)
{
		
	var c = {
		"get":{
			"platform":"GetPlatformRequest",
			"sensor":"GetSensorRequest",
			"housing":"GetHousingRequest",
			"model":"GetModelRequest"
		},
		"add":{
			"platform":"AddPlatformRequest",
			"sensor":"AddSensorRequest",
			"housing":"AddHousingRequest",
			"model":"AddModelRequest"
		},
		"del":{
			"platform":"DelPlatformRequest",
			"sensor":"DelSensorRequest",
			"housing":"DelHousingRequest",
			"model":"DelModelRequest"
		},
		"mod":{
			"platform":"ModPlatformRequest",
			"sensor":"ModSensorRequest",
			"housing":"ModHousingRequest",
			"model":"ModModelRequest"
		},
		"data":{
			"platform":"GetPlatformDataRequest",
			"sensor":"GetSensorDataRequest",
			"housing":"GetHousingDataRequest",
			"model":"GetModelDataRequest"
		}
	};
		
	return c[comm][item];
}
function _get_body_title(act, item)
{
	console.log(act);
	console.log(item);
	
	var c = {
		"platform":{
			"show":"Platform",
			"add" : "Platform Add",
			"mod" : "Platform Modify"
		},
		"sensor":{
			"show":"Sensor",
			"add" : "Sensor Add",
			"mod" : "Sensor Modify"
		},
		"housing":{
			"show":"Housing",
			"add" : "Housing Add",
			"mod" : "Housing Modify"
		},
		"model":{
			"show":"Model",
			"add" : "Model Add",
			"mod" : "Model Modify"
		}
	};
	return c[item][act];
}
function _get_target_page(act, item)
{
	if(act == 'show'){
		return item + '.html';
	}
	return act + '_' + item + '.html';
}
function _get_button_name(act, item)
{
	return act + '_' + item + '_button';
}

function make_item_data(obj)
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

function item_delete_submit(e)
{
	
	var p = {};

	p[e.data.item] = e.data.pid;
	// 전송
	var basic = build_basic_info(_get_command('del',item));
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
				window.location.href=_get_target_page('show',item);
			}
			$("#RemoveModal").modal('hide');
		}
	);
	r.fail( function(hr, textStatus){ console.log('connection fail') } );
	

}
function confirm_remove_item()
{
	console.log($(this).data("pid"));
	var d = new Object();
	d.pid = $(this).data("pid");
	d.item = $(this).data("item");
	$("#RemoveModal").modal( {backdrop:"static"});
	$("#remove_title").empty();
	$("#remove_title").append('Remove '+ d.item + ' Data');
	$("#remove_info").empty();
	$("#remove_info").append(d.pid + ' data will be removed');
	$("#remove_check_button").unbind('click');
	$("#remove_check_button").click(d, item_delete_submit);
}


function show_item(item)
{
	
	var basic = build_basic_info(_get_command('get',item));
    var property = new Object();
	var request = build_dfl_request(basic, property);
    var request_str = JSON.stringify(request);

	r = normal_call('../cgi/api.cgi', request_str);
	var target_item = $.urlparam(item);

	set_body_title(_get_body_title('show',item),"");
	btn = make_link_button(_get_target_page('add',item), 'ADD', _get_button_name('add',item));
	append_left(btn);
	btn = make_link_button(_get_target_page('mod',item),  'MOD', _get_button_name('mod',item));
	append_left(btn);
	btn = make_link_button('#', 'DEL', _get_button_name('del',item));
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
			var item_list = data.properties[item];
			var rflag = 1;
			var lflag = 1;
			var selected_item_index = 0;
			if ( item_list.length < 1){
				$("#"+_get_button_name('mod',item)).bind('click', false);
				$("#"+_get_button_name('del',item)).bind('click', false);
				return;
			}
			// make left
			for( i = 0; i < item_list.length; i++ ){
				if ( target_item == null ){
					if( i == 0 ){
 						lcode = lcode + '<a href="'+_get_target_page('show',item)+ '?' + item + '='+item_list[i]['name']+'" class="list-group-item list-group-item-action font-weight-bold">'  + item_list[i]['name'] + '</a>';
						selected_item_index = i;
					}else{
						lcode = lcode + '<a href="'+_get_target_page('show',item) +'?' + item + '='+ item_list[i]['name']+'" class="list-group-item list-group-item-action">'  + item_list[i]['name'] + '</a>';
					}
				}else{
					if( item_list[i]['name'] == target_item){
 						lcode = lcode + '<a href="' + _get_target_page('show',item) + '?' + item + '='+item_list[i]['name']+'" class="list-group-item list-group-item-action font-weight-bold">'  + item_list[i]['name'] + '</a>';
						selected_item_index = i;
					}else{
						lcode = lcode + '<a href="' + _get_target_page('show', item)+ '?' + item + '='+item_list[i]['name']+'" class="list-group-item list-group-item-action">'  + item_list[i]['name'] + '</a>';
																	  }
				}
			}
			lcode = lcode + '</div>';
			append_left(lcode);

			// make right
			rcode = make_item_data(item_list[selected_item_index]);
			append_right(rcode);

			$("#"+_get_button_name('mod')).attr("href", _get_target_page('mod')+"?" + item + "="+item_list[selected_item_index]['name']);
			$("#"+ _get_button_name('del')).attr("data-pid", item_list[selected_item_index]['name']);
			$("#"+ _get_button_name('del')).attr("data-item", item);
			$("#"+ _get_button_name('del')).click(confirm_remove_item);
		}
	);
	r.fail( function(hr, textStatus){ console.log('connection fail') } );
}

function item_mod_submit(event)
{
	var p = {};
	var pl = event.data.param;
	var name = {};
	var desc = {};
	var item = event.data.item;
	console.log(pl);

	// 수집
	p['name'] = event.data.name;
	p['desc'] = event.data.desc;
	console.log(p['name']);
	console.log(p['desc']);

	p['param'] = get_all_form(pl);
	// 필수 요소 체크. --> 생략. modify 기능 이용 
	
	// 전송
	var basic = build_basic_info(_get_command('mod',item));
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
				window.location.href=_get_target_page('show', item);
			}
		}
	);
	r.fail( function(hr, textStatus){ console.log('connection fail') } );
	
	


}

function show_mod_item(item)
{
	var basic = build_basic_info("GetParamRequest");
    var property = new Object();
	var request = build_dfl_request(basic, property);
    var request_str = JSON.stringify(request);
	var target_item = $.urlparam(item);
	var item_data;
	var r2;
	var i;
	r = normal_call('../cgi/api.cgi', request_str);
	set_body_title(_get_body_title('mod',item), "");
	r.done(
		function(data){
			console.log(data);
			if ( data.return.code != 0 ){
				
				return;
			}
			item_param = data.properties[item];
			basic = build_basic_info(_get_command('data',item));
			property[item] = target_item;
			request = build_dfl_request(basic, property);
			request_str = JSON.stringify(request);
			
			r2 = normal_call('../cgi/api.cgi', request_str);
			r2.done(
				function(data){
					console.log(data);
					if ( data.return.code != 0 ){

						return;
					}
					item_data = data.properties;
					console.log(item_data);
					var code = '';
					code = code + '<div class="alert alert-success"><h1>' + target_item + '</h1><p>'+ item_data['desc']  + '</div>';

					
					code = code + make_form_each(item_param);
					code = code + make_action_button(_get_button_name('mod',item), 'MODIFY');
					
					$("#right_frame").append(code);
					var msg = new Object();
					msg.name = target_item;
					msg.desc = item_data['desc'];
					msg.item = item;
					msg.param = item_param;
					$('#'+_get_button_name('mod', item)).click(msg,item_mod_submit);
					
					// fill and check target platform data
					var item_param_array = item_data['param'];

					for( i = 0 ; i < item_param.length; i++){
						fill_check_param(item_param[i]['name'],item_param[i]['type'], item_param_array);
					}
				}
			);

		}

	);
	


	
	
}
function show_add_item(item)
{
	var basic = build_basic_info("GetParamRequest");
    var property = new Object();
	var request = build_dfl_request(basic, property);
    var request_str = JSON.stringify(request);

	r = normal_call('../cgi/api.cgi', request_str);
	
	set_body_title(_get_body_title('add', item), "");
	r.done(
		function(data){
			console.log(data);
			if ( data.return.code != 0 ){

				return;
			}
			var param_list = data.properties[item];
			var code = '';

			code = code + make_form_text(item+' Name', item+'name','');
			code = code + make_form_text(item+' description', item+'desc','');
			code = code + make_form_each(param_list);
			code = code + make_action_button(_get_button_name('add',item), 'ADD');

			$("#right_frame").append(code);
			var msg = new Object();
			msg.param_list = param_list;
			msg.item = item;
			$('#'+_get_button_name('add',item)).click(msg,item_add_submit);
		}

	);
}


function item_add_submit(event)
{
	var p = {};
	var pl = event.data.param_list;
	var item = event.data.item;
	var name = {};
	var desc = {};
	// 수집
	p['name'] = get_text_value(item+'name');
	p['desc'] = get_text_value(item+'desc');

	p['param'] = get_all_form(pl);
	// 필수 요소 체크. --> 생략. modify 기능 이용 
	
	// 전송
	var basic = build_basic_info(_get_command('add',item));
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
				window.location.href=_get_target_page('show',item);
			}
		}
	);
	r.fail( function(hr, textStatus){ console.log('connection fail') } );
	
	


}
