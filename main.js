// When the window is loaded all the dynamic content is created and appended to the right places
//When the folders are clicked the class of d-none is being removed and when an close icon in the folder is 
//clicked the d-none class is being added

const categoryFolderTemplate = document.querySelector(".category-folder-template").content;
const artCategories = document.querySelector(".categories"); //Place to append the main menu categories/folders
const artPieceTemplate = document.querySelector(".art-piece-template").content;
const pathTemplate = document.querySelector(".path-template").content;
const subCategoryTemplate = document.querySelector(".sub-category-template").content;
const artPiecesCategories = document.querySelector(".art-pieces-categories");
const spinner = document.getElementById("spinner"); //preloader temporary
const body = document.querySelector("BODY");
const openFolderContainer = document.querySelector(".open-folder-container")
const folderPath = document.querySelector(".path-to-the-folder");
const backArrow = document.querySelector(".back-arrow");
const thisPCBtn = document.querySelector(".thispc")
const infoPopUp = document.querySelector(".info-pop-up");
const photoContainer = document.querySelector(".photo-container")
const closeImg = document.getElementById("closeImg");


window.addEventListener("DOMContentLoaded", init)

document.querySelector(".closeBTn").onclick = function () {
  resetheightandWidth(openFolderContainer)
  resetheightandWidth(artPiecesCategories)
  openFolderContainer.classList.add("d-none");
  while (folderPath.firstChild) {
    folderPath.removeChild(folderPath.firstChild);
  }
}

const popupWindowOk = document.querySelector(".info-pop-up-ok")
popupWindowOk.onclick = function () {
  infoPopUp.classList.add("d-none");
}


const popupWindowClose = document.querySelector(".info-pop-up-closeBtn")
popupWindowClose.onclick = function () {
  infoPopUp.classList.add("d-none");
}



closeImg.onclick = function () {
  const images = document.querySelectorAll(".art-piece")
  photoContainer.style.display = "none";
  infoPopUp.classList.add("d-none");
  images.forEach(img => {
    img.classList.remove("active"); //Remove the class active
  })
  resetheightandWidth(photoContainer)
  resetheightandWidth(photo)
  nextFoto.style.display = "block";
  previousPhoto.style.display = "block";
}

function init() {
  spinner.removeAttribute('hidden'); //preloader shows up
  fetch("https://timidesign.org/kea/wordpress-excersize/wordpress/wordpress/wp-json/wp/v2/art_categories").then(res => {
    return res.json()
  }).then(data => {
    spinner.setAttribute('hidden', '')
    cloneNotepad(); //Function that will copy notepadIcon and assign functionality for contact
    cloneNotepadAbout() //Function to append abuut page icon
    addVideobtn() // add video bnt
    data.forEach(category => {
      getCategories(category, artCategories);
      createSubcategories(category, artPiecesCategories)
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


    document.querySelectorAll(".category-folder").forEach(btn => btn.onclick = function () {
      while (folderPath.firstChild) {
        folderPath.removeChild(folderPath.firstChild);
      }
      let canBeAddedTothePath = true;

      clickedFolder(btn, canBeAddedTothePath)
      path()
    })

    thisPCBtn.onclick = function () {
      let canBeAddedTothePath = false;
      clickedFolder(thisPCBtn, canBeAddedTothePath)
      while (folderPath.firstChild) {
        folderPath.removeChild(folderPath.firstChild);
      }
    }
  })

  backArrow.onclick = function () {
    const parent = document.querySelector(".art-pieces-categories");
    const artPieces = document.querySelectorAll(".artPieces");
    const lastChildOfFolderPath = folderPath.querySelector(".pathNameAndIcon:last-child") //selects the last pathName

    const allFolderPathWords = folderPath.querySelectorAll(".pathNameAndIcon") //selects the last pathName
    folderPath.removeChild(lastChildOfFolderPath); //removes the last folder name

    let folder;
    if (allFolderPathWords.length == 1) {
      folder = thisPCBtn;
    } else {
      folder = allFolderPathWords[allFolderPathWords.length - 2];
    }
    clickedFolder(folder);
  }
}



function cloneNotepad() {
  const clnContact = document.querySelector(".contact-page").cloneNode(true);
  clnContact.classList.add("subcategory-file")
  clnContact.addEventListener("click", openContact);
  artPiecesCategories.appendChild(clnContact);
}

function cloneNotepadAbout() {
  const clnAboutbtn = aboutPagebtn.cloneNode(true);
  clnAboutbtn.classList.add("subcategory-file")
  clnAboutbtn.addEventListener("click", openAboutPage);
  artPiecesCategories.appendChild(clnAboutbtn);
}


const videoPageBtn = document.querySelector(".video-page-btn")
const closeBTnvideo = document.querySelector(".closeBTnvideo");
const videoContainer = document.querySelector(".open-video-container");

videoPageBtn.onclick = function () {
  showVideo()
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
  const pathNameBtns = document.querySelectorAll(".pathNameAndIcon")
  pathNameBtns.forEach(pathName => {
    pathName.onclick = function () {
      let canBeAddedTothePath = false;
      let siblingNode = pathName.nextSibling;

      clickedFolder(pathName, canBeAddedTothePath) ///function that will display the correct folder and calls a function to change the path name
      while (siblingNode) {
        siblingNode = pathName.nextSibling;
        folderPath.removeChild(siblingNode);
      }
    }
  })
}



function clickedFolder(folder, canBeAddedTothePath) {
  const artPiecePlaces = document.querySelectorAll(".artPieces")
  openFolderContainer.classList.remove("d-none");
  const folderName = folder.querySelector(".name").textContent.toLowerCase().split(' ').join('');
  if (canBeAddedTothePath == true) {
    getCustomPath(folderName) //Changes the file path by addind the name of the clicked folder
  }

  artPiecePlaces.forEach(artPlace => {
    if (artPlace.classList.contains(folderName)) { //First checks for the arPlace if it has the class name as the clicked button name
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