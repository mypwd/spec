
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
