// Template for menu folders
const menuFolderTemplate = document.querySelector(".category-folder-template").content;
const artCategories = document.querySelector(".categories");
const artPieceTemplate = document.querySelector(".art-piece-template").content;
const artPieces = document.querySelector(".art-pieces");
const folderPath = document.querySelector(".folder-path")
const pathTemplate = document.querySelector(".path-template").content;

fetch("http://indre101.lashboutique.dk/wordpress/wp-json/wp/v2/art_categories").then(res => {
  return res.json()
}).then(data => {
  data.forEach(getCategories)
})


// <img class="image-sample" src="./images/water.png" alt="">
function getCategories(category) {
  let clnMenuFolder = menuFolderTemplate.cloneNode(true);
  clnMenuFolder.querySelector(".category-name").textContent = category.title.rendered;
  let imagesInsideFolderIcon = clnMenuFolder.querySelector(".images-inside-folder-icon");

  // Assign image to the folder to be inserted
  if (category.art_category_id.length > 0) {
    addImgaesToFolderIcon(category, imagesInsideFolderIcon)
    changeTheFilePath(category)
    category.art_category_id.forEach(showArtPieceList)

  }

  artCategories.appendChild(clnMenuFolder);
  console.log(category);
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
  console.log(piece)
}

function changeTheFilePath(pathName) {
  const clnPath = pathTemplate.cloneNode(true);
  clnPath.querySelector(".path-name").textContent = pathName.title.rendered;
  folderPath.appendChild(clnPath)
}