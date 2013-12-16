$(document).ready(function() {



//Function to generate random ID hashes. 

	function makeid(n)
	{
	    var text = "a";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < n; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return text;
	}	



	var usersOnline = new Firebase('https://santalist.firebaseIO.com/users/');
	usersOnline.on('value', function(event) {
					//alert('change');
		event.forEach(function(person) {
		  	

			//delete existing faces

			//$('.face').not('#proto').remove();

			var people = person.val();
			//console.log(people.connections);


			var people2 = people.link;
			//console.log (people2);
			var people3 = people2.replace('https://www.facebook.com/','');
			var people4 = '<img src="http://graph.facebook.com/'+people3+'/picture" alt="'+people.firstname+'">';
			//console.log(people4);

			  
			  //Check if user exists
			  console.log($('#'+people.firstname+people.lastname).length)
			  if ($('#'+people.firstname+people.lastname).length > 0) {
 					if(people.connections!=undefined){

 						console.log('people.connections: '+people.connections+' online');
				   		$(".face#"+people.firstname+people.lastname).css('border','2px solid #D32F2F');
				    }else{
				  		$(".face#"+people.firstname+people.lastname).css('border', '2px solid #eee');
				  		console.log('id: '+people.firstname+people.lastname+' people.connections: '+people.connections+' offline');
				  	}   			  
			  }else{

				  var newID = makeid(8);
				  if(people.connections!=undefined){
				  	var faceContainer = $(".face#proto").clone(true).attr('id',people.firstname+people.lastname).html(people4).css('border','2px solid blue');
				  }else{
				  	var faceContainer = $(".face#proto").clone(true).attr('id',people.firstname+people.lastname).html(people4);
				  }
				  	
				  //eventContainer.find('div').attr('id',newID);
	              $(".face#proto").before(faceContainer);
          		}

		});
	});

});