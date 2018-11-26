var mode = 1;
var elems = 0;
var glob_name="";
var glob_netid="";
var glob_standing="";
var glob_area="";
var glob_data;
var BACK_END_LOC = "http://182.220.149.166:7777/cs_scheduler/";

function init(name,netid,standing,area,data){
	//elems = data length
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
	return false;
}

function signin(){
	var netid = $("#netid").val();
	checkexists(netid);
}

function signup(){
	var netid = $("#netid").val();
	var firstname = $("#firstname").val();
	var lastname = $("#lastname").val();
	var standing = $("#standing").val();
	var area = $("#area").val();
	$.ajax({
		url:BACK_END_LOC+"insert_user",
		type:'POST',
		data:({
			netid:netid,
			firstname:firstname,
			lastname:lastname,
			standing:standing,
			area:area
		}),
		success: function(o){

		},
		failure: function(){
			console.log("Error");
		}
	});
	mode = 1;
	name = firstname+" "+lastname;
	init(name,netid,standing,area,null);
}

function checkexists(netid){
	//check user exists
	var payload;
	$.ajax({
		url: BACK_END_LOC+'check_user',
		type:'POST',
		data:({
			netid:netid
		}),
		success: function(o){
			payload = o;
			if(payload==null){
				var container = document.getElementById("formcontainer");
				container.innerHTML = '<span class="contact3-form-title">sign up</span>'
						+ '<div class="wrap-input3 validate-input" data-validate="Name is required">'
						+ '<input class="input3" type="text" id="netid" name="name" placeholder="NetId" value="'+netid+'">'
						+ '<span class="focus-input3"></span>'
						+ '</div>'
						+ '<div class="wrap-input3 validate-input" data-validate="Name is required">'
						+ '<input class="input3" type="text" id="firstname" name="name" placeholder="First Name">'
						+ '<span class="focus-input3"></span>'
						+ '</div>'
						+ '<div class="wrap-input3 validate-input" data-validate="Name is required">'
						+ '<input class="input3" type="text" id="lastname" name="name" placeholder="Last Name">'
						+ '<span class="focus-input3"></span>'
						+ '</div>'
						+ '<div class="wrap-input3 validate-input" data-validate="Name is required">'
						+ '<input class="input3" type="text" id="standing" name="name" placeholder="Standing">'
						+ '<span class="focus-input3"></span>'
						+ '</div>'
						+ '<div class="wrap-input3 validate-input" data-validate="Name is required">'
						+ '<input class="input3" type="text" id="area" name="name" placeholder="Area">'
						+ '<span class="focus-input3"></span>'
						+ '</div>'
						+ '</div>'
						+ '<div class="container-contact3-form-btn">'
						+ '<button class="contact3-form-btn" onclick="return sub();">Submit</button>'
						+ '</div>';
				mode = 2;
			}else{
				var name = payload['firstname']+" "+payload['lastname'];
				var data = payload['courses'];
				var standing = payload['standing'];
				var area = payload['area'];
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
	var container = document.getElementById("bigcontainer");
	container.innerHTML = '<div class="row">'
			+'<div class="col-sm-8"><span class="contact3-form-title">Hello<br>'+glob_name+'</span></div>'
			+'<div class="col-sm-4">'
			+'<div class="btn-group-vertical">'
			+'<button type="button" class="btn contact3-form-btn" onclick="editprofile();">Update Profile</button>'
			+'<button type="button" class="btn contact3-form-btn" data-toggle="modal" data-target="#myModal" onclick="clear_ph();"><i class="fa fa-plus"></i> Add New</button>'
			+'</div></div></div>'
			+'<div class="modal fade" id="myModal" role="dialog">'
			+'<div class="modal-dialog">'
			+'<div class="modal-content">'
			+'<div class="modal-header">'
			+'<button type="button" class="close" data-dismiss="modal">&times;</button>'
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
			+'<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'
			+'<button class="contact3-form-btn" data-dismiss="modal" onclick="add_to_db();">Submit</button>'
			+'</div>'
			+'</div>'
			+'</div>'
			+'</div>';
	if(glob_data!=null && glob_data.length>0){
		var str = '';
		str += '<table id="courses" class="table table-hover"><thead><tr>'
					+ '<th>Course</th>'
					+ '<th>CRN</th>'
					+ '<th>Title</th>'
					+ '<th>Instructor</th>'
					+ '</tr></thead><tbody>';
		for(i in glob_data){
			course = glob_data[i];
			str += '<tr onmouseover="del_mouse_over('+i+');" onmouseout="del_mouse_out('+i+');">'
					+ '<td>'+course['course_number']+'</td>'
					+ '<td>'+course['crn']+'</td>'
					+ '<td>'+course['title']+'</td>'
					+ '<td>'+course['instructor']+'</td>'
					+ '<td class="del" id="del'+i+'" onclick="delete_row('+i+')"><i class="material-icons">&#xE872;</i> </td>'
					+ '</tr>';
		}
		str += '</tbody></table>';
		container.innerHTML += str;
	}
			
}

function del_mouse_over(i){
	var id = "del"+i;
	document.getElementById(id).style.opacity = "1.0";
}
function del_mouse_out(i){
	var id = "del"+i;
	document.getElementById(id).style.opacity = "0.0";
}
function delete_row(i){
	var the_table = document.getElementById("courses");
	var crn = the_table.rows[i+1].cells[1].innerHTML;;
	$.ajax({
		url: BACK_END_LOC+'delete_course',
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

function clear_ph(){
	$('#crn').val("")
}

function add_to_db(){
	var crn = $("#crn").val();
	$.ajax({
		url: BACK_END_LOC+'insert_course',
		type:'POST',
		data:({
			netid:glob_netid,
			crn: crn
		}),
		success: function(o){
			if(o=="false"){
				return;
			}
			glob_data.push(o);
			maketable();
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
				+'<span class="contact3-form-title">Update Profile</span>'
				+ '<div class="wrap-input3 validate-input" data-validate="Name is required">'
				+ '<input class="input3" type="text" id="standing" name="name" placeholder="Standing" value="'+glob_standing+'">'
				+ '<span class="focus-input3"></span>'
				+ '</div>'
				+ '<div class="wrap-input3 validate-input" data-validate="Name is required">'
				+ '<input class="input3" type="text" id="area" name="name" placeholder="Area" value="'+glob_area+'">'
				+ '<span class="focus-input3"></span>'
				+ '</div>'
				+ '</div>'
				+ '<div class="container-contact3-form-btn">'
				+ '<button class="contact3-form-btn" onclick="updateprofile();maketable();return false;">Submit</button>'
				+ '</div></form>';
}

function updateprofile(){
	glob_standing = $("#standing").val();
	glob_area = $("#area").val();
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


