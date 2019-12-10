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
    appendFolders() //Function that will create and append one main

    // console.log(document.querySelector(".open-folder-container"))
    spinner.setAttribute('hidden', ''); //preloader hides
    data.forEach((category) => {
      appendArtPiecesOrSubcategories(category)
      getCategories(category, artCategories)
    })

    //gets the categories and the rest of the folders

    // appendMyComputerFolder(data) //Function that will append and create the Mycomputer open folder


    const thisPcBTns = document.querySelector(".this-pc"); //All the this pc buttons in the folder path
    // console.log(thisPcBTns);
    // thisPcBTns.forEach(btn => {
    // openTheRightFolder(thisPcBTns) //Calls a function that will find the open folder with the name thispc and will display it
    // })
  }).then(() => {

    const categoryFolders = document.querySelectorAll(".category-folder")
    const subcategories = document.querySelectorAll("article.subcategory")
    const childernElements = document.querySelectorAll(".artPieces")
    const openFolderContainer = document.querySelector(".open-folder-container")

    console.log(subcategories);
    categoryFolders.forEach(sub => {
      sub.classList.remove("d-none")
      sub.onclick = function () {
        showThisFolderMAin(sub, childernElements)
        openFolderContainer.classList.remove("d-none")
        showThisFolderMAin(sub, subcategories)
      }
    })

    subcategories.forEach(sub => {
      sub.classList.remove("d-none")
      childernElements.forEach(child => {
        if (child.classList.contains(sub.querySelector(".name").textContent)) {
          console.log(child);
          console.log(sub.querySelector(".name"));

          sub.appendChild(child)
          // console.log(child, sub);
        }
        sub.onclick = function () {
          // child.classList.add("d-none");
          showThisFolderMAin(sub, childernElements)
          // showThisFolder(sub, childernElements)
          openFolderContainer.classList.remove("d-none")
        }
      })

    })

  })

}


function showThisFolderMAin(sub, childernElements) {
  console.log(sub.querySelector(".name").textContent);
  childernElements.forEach(child => {
    child.classList.add("d-none");

    if (child.classList.contains(sub.querySelector(".name").textContent)) {
      child.classList.remove("d-none");
      const subcategoriesOfChild = child.querySelectorAll(".subcategory");
      if (subcategoriesOfChild.length > 0) {
        console.log(subcategoriesOfChild);
        subcategoriesOfChild.forEach(subFolder => {
          console.log(subFolder);
          subFolder.classList.remove("d-none");
        })
      }
      let childParent = child.parentElement
      let childParentParent = childParent.parentElement
      childParent.classList.remove("d-none");
      childParentParent.classList.remove("d-none");
      child.classList.remove("d-none");
      const icon = childParent.querySelector(".subcategory-icon-and-name");
      icon.classList.add("d-none");
    }
  });
}


function showThisFolder(sub, childernElements) {
  // for (let index = 0; index < subcategories.length; index++) {
  //   console.log(subcategories[index]);
  //   subcategories[index].classList.add("d-none");

  // }
  childernElements.forEach(child => {
    if (child.classList.contains(sub.querySelector(".name").textContent)) {
      // sub.appendChild(child)
      // sub.classList.add("d-none")
      // child.classList.remove("d-none");
      // sub.querySelector(".subcategory-icon-and-name").classList.add("d-none");
      // sub.querySelector(".artPieces").classList.remove("d-none");
      // sub.parentElement.classList.remove("d-none")
      // console.log(child);
    }

  })

  // sub.classList.add("d-none")
  // sub.classList.remove("d-none");
  // sub.querySelector(".subcategory-icon-and-name").classList.add("d-none");
  // sub.querySelector(".artPieces").classList.remove("d-none");
  // sub.parentElement.classList.remove("d-none")
  // console.log(sub);

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
  const parentFolder = document.querySelector(".thisPc")
  const artPieces = document.createElement("div");
  artPieces.classList.add("subcategory")
  // artPieces.classList.add("d-none")

  let newClassName;
  if (category.post_title) {
    newClassName = category.post_title.toLowerCase();
  } else if (category.title.rendered) {
    newClassName = category.title.rendered.toLowerCase();
  }
  artPieces.classList.add(newClassName);
  showSubCategories(category, artPieces)


  //Checks if the category has post_title OR category.title.rendered and assigns the name of the folder


  // changeTheFilePath(category, customPath) //calls a function that will change the path of folder
  if (category.art_category_id) { //Checks if category has art_category_id array and then calls a function that would display the art pieces
    const artPieces = document.createElement("div");
    artPieces.classList.add("artPieces")
    // artPieces.classList.add("d-none")
    artPieces.classList.add(newClassName);
    parentFolder.appendChild(artPieces);

    category.art_category_id.forEach(art => {
      showArtPieceList(art, artPieces)
    })
  }

  if (category.subcategory_id) { //Checks if category has subcategories and then calls a function that would display subcategories
    // const artPieces = document.createElement("div");
    // artPieces.classList.add("subcategory")
    // // artPieces.classList.add("d-none")
    // artPieces.classList.add(newClassName);
    // parentFolder.appendChild(artPieces);
    category.subcategory_id.forEach(subCategory => {
      const subcategoryRt = document.createElement("div");
      subcategoryRt.classList.add("artPieces")
      subcategoryRt.classList.add(subCategory.post_title.toLowerCase())
      // artPieces.classList.add("d-none")
      // subcategory.classList.add(subCategory.post_title.toLowerCase());
      // console.log(subCategory.post_title.toLowerCase());
      artPieces.appendChild(subcategoryRt);
      // console.log(subcategory)
      // console.log(category)
      // // if (category.art_piece_id) {
      //   console.log("pieces id");
      //   const artPieces = document.createElement("div");
      //   artPieces.classList.add("artPieces")
      //   // artPieces.classList.add("d-none")
      //   artPieces.classList.add(newClassName);
      //   parentFolder.appendChild(artPieces);
      //   console.log(parentFolder);

      // const convertedArtArray = Object.keys(subCategory.art_piece_id).map(i => subCategory.art_piece_id[i])
      // // appendArtPiecesOrSubcategories(subCategory, convertedArtArray)

      // convertedArtArray.forEach(art => {
      //   console.log(subcategoryRt);
      //   showArtPieceList(art, subcategoryRt)
      // })
      // }


      showSubCategories(subCategory, artPieces)
      // artPieces.appendChild(subcategoryRt)

    })
  }
  parentFolder.appendChild(artPieces);
}




// IF the category has subcategories this function will be called to show them
function showSubCategories(subCategory, placeToAppend) {
  const clnSubCategory = subCategoryTemplate.cloneNode(true); //Template of subcategory
  const subCategoryName = clnSubCategory.querySelector(".subCategoryName")

  let newClassName;
  if (subCategory.post_title) {
    newClassName = subCategory.post_title.toLowerCase();
  } else if (subCategory.title.rendered) {
    newClassName = subCategory.title.rendered.toLowerCase();
  }
  subCategoryName.textContent = newClassName;
  const artSubcategory = clnSubCategory.querySelector(".artSubcategory");
console.log(artSubcategory);
  if (subCategory.art_piece_id) {
    const convertedArtArray = Object.keys(subCategory.art_piece_id).map(i => subCategory.art_piece_id[i])
    // appendArtPiecesOrSubcategories(subCategory, convertedArtArray)
    convertedArtArray.forEach(art => {
      console.log(art);
      // console.log(subcategoryRt);
      showArtPieceList(art, artSubcategory)
    })

  }



  // showArtPieceList(piece, artSubcategory)
  const subcategory = clnSubCategory.querySelector(".subcategory");
  subcategory.classList.add(newClassName)
  //subCategory.art_piece_id is and object with objects inside, so i converted it to array
  //Function that will create and append open-folder container with art, but will not be displayed
  // openTheRightFolder(subcategory, subCategoryName.textContent) //Function that will display the correct open folder according on the subcategory clicked
  placeToAppend.appendChild(clnSubCategory)
}



// Appends all the art pieces to the art-pieces container in the open-folder-container;
function showArtPieceList(piece, placeToAppendTo) {
  // console.log(piece);
  let artPieceCln = artPieceTemplate.cloneNode(true);
  artPieceCln.querySelector(".art-piece-name").textContent = piece.post_title.toLowerCase()
  artPieceCln.querySelector(".art-piece-large-icon").src = piece.featured_image.guid
  // artPieces.appendChild(artPieceCln)
  placeToAppendTo.appendChild(artPieceCln) // Place to append is element with art-pieces class in the open-folder-container template;
}



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
  // categoryFolder.classList.add("subcategory")
  // artCategories.appendChild(clnMenuFolder);
  placeToAppend.appendChild(clnMenuFolder);

  if (category.art_category_id.length > 0) { //If the category does NOT have subcategories
    addImgaesToFolderIcon(category, imagesInsideFolderIcon) //Add image to the folder icon
  }
  // openTheRightFolder(categoryFolder, categoryName.textContent) //When a folder is clicked it would remove display none property from the right element
}


let zIndex = 0; //This will get increased once the folder icon is clicked

// the parameters are The category/folder that is clicked and the Html markup for the folder when it is opened h2, which is not displayed but is in the mark up
function openTheRightFolder(folderToClick) {
  const openFolderContainer = document.querySelector(".open-folder-container")
  // const namesOfTheFolders = document.querySelectorAll(".name-of-the-folder"); // the open-folder-container has a h2, that is not displayed but is selected in order to compare the names
  folderToClick.onclick = function () { //Once a folder is clicked
    const folders = document.querySelectorAll(".artPieces") //selects all the open-folder-container that are already appended to the body but are not displayed
    const subcategories = document.querySelectorAll(".subcategory")
    subcategories.forEach(sub => {
      sub.classList.add("d-none")
    })

    const folderName = folderToClick.querySelector(".name").textContent.toLowerCase().split(' ').join('')
    zIndex++; //this will increase so the folder would be on top
    folders.forEach(folder => { //goes through all open-folder-container h2
      folder.classList.add("d-none")
      // console.log(folder);
      if (folder.classList.contains(`${folderName}`)) { //checks if the name of the h2, is the same as the name of the clicked folder

        openFolderContainer.classList.remove("d-none");
        folder.classList.remove("d-none")
        // folder.querySelector(".artPieces").classList.remove("d-none");
        folder.style.zIndex = zIndex;
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