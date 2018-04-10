$(document).ready(function(){
	$('.deletePoint').on('click',deleteUser);

});

function deleteUser(){
	var confirmation = confirm('Are you Sure?');
	if(confirmation){
	$.ajax({
		type:'DELETE',
		url: '/points/delete/'+ $(this).data('id')
	}).done(function(response){
		window.location.replace('/');
	});
   }
   else{
   	 return false;
   }
}


function getLocation() {
    if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        document.getElementById("locat").value = "Geolocation is not supported by this browser.";
    }
}
function showPosition(position) {
    document.getElementById("locat").value = "[" + position.coords.latitude + "," + position.coords.longitude + "]";
}