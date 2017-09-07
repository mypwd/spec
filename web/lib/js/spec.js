























function bind_all_method()
{
	$("#login_link").click(manual_login);
}

function hide_all_contents()
{
	$("#jumbo").hide();
}

$(document).ready(
	function(){
		hide_all_contents();
		bind_all_method();
		check_login();
		var path = window.location.pathname;
		page_name = path.split("/").pop();
		page_show(page_name);
	}
	
);
