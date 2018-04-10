$(document).ready(function(){
	$('.deletePoint').on('click',deleteUser);

});

function deleteUser(){
	var confirmation = confirm('Are you Sure?');
	if(confirmation){
	$.ajax({
		type:'DELETE',
		url: '/points/delete/'+ $('.deletePoint').data('id')
	}).done(function(response){
		window.location.replace('/');
	});
   }
   else{
   	 return false;
   }
}