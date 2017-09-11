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
						   code = code + '<li class="list-group-item">'
							   + obj['name'] + '</li>';
						   
					   }
					  );
				code = code + '</uf>';
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
			console.log(platform.dnr);
			code = code + make_form_text('Platform Name', 'platformname','S3l55m');
			code = code + make_form_text('Platform description', 'platformdesc','Ambarella S3lm series, 2M');
			code = code + make_form_radio_inline('Digital Noise Reduction', 'dnr', platform.dnr);
			code = code + make_form_checkbox_inline('Event Trigger', 'eventtrigger', platform.eventtrigger);
			code = code + make_form_text('Privacy Mask', 'privacymask','16 Programmerable Zone');
			code = code + make_form_text_tilde('Video Bitrate', 'videominbps', '100k', 'videomaxbps', '10M');
			code = code + make_form_text('Video Bitrate extra comment', 'videobpsextra', 'Multi-rate for Preview and Recording');
			code = code + make_form_radio_inline('AGC', 'AGC', platform.AGC);
			code = code + make_form_checkbox_inline('Video Compression', 'videocompression', platform.videocompression);
			code = code + make_form_checkbox_inline('H.264 Profile', 'h264profile', platform.h264profile);
			code = code + make_form_checkbox_inline('H.265 Profile', 'h265profile', platform.h265profile);
			code = code + make_form_checkbox_inline('Special Feature', 'specialfeature', platform.specialfeature);
			code = code + make_form_text('Pre Buffer', 'prebuffer', '5');
			code = code + make_form_text('Post Buffer', 'postbuffer', '240');
			code = code + make_form_checkbox_inline('Event Notification', 'eventnotifycation', platform.eventnotifycation);
			code = code + make_form_radio_inline('Ethernet', 'ethernet', platform.ethernet);
			code = code + make_form_checkbox_inline('Network Protocol(IPv4)', 'networkprotocolipv4', platform.networkprotocolipv4);
			code = code + make_form_checkbox_inline('Security', 'security', platform.security);
			code = code + make_form_checkbox_inline('SIP/VoIP support', 'sipvoipsupport', platform.sipvoipsupport);
			code = code + make_form_checkbox_inline('Programming I/F', 'programmingif', platform.programmingif);
			code = code + make_form_checkbox_inline('Support languages', 'supportlanguage', platform.supportlanguage);
			code = code + make_action_button('platform_add_button', 'ADD');
			$("#platform_form").append(code);

			$('#platform_add_button').click(platform_add_submit);
		}

	);
}


function platform_add_submit()
{
	var p = new Object();

	// 수집
	p.name = get_text_value('platformname');
	p.desc = get_text_value('platformdesc');
	p.dnr = get_radio_value('dnr');
	p.eventtrigger = gather_check_box_value('eventtrigger');
	p.privacymask = get_text_value('privacymask');
	p.videobps = get_text_tilde_value('videominbps', 'videomaxbps');
	p.videobpsextra = get_text_value('videobpsextra');
	p.AGC = get_radio_value('AGC');
	p.videocompression = gather_check_box_value('videocompression');
	p.h264profile = gather_check_box_value('h264profile');
	p.h265profile = gather_check_box_value('h265profile');
	p.specialfeature = gather_check_box_value('specialfeature');
	p.prebuffer = get_text_value('prebuffer');
	p.postbuffer = get_text_value('postbuffer');
	p.eventnotifycation = gather_check_box_value('eventnotifycation');
	p.ethernet = get_radio_value('ethernet');
	p.networkprotocolipv4 = gather_check_box_value('networkprotocolipv4');
	p.security = gather_check_box_value('security');
	p.sipvoipsupport = gather_check_box_value('sipvoipsupport');
	p.programmingif = gather_check_box_value('programmingif');
	p.supportlanguage = gather_check_box_value('supportlanguage');

	console.log(p);
	console.log(p.name.length);
	// 필수 요소 체크. --> 생략. modify 기능 이용 

	// 전송
	var basic = build_basic_info("AddPlatformRequest");
	var request = build_dfl_request(basic, p);
    var request_str = JSON.stringify(request);

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
