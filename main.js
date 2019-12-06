// Template for menu folders
const menuFolderTemplate = document.querySelector(".category-folder-template").content;
const artCategories = document.querySelector(".categories");


fetch("http://indre101.lashboutique.dk/wordpress/wp-json/wp/v2/art_categories").then(res => {
  return res.json()
}).then(data => {
  data.forEach(getCategories)
})




function getCategories(category) {
  let clnMenuFolder = menuFolderTemplate.cloneNode(true);
  clnMenuFolder.querySelector(".category-name").textContent = category.title.rendered;
  artCategories.appendChild(clnMenuFolder);
  console.log(category);
}