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

window.addEventListener("DOMContentLoaded", init)

document.querySelector(".closeBTn").onclick = function () {
  openFolderContainer.classList.add("d-none");
  while (folderPath.firstChild) {
    folderPath.removeChild(folderPath.firstChild);
  }
}

function init() {
  spinner.removeAttribute('hidden'); //preloader shows up
  fetch("http://indre101.lashboutique.dk/wordpress/wp-json/wp/v2/art_categories?_embed").then(res => {
    return res.json()
  }).then(data => {
    spinner.setAttribute('hidden', '')
    cloneIconsFromDesktop();

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
    // console.log(document.querySelectorAll(".artPieces"));
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


function cloneIconsFromDesktop() {
  const clnContact = document.querySelector(".contact-page").cloneNode(true);
  clnContact.classList.add("subcategory-file")
  clnContact.addEventListener("click", openContact);
  artPiecesCategories.appendChild(clnContact);

}

function path() {
  const pathNameBtns = document.querySelectorAll(".pathNameAndIcon")
  pathNameBtns.forEach(pathName => {
    pathName.onclick = function () {
      let canBeAddedTothePath = false;
      let siblingNode = pathName.nextSibling;
      clickedFolder(thisPCBtn, canBeAddedTothePath) ///function that will display the correct folder and calls a function to change the path name
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
        artPlace.style.display = "block"; //display the container
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
  // if (category.art_category_id.length > 0) { //If the category does NOT have subcategories
  //   addImgaesToFolderIcon(category, imagesInsideFolderIcon) //Add image to the folder icon
  // }
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
  placeToAppendTo.appendChild(artPieceCln) // Place to append is element with art-pieces class in the open-folder-container template;
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