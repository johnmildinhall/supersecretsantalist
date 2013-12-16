$(document).ready(function() {


			// Read a page's GET URL variables and return them as an associative array.
	function getUrlVars()
	{
	    var vars = [], hash;
	    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	    for(var i = 0; i < hashes.length; i++)
	    {
	        hash = hashes[i].split('=');
	        vars.push(hash[0]);
	        vars[hash[0]] = hash[1];
	    }
	    return vars;
	}
	var params=getUrlVars();
	if (params.user==null){params.user='your'}else{params.user+="'s"}

	$('#login').html("Log in with Facebook to see "+params.user+" Super Secret Santa List");


//Record page visits
var activityRef = new Firebase('https://santalist.firebaseIO.com/activityLog');
//console.log(activityRef);
var date = +new Date;
//console.log(date);
var occurrenceRef = activityRef.child(date);
//console.log(occurrenceRef);
occurrenceRef.set({URL : document.URL});

		  var chatRef = new Firebase('https://santalist.firebaseIO.com');
		  
		  var auth = new FirebaseSimpleLogin(chatRef, function(error, user) {
  		  if (error) {
			    // an error occurred while attempting login
			    console.log(error);
			  } else if (user) {
			    // user authenticated with Firebase
			    console.log('User ID: ' + user.id + ', Provider: ' + user.provider +', 3rd Party Data '
			    	+ user.thirdPartyUserData.first_name+' '+user.thirdPartyUserData.last_name+' '+ user.thirdPartyUserData.link+' '+ user.thirdPartyUserData.locale);

			    var myRootRef = new Firebase('https://santalist.firebaseIO.com/users');
			    var uniqueUserRef = myRootRef.child(user.id);
				
			    //catch users who have not set their gender
			    if(user.thirdPartyUserData.gender==null){user.thirdPartyUserData.gender='unknown'};
			      

				   	//Add fb data to firebase
				   	console.log(user.thirdPartyUserData.first_name,user.thirdPartyUserData.first_name);
				   	firstName = user.thirdPartyUserData.first_name;
			    	uniqueUserRef.set({firstname : user.thirdPartyUserData.first_name,lastname : user.thirdPartyUserData.last_name, link : user.thirdPartyUserData.link, username : user.thirdPartyUserData.username, gender : user.thirdPartyUserData.gender, timezone : user.thirdPartyUserData.timezone, locale: user.thirdPartyUserData.locale, verified: user.thirdPartyUserData.verified, updated : user.thirdPartyUserData.updated_time, name : user.thirdPartyUserData.name});
			    	friends(uniqueUserRef, user.accessToken);


				



			    //Get user image and display it top right
			    var imageURL = 'http://graph.facebook.com/'+user.thirdPartyUserData.username+'/picture';
			    console.log(imageURL);
			    $('#username').html(user.thirdPartyUserData.first_name+' '+user.thirdPartyUserData.last_name);
			    $('#fbImage').html('<img id="fbImage" src="'+imageURL+'">')

			    


			    //list user data available
			    //for (var key in user.thirdPartyUserData) {
  				//	console.log(key);
				//}

				//Get friend list if last time logged in >30 days ago


				//Set user as online
				var myConnectionsRef = new Firebase('https://santalist.firebaseIO.com/users/'+user.id+'/connections');

				// stores the timestamp of my last disconnect (the last time I was seen online)
				var lastOnlineRef = new Firebase('https://santalist.firebaseIO.com/users/'+user.id+'/lastOnline');


				// add this device to my connections list
				var con = myConnectionsRef.push(true);
				// when I disconnect, remove this device
        		con.onDisconnect().remove();

        		// when I disconnect, update the last time I was seen online
        		lastOnlineRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);

        		$('#overlay').hide();

        	    setTimeout(function (){

					$('#share').fadeIn();

         		}, 2000); 


			  } else {
			    // user is logged out
			  }
		   });


	$('#login').click(function(){
		//alert('hello');
		auth.login('facebook', {
  			rememberMe: true,
  			scope: 'email,user_likes'
		});
		return false;
	});

	$('#fbShare').click(function(){
		//alert('hello');

		var message = firstName+' shared a Super Secret Santa List';
		var href = 'http://www.supersecretsantalist.com/index.html?user='+firstName;
		fbShare(message,'This is the message','A Super Secret Santa List lets you share exactly what you want for Christmas with your nearest and dearest.','',href,'');
		return false;
	});         

//mobile






//Facebook share function
	//Code to publish to wall
  function fbShare(name,message,caption,description,url,picture) {
     FB.ui(
       {

       	    method: 'feed',
     		name: name,
     		link: url,
    		picture: picture,
     		caption: caption,
     		description: description,
     		message: message

       },
       function(response) {
         if (response && response.post_id) {
           $('#fbShare').html('Thanks for sharing!')
           //alert('Post was published.');
         } else {
           alert('Post was not published.');
         }
       }
     );  
  	}

//Get friend list
function friends(uniqueUserRef, userAccessToken){
	var friendsRef = uniqueUserRef.child('friends');
	$.ajax({
			type: 'get',
			url: 'https://graph.facebook.com/me/friends',
			data: {
			access_token: userAccessToken
		},
		dataType: 'json'
		}).done(function(response) {
			console.log(response);
			for (var i = 0; i < response.data.length; i++) {
 					   
 		   		//console.log(response.data[i]);
    	   		friendsRef.child(response.data[i].id).set({name: response.data[i].name});
			}
					
		});
}

});