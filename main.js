// Template for menu folders
const categoryFolderTemplate = document.querySelector(".category-folder-template").content;
const artCategories = document.querySelector(".categories");
const artPieceTemplate = document.querySelector(".art-piece-template").content;
const artPieces = document.querySelector(".art-pieces");
const folderPath = document.querySelector(".folder-path")
const pathTemplate = document.querySelector(".path-template").content;
// const openFolderContainers = document.querySelectorAll(".open-folder-container");
const closeButtons = document.querySelectorAll(".closeBTn");
const subCategoryTemplate = document.querySelector(".sub-category-template").content;


fetch("http://indre101.lashboutique.dk/wordpress/wp-json/wp/v2/art_categories").then(res => {
  return res.json()
}).then(data => {
  data.forEach(getCategories)
})




// <img class="image-sample" src="./images/water.png" alt="">
function getCategories(category) {
  console.log(category)
  let clnMenuFolder = categoryFolderTemplate.cloneNode(true);
  clnMenuFolder.querySelector(".category-name").textContent = category.title.rendered;
  let imagesInsideFolderIcon = clnMenuFolder.querySelector(".images-inside-folder-icon");
  let categoryFolder = clnMenuFolder.querySelector(".category-folder");
  artCategories.appendChild(clnMenuFolder);


  categoryFolder.onclick = function () {
    artPieces.innerHTML = ""
    // Assign image to the folder to be inserted
    if (category.art_category_id.length > 0) {
      addImgaesToFolderIcon(category, imagesInsideFolderIcon)
      changeTheFilePath(category)
      category.art_category_id.forEach(showArtPieceList)
    } else if (category.subcategory_id.length > 0) {
      category.subcategory_id.forEach(showSubCategories);
      changeTheFilePath(category)
    }
  }
  // console.log(category);
}



function showSubCategories(subCategory) {
  const clnSubCategory = subCategoryTemplate.cloneNode(true);
  clnSubCategory.querySelector(".subCategoryName").textContent = subCategory.post_title;
  artPieces.appendChild(clnSubCategory)

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



function showArtPieceList(piece) {
  let artPieceCln = artPieceTemplate.cloneNode(true);
  artPieceCln.querySelector(".art-piece-name").textContent = piece.post_title
  artPieceCln.querySelector(".art-piece-large-icon").src = piece.featured_image.guid
  artPieces.appendChild(artPieceCln)
  // console.log(piece)
}

function changeTheFilePath(pathName) {
  const clnPath = pathTemplate.cloneNode(true);
  const name = clnPath.querySelector(".path-name")
  name.textContent = pathName.title.rendered;
  folderPath.appendChild(clnPath)

  let openFolderContainer = name.parentElement
  let parentFolderName = openFolderContainer.parentElement
  parentFolderName.classList.remove("d-none");
}





closeButtons.forEach(closeWindow);

function closeWindow(btn) {
  btn.onclick = function () {
    let parentBtn = btn.parentElement;
    let mainParent = parentBtn.parentElement
    mainParent.classList.add("d-none");
    console.log(mainParent)
  }
}