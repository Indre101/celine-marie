// Template for menu folders
const categoryFolderTemplate = document.querySelector(".category-folder-template").content;
const artCategories = document.querySelector(".categories");
const artPieceTemplate = document.querySelector(".art-piece-template").content;
const folderPath = document.querySelector(".folder-path")
const pathTemplate = document.querySelector(".path-template").content;
const subCategoryTemplate = document.querySelector(".sub-category-template").content;
const spinner = document.getElementById("spinner");
const openFolderContainer = document.querySelector(".open-folder-container");
const openFolderContainerTemplate = document.querySelector(".open-folder-container-template").content
const body = document.querySelector("BODY");
window.addEventListener("DOMContentLoaded", init)

function init() {

  spinner.removeAttribute('hidden'); //preloader shows up
  fetch("http://indre101.lashboutique.dk/wordpress/wp-json/wp/v2/art_categories?_embed").then(res => {
    return res.json()
  }).then(data => {
    spinner.setAttribute('hidden', ''); //preloader hides
    data.forEach(getCategories)
  })

}


//adds categories/folders t
function getCategories(category) {
  console.log(category)
  let clnMenuFolder = categoryFolderTemplate.cloneNode(true);
  let categoryName = clnMenuFolder.querySelector(".category-name")
  categoryName.textContent = category.title.rendered.toLowerCase()
  let imagesInsideFolderIcon = clnMenuFolder.querySelector(".images-inside-folder-icon");
  let categoryFolder = clnMenuFolder.querySelector(".category-folder");
  artCategories.appendChild(clnMenuFolder);


  if (category.art_category_id.length > 0) { //If the category does NOT have subcategories

    addImgaesToFolderIcon(category, imagesInsideFolderIcon) //Add image to the folder icon
    openFolder(category, category.art_category_id) //Calls a function to show the art list
  } else if (category.subcategory_id.length > 0) { //If the category HAS subcategories
    openFolder(category, category.art_category_id) //Calls a function that will show open folder with subcategories as folders
  }

  openTheRightFolder(categoryFolder, categoryName.textContent) //When a folder is clicked it would remove display none property from the right element

}

let zIndex = 0; //This will get increased once the folder icon is clicked 

// the parameters are The category/folder that is clicked and the Html markup for the folder when it is opened h2, which is not displayed but is in the mark up
function openTheRightFolder(folderToClick, nameToCompare) {
  const folders = document.querySelectorAll(".open-folder-container") //selects all the open-folder-container that are already appended to the body but are not displayed
  const namesOfTheFolders = document.querySelectorAll(".name-of-the-folder"); // the open-folder-container has a h2, that is not displayed but is selected in order to compare the names
  folderToClick.onclick = function () { //Once a folder is clicked
    zIndex++; //this will increase so the folder would be on top
    namesOfTheFolders.forEach(name => { //goes through all open-folder-container h2
      if (name.textContent == nameToCompare) { //checks if the name of the h2, is the same as the name of the clicked folder
        console.log(name.textContent, nameToCompare)
        let folder = name.parentElement //Selects the h2 parent element, so the correct open-folder-container
        folder.classList.remove("d-none");
        folder.style.zIndex = zIndex;
      }
    })
  }
}


//Shows either an opened folder with subcategory folders or a folder with displayed art 
function openFolder(category, artArray) {
  const clnOpenFolderContainer = openFolderContainerTemplate.cloneNode(true);
  const customPath = clnOpenFolderContainer.querySelector(".custom-path");
  const artPieces = clnOpenFolderContainer.querySelector(".art-pieces");
  const closeButton = clnOpenFolderContainer.querySelector(".closeBTn");
  const openFolderContainers = clnOpenFolderContainer.querySelector(".open-folder-container");
  const nameOfTheFolder = clnOpenFolderContainer.querySelector(".name-of-the-folder");

  //Checks if the category has post_title OR category.title.rendered and assigns the name of the folder
  if (category.post_title) {
    nameOfTheFolder.textContent = category.post_title.toLowerCase();

  } else if (category.title.rendered) {
    nameOfTheFolder.textContent = category.title.rendered.toLowerCase();
  }


  changeTheFilePath(category, customPath)



  if (artArray) { //Checks if category has art_category_id array and then calls a function that would display the art pieces
    artArray.forEach(art => {
      showArtPieceList(art, artPieces)
    })
  }


  if (category.subcategory_id) { //Checks if category has subcategories and then calls a function that would display subcategories
    category.subcategory_id.forEach(subCategory => {
      showSubCategories(subCategory, artPieces)
    })

  }

  closeButton.onclick = function () { //closes the folder
    // zIndex = 0

    openFolderContainers.classList.add("d-none");
  }
  body.appendChild(clnOpenFolderContainer)
}


// Changes the file path and remove display none class from the open folder container
function changeTheFilePath(pathName, customPath) {
  // add a new path name, since the path has to have an image and text i thought the template would be best approach
  const clnPath = pathTemplate.cloneNode(true);
  const name = clnPath.querySelector(".path-name")
  if (pathName.post_title) {
    name.textContent = pathName.post_title.toLowerCase();

  } else if (pathName.title.rendered) {
    name.textContent = pathName.title.rendered.toLowerCase();
  }
  customPath.appendChild(clnPath)
}



function showSubCategories(subCategory, placeToAppend) {
  const clnSubCategory = subCategoryTemplate.cloneNode(true);
  const subCategoryName = clnSubCategory.querySelector(".subCategoryName")
  subCategoryName.textContent = subCategory.post_title.toLowerCase()
  const subcategory = clnSubCategory.querySelector(".subcategory");
  const convertedArtArray = Object.keys(subCategory.art_piece_id).map(i => subCategory.art_piece_id[i])
  openFolder(subCategory, convertedArtArray)
  openTheRightFolder(subcategory, subCategoryName.textContent)
  placeToAppend.appendChild(clnSubCategory)
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



function showArtPieceList(piece, placeToAppendTo) {
  let artPieceCln = artPieceTemplate.cloneNode(true);
  artPieceCln.querySelector(".art-piece-name").textContent = piece.post_title.toLowerCase()
  artPieceCln.querySelector(".art-piece-large-icon").src = piece.featured_image.guid
  placeToAppendTo.appendChild(artPieceCln)
}