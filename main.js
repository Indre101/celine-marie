// Template for menu folders
const menuFolderTemplate = document.querySelector(".category-folder-template").content;
const artCategories = document.querySelector(".categories");


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


  if (category.art_category_id.length > 0) {
    addImgaesToFolderIcon(category, imagesInsideFolderIcon)
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