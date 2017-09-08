
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


function normal_call( target, data )
{
	var request = jQuery.ajax( 
		{
			type:"POST", 
			url:target,
			data: data,
			dataType:"JSON"
		}
	);
	return request;
}


function append_left(code)
{
	$('#left_frame').append(code);
}



//////////////////////////////////////////////////
function make_link_button(target, name)
{
	var code;
	code = '<a class="btn btn-primary" href="' + target + '" role="button">'+name + '</a>';
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
	code = '<div>'+title+'</div>';
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
	code = '<div>'+title+'</div>';
	code = code
		+ '<input type="text" class="form-control" id="'
		+ name + '" placeholder="'
		+ placeholder + '">'
	return code;
}
function make_form_text_tilde(title, name1, pl1, name2, pl2)
{
	var code;
	code = '<div>'+title+'</div>';
	code = code
		+ '<div class="row"><div class="col"><input type="text" id="'
		+ name1 + '" class="form-control" placeholder="'
		+ pl1 +'"></div><label> ~ <label><div class="col"><input type="text" id="'
		+ name2 + '" class="form-control" placeholder="'
		+ pl2 + '"></div></div>';
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

