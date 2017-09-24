var platform_list = [];
var resolution_list;
var oem_list;



function refresh_candidate(cat)
{
	
}


function show_compare()
{
	var category = 'platform';
	var r,r1,r2,r3;
	set_body_title('Compare');
	$("#compare").show();

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

	
	refresh_candidate(category);
}

