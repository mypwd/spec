 ////////////////////////////////////////////////////////////////
//
//   Show Page
//
////////////////////////////////////////////////////////////////

function set_body_title(t, h)
{
	$("#body_title").append(t);
	$("#body_header").append(h);
	
}
function show_index()
{
	
	$("#jumbo").show();
}





function page_show(page)
{
	if( page == "index.html"){
		show_index();
	}else if( page == "platform.html"){
		show_platform();
	}else if( page == "add_platform.html"){
		show_add_platform();
	}else if( page == "mod_platform.html"){
		show_mod_platform();
	}else if( page == "sensor.html"){
		show_sensor();
	}else if( page == "add_sensor.html"){
		show_add_sensor();
	}else if( page == "mod_sensor.html"){
		show_mod_sensor();
	}else if( page == "housing.html"){
		show_housing();
	}else if( page == "add_housing.html"){
		show_add_housing();
	}else if( page == "mod_housing.html"){
		show_mod_housing();
	}else if( page == "model.html"){
		show_model();
	}else if( page == "add_model.html"){
		show_add_model();
	}else if( page == "mod_model.html"){
		show_mod_model();
	}else if( page == "compare.html"){
		show_compare();
	}
		
}

