"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */
//story = {title,author,url}

function navAllStories(evt) {              //handles the home button only
  console.debug("navAllStories", evt);
  
  putStoriesOnPage(storyList);
  $('#nav-new-story').show();
  markFaves();

}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {             //handles click on login/signup only
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {           //accessed in user.js, now shows "logout" on navbar
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();  //links showing up when logged in
  $("#fave-link").show()
  $('#nav-new-story').show();
  $loginForm.hide();           //change for right side nav display
  $signupForm.hide();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function submitClick(){   //hides the stories and shows submit form
  hidePageComponents();
  $submitForm.show();
  $('#nav-new-story').hide();
  
}

async function redirectFormSubmit(){    // submits story and navigates back to stories
  const title = $('#title').val();
  const url = $('#url').val();
  if(!title || !url){alert("must specify Title and URL"); return 0}
  $('#title').val('');
  $('#url').val('');
  $('#nav-new-story').show();
  $submitForm.hide();
  const list = await storyList.addStory(currentUser,{title, "author": currentUser.name,url});
  getAndShowStoriesOnStart();   //This is required because the story list has changed
  markFaves();   //must re-mark favorites for every story list refresh
  return list;

}


$("#nav-new-story").on("click", submitClick);
$('#subbut').on("click",redirectFormSubmit);



function seeFaves(){         //hides all stories and displays favorites
  hidePageComponents();
  putStoriesOnPage(favorites);
  markFaves();  //must re-mark favorites for every story list refresh
}

$('#fave-link').on("click",seeFaves);