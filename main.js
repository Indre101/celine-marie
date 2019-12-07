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

  spinner.removeAttribute('hidden');
  fetch("http://indre101.lashboutique.dk/wordpress/wp-json/wp/v2/art_categories?_embed").then(res => {
    return res.json()
  }).then(data => {
    spinner.setAttribute('hidden', '');
    data.forEach(getCategories)
  })

}

// <img class="image-sample" src="./images/water.png" alt="">
function getCategories(category) {
  console.log(category)
  let clnMenuFolder = categoryFolderTemplate.cloneNode(true);
  let categoryName = clnMenuFolder.querySelector(".category-name")
  categoryName.textContent = category.title.rendered.toLowerCase()
  let imagesInsideFolderIcon = clnMenuFolder.querySelector(".images-inside-folder-icon");
  let categoryFolder = clnMenuFolder.querySelector(".category-folder");
  artCategories.appendChild(clnMenuFolder);

  if (category.art_category_id.length > 0) {
    addImgaesToFolderIcon(category, imagesInsideFolderIcon)
    openFolder(category, category.art_category_id)
  } else if (category.subcategory_id.length > 0) {
    openFolder(category, category.art_category_id)
    // openFolderWithSubCategories(category)
  }
  openTheRightFolder(categoryFolder, categoryName.textContent)


}

let zIndex = 0;

function openTheRightFolder(folderToClick, nameToCompare) {
  const folders = document.querySelectorAll(".open-folder-container")
  const namesOfTheFolders = document.querySelectorAll(".name-of-the-folder");
  folderToClick.onclick = function () {
    zIndex++;
    namesOfTheFolders.forEach(name => {
      if (name.textContent == nameToCompare) {
        console.log(name.textContent, nameToCompare)
        let folder = name.parentElement
        folder.classList.remove("d-none");
        folder.style.zIndex = zIndex;
      }
    })
  }
}


function openFolder(category, artArray) {
  const clnOpenFolderContainer = openFolderContainerTemplate.cloneNode(true);
  const customPath = clnOpenFolderContainer.querySelector(".custom-path");
  const artPieces = clnOpenFolderContainer.querySelector(".art-pieces");
  const closeButton = clnOpenFolderContainer.querySelector(".closeBTn");
  const openFolderContainers = clnOpenFolderContainer.querySelector(".open-folder-container");
  const nameOfTheFolder = clnOpenFolderContainer.querySelector(".name-of-the-folder");
  if (category.post_title) {
    nameOfTheFolder.textContent = category.post_title.toLowerCase();

  } else if (category.title.rendered) {
    nameOfTheFolder.textContent = category.title.rendered.toLowerCase();
  }


  changeTheFilePath(category, customPath)
  if (artArray) {
    artArray.forEach(art => {
      showArtPieceList(art, artPieces)
    })
  }


  if (category.subcategory_id) {
    category.subcategory_id.forEach(subCategory => {
      showSubCategories(subCategory, artPieces)
    })

  }

  closeButton.onclick = function () {
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