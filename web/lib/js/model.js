
function model_add_submit(event)
{
	var p = {};
	var pl = event.data.pl;
	// 수집
	p['name'] = get_text_value('modelname');
	p['desc'] = get_text_value('modeldesc');
	p['param'] = get_all_form(pl);
	
	var val1 = new Object();
	val1.name = 'platform';
	val1.value = event.data.platform;
	val1.title = 'Platform';
	p['param'].unshift(val1);

	var val2 = new Object();
	val2.name = 'sensor';
	val2.value = event.data.sensor;
	val2.title = 'Sensor';
	p['param'].unshift(val2);

	var val3 = new Object();
	val3.name = 'housing';
	val3.value = event.data.housing;
	val3.title = 'Housing';
	p['param'].unshift(val3);
	
	// 필수 요소 체크. --> 생략. modify 기능 이용 
	
	// 전송
	var basic = build_basic_info(_get_command('add','model'));
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
				window.location.href=_get_target_page('show','model');
			}
		}
	);
	r.fail( function(hr, textStatus){ console.log('connection fail') } );

}
function show_model()
{
	show_item('model');

}
function show_detail_form_of_model()
{
	var platform, sensor, housing;
	var code;
	// select item
	platform = get_radio_value('platform');
	if ( typeof platform === 'undefined' ){
		$("#model_info").empty();
		$("#model_info").append('<div class="alert alert-warning">Platform 을 선택해 주세요</div>');
		return;
	}
	sensor = get_radio_value('sensor');
	if ( typeof sensor === 'undefined' ){
		$("#model_info").empty();
		$("#model_info").append('<div class="alert alert-warning">Sensor 을 선택해 주세요</div>');
		return;
	}
	housing = get_radio_value('housing');
	if ( typeof housing === 'undefined' ){
		$("#model_info").empty();
		$("#model_info").append('<div class="alert alert-warning">Housing 을 선택해 주세요</div>');
		return;
	}

	$("#model_contents").empty();
	$("#ModelModal").delay(1000).modal('hide');

	set_body_title(_get_body_title('add', 'model'), "");
	code = make_form_text('Model Name', 'modelname','');
	code = code + make_form_text('Model Description', 'modeldesc','');
	code = code + '<p></p>';
	$("#model_pre").append(code);


	$("#accordion").show();
	$("#right_frame").append('<div>'+make_action_button(_get_button_name('add','model'), 'ADD') + '</div>');



	// get param
	var basic = build_basic_info("GetParamRequest");
    var property = new Object();
	var request = build_dfl_request(basic, property);
    var request_str = JSON.stringify(request);
	var r1,r2,r3,r4;
	var platform_param_list, sensor_param_list, housing_param_list, model_param_list;
	var platform_data,housing_data,sensor_data;

	var item_param_array;
	r1 = normal_call('../cgi/api.cgi', request_str);

	r1.done(
		function(data){
			console.log(data);
			if ( data.return.code != 0 ){
				
				return;
			}
			platform_param_list = data.properties['platform'];
			housing_param_list = data.properties['housing'];
			sensor_param_list = data.properties['sensor'];
			model_param_list = data.properties['model'];

			code = make_form_each(platform_param_list);
			$("#platform_card").empty();
			$("#platform_card").append(code);

			code = make_form_each(housing_param_list);
			$("#housing_card").empty();
			$("#housing_card").append(code);

			code = make_form_each(sensor_param_list);
			$("#sensor_card").empty();
			$("#sensor_card").append(code);

			code = make_form_each(model_param_list);
			$("#model_card").empty();
			$("#model_card").append(code);

			// model param list를 위해서 카테고리별 param list 를 merge
			var total_param = $.merge($.merge($.merge($.merge( [], platform_param_list),sensor_param_list), housing_param_list),model_param_list);
			var m = new Object();
			m.pl = total_param;
			m.platform = platform;
			m.sensor = sensor;
			m.housing = housing;
			$('#'+_get_button_name('add','model')).click(m, model_add_submit);
			// platform data
			basic = build_basic_info(_get_command('data','platform'));
			property['platform'] = platform;
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
					item_param_array = platform_data['param'];
					
					for( i = 0 ; i < platform_param_list.length; i++){
						fill_check_param(platform_param_list[i]['name'],platform_param_list[i]['type'], item_param_array);
					}
				}
			);
			// housing data
			basic = build_basic_info(_get_command('data','housing'));
			property['housing'] = housing;
			request = build_dfl_request(basic, property);
			request_str = JSON.stringify(request);
			
			r2 = normal_call('../cgi/api.cgi', request_str);
			r2.done(
				function(data){
					console.log(data);
					if ( data.return.code != 0 ){

						return;
					}
					housing_data = data.properties;
					item_param_array = housing_data['param'];
					
					for( i = 0 ; i < housing_param_list.length; i++){
						fill_check_param(housing_param_list[i]['name'],housing_param_list[i]['type'], item_param_array);
					}
				}
			);
			// sensor data
			basic = build_basic_info(_get_command('data','sensor'));
			property['sensor'] = sensor;
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
					item_param_array = sensor_data['param'];
					
					for( i = 0 ; i < sensor_param_list.length; i++){
						fill_check_param(sensor_param_list[i]['name'],sensor_param_list[i]['type'], item_param_array);
					}
					
				}
			);
			

			

		}
	);

	

}

function show_add_model()
{
	$("#ModelModal").modal( {backdrop:"static"});
	$("#model_title").empty();
	$("#model_title").append('Model Wizard');
	$("#model_info").empty();
	$("#model_info").append('Choice basic properties');
	$("#model_check_button").unbind('click');
	$("#model_check_button").click(show_detail_form_of_model);

	var basic ;
    var property ;
	var request ;
    var request_str;

	var r, r2;
	var platform_list, sensor_list, housing_list, model_list;


	basic = build_basic_info('GetItemListRequest');
	property = new Object();
	var request = build_dfl_request(basic, property);
    var request_str = JSON.stringify(request);

	r2 = normal_call('../cgi/api.cgi', request_str);

	r2.done(
		function(data){
			var code = '';
			console.log(data);
			if( data.return.code != 0 ){
				console.log('receive fail');
				return;
			}
			platform_list = data.properties['platform'];
			sensor_list = data.properties['sensor'];
			housing_list = data.properties['housing'];
			model_list = data.properties['model'];
			code = code + make_form_radio_inline('Platform','platform',platform_list);
			code = code + make_form_radio_inline('Sensor', 'sensor', sensor_list);
			code = code + make_form_radio_inline('housing', 'housing', housing_list);
			$("#model_contents").append(code);
		}
	);
	
}
function get_model_param(target)
{

}
function show_mod_model()
{

	var target = $.urlparam('model');


	
	var basic = build_basic_info('GetParamRequest');
    var property = new Object();
	var request = build_dfl_request(basic, property);
    var request_str = JSON.stringify(request);
	var platform_param_list, sensor_param_list, housing_param_list, model_param_list, total_param_list;
	var r, r2;
	var platform_list, sensor_list, housing_list, model_list;
	var code;

	set_body_title(_get_body_title('mod', 'model'), "");

	r = normal_call('../cgi/api.cgi', request_str);
	
	r.done(
		function(data){
			console.log(data);
			if( data.return.code != 0 ){
				console.log('receive fail');
				return;
			}
			
			platform_param_list = data.properties['platform'];
			sensor_param_list = data.properties['sensor'];
			housing_param_list = data.properties['housing'];
			model_param_list = data.properties['model'];

			code = make_form_each(platform_param_list);
			$("#platform_card").empty();
			$("#platform_card").append(code);

			code = make_form_each(housing_param_list);
			$("#housing_card").empty();
			$("#housing_card").append(code);
			
			code = make_form_each(sensor_param_list);
			$("#sensor_card").empty();
			$("#sensor_card").append(code);

			code = make_form_each(model_param_list);
			$("#model_card").empty();
			$("#model_card").append(code);
			$("#accordion").show();

			$("#right_frame").append('<div>'+make_action_button(_get_button_name('mod','model'), 'MODIFY')+'</div>');

			
			total_param_list = $.merge($.merge($.merge($.merge( [], platform_param_list),sensor_param_list), housing_param_list),model_param_list);

			basic = build_basic_info(_get_command('data','model'));
			property['model'] = target;
			request = build_dfl_request(basic, property);
			request_str = JSON.stringify(request);
	
			r2 = normal_call('../cgi/api.cgi', request_str);
			r2.done(
				function(data){
					console.log(data);
					if ( data.return.code != 0 ){
						
						return;
					}
					data = data.properties;
					$("#model_pre").append('<div class="alert alert-success"><h1>' + target + '</h1><p>'+ data['desc']  + '</div>');
					item_param_array = data['param'];
					for( i = 0 ; i < total_param_list.length; i++){
						fill_check_param(total_param_list[i]['name'],total_param_list[i]['type'], data);
					}
					var msg = new Object();
					msg.name = target;
					msg.desc = data['desc'];
					msg.item = 'model';
					msg.param = total_param_list;
					$('#'+_get_button_name('mod', 'model')).click(msg,item_mod_submit);

				}
			);
			
		}
	);

	

}
