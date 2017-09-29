var platform_list = [];
var resolution_list;
var oem_list;
var model_list = [];

function make_candidate_card( id, header, model)
{
	var code = '';
	code = code + '<div class="card"><div class="card-header">';
	code = code + header;
	code = code + '</div><div class="card-body">';
	var i;
	for ( i = 0; i<model.length; i++){
		code = code +
			'<div class="form-check form-check-inline"><label class="form-check-label"><input class="form-check-input" type="checkbox" name="'
			+ id +  '" id="inlineRadio" value="'
			+ model[i] + '">'
			+ model[i] + '</label></div>';
		
	}
	code = code + '</div></div>';
	return code;
}
function update_model()
{
	var code = '<ul>';
	console.log('update');
	$("input[name='model']:checked").each(function(){
		var test = $(this).val();
		code = code + '<li>' + $(this).val() + '</li>';
	});
	code = code + '</ul>';
	$('#selected_model').empty();
	$('#selected_model').append(code);
	
}
function refresh_candidate()
{
	var i,j;
	var code = '';
	var cat;

	cat = $( "select option:selected" ).val();
	console.log(cat);
	if (cat == 'platform'){
		
		for(i = 0; i< platform_list.length; i++ ){
			var cand = [];
			for( j = 0; j< model_list.length; j++ ){
				if ( platform_list[i] == model_list[j].platform ){
					cand.push(model_list[j].name);
				}
			}
			code = code + make_candidate_card('model',platform_list[i], cand);
			
		}

	}else if(cat == 'oem'){
		for(i = 0; i< oem_list.length; i++ ){
			var cand = [];
			for( j = 0; j< model_list.length; j++ ){
				if ( oem_list[i] == model_list[j].oem ){
					cand.push(model_list[j].name);
				}
			}
			code = code + make_candidate_card('model',oem_list[i], cand);
			
		}

	}else if(cat == 'resolution'){
		for(i = 0; i< resolution_list.length; i++ ){
			var cand = [];
			for( j = 0; j< model_list.length; j++ ){
				if ( resolution_list[i] == model_list[j].simpleresolution ){
					cand.push(model_list[j].name);
				}
			}
			code = code + make_candidate_card('model',resolution_list[i], cand);
			
		}

	}

	$("#candidate").empty();
	$("#candidate").append(code);
	$(":checkbox").change( update_model);
}


function show_compare()
{
	var category = 'platform';
	var r,r1,r2,r3;
	set_body_title('Compare');
	
	$("#compare").show();
	$("#candidate_category").change(refresh_candidate);
	// get platform list
	var basic = build_basic_info(_get_command('get','platform'));
    var property = new Object();
	var request = build_dfl_request(basic, property);
    var request_str = JSON.stringify(request);

	r = normal_call('../cgi/api.cgi', request_str);
	r.done(
		function(data){
			console.log(data);
			if( data.return.code != 0 ){
				console.log('receive fail');
				return;
			}
			var i ;
			var pl = data.properties.platform;;
			for ( i = 0 ; i < pl.length; i++ ){
				platform_list.push(pl[i].name);
			}
			console.log(platform_list);
		}
	);
	r.fail( function(hr, textStatus){ console.log('connection fail') } );

	// get model list
	var basic = build_basic_info(_get_command('get','model'));
    var property = new Object();
	var request = build_dfl_request(basic, property);
    var request_str = JSON.stringify(request);

	r = normal_call('../cgi/api.cgi', request_str);
	r.done(
		function(data){
			console.log(data);
			if( data.return.code != 0 ){
				console.log('receive fail');
				return;
			}
			var i,j ;
			var ml = data.properties.model;
			for ( i = 0 ; i < ml.length; i++ ){
				var m = new Object();
				m.name = ml[i].name;
				for( j = 0; j < ml[i].param.length; j++ ){
					if( ml[i].param[j].name == 'platform' ){
						m.platform = ml[i].param[j].value;
					}else if( ml[i].param[j].name == 'simpleresolution'){
						m.simpleresolution = ml[i].param[j].value;
					}else if( ml[i].param[j].name == 'oem'){
						m.oem = ml[i].param[j].value;
					}
				}
				model_list.push(m);
			}
			console.log(model_list);
		}
	);
	r.fail( function(hr, textStatus){ console.log('connection fail') } );

	

	// get platform list
	basic = build_basic_info('GetParamRequest');
    property = new Object();
	request = build_dfl_request(basic, property);
    request_str = JSON.stringify(request);

	r1 = normal_call('../cgi/api.cgi', request_str);
	r1.done(
		function(data){
			console.log(data);
			if( data.return.code != 0 ){
				console.log('receive fail');
				return;
			}

			var mp = data.properties.model;
			for ( i = 0 ; i < mp.length; i++ ){
				if ( mp[i].name == 'oem'){
					oem_list = mp[i].param;
					console.log(oem_list);
				}
			}
			var sp = data.properties.sensor;
			for ( i = 0; i < sp.length; i++ ){
				if ( sp[i].name == 'simpleresolution'){
					resolution_list = sp[i].param;
					console.log(resolution_list);
				}
			}
		}
	);
	r1.fail( function(hr, textStatus){ console.log('connection fail') } );

	setTimeout(function(){
		refresh_candidate(category);
	},500);
	
	var btn;
	btn = make_link_button_blank('compare_table.html', 'View', 'view_button');
	append_left(btn);
	btn = make_action_button(  'export_pdf_button','PDF');
	append_left(btn);
	btn = make_action_button( 'export_excel_button', 'Excel');
	append_left(btn);
	

}

