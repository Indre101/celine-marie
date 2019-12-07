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
  fetch("http://indre101.lashboutique.dk/wordpress/wp-json/wp/v2/art_categories").then(res => {
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
  clnMenuFolder.querySelector(".category-name").textContent = category.title.rendered;
  let imagesInsideFolderIcon = clnMenuFolder.querySelector(".images-inside-folder-icon");
  let categoryFolder = clnMenuFolder.querySelector(".category-folder");
  artCategories.appendChild(clnMenuFolder);


  categoryFolder.onclick = function () {
    // Assign image to the folder to be inserted
    openFolder(category)

  }
  // console.log(category);
}


function openFolder(category) {



  const clnOpenFolderContainer = openFolderContainerTemplate.cloneNode(true);
  const customPath = clnOpenFolderContainer.querySelector(".custom-path");
  const artPieces = clnOpenFolderContainer.querySelector(".art-pieces");
  const closeButton = clnOpenFolderContainer.querySelector(".closeBTn");
  const openFolderContainers = clnOpenFolderContainer.querySelector(".open-folder-container");
  changeTheFilePath(category, customPath)


  if (category.art_category_id.length > 0) {
    // addImgaesToFolderIcon(category, imagesInsideFolderIcon)

    category.art_category_id.forEach(art => {
      showArtPieceList(art, artPieces)
    })

  } else if (category.subcategory_id.length > 0) {
    category.subcategory_id.forEach(subCategory => {
      showSubCategories(subCategory, artPieces)
    });
  }





  closeButton.onclick = function () {
    openFolderContainers.classList.add("d-none");
  }

  body.appendChild(clnOpenFolderContainer)
}


// Changes the file path and remove display none class from the open folder container
function changeTheFilePath(pathName, customPath) {
  // add a new path name, since the path has to have an image and text i thought the template would be best approach
  const clnPath = pathTemplate.cloneNode(true);
  const name = clnPath.querySelector(".path-name")
  name.textContent = pathName.title.rendered;
  customPath.appendChild(clnPath)

  // // removes the display none class, from the parent element 
  // let parentFolderName = customPath.parentElement
  // let openFolderContainer = parentFolderName.parentElement
  // console.log(openFolderContainer)
  // openFolderContainer.classList.remove("d-none");
}



function showSubCategories(subCategory, placeToAppend) {

  const clnSubCategory = subCategoryTemplate.cloneNode(true);
  clnSubCategory.querySelector(".subCategoryName").textContent = subCategory.post_title;

  const subcategory = clnSubCategory.querySelector(".subcategory");
  subcategory.onclick = function () {

    const clnOpenFolderContainer = openFolderContainer.cloneNode(true);
    const artPieces = clnOpenFolderContainer.querySelector(".art-pieces");


    for (let key of Object.keys(subCategory.art_piece_id)) {
      console.log(subCategory.art_piece_id[key])
      showArtPieceList(subCategory.art_piece_id[key], artPieces)
      // showArtPieceList(piece)
      // if (subCategory.art_piece_id.hasOwnProperty(key)) {
      //   console.log(`${key} : ${subCategory.art_piece_id[key]}`)
      // }
    }

    body.appendChild(clnOpenFolderContainer);

  }


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
  artPieceCln.querySelector(".art-piece-name").textContent = piece.post_title
  artPieceCln.querySelector(".art-piece-large-icon").src = piece.featured_image.guid
  placeToAppendTo.appendChild(artPieceCln)
  // console.log(piece)
}






// // Closes the open folder window and resets the file path
// closeButtons.forEach(closeWindow);

// function closeWindow(btn) {
//   btn.onclick = function () {
//     customPath.innerHTML = ""
//     let parentBtn = btn.parentElement;
//     let openFolderContainer = parentBtn.parentElement
//     openFolderContainer.classList.add("d-none");
//     console.log(mainParent)
//   }
// }