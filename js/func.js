var mode = 1;
var elems = 0;
var glob_name="";
var glob_netid="";
var glob_standing="";
var glob_area="";
var glob_data;
var major_data;
var minor_data;
var curr_view = "overview";
var BACK_END_LOC = "//csscheduler.web.illinois.edu/";
var daydict = {'M':'Monday','T':'Tuesday','W':'Wednesday','R':'Thursday','F':'Friday'};
// var BACK_END_LOC = "http://192.168.0.101:7777/";


function init(name,netid,standing,area,data){
	sessionStorage.setItem("netid_scheduler", netid);
	glob_name = name;
	glob_netid = netid;
	glob_standing = standing;
	glob_area = area;
	if(data==null){
		glob_data = new Array();
	}else{
		glob_data = data;
	}
	maketable();
}

function sub(){
	if(mode==1){
		signin();
	}
	else if(mode==2){
		signup();
	}
}

function signin(){
	var netid = $("#netid").val();
	checkexists(netid);
}

function signup(){
	var netid = $("#netid").val();
	var firstname = $("#firstname").val();
	let f = $('.validate-input input[name="firstname"]');
	var lastname = $("#lastname").val();
	let l = $('.validate-input input[name="lastname"]');
	var standing = $("#standing").val();
	let s = $('.validate-input input[name="standing"]');
	var area = $("#area").val();
	let a = $('.validate-input input[name="area"]');
	var email = $("#email").val();
	let e = $('.validate-input input[name="email"]')
	if(firstname==""){
		let thisAlert = $(f).parent();
        $(thisAlert).addClass('alert-validate');
	}else{
		let thisAlert = $(f).parent();
        $(thisAlert).removeClass('alert-validate');
	}
	if(lastname==""){
		let thisAlert = $(l).parent();
        $(thisAlert).addClass('alert-validate');
	}else{
		let thisAlert = $(l).parent();
        $(thisAlert).removeClass('alert-validate');
	}
	if(email==""){
		let thisAlert = $(e).parent();
        $(thisAlert).addClass('alert-validate');
	}else{
		let thisAlert = $(e).parent();
        $(thisAlert).removeClass('alert-validate');
	}
	let cond_standing = false;
	if(standing!="freshman"&&standing!="sophomore"&&standing!="junior"&&standing!="senior"){
		let thisAlert = $(s).parent();
        $(thisAlert).addClass('alert-validate');
        cond_standing = true;
	}else{
		let thisAlert = $(s).parent();
        $(thisAlert).removeClass('alert-validate');
	}
	let cond_area = false;
	if(area!="software"&&area!="algorithm"&&area!="ai"&&area!="social"&&area!="media"&&area!="security"&&area!="machine"){
		let thisAlert = $(a).parent();
        $(thisAlert).addClass('alert-validate');
        cond_area = true;
	}else{
		let thisAlert = $(a).parent();
        $(thisAlert).removeClass('alert-validate');
	}
	if(email==""||netid==""||firstname==""||lastname==""||cond_standing||cond_area){
        return;
	}
	$.ajax({
		url:BACK_END_LOC+"insert_user",
		type:'POST',
		data:({
			netid:netid,
			firstname:firstname,
			lastname:lastname,
			standing:standing,
			area:area,
			email:email
		}),
		success: function(o){
			console.log(o);
		},
		failure: function(){
			console.log("Error");
		}
	});
	mode = 1;
	name = firstname+" "+lastname;
	init(name,netid,standing,area,null);
}

function checkexists(netid,notsignup=false){
	//check user exists
	var payload;
	$.ajax({
		url: BACK_END_LOC+'get_user',
		type:'POST',
		data:({
			netid:netid
		}),
		success: function(o){
			console.log(o);
			payload = o;
			if(payload=="fail"&&notsignup==false){
				var container = document.getElementById("formcontainer");
				container.innerHTML = '<span class="contact3-form-title">sign up</span>'
						+ '<div class="wrap-input3 validate-input" data-validate="NetId is required">'
						+ '<input class="input3" type="text" id="netid" name="name" placeholder="NetId" value="'+netid+'">'
						+ '<span class="focus-input3"></span>'
						+ '</div>'
						+ '<div class="wrap-input3 validate-input" data-validate="First name is required">'
						+ '<input class="input3" type="text" id="firstname" name="firstname" placeholder="First Name">'
						+ '<span class="focus-input3"></span>'
						+ '</div>'
						+ '<div class="wrap-input3 validate-input" data-validate="Last name is required">'
						+ '<input class="input3" type="text" id="lastname" name="lastname" placeholder="Last Name">'
						+ '<span class="focus-input3"></span>'
						+ '</div>'
						+ '<div class="wrap-input3 validate-input" data-validate="Email is required">'
						+ '<input class="input3" type="text" id="email" name="email" placeholder="Email">'
						+ '<span class="focus-input3"></span>'
						+ '</div>'
						+ '<div class="wrap-input3 validate-input" data-validate="Only put in provided Standing">'
						+ '<input class="input3" type="text" id="standing" name="standing" placeholder="Standing: (freshman, sophomore, junior, senior)">'
						+ '<span class="focus-input3"></span>'
						+ '</div>'
						+ '<div class="wrap-input3 validate-input" data-validate="Only put in provided Areas">'
						+ '<input class="input3" type="text" id="area" name="area" placeholder="Area: (software, algorithm, ai, social, media, security, machine)">'
						+ '<span class="focus-input3"></span>'
						+ '</div>'
						+ '<div class="row">'
						+ '<div class="col-sm-3 container-contact3-form-btn">'
						+ '<button class="contact3-form-btn" type="submit" onclick="sub();return false;">Submit</button>'
						+ '</div>'
						+ '<div class="col-sm-3 container-contact3-form-btn">'
						+ '<button class="contact3-form-btn" onclick="location.reload();">Back</button>'
						+ '</div></div>';
				mode = 2;
			}else if(payload=="fail"){
				sessionStorage.removeItem('netid_scheduler');
			}else{
				var name = payload["firstname"]+" "+payload["lastname"];
				var data = payload["courses"];
				var standing = payload["standing"];
				var area = payload["area"];
				init(name,netid,standing,area,data);
			}
		},
		failure: function(){
			console.log("Error");
			payload = false;
		}
	});
	return payload;
}

function maketable(){
	curr_view = "overview";
	var container = document.getElementById("bigcontainer");
	container.innerHTML = '<div class="row">'
			+'<div class="col-sm-8"><span class="contact3-form-title">Hello<br>'+glob_name+'<i style="padding-left:5px;cursor:pointer;font-size: 20px;" onclick="logout()" class="material-icons" title="Logout">clear</i></span></div>'
			+'<div class="col-sm-4">'
			+'<div class="btn-group-vertical">'
			+'<button type="button" class="btn contact3-form-btn" onclick="recommend()">Recommended</button>'
			+'<button type="button" class="btn contact3-form-btn" onclick="editprofile();">Update Profile</button>'
			+'<button type="button" class="btn contact3-form-btn" data-toggle="modal" data-target="#myModal" onclick="clear_ph();"><i class="fa fa-plus"></i> Add New</button>'
			+'</div></div></div>'
			+'<div class="modal fade" id="myModal" role="dialog">'
			+'<div class="modal-dialog">'
			+'<div class="modal-content">'
			+'<div class="modal-header">'
			+'<button type="button" class="close" onclick="restoreOpacity();" data-dismiss="modal">&times;</button>'
			+'<h4 class="modal-title">ADD A NEW COURSE</h4>'
			+'</div>'
			+'<div class="modal-body">'
			+'<form role="form">'
			+'<div class="form-group">'
			+'<input type="text" class="form-control" id="crn" placeholder="Enter your CRN">'
			+'</div>'
			+'</form>'
          	+'</div>'
			+'<div class="modal-footer">'
			+'<button type="button" class="btn btn-default" onclick="restoreOpacity();" data-dismiss="modal">Close</button>'
			+'<button class="contact3-form-btn" data-dismiss="modal" onclick="restoreOpacity();add_to_db(null,true);">Submit</button>'
			+'</div>'
			+'</div>'
			+'</div>'
			+'</div><label class="switch"><input type="checkbox" id="togBtn"><div class="slider round" onclick="switchView()"><span class="on">SCHEDULE</span><span class="off">OVERVIEW</span></div></label>';
	if(glob_data!=null && glob_data.length>0){
		var str = '';
		str += '<div id="view_container"><table id="courses" class="table table-hover"><thead><tr>'
					+ '<th>Course</th>'
					+ '<th>CRN</th>'
					+ '<th>Title</th>'
					+ '<th>Instructor</th>'
					+ '</tr></thead><tbody>';
		for(i in glob_data){
			let course = glob_data[i];
			str += '<tr onmouseover="del_mouse_over('+i+');" onmouseout="del_mouse_out('+i+');">'
					+ '<td class="animated flipInX" style="animation-delay: 0.'+i+'s;">'+course['course_number']+'</td>'
					+ '<td class="animated flipInX" style="animation-delay: 0.'+i+'s;">'+course['crn']+'</td>'
					+ '<td class="animated flipInX" style="max-width:100px;animation-delay: 0.'+i+'s;">'+course['title']+'</td>'
					+ '<td class="animated flipInX" style="max-width:200px;animation-delay: 0.'+i+'s;">'+course['instructor']+'</td>'
					+ '<td class="del" id="noti'+i+'" data-status="on" onclick="updateNotification(this,'+course['crn']+')"><i class="material-icons" title="Get notified when a spot is open!">&#xE7F7;</i></td>'
					+ '<td class="del" id="del'+i+'" onclick="delete_row('+i+')"><i class="material-icons">&#xE872;</i> </td>'
					+ '</tr>';
		}
		str += '</tbody></table></div>';
		container.innerHTML += str;
	}else{
		var str ='';
		str += '<div class="contact3-form-title3">No Course Yet.</div>';
		container.innerHTML += str;
	}
			
}
function switchView(){
	if(curr_view=="overview"){//show schedule
		let container = document.getElementById("view_container");
		container.innerHTML = '<div class="timetable animated fadeInLeft"></div>';

        var timetable = new Timetable();
        timetable.setScope(7,22);
	    timetable.addLocations(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
	    for(i in glob_data){
	    	let course = glob_data[i];
	    	for (let i = 0; i < course['day'].length; i++) {
			  	let d = daydict[course['day'][i]];
			  	let t = course['time_slot'];
			  	if(t!="TBA"){
			  		let t1 = Number(t.substr(0,2));
			  		let t2 = Number(t.substr(3,2));
			  		if(t.substr(6,2)=="pm"&&t1<12){
			  			t1+=12;
			  		}
			  		let t3 = Number(t.substr(9,2));
			  		let t4 = Number(t.substr(12,2));
			  		if(t.substr(15,2)=="pm"&&t3<12){
			  			t3+=12;
			  		}
	  		      	timetable.addEvent(course['title'],d, new Date(2015,7,17,t1,t2), new Date(2015,7,17,t3,t4));
			  	}
			}
	    }
        var renderer = new Timetable.Renderer(timetable);
	    renderer.draw('.timetable');

		curr_view = "schedule";
	}else{
		let container = document.getElementById("view_container");
		if(glob_data!=null && glob_data.length>0){
			var str = '';
			str += '<table id="courses" class="table table-hover"><thead><tr>'
						+ '<th>Course</th>'
						+ '<th>CRN</th>'
						+ '<th>Title</th>'
						+ '<th>Instructor</th>'
						+ '</tr></thead><tbody>';
			for(i in glob_data){
				let course = glob_data[i];
				str += '<tr onmouseover="del_mouse_over('+i+');" onmouseout="del_mouse_out('+i+');">'
						+ '<td class="animated flipInX" style="animation-delay: 0.'+i+'s;">'+course['course_number']+'</td>'
						+ '<td class="animated flipInX" style="animation-delay: 0.'+i+'s;">'+course['crn']+'</td>'
						+ '<td class="animated flipInX" style="max-width:100px;animation-delay: 0.'+i+'s;">'+course['title']+'</td>'
						+ '<td class="animated flipInX" style="max-width:200px;animation-delay: 0.'+i+'s;">'+course['instructor']+'</td>'
						+ '<td class="del" id="noti'+i+'" data-status="off" onclick="updateNotification(this,'+course['crn']+')"><i class="material-icons" title="Get notified when a spot is open!">&#xE7F6;</i></td>'
						+ '<td class="del" id="del'+i+'" onclick="delete_row('+i+')"><i class="material-icons">&#xE872;</i> </td>'
						+ '</tr>';
			}
			str += '</tbody></table>';
			container.innerHTML = str;
		}
		curr_view = "overview";
	}
}
function del_mouse_over(i){
	var id = "del"+i;
	document.getElementById(id).style.opacity = "1.0";
	var id = "noti"+i;
	document.getElementById(id).style.opacity = "1.0";
}
function del_mouse_out(i){
	var id = "del"+i;
	document.getElementById(id).style.opacity = "0.0";
	var id = "noti"+i;
	document.getElementById(id).style.opacity = "0.0";
}


function delete_row(i){
	var the_table = document.getElementById("courses");
	var crn = the_table.rows[i+1].cells[1].innerHTML;;
	$.ajax({
		url: BACK_END_LOC+'delete_registration',
		type:'POST',
		data:({
			netid:glob_netid,
			crn: crn
		}),
		success: function(o){
			glob_data.splice(i,1);
			maketable();
		},
		failure: function(){
			console.log("Error");
			payload = false;
		}
	});

}
function updateNotification(elem,crn){
	var status = elem.getAttribute("data-status");
	if(status=="off"){
		elem.innerHTML = '<i class="material-icons" title="Get notified when a spot is open!">&#xE7F7;</i>';
		elem.setAttribute("data-status","on");
		$.ajax({
			url: BACK_END_LOC+'update_registration',
			type:'POST',
			data:({
				netid:glob_netid,
				notification:1,
				crn:crn
			}),
			success: function(o){
				console.log(o);
			},
			failure: function(){
				console.log("Error");
			}
		});
	}else{
		elem.innerHTML = '<i class="material-icons" title="Get notified when a spot is open!">&#xE7F6;</i>';
		elem.setAttribute("data-status","off");
		$.ajax({
			url: BACK_END_LOC+'update_registration',
			type:'POST',
			data:({
				netid:glob_netid,
				notification:0,
				crn:crn
			}),
			success: function(o){
				console.log(o);
			},
			failure: function(){
				console.log("Error");
			}
		});
	}
	
}
function recommend(){
	$.ajax({
		url: BACK_END_LOC+'get_recommend',
		type:'POST',
		data:({
			area:glob_area,
			standing:glob_standing
		}),
		success: function(o){
			console.log(o);
			get_recommend(o);
		},
		failure: function(){
			console.log("Error");
			payload = false;
		}
	});
}
function update_recommend(){
	var container = document.getElementById("bigcontainer");
	var str ='<i class="contact3-form-title material-icons return" title="Go back" onclick="maketable()">&#xe5c4;</i>'
						+'<div class="contact3-form-title3">Recommended</div>';
	str += '<table id="courses2" class="table table-hover"><caption style="caption-side:top;color:white">Required</caption><thead><tr>'
					+ '<th width="50%">Course</th>'
					+ '<th width="50%">Title</th>'
					+ '</tr></thead><tbody>';
		for(i in major_data){
			let course = major_data[i];
			let course_number = course[1];
			let title = course[3];
			let instructor = course[2];
			let time = course[8];
			let crn = course[0];
			let p = '\''+course_number+'\',\''+title+'\',\''+instructor+'\',\''+time+'\',\''+crn+'\',\'major\'';
			str += '<tr style="cursor:pointer;" onclick="show_details('+p+')">'
					+ '<td class="animated flipInX" style="animation-delay: 0.'+i+'s;">'+course_number+'</td>'
					+ '<td class="animated flipInX" style="animation-delay: 0.'+i+'s;">'+title+'</td>'
					+ '</tr>';
		}
		str += '</tbody></table>';

		str += '<table id="courses3" class="table table-hover"><caption style="caption-side:top;color:white">Elective</caption><thead><tr>'
					+ '<th width="50%">Course</th>'
					+ '<th width="50%">Title</th>'
					+ '</tr></thead><tbody>';
		for(i in minor_data){
			let course = minor_data[i];
			let course_number = course[1];
			let title = course[3];
			let instructor = course[2];
			let time = course[8];
			let crn = course[0];
			let p = '\''+course_number+'\',\''+title+'\',\''+instructor+'\',\''+time+'\',\''+crn+'\',\'minor\'';
			str += '<tr style="cursor:pointer;" onclick="show_details('+p+')">'
					+ '<td class="animated flipInX" style="animation-delay: 0.'+i+'s;">'+course_number+'</td>'
					+ '<td class="animated flipInX" style="animation-delay: 0.'+i+'s;">'+title+'</td>'
					+ '</tr>';
		}
		str += '</tbody></table>';
		str += '<div id="overlay"><div id="inside_overlay">To fill in real data</div></div>';
		container.innerHTML = str;
}
function get_recommend(data){
	if(data==null){
		var container = document.getElementById("bigcontainer");
		var str ='<i class="contact3-form-title material-icons return" title="Go back" onclick="maketable()">&#xe5c4;</i>'
						+'<div class="contact3-form-title3">Recommended</div>';
		str+='<div class="contact3-form-title2">No recommended course!</div>';
		container.innerHTML = str;
	}else{
		major_data = data[0]
		minor_data = data[1]
		update_recommend();
	}

}
function show_details(course_number,title,instructor,time,crn,major){
	var container = document.getElementById("inside_overlay");
	container.innerHTML = '<i class="contact3-form-title material-icons" style="float:right;margin-right:20%;cursor:pointer;font-size:30px;" title="Go back" onclick="document.getElementById(\'overlay\').style = \'width:0;\'">&#xe5c4;</i>'
							+ '<div style="font-size:40px;font-family: Poppins-Bold;">'+course_number+'</div>'
							+ '<div class="row">'
							+ '<div class="col-sm-12">Title: '+title+'</div>'
							+ '<div class="col-sm-12">CRN: '+crn+'</div>'
							+ '<div class="col-sm-12">Instructor: '+instructor+'</div>'
							+ '<div class="col-sm-12">Time: '+time+'</div>'
							+ '<div class="col-sm-12" style="padding-top:20px;"><button class="contact3-form-btn" onclick="add_to_courselist(\''+crn+'\',\''+major+'\');">Add this course</button></div>'
							+ '</div>';
	document.getElementById("overlay").style = "width:100%;"
	window.scrollTo(0,0);
}
function add_to_courselist(crn,major){
	document.getElementById("overlay").style = "width:0;";
	//todo: tell the server
	if(major=="major"){
		for(i in major_data){
			if(major_data[i]['crn']==crn){
				major_data.splice(i,1);
				break;
			}
		}
		let table = document.getElementById("courses2");
		let str = '<caption style="caption-side:top;color:white">Required</caption><thead><tr>'
					+ '<th width="50%">Course</th>'
					+ '<th width="50%">Title</th>'
					+ '</tr></thead><tbody>';
		for(i in major_data){
			let course = major_data[i];
			let course_number = course[1];
			let title = course[3];
			let instructor = course[2];
			let time = course[8];
			let p = '\''+course_number+'\',\''+title+'\',\''+instructor+'\',\''+time+'\',\''+course[0]+'\',\'major\'';
			str += '<tr style="cursor:pointer;" onclick="show_details('+p+')">'
					+ '<td>'+course_number+'</td>'
					+ '<td>'+title+'</td>'
					+ '</tr>';
		}
		str += '</tbody></table>';
		add_to_db(crn);
		table.innerHTML = str;
	}else{
		for(i in minor_data){
			if(minor_data[i]['crn']==crn){
				minor_data.splice(i,1);
				break;
			}
		}
		let table = document.getElementById("courses3");
		let str = '<caption style="caption-side:top;color:white">Elective</caption><thead><tr>'
					+ '<th width="50%">Course</th>'
					+ '<th width="50%">Title</th>'
					+ '</tr></thead><tbody>';
		for(i in minor_data){
			let course = minor_data[i];
			let course_number = course[1];
			let title = course[3];
			let instructor = course[2];
			let time = course[8];
			let p = '\''+course_number+'\',\''+title+'\',\''+instructor+'\',\''+time+'\',\''+course[0]+'\',\'minor\'';
			str += '<tr style="cursor:pointer;" onclick="show_details('+p+')">'
					+ '<td>'+course_number+'</td>'
					+ '<td>'+title+'</td>'
					+ '</tr>';
		}
		str += '</tbody></table>';
		add_to_db(crn);
		table.innerHTML = str;
	}
}
function clear_ph(){
	document.getElementById("bigcontainer").style = "opacity:1.0;"
	$('#crn').val("")
}

function restoreOpacity(){
	document.getElementById("bigcontainer").style = "opacity:0.85;";
}

function add_to_db(crn,refresh=false){
	if(crn==null){
		var crn = $("#crn").val();
	}
	$.ajax({
		url: BACK_END_LOC+'insert_registration',
		type:'POST',
		data:({
			netid:glob_netid,
			crn: crn
		}),
		success: function(o){
			if(o=="fail"){
				return;
			}
			let update = true;
			for(i in glob_data){
				if(glob_data[i]["crn"]==o[0]["crn"]){
					update = false;
				}
			}
			if(update){
				glob_data.push(o[0]);
			}
			if(refresh){
				maketable();
			}

		},
		failure: function(){
			console.log("Error");
			payload = false;
		}
	});
}

function editprofile(){
	var container = document.getElementById("bigcontainer");
	container.innerHTML = '<form class="contact3-form validate-form" id="formcontainer">'
				+ '<span class="contact3-form-title">Update Profile</span>'
				+ '<div class="wrap-input3 validate-input" data-validate="Only put in provided Standing(freshman, sophomore, junior, senior)">'
				+ '<input class="input3" type="text" id="standing" name="standing" placeholder="'+glob_standing+'">'
				+ '<span class="focus-input3"></span>'
				+ '</div>'
				+ '<div class="wrap-input3 validate-input" data-validate="Only put in provided areas(software, algorithm, ai, social, media, security, machine)">'
				+ '<input class="input3" type="text" id="area" name="area" placeholder="'+glob_area+'">'
				+ '<span class="focus-input3"></span>'
				+ '</div>'
				+ '</div>'
				+ '<div class="container-contact3-form-btn">'
				+ '<button class="contact3-form-btn" onclick="updateprofile();return false;">Submit</button>'
				+ '</div></form>';
}

function updateprofile(){
	let standing = $("#standing").val();
	if(standing==""){
		standing = glob_standing;
	}
	let area = $("#area").val();
	if(area==""){
		area = glob_area;
	}
	let s = $('.validate-input input[name="standing"]');
	let a = $('.validate-input input[name="area"]');
	let cond_standing = false;
	if(standing!="freshman"&&standing!="sophomore"&&standing!="junior"&&standing!="senior"){
		let thisAlert = $(s).parent();
        $(thisAlert).addClass('alert-validate');
        cond_standing = true;
	}else{
		let thisAlert = $(s).parent();
        $(thisAlert).removeClass('alert-validate');
	}
	let cond_area = false;
	if(area!="software"&&area!="algorithm"&&area!="ai"&&area!="social"&&area!="media"&&area!="security"&&area!="machine"){
		let thisAlert = $(a).parent();
        $(thisAlert).addClass('alert-validate');
        cond_area = true;
	}else{
		let thisAlert = $(a).parent();
        $(thisAlert).removeClass('alert-validate');
	}
	if(cond_standing||cond_area){
		return;
	}else{
		maketable();
	}
	glob_standing = standing;
	glob_area = area;
	$.ajax({
		url:BACK_END_LOC+'update_user',
		type:'POST',
		data:({
			netid:glob_netid,
			standing:glob_standing,
			area:glob_area
		}),
		success: function(o){

		},
		failure: function(){
			console.log("Error");
		}
	});
}

function check_status(){
	var netid = sessionStorage.getItem('netid_scheduler');
	if(netid!=null){
		checkexists(netid,true);
	}
}
function logout(){
	sessionStorage.removeItem('netid_scheduler');
	location.reload();
}

