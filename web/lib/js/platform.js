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
			var platform = data.properties.platform;
			var code = '';
			console.log(platform.dnr);
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
			code = code + make_form_text('Post Buffer', 'prebuffer', '240');
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
	console.log('submit');
	var videocompression = gather_check_box_value('videocompression');
	console.log('video');
	console.log(videocompression);
	console.log(get_radio_value('dnr'));
	console.log(get_text_value('privacymask'));
	console.log(get_text_tilde_value('videominbps', 'videomaxbps'));
}
