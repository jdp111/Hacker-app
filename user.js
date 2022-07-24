"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/************************************** This whole js file is functions from the class User in model.js, except the last function that run from other js files
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$loginForm.on("submit", login);    //event listener passes login function



async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);  //event listener passes in submit function



/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);  //this function is part of user class
}


function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}
/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

async function updateUIOnUserLogin() {         //shows "logout with help of nav.js, then shows stories"
  console.debug("updateUIOnUserLogin");
  markFaves();                //marks user saved favorites
  $allStoriesList.show();     //shows hidden stories
  updateNavOnLogin();
}




async function handleFavorite(id){
  let repeat = false;
  if (currentUser){        //determines if somoene is logged in and allowed to have favorites
  if (favorites){          //favorites array must exist to be compared
  repeat = favorites.stories.some(function(val){ //determines if any favorite stories have the same id as the clicked story
  return val.storyId == id;
  })}
  
  if (!repeat){      //determine whether to add or delete
  await addFav(id);
  }else{
    await deleteFav(id);
  }
}
}


async function addFav(id){       //adds post by id to the favorites list
  const addFav = await axios({
    url: `https://hack-or-snooze-v3.herokuapp.com/users/${currentUser.username}/favorites/${id}`,
    method: "POST",
    data: {"token": currentUser.loginToken},
  });
  const favArray = addFav.data.user.favorites;
  const stories = favArray.map(story => new Story(story));
  favorites =  new StoryList(stories);  //makes favorites into storyList for display
  return favorites;
}



async function deleteFav(id){   //deletes post by id from the favorites list
  const delFav = await axios({
      url: `https://hack-or-snooze-v3.herokuapp.com/users/${currentUser.username}/favorites/${id}`,
      method: "DELETE",
      data: {"token": currentUser.loginToken},
    });
    const favArray = delFav.data.user.favorites;
    const stories = favArray.map(story => new Story(story));
    favorites =  new StoryList(stories); //makes favorites into storyList for display
    return favorites
  }

function toggleFav(evt){    //runs the get/post function and handles UI display
  const newId = evt.target.parentElement.id;
  handleFavorite(newId);

  if (evt.target.innerText == `★`){
    evt.target.innerText = 	`☆`;
    evt.target.id = "nonfavorite";
  }else{
    evt.target.innerText = `★`;
    evt.target.id = "favorite";
  }
}

$('.stories-list').on("click",".star",toggleFav)


async function markFaves(){  //inits whenever story lists are displayed and marks favorites with star
if (currentUser){    //makes sure someone is logged in

  await deleteFav(storyList.stories.at(-1).storyId); //sets favorites list into an array of stories

  favorites.stories.forEach(function(val){  //iterates through favorites to mark them
    $(`#${val.storyId}`).children('.star').eq(0).text('★');
    $(`#${val.storyId}`).children('.star').attr("id","favorite")
  })
}}