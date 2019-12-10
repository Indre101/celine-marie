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
window.addEventListener("DOMContentLoaded", init)

document.querySelector(".closeBTn").onclick = function () {
  openFolderContainer.classList.add("d-none");
}

function init() {
  spinner.removeAttribute('hidden'); //preloader shows up
  fetch("http://indre101.lashboutique.dk/wordpress/wp-json/wp/v2/art_categories?_embed").then(res => {
    return res.json()
  }).then(data => {
    spinner.setAttribute('hidden', '')
    data.forEach(category => {
      getCategories(category, artCategories);
      createSubcategories(category, artPiecesCategories)
    })

  }).then(() => {




    //  document.querySelectorAll(".artSubcategory").forEach(c=>console.log(c))
    const subCategoryBtns = document.querySelectorAll(".subcategory-icon-and-name")

    subCategoryBtns.forEach(btn => {
      console.log(btn);
      btn.onclick = function () {
        clickedFolder(btn)
      }
    })



    document.querySelectorAll(".category-folder").forEach(btn => btn.onclick = function () {
      clickedFolder(btn)
    })

  })
}

function clickedFolder(folder) {
  console.log(folder);
  const artPiecePlaces = document.querySelectorAll(".artPieces")
  const subcategoryIconAndName = document.querySelectorAll(".subcategory-icon-and-name")
  subcategoryIconAndName.forEach(s => s.style.display = "none")

  openFolderContainer.classList.remove("d-none");
  const folderName = folder.querySelector(".name").textContent.toLowerCase().split(' ').join('');
  artPiecePlaces.forEach(artPlace => {
    if (artPlace.classList.contains(folderName)) {
      console.log(artPlace);

      const parent = artPlace.parentElement
      const parentParent = parent.parentElement
      const parentParentParent = parentParent.parentElement;
      artPlace.style.display = "flex"
      parent.style.display = "flex"
      parentParent.style.display = "flex"
      parentParentParent.style.display = "flex"

      artPlace.querySelectorAll(".subcategory-icon-and-name").forEach(subSth => subSth.style.display = "block");
    } else {
      artPlace.style.display = "none";

    }
  })



}




function getCategories(category, placeToAppend) {
  let clnMenuFolder = categoryFolderTemplate.cloneNode(true);
  let categoryName = clnMenuFolder.querySelector(".category-name")
  categoryName.textContent = category.title.rendered.toLowerCase()
  let imagesInsideFolderIcon = clnMenuFolder.querySelector(".images-inside-folder-icon");
  let categoryFolder = clnMenuFolder.querySelector(".category-folder");
  if (category.art_category_id.length > 0) { //If the category does NOT have subcategories
    addImgaesToFolderIcon(category, imagesInsideFolderIcon) //Add image to the folder icon
  }

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