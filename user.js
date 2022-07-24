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

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

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
  markFaves();
  $allStoriesList.show();
  updateNavOnLogin();
  
}




async function toggleFavorite(id){
  let repeat = false;

  if (favorites){          //determines if you have already added to favorites
  repeat = favorites.stories.some(function(val){
  return val.storyId == id;
  });
  }
  
  if (!repeat){
  await addFav(id);
  }else{
    await deleteFav(id);
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
  favorites =  new StoryList(stories);
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
    favorites =  new StoryList(stories);
    return favorites
  }

function toggleFav(evt){
  const newId = evt.target.parentElement.id;
  toggleFavorite(newId);

  if (evt.target.innerText == `★`){
    evt.target.innerText = 	`☆`;
    evt.target.id = "nonfavorite";
  }else{
    evt.target.innerText = `★`;
    evt.target.id = "favorite";
  }
}

$('.stories-list').on("click",".star",toggleFav)


async function markFaves(){
if (currentUser){

  await deleteFav(storyList.stories.at(-1).storyId);

  favorites.stories.forEach(function(val){
    $(`#${val.storyId}`).children('.star').eq(0).text('★');
    $(`#${val.storyId}`).children('.star').attr("id","favorite")
  })
}}