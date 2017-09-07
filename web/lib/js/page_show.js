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
	}
		
}

