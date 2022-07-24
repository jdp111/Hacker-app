"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
let favorites;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  favorites = storyList;
  $storiesLoadingMsg.remove();

  putStoriesOnPage(storyList);
}

/**
 * 
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {           //input is an object of type "Story", returns html to include story on the page
  console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <button id = "nonfavorite " class ="star"> ☆ </button>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage(storyDisplay) {
  console.debug("putStoriesOnPage");
  $allStoriesList.empty();
  
  // loop through all of our stories and generate HTML for them
  for (let story of storyDisplay.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
  //markStars()
  removePostsOption()
}



//function markStars(){
  //setTimeout(function(){
  
//favorites.stories.forEach(function(val){
  //  $(`#${val.storyId}`).children('.star').eq(0).text('★');
 //   $(`#${val.storyId}`).children('.star').attr("id","favorite")
//  })
//},500)}


function removePostsOption(){

  storyList.stories.forEach(function(val){
    if (val.username == currentUser.username){
      const $removeButton = $('<button id = "delete">Remove</button>')
      $(`#${val.storyId}`).append($removeButton)
    }
  })
}

$('#all-stories-list').on("click",'#delete',async function(evt){
  
  const ret = await axios({
    url: `https://hack-or-snooze-v3.herokuapp.com/stories/${evt.target.parentElement.id}`,
    method: "DELETE",
    data: {"token": currentUser.loginToken},
  });
  evt.target.parentElement.remove()
  storyList = await StoryList.getStories();

})