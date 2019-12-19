// When the window is loaded all the dynamic content is created and appended to the right places
// The pop up window when an image is clicked is not a template, it changes it's values simpy by rewriting it's values with a function

const categoryFolderTemplate = document.querySelector(".category-folder-template").content; //Template Mark up of the category folder (Folder icon and category name)
const artCategories = document.querySelector(".categories"); //Place to append the main menu categories/folders(the categories you see on the landing page)
const artPieceTemplate = document.querySelector(".art-piece-template").content; //Template for the art piece which has image of art and name 
const pathTemplate = document.querySelector(".path-template").content; //The template for the folder path to append, that is  an arrow and name of the clicked category/subcategory
const subCategoryTemplate = document.querySelector(".sub-category-template").content; //This is a template that is for subcategories, the main difference between categories and subcategories template is that subcategory template has a place to append the art pieces
const artPiecesCategories = document.querySelector(".art-pieces-categories"); //The container where it s displayed categories subcategories when a folder is open
const spinner = document.getElementById("spinner"); //preloader selected
const body = document.querySelector("BODY"); // The body element
const openFolderContainer = document.querySelector(".open-folder-container") //It is the container that shows up once a main category is open and basically containes all the content
const folderPath = document.querySelector(".path-to-the-folder"); //The folder path container
const backArrow = document.querySelector(".back-arrow"); //Arrow that allows to go back between the folders
const thisPCBtn = document.querySelector(".thispc") //It's the this pc option to click in the folder path
const infoPopUp = document.querySelector(".info-pop-up"); // the pop up window that shows up once an art piece is clicked
const photoContainer = document.querySelector(".photo-container") // The pop up window that shows up once a art piece is clicked
const closeImg = document.getElementById("closeImg"); //An X/close icon of the popup window window that shows up once a art piece 


window.addEventListener("DOMContentLoaded", init) //Once the  HTML has loaded, it will call the init function

//A close button of the container that shows up once a category is clicked
document.querySelector(".closeBTn").onclick = function () {
  resetheightandWidth(openFolderContainer) //This function is is being called to reset the size of the open folder container
  resetheightandWidth(artPiecesCategories) //this function is is being called to reset the size of the container inside the open folder container where all the categeories/images displayed
  openFolderContainer.classList.add("d-none"); //It will close the open folder container
  while (folderPath.firstChild) { // this is checking if the folder path has any appended elements/children
    folderPath.removeChild(folderPath.firstChild); //If it does not have any more elements left inside the folderpath container the while loop will end and clear the folder path.
  }
}


const popupWindowOk = document.querySelector(".info-pop-up-ok") //OK Button inside the pop up Information window
popupWindowOk.onclick = function () {
  infoPopUp.classList.add("d-none"); // Once the OK button is clicked the modal/infoPopUp will be closed
}


const popupWindowClose = document.querySelector(".info-pop-up-closeBtn") //It's a close button of the Information popup window 
popupWindowClose.onclick = function () {
  infoPopUp.classList.add("d-none"); // Once the close button is clicked the modal/infoPopUp will be closed
}



closeImg.onclick = function () { //Close button of the modal that shows up once an art piece is clikced, that shows the larger version of the image
  const images = document.querySelectorAll(".art-piece") //selects all the art pieces that are already appended 
  photoContainer.style.display = "none"; //The pop up window that showed up as the image was clicked is closed
  infoPopUp.classList.add("d-none"); //If the popup window with image Information was not closed, it will be closed now
  images.forEach(img => { //For each method to go through all the art pieces
    img.classList.remove("active"); //Remove the class active from any art piece that has a class active, which was added once the image was clicked
  })
  resetheightandWidth(photoContainer) //resets the photoContainer width and height, back to normal, in case it was maximised to full screen
  resetheightandWidth(photo) // resets the heigh and with of the photo in case it was maximised to full screen
  nextFoto.style.visibility = "visible"; //The arrow that lets you see the next art piece visisbility is set back to being visisble
  previousPhoto.style.visibility = "visible"; // The arrow that lets you see the previous art piece visisbility is set back to being visisble
}

function init() { //The function that is called on window event
  spinner.removeAttribute('hidden'); //preloader shows up
  fetch("https://timidesign.org/kea/wordpress-excersize/wordpress/wordpress/wp-json/wp/v2/art_categories").then(res => { //fetching 
    return res.json() //Getting the response
  }).then(data => { //Takes json response 
    spinner.setAttribute('hidden', '') //Hides the spinnner/preloader
    cloneNotepad(); //Function that will copy notepadIcon and assign functionality for it to show contact information
    cloneNotepadAbout() //Function to append abuut page icon and assign functionality to show about page once it's clicked
    addVideobtn() // adds video btn clone and assigns functionality to show video once it's clicked
    data.forEach(category => { //hadle the data from json
      getCategories(category, artCategories); //this function created the main categories that you see on the landing page
      createSubcategories(category, artPiecesCategories) //This function creates the html markup for categories with subcategories and art pieces inside and appends it to the  open folder container place-artPiecesCategories
    })

  }).then(() => {
    const subCategoryBtns = document.querySelectorAll(".subcategory-icon-and-name")
    subCategoryBtns.forEach(btn => {
      btn.onclick = function () {
        let canBeAddedTothePath = true;
        clickedFolder(btn, canBeAddedTothePath) //function that will display the correct folder and calls a function to change the path name
        path() //function that one a path btn is clicked the path will be cleared out untill the clicked button it's called here cause only here you can access all the added btns
      }
    })


    document.querySelectorAll(".category-folder").forEach(btn => btn.onclick = function () { //This is selecting already appeneded main categories on the landing page and adds onclick function
      while (folderPath.firstChild) { // this is checking if the folder path has any appended elements/children
        folderPath.removeChild(folderPath.firstChild); //If it does not have any more elements left inside the folderpath container the while loop will end and clear the folder path.
      }

      let canBeAddedTothePath = true; //A variable whose state is used to check if the name of the clicked item should be appended to the folder path or not
      clickedFolder(btn, canBeAddedTothePath) //Once a category is clicked it's name is being appended to the folder path and this function displays correct content according the clicked folder
      path() //This function is called to clear out the folder path until the clicked name on the folder path and it makes sure that the same name was not added again in the folder path
    })




    //This Pc button is added in html mark up, so once it's clicked the folder path place where the folder path is changed, when the clicked folder names are appended it will be cleared out, leaving just this pc displayed
    thisPCBtn.onclick = function () { //The button in the folder path that is for displaying in the open folder the elements that are on the landing page
      let canBeAddedTothePath = false; //The variable that is set to false that makes sure that the name of This pc would not be added to the folder path again
      clickedFolder(thisPCBtn, canBeAddedTothePath) //This function will display the correct content in the open folder container
      while (folderPath.firstChild) { //this is checking if the folder path has any appended elements/children
        folderPath.removeChild(folderPath.firstChild); //It will remove all the elements from the forlder path util this PC
      }
    }
  })

  backArrow.onclick = function () { //The button that let's you go back in the open folder
    const parent = document.querySelector(".art-pieces-categories"); //Selects the parent container where the categories/subactegories/art pieces are appended
    const artPieces = document.querySelectorAll(".artPieces"); //Selects all the art pieces
    const lastChildOfFolderPath = folderPath.querySelector(".pathNameAndIcon:last-child") //selects the last pathName on the folder path

    const allFolderPathWords = folderPath.querySelectorAll(".pathNameAndIcon") //selects all the appended folder path names, that where appended by clicking through folders
    folderPath.removeChild(lastChildOfFolderPath); //removes the last name in the folder path

    let folder; //variable that will contain the value of the name that is second to last in the folder path before removing the last name in the foler path
    if (allFolderPathWords.length == 1) { //Checks how many elements the folder path contains if it is 1 
      folder = thisPCBtn; //The folder will be equeal to this pc value, that is in the folder path
    } else {
      folder = allFolderPathWords[allFolderPathWords.length - 2]; //If there are more values in the array of the folder path, the folder will be equal to the second to last value in the folder path
    }
    let canBeAddedTothePath = false; //Since it is false the value will not be added to the folder path
    clickedFolder(folder, canBeAddedTothePath); //The fucntion that will show the correct content in the open folder container is called with either This pc button or second to last value in the folder path
  }
}



function cloneNotepad() { //This function is call in the init function to clone append the contact button to the open folder container, you can see this icon when you click on this pc or back arrow
  const clnContact = document.querySelector(".contact-page").cloneNode(true); //clones the contact btn from the landing page categories
  clnContact.classList.add("subcategory-file") //adds a class that helps to style the button to fit into open folder container
  clnContact.addEventListener("click", openContact); //Assign the same function as the one on the landing screen has
  artPiecesCategories.appendChild(clnContact); //Appends the clone to the openfolder container where the main categories are appended
}

function cloneNotepadAbout() { //This function is call in the init function to clone append the about button to the open folder container, you can see this icon when you click on this pc or back arrow
  const clnAboutbtn = aboutPagebtn.cloneNode(true); //clones the about btn from the landing page categories
  clnAboutbtn.classList.add("subcategory-file") //adds a class that helps to style the button to fit into open folder container
  clnAboutbtn.addEventListener("click", openAboutPage); //Assign the same function as the one on the landing screen has
  artPiecesCategories.appendChild(clnAboutbtn); //Appends the clone to the openfolder container where the main categories are appended
}


const videoPageBtn = document.querySelector(".video-page-btn") //Button on the landing screen that once clicked shows video vidow
const closeBTnvideo = document.querySelector(".closeBTnvideo"); //The close button of the video window
const videoContainer = document.querySelector(".open-video-container"); //the video window

videoPageBtn.onclick = function () { //once the video button on the landing page is clicked
  showVideo() //calls a function that will display the video widow by removing d-none class;
}


function showVideo() {
  videoContainer.classList.remove("d-none");
}

closeBTnvideo.onclick = function () {
  videoContainer.classList.add("d-none");

}


function addVideobtn() {
  const videoPageBtncln = videoPageBtn.cloneNode(true);
  videoPageBtncln.classList.add("subcategory-file")
  videoPageBtncln.addEventListener("click", showVideo);
  artPiecesCategories.appendChild(videoPageBtncln);
}


function path() {
  const pathNameBtns = document.querySelectorAll(".pathNameAndIcon") //Selects all the appened names to the folder path
  pathNameBtns.forEach(pathName => { //Goes through each folder path name
    pathName.onclick = function () { //Once a name in the folder path is clicked
      let canBeAddedTothePath = false; //This variable will set the the clicked name would not be added again
      let siblingNode = pathName.nextSibling; //Selects the sibling og the clicked name in the folder path

      clickedFolder(pathName, canBeAddedTothePath) ///function that will display the correct folder and folder path will not be changed since canBeAddedTothePath = false
      while (siblingNode) { //it will check if the clicked name in the path still has a sibling
        siblingNode = pathName.nextSibling; //Keeps selecting the next sibling
        folderPath.removeChild(siblingNode); //Deletes the sibling, that the folder path would only be until the clicked name in the folder bath
      }
    }
  })
}



function clickedFolder(folder, canBeAddedTothePath) {
  const artPiecePlaces = document.querySelectorAll(".artPieces") //Selects all the appended art pieces
  openFolderContainer.classList.remove("d-none"); //removes the display none class from the open folder container
  const folderName = folder.querySelector(".name").textContent.toLowerCase().split(' ').join(''); //makes sure that the name would be lower case and without gaps 
  if (canBeAddedTothePath == true) { //It is checking if the clicked button's name should be appended to the folder path
    getCustomPath(folderName) //Changes the file path by addind the name of the clicked folder
  }

  artPiecePlaces.forEach(artPlace => { //Iterates through all ar pieces 
    if (artPlace.classList.contains(folderName)) { //First checks for the artPlace if it has the class name as the clicked button name
      artPlace.querySelectorAll(".subcategory-icon-and-name").forEach(p => p.style.display = "flex") //returns display to all the subcategory folders
      if (artPlace.classList.contains("art-pieces-categories")) { //If the art place has the main class/Checks basically if it's the top hierarchy level
        artPlace.style.display = "flex"; //display the container
        artPlace.querySelectorAll(".subcategory-file").forEach(sub => sub.style.display = "flex"); //Display all the files(notepad, video)
      } else { //If it is not the top hierarchy folder
        artPlace.style.display = "flex"; //Change display property to flex from none
        artPiecesCategories.style.display = "block"; //Make sure that the top folder is displayed
        while ((artPlace = artPlace.parentElement) && !artPlace.classList.contains("art-pieces-categories")) //While it is not the top layer
          artPlace.style.display = "flex"; //Make sure that every top layer is being displayed, otherwise if any of artPlace parent element has display none property the elements won't be displayed
      }
    } else { //if the artPlace does not have the class as the clicked button name 
      artPlace.style.display = "none"; // do not display it
      artPlace.querySelectorAll(".subcategory-icon-and-name").forEach(p => p.style.display = "none") //and do not display anything inside the container
      artPlace.querySelectorAll(".subcategory-file").forEach(b => b.style.display = "none");

    }
  })
}

function getCustomPath(folder) { //This function will create custom folder paths
  const clnpathTemplate = pathTemplate.cloneNode(true); //Clones the path template
  clnpathTemplate.querySelector(".path-name").textContent = folder; //assigns the name of the clicked button/folder
  folderPath.appendChild(clnpathTemplate) //Appends the cln to the folder path place;

}


function getCategories(category, placeToAppend) {
  let clnMenuFolder = categoryFolderTemplate.cloneNode(true);
  let categoryName = clnMenuFolder.querySelector(".category-name")
  categoryName.textContent = category.title.rendered.toLowerCase()
  let imagesInsideFolderIcon = clnMenuFolder.querySelector(".images-inside-folder-icon");
  let categoryFolder = clnMenuFolder.querySelector(".category-folder");
  categoryFolder.onclick = function () {
    openFolderContainer.classList.remove("d-none");
  }
  placeToAppend.appendChild(clnMenuFolder);
}


// Function to customise the folder icon
function addImgaesToFolderIcon(imageURL, containerToAppendTo) {
  for (let index = 0; index < 1; index++) {
    let imageOfArt = document.createElement("img");
    imageOfArt.classList.add("image-sample");
    imageOfArt.src = imageURL.art_category_id[index].featured_image.guid
    containerToAppendTo.appendChild(imageOfArt);
  }
}


function createSubcategories(category, placeToAppend) {
  const clnsubCategoryTemplate = subCategoryTemplate.cloneNode(true);
  clnsubCategoryTemplate.querySelector(".subCategoryName").textContent = getThename(category);
  clnsubCategoryTemplate.querySelector(".subcategory").classList.add(getThename(category));
  const artSubcategory = clnsubCategoryTemplate.querySelector(".artSubcategory")
  artSubcategory.classList.add(getThename(category))
  const artPiecesLists = artSubcategory.querySelector(".artPieces")
  artPiecesLists.classList.add(getThename(category))

  if (category.subcategory_id) {
    category.subcategory_id.forEach(sub => {
      const clnsubCategoryTemplate = subCategoryTemplate.cloneNode(true);
      clnsubCategoryTemplate.querySelector(".subCategoryName").textContent = getThename(sub);
      clnsubCategoryTemplate.querySelector(".subcategory").classList.add(getThename(sub));
      const artSubcategoryInner = clnsubCategoryTemplate.querySelector(".artSubcategory")
      artSubcategoryInner.classList.add(getThename(sub))
      const artPiecesListsInner = artSubcategoryInner.querySelector(".artPieces")
      artPiecesListsInner.classList.add(getThename(sub))
      getTheArtPieces(sub, artPiecesListsInner)
      artPiecesLists.appendChild(clnsubCategoryTemplate)
    })
  } else if (category.art_category_id) {
    getTheArtPieces(category, artPiecesLists)
  }

  placeToAppend.appendChild(clnsubCategoryTemplate);
}



function getTheArtPieces(category, placeToAppendTo) {
  if (category.art_category_id) {
    category.art_category_id.forEach(artPiece => {
      showArtPieceList(artPiece, placeToAppendTo)

    })
  } else if (category.art_piece_id) {
    const convertedArtArray = Object.keys(category.art_piece_id).map(i => category.art_piece_id[i])
    convertedArtArray.forEach(artPiece => {
      showArtPieceList(artPiece, placeToAppendTo)
    })
  }
}



function showArtPieceList(piece, placeToAppendTo) {
  let artPieceCln = artPieceTemplate.cloneNode(true);
  artPieceCln.querySelector(".art-piece-name").textContent = piece.post_title.toLowerCase()
  artPieceCln.querySelector(".art-piece-large-icon").src = piece.featured_image.guid

  artPieceCln.querySelector(".art-piece-large-icon").setAttribute("alt", `${piece.post_title.toLowerCase()}`);
  artPieceCln.querySelector(".descirption").textContent = piece.post_excerpt;
  artPieceCln.querySelector(".year").textContent = piece.year;


  const artPiecePhotoandName = artPieceCln.querySelector(".art-piece")
  artPiecePhotoandName.onclick = function () {
    artPiecePhotoandName.classList.add("active");
    switchBetweenImages(false);
    infoPopUp.classList.remove("d-none");
    photoContainer.classList.remove("d-none");
    photoContainer.style.display = "flex";

    popUpIwndows(artPiecePhotoandName)

  }

  placeToAppendTo.appendChild(artPieceCln) // Place to append is element with art-pieces class in the open-folder-container template;
}


const infoPopUpName = infoPopUp.querySelector(".art-piece-name")
const infoPopUpArtPieceInfo = infoPopUp.querySelector(".art-piece-info")
const infoPopupArtPieceYear = infoPopUp.querySelector(".art-piece-year")
const photoContainerPhotosrc = photoContainer.querySelector(".photo")
const photoHeader = photoContainer.querySelector(".photoHeader h4");

function popUpIwndows(artPiecePhotoandName) {
  infoPopUp.classList.remove("d-none");
  infoPopUpName.textContent = artPiecePhotoandName.querySelector(".art-piece-name").textContent
  infoPopUpArtPieceInfo.textContent = artPiecePhotoandName.querySelector(".descirption").textContent
  infoPopupArtPieceYear.textContent = artPiecePhotoandName.querySelector(".year").textContent
  photoContainerPhotosrc.src = artPiecePhotoandName.querySelector(".art-piece-large-icon").src
  photoContainerPhotosrc.setAttribute("alt", `${artPiecePhotoandName.querySelector(".art-piece-name").textContent}`);

  photoHeader.textContent = artPiecePhotoandName.querySelector(".art-piece-name").textContent
}


const previousPhoto = document.querySelector(".arrowPreviousPhoto");
const nextFoto = document.querySelector(".arrowNextPhoto")

const arrowPhotos = document.querySelectorAll(".arrowPhoto");

arrowPhotos.forEach(arrow => {
  arrow.onclick = function () {
    switchBetweenImages(true, arrow);
  }
})

function switchBetweenImages(statusToMoveTheActiveClass, btn) {
  const images = document.querySelectorAll(".art-piece") //Selecting all the images
  const activeImg = findActiveImg(images); //Finds an image with a class active, return the img
  const arrayOFtheImgWithinActiveImg = getTheImgArrayWithinActiveImg(activeImg); //Finds all the img withing the active img
  let indexImg = arrayOFtheImgWithinActiveImg.indexOf(activeImg) // Gets the index/ position of the active img within an array of the images;
  if (statusToMoveTheActiveClass && btn.classList.contains("arrowPreviousPhoto")) {
    indexImg--
  } else if (statusToMoveTheActiveClass && btn.classList.contains("arrowNextPhoto")) {
    indexImg++

  } else {
    console.log(false);
  }

  if (indexImg == 0) {
    previousPhoto.style.visibility = "hidden";
  } else if (indexImg == arrayOFtheImgWithinActiveImg.length - 1) {
    nextFoto.style.visibility = "hidden";
  } else {
    nextFoto.style.visibility = "visible";
    previousPhoto.style.visibility = "visible";

  }
  arrayOFtheImgWithinActiveImg[indexImg].classList.add("active");
  popUpIwndows(arrayOFtheImgWithinActiveImg[indexImg])

}


const findActiveImg = (images) => {
  let activeImg;
  images.forEach(img => {
    if (img.classList.contains("active")) { //check for image with a class Active
      img.classList.remove("active"); //Remove the class active
      activeImg = img;
    }
  })
  return activeImg
}


const getTheImgArrayWithinActiveImg = (image) => {
  const parent = image.parentElement //Find the parent element of the img with a class active
  const parentArtPieces = parent.querySelectorAll(".art-piece") //Select all the art-piece eleements within the parent element
  const parentArtPiecesAray = Array.from(parentArtPieces) //Convert the node list of parentArtPieces to array, to be able to use array method indexOf
  return parentArtPiecesAray
}



const getThename = (category) => {
  let nameOf;
  if (category.post_title) {
    nameOf = category.post_title.toLowerCase().split(' ').join('');
  } else if (category.title.rendered) {
    nameOf = category.title.rendered.toLowerCase().split(' ').join('');
  }
  return nameOf
}