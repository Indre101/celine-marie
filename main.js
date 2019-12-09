// When the window is loaded all the dynamic content is created and appended to the right places
//When the folders are clicked the class of d-none is being removed and when an close icon in the folder is 
//clicked the d-none class is being added

const categoryFolderTemplate = document.querySelector(".category-folder-template").content;
const artCategories = document.querySelector(".categories"); //Place to append the main menu categories/folders
const artPieceTemplate = document.querySelector(".art-piece-template").content;
const pathTemplate = document.querySelector(".path-template").content;
const subCategoryTemplate = document.querySelector(".sub-category-template").content;
const spinner = document.getElementById("spinner"); //preloader temporary
const openFolderContainerTemplate = document.querySelector(".open-folder-container-template").content
const body = document.querySelector("BODY");
window.addEventListener("DOMContentLoaded", init)

function init() {

  spinner.removeAttribute('hidden'); //preloader shows up
  fetch("http://indre101.lashboutique.dk/wordpress/wp-json/wp/v2/art_categories?_embed").then(res => {
    return res.json()
  }).then(data => {
    appendFolders()

    // console.log(document.querySelector(".open-folder-container"))
    spinner.setAttribute('hidden', ''); //preloader hides
    data.forEach((category) => {
      appendArtPiecesOrSubcategories(category)
      getCategories(category, artCategories)
    }) 
    
    //gets the categories and the rest of the folders

    // appendMyComputerFolder(data) //Function that will append and create the Mycomputer open folder


    //   const thisPcBTns = document.querySelectorAll(".this-pc"); //All the this pc buttons in the folder path
    //   thisPcBTns.forEach(btn => {
    //     openTheRightFolder(btn, btn.textContent.toLowerCase().split(' ').join('')) //Calls a function that will find the open folder with the name thispc and will display it
    //   })
  }).then(()=>{
    const subcategories=document.querySelectorAll(".subcategory")
    const childernElements= document.querySelectorAll(".artPieces")
    console.log(subcategories);
    subcategories.forEach(e=>{
      childernElements.forEach(c=>{

        if (c.classList.contains(e.querySelector(".name").textContent)) {
            e.appendChild(c)
  
          console.log("object");
        }
      })
  
    })
  })

}


//Shows either an opened folder with subcategory folders or a folder with displayed art 
//Category = art, illustrations or as well subcategories paintings, sculptures. Artarray = the array in the json, that categories have(art_category_id)
function appendFolders(category, artArray) {
  const clnOpenFolderContainer = openFolderContainerTemplate.cloneNode(true);
  const customPath = clnOpenFolderContainer.querySelector(".custom-path");
  // const artPieces = clnOpenFolderContainer.querySelector(".art-pieces");
  const closeButton = clnOpenFolderContainer.querySelector(".closeBTn");
  const openFolderContainers = clnOpenFolderContainer.querySelector(".open-folder-container");
  // const nameOfTheFolder = clnOpenFolderContainer.querySelector(".name-of-the-folder");
  // if (category.post_title) {
  //   nameOfTheFolder.textContent = category.post_title.toLowerCase();
  // } else if (category.title.rendered) {
  //   nameOfTheFolder.textContent = category.title.rendered.toLowerCase();
  // }

  const parentFolder = document.createElement("div");
  parentFolder.classList.add("thisPc")
  openFolderContainers.appendChild(parentFolder)

  closeButton.onclick = function () { //closes the folder
    // zIndex = 0

    openFolderContainers.classList.add("d-none");
  }
  body.appendChild(clnOpenFolderContainer)
}


function appendArtPiecesOrSubcategories(category, artArray) {
const parentFolder= document.querySelector(".thisPc")


  // parentFolder.appendChild(parentFolder);
  
  let newClassName;
  if (category.post_title) {
    newClassName = category.post_title.toLowerCase();
  } else if (category.title.rendered) {
    newClassName = category.title.rendered.toLowerCase();
  }
  //Checks if the category has post_title OR category.title.rendered and assigns the name of the folder


  // changeTheFilePath(category, customPath) //calls a function that will change the path of folder
  if (category.art_category_id) { //Checks if category has art_category_id array and then calls a function that would display the art pieces
    const artPieces = document.createElement("div");
    artPieces.classList.add("artPieces")
    artPieces.classList.add(newClassName);
    parentFolder.appendChild(artPieces);


    category.art_category_id.forEach(art => {
      showArtPieceList(art, artPieces)
    })
  }

  if (category.art_piece_id) {
    const artPieces = document.createElement("div");
    artPieces.classList.add("artPieces")
    artPieces.classList.add(newClassName);
    parentFolder.appendChild(artPieces);
    artArray.forEach(art => {
      showArtPieceList(art, artPieces)
    })
  }

  

  if (category.subcategory_id) { //Checks if category has subcategories and then calls a function that would display subcategories
    const artPieces = document.createElement("div");
    artPieces.classList.add("artPieces")
    artPieces.classList.add(category.title.rendered.toLowerCase());

  
  
    parentFolder.appendChild(artPieces);

    category.subcategory_id.forEach(subCategory => {
      showSubCategories(subCategory, artPieces)
    })
  }
}




// IF the category has subcategories this function will be called to show them
function showSubCategories(subCategory, placeToAppend) {
      


  const clnSubCategory = subCategoryTemplate.cloneNode(true); //Template of subcategory
  const subCategoryName = clnSubCategory.querySelector(".subCategoryName")
  subCategoryName.textContent = subCategory.post_title.toLowerCase()

  const subcategory = clnSubCategory.querySelector(".subcategory");
  subcategory.classList.add(subCategory.post_title.toLowerCase())
  //subCategory.art_piece_id is and object with objects inside, so i converted it to array
  const convertedArtArray = Object.keys(subCategory.art_piece_id).map(i => subCategory.art_piece_id[i])
  appendArtPiecesOrSubcategories(subCategory, convertedArtArray) //Function that will create and append open-folder container with art, but will not be displayed
  openTheRightFolder(subcategory, subCategoryName.textContent) //Function that will display the correct open folder according on the subcategory clicked

  placeToAppend.appendChild(clnSubCategory)
}

// Appends all the art pieces to the art-pieces container in the open-folder-container;
function showArtPieceList(piece, placeToAppendTo) {
  let artPieceCln = artPieceTemplate.cloneNode(true);
  artPieceCln.querySelector(".art-piece-name").textContent = piece.post_title.toLowerCase()
  artPieceCln.querySelector(".art-piece-large-icon").src = piece.featured_image.guid
  placeToAppendTo.appendChild(artPieceCln) // Place to append is element with art-pieces class in the open-folder-container template;
}

// Navigation in the folder

// //Shows either an opened folder with subcategory folders or a folder with displayed art
// //Category = art, illustrations or as well subcategories paintings, sculptures. Artarray = the array in the json, that categories have(art_category_id)
// function appendMyComputerFolder(data) {
//   const clnOpenFolderContainer = openFolderContainerTemplate.cloneNode(true);
//   const customPath = clnOpenFolderContainer.querySelector(".custom-path");
//   const artPieces = clnOpenFolderContainer.querySelector(".art-pieces");
//   const closeButton = clnOpenFolderContainer.querySelector(".closeBTn");
//   const openFolderContainers = clnOpenFolderContainer.querySelector(".open-folder-container");
//   const nameOfTheFolder = clnOpenFolderContainer.querySelector(".name-of-the-folder")
//   //Checks if the category has post_title OR category.title.rendered and assigns the name of the folder
//   nameOfTheFolder.textContent = "thispc";
//   console.log("nameOfTheFolder");
//   data.forEach((category) => {

//     getCategories(category, artPieces, "1.3rem", "normal", "black")
//   })
//   closeButton.onclick = function () { //closes the folder
//     // zIndex = 0

//     openFolderContainers.classList.add("d-none");
//   }
//   body.appendChild(clnOpenFolderContainer)
// }

//adds categories/folders t
function getCategories(category, placeToAppend, namefontSize, namefontWeight, namefontColor) {
  let clnMenuFolder = categoryFolderTemplate.cloneNode(true);
  let categoryName = clnMenuFolder.querySelector(".category-name")
  categoryName.textContent = category.title.rendered.toLowerCase()
  categoryName.style.fontSize = namefontSize;
  categoryName.style.fontWeight = namefontWeight;
  categoryName.style.color = namefontColor;
  let imagesInsideFolderIcon = clnMenuFolder.querySelector(".images-inside-folder-icon");
  let categoryFolder = clnMenuFolder.querySelector(".category-folder");
  // artCategories.appendChild(clnMenuFolder);
  placeToAppend.appendChild(clnMenuFolder);

  if (category.art_category_id.length > 0) { //If the category does NOT have subcategories
    addImgaesToFolderIcon(category, imagesInsideFolderIcon) //Add image to the folder icon
  }
  openTheRightFolder(categoryFolder, categoryName.textContent) //When a folder is clicked it would remove display none property from the right element
}


let zIndex = 0; //This will get increased once the folder icon is clicked

// the parameters are The category/folder that is clicked and the Html markup for the folder when it is opened h2, which is not displayed but is in the mark up
function openTheRightFolder(folderToClick) {
  const folders = document.querySelectorAll(".artPieces") //selects all the open-folder-container that are already appended to the body but are not displayed
  // const namesOfTheFolders = document.querySelectorAll(".name-of-the-folder"); // the open-folder-container has a h2, that is not displayed but is selected in order to compare the names
  folderToClick.onclick = function () { //Once a folder is clicked
    const folderName = folderToClick.querySelector(".name").textContent.toLowerCase().split(' ').join('')
    zIndex++; //this will increase so the folder would be on top
    folders.forEach(folder => { //goes through all open-folder-container h2
      folder.classList.add("d-none")
      if (folder.classList.contains(`${folderName}`)) { //checks if the name of the h2, is the same as the name of the clicked folder
        let folderParent = folder.parentElement //Selects the h2 parent element, so the correct open-folder-container
        folderParent.classList.remove("d-none");
        folder.classList.remove("d-none")
        folderParent.style.zIndex = zIndex;
      }
    })
  }
}



// Changes the file path(it's not working perfectly, yet :D)
//Path name = name of the clicked folder, customPath = is an element with custom-path class inside open-folder-container template 
function changeTheFilePath(pathName, customPath) {
  // add a new path name, since the path has to have an image and text i thought the template would be best approach
  const clnPath = pathTemplate.cloneNode(true);
  const name = clnPath.querySelector(".path-name")

  //because some elements in json had either a post_title or title.rendered it checks which one it has and then inserts it
  if (pathName.post_title) {
    name.textContent = pathName.post_title.toLowerCase();

  } else if (pathName.title.rendered) {
    name.textContent = pathName.title.rendered.toLowerCase();
  }
  customPath.appendChild(clnPath)
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