
function make_sensor_data(obj)
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
function sensor_delete_submit(e)
{
	
	var p = {};

	p['sensor'] = e.data.pid;
	// 전송
	var basic = build_basic_info("DelSensorRequest");
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
				window.location.href="sensor.html";
			}
			$("#RemoveModal").modal('hide');
		}
	);
	r.fail( function(hr, textStatus){ console.log('connection fail') } );
	

}
function confirm_remove_sensor()
{
	console.log($(this).data("pid"));
	var d = new Object();
	d.pid = $(this).data("pid");
	$("#RemoveModal").modal( {backdrop:"static"});
	$("#remove_title").empty();
	$("#remove_title").append('Remove Sensor Data');
	$("#remove_info").empty();
	$("#remove_info").append(d.pid + ' data will be removed');
	$("#remove_check_button").unbind('click');
	$("#remove_check_button").click(d, sensor_delete_submit);
}

function sensor_mod_submit(event)
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
	var basic = build_basic_info("ModifySensorRequest");
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
				window.location.href="sensor.html";
			}
		}
	);
	r.fail( function(hr, textStatus){ console.log('connection fail') } );
	
	


}

function show_mod_sensor()
{
	var basic = build_basic_info("GetParamRequest");
    var property = new Object();
	var request = build_dfl_request(basic, property);
    var request_str = JSON.stringify(request);
	var target_sensor = $.urlparam('sensor');
	var sensor;
	var sensor_data;
	var r2;
	var i;
	r = normal_call('../cgi/api.cgi', request_str);
	set_body_title("Sensor Modify", "");
	r.done(
		function(data){
			console.log(data);
			if ( data.return.code != 0 ){
				
				return;
			}
			sensor_param = data.properties.sensor;
			basic = build_basic_info("GetSensorDataRequest");
			property['sensor'] = target_sensor;
			request = build_dfl_request(basic, property);
			request_str = JSON.stringify(request);
			
			r2 = normal_call('../cgi/api.cgi', request_str);
			r2.done(
				function(data){
					console.log(data);
					if ( data.return.code != 0 ){

						return;
					}
					sensor_data = data.properties;
					console.log(sensor_data);
					var code = '';
					code = code + '<div class="alert alert-success"><h1>' + target_sensor + '</h1><p>'+ sensor_data['desc']  + '</div>';

					
					code = code + make_form_each(sensor_param);
					code = code + make_action_button('sensor_mod_button', 'MODIFY');
					
					$("#right_frame").append(code);
					var msg = new Object();
					msg.name = target_sensor;
					msg.desc = sensor_data['desc'];
					msg.param = sensor_param;
					$('#sensor_mod_button').click(msg,sensor_mod_submit);
					
					// fill and check target sensor data
					var sensor_param_array = sensor_data['param'];

					for( i = 0 ; i < sensor_param.length; i++){
						fill_check_param(sensor_param[i]['name'],sensor_param[i]['type'], sensor_param_array);
					}
				}
			);

		}

	);
	


	
	
}


function show_sensor()
{
	
	var basic = build_basic_info("GetSensorRequest");
    var property = new Object();
	var request = build_dfl_request(basic, property);
    var request_str = JSON.stringify(request);

	r = normal_call('../cgi/api.cgi', request_str);
	var target_sensor = $.urlparam('sensor');

	set_body_title("Sensor", "");
	btn = make_link_button('add_sensor.html', 'ADD', "add_button");
	append_left(btn);
	btn = make_link_button('mod_sensor.html', 'MOD', "modify_button");
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
			var sensor_list = data.properties.sensor
			var rflag = 1;
			var lflag = 1;
			var selected_sensor_index = 0;
			if ( sensor_list.length < 1){
				console.log('array null');
				$("#modify_button").bind('click', false);
				$("#delete_button").bind('click', false);
				return;
			}
			// make left
			for( i = 0; i < sensor_list.length; i++ ){
				if ( target_sensor == null ){
					if( i == 0 ){
 						lcode = lcode + '<a href="sensor.html?sensor='+sensor_list[i]['name']+'" class="list-group-item list-group-item-action font-weight-bold">'  + sensor_list[i]['name'] + '</a>';
						selected_sensor_index = i;
					}else{
						lcode = lcode + '<a href="sensor.html?sensor='+sensor_list[i]['name']+'" class="list-group-item list-group-item-action">'  + sensor_list[i]['name'] + '</a>';
					}
				}else{
					if( sensor_list[i]['name'] == target_sensor){
 						lcode = lcode + '<a href="sensor.html?sensor='+sensor_list[i]['name']+'" class="list-group-item list-group-item-action font-weight-bold">'  + sensor_list[i]['name'] + '</a>';
						selected_sensor_index = i;
					}else{
						lcode = lcode + '<a href="sensor.html?sensor='+sensor_list[i]['name']+'" class="list-group-item list-group-item-action">'  + sensor_list[i]['name'] + '</a>';
					}
				}
			}
			lcode = lcode + '</div>';
			append_left(lcode);

			// make right
			rcode = make_sensor_data(sensor_list[selected_sensor_index]);
			append_right(rcode);

			$("#modify_button").attr("href", "mod_sensor.html?sensor="+sensor_list[selected_sensor_index]['name']);
			$("#delete_button").attr("data-pid", sensor_list[selected_sensor_index]['name']);
			$("#delete_button").click(confirm_remove_sensor);
		}
	);
	r.fail( function(hr, textStatus){ console.log('connection fail') } );


	
}

function show_add_sensor()
{
	var basic = build_basic_info("GetParamRequest");
    var property = new Object();
	var request = build_dfl_request(basic, property);
    var request_str = JSON.stringify(request);

	r = normal_call('../cgi/api.cgi', request_str);
	
	set_body_title("Sensor Add", "");
	r.done(
		function(data){
			console.log(data);
			if ( data.return.code != 0 ){

				return;
			}
			var sensor = data.properties.sensor;
			var code = '';

			code = code + make_form_text('Sensor Name', 'sensorname','IMX172');
			code = code + make_form_text('Sensor description', 'sensordesc','Sony Starvis IMX172');
			code = code + make_form_each(sensor);
			code = code + make_action_button('sensor_add_button', 'ADD');

			$("#right_frame").append(code);
			
			$('#sensor_add_button').click(sensor,sensor_add_submit);
		}

	);
	
}

function sensor_add_submit(event)
{
	var p = {};
	var pl = event.data;
	var name = {};
	var desc = {};
	// 수집
	p['name'] = get_text_value('sensorname');
	p['desc'] = get_text_value('sensordesc');

	p['param'] = get_all_form(pl);
	// 필수 요소 체크. --> 생략. modify 기능 이용 
	
	// 전송
	var basic = build_basic_info("AddSensorRequest");
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
				window.location.href="sensor.html";
			}
		}
	);
	r.fail( function(hr, textStatus){ console.log('connection fail') } );
	
	


}
