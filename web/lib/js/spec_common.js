
function delete_cookie( name ) {
	document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function build_basic_info( mesg)
{
	var info = new Object();
	
	info.command = mesg;

	return info;
}

function build_dfl_request(basic, property)
{
	var request = new Object();
	
	request.info = basic;
	request.properties = property;

	return request;
}

function tr_wrap(contents)
{
	var tr = '<tr>' + contents + '</tr>';
	return tr;
}
function table_wrap(clss, contents)
{
	var table = '<table class="' + clss + '">';
	table = table + contents + '</table>';
	return table;
}



function check_auth( data )
{
	if (data.properties.return.code == -1){
		console.log("unauthorized access");
		return -1;
	}else{
		return 0;
	}
}

function _ajax_call( target, data, async )
{
	var request = jQuery.ajax( 
		{
			type:"POST", 
			url:target,
			async:async,
			data: data,
			dataType:"JSON"
		}
	);
	return request;
}

function normal_call( target, data )
{
	return _ajax_call(target, data, true);
}

function sync_call( target, data)
{
	return _ajax_call(target, data, false);
}

function append_left(code)
{
	$('#left_frame').append(code);
}

function append_right(code)
{
	$('#right_frame').append(code);
}

$.urlparam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
		return null;
    }
    else{
		return results[1] || 0;
    }
}

//////////////////////////////////////////////////
function make_link_button(target, name, id)
{
	var code;
	code = '<a class="btn btn-primary btn-sm" href="' + target + '" role="button" id="'+id+'">'+name + '</a>&nbsp;';
	return code;
}
function make_form_radio_inline(title, name, radioarray)
{
	return make_form_radiocheck_inline(title, name, radioarray, 'radio');
}
function make_form_checkbox_inline(title, name, checkarray)
{
	return make_form_radiocheck_inline(title, name, checkarray, 'checkbox');
}

function make_form_radiocheck_inline(title, name, arr, type)
{
	var code;
	code = '<div class="itemtag">'+title+'</div>';
	$.each(arr,
		   function(idx, item){
			   code = code +
				   '<div class="form-check form-check-inline"><label class="form-check-label"><input class="form-check-input" type="'
				   + type + '" name="'
				   + name +  '" id="inlineRadio" value="'
				   + item + '">'
				   + item + '</label></div>';
		   }
		  );
	return code;
}
function make_form_text(title, name, placeholder)
{
	var code;
	code = '<div class="itemtag">'+title+'</div>';
	code = code
		+ '<input type="text" class="form-control" id="'
		+ name + '" placeholder="'
		+ placeholder + '">'
	return code;
}
function make_form_textarea(title, name, placeholder)
{
	var code;
	code = '<div class="itemtag">'+title+'</div>';
	code = code
		+ '<input type="textarea" class="form-control" id="'
		+ name + '" placeholder="'
		+ placeholder + '">'
	return code;
}

function make_action_button(id, name)
{
	var code;
	code = '<div><button type="button" class="btn btn-primary" id="'
		+ id + '">'
		+ name + '</button></div>';
	return code;
}
//////////////////////////////////////////////////




function make_form_each( e )
{
	var code = '';

	$.each(e,
		   function(idx, item){

			   if(item.type == 'check'){
				   code = code + make_form_checkbox_inline(item.title, item.name, item.param);
			   }else if(item.type=='radio'){
				   code = code + make_form_radio_inline(item.title, item.name, item.param);
			   }else if(item.type=='text'){
				   code = code + make_form_text(item.title, item.name, item.placeholder);
			   }else if(item.type=='textarea'){
				   code = code + make_form_textarea(item.title, item.name, item.placeholder);
			   }

		   }
		  );
	return code;
	
}

function get_all_form( p )
{
	var o = new Array();
	// name, title, value
	$.each(p,
		   function(idx, item){
			   var l = {};
			   l.name = item.name;
			   l.title = item.title;
			   if(item.type == 'check'){
				   l.value = gather_check_box_value(item.name);				   
			   }else if(item.type=='radio'){
				   l.value = get_radio_value(item.name);				   
			   }else if(item.type=='text'){
				   l.value = get_text_value(item.name);				   
			   }else if(item.type=='textarea'){
				   l.value = get_textarea_value(item.name);
			   }
			   o.push(l);
		   }
		   
		  );
	console.log(o);
	return o;
}

//////////////////////////////////////////////////

function gather_check_box_value(name)
{
	var val  = new Array();

	$("input[name=" + name + "]:checked").each(function(){
		val.push($(this).val());
	});
	return val;
}

function get_radio_value(name)
{
	var val;

	val =  $("input:radio[name=" + name + "]:checked").val();
	return val;
}

function get_text_value(id)
{
	var val;
	var jid = '#' + id;
	val = $(jid).val();
	return val;
}
function get_textarea_value(id)
{
	var val;
	var jid = '#' + id;
	val = $(jid).val();
	return val;
}


//////////////////////////////////////////////////////

function fill_form_text(name, value)
{
	$("#"+name).val(value);
}

function check_form_checkbox(name, value)
{
	var i;
	if( value.length == 0 ){
		return;
	}
	for(i = 0; i < value.length; i++){
		$("input[name="+name+"][value=\'"+value[i]+"\']").attr("checked",true);
	}
}

function check_form_radiobutton(name, value)
{
	var s = "input:radio[name=\'"+name+"\']:radio[value=\'"+value+"\']";
	console.log(s);
	$(s).attr("checked", true);
}

function fill_check_param(name, type, param_array)
{
	var i;
	for( i = 0 ; i < param_array.length; i++){
		
		if( param_array[i]['name'] == name){
			if( type == "check"){
				check_form_checkbox(name, param_array[i]['value']);
			}else if( type == "radio"){
				check_form_radiobutton(name, param_array[i]['value']);
			}else if( type == "text") {
				fill_form_text(name, param_array[i]['value']);
			}
		}
		
	}
}
