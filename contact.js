const contactPage = document.querySelector(".open-contact-page");
const contactIcon = document.querySelector(".contact-page");
const close = document.querySelector(".closeBTnContact");

contactIcon.addEventListener("click", openContact);
close.addEventListener("click", closeContact)

function openContact() {
    contactPage.classList.remove("d-none")
    contactPage.style.zIndex = 3;
}

function closeContact() {
    resetheightandWidth(contactPage)
    contactPage.classList.add("d-none")
    contactPage.style.zIndex = 1;

}

// Maximize button
const maximizeBtn = document.querySelector(".maximize");
const minimizeBtn = document.querySelector(".minimize");
const maximizeNotepad = document.querySelector(".maximizeNotepad");
const minimizeNotepad = document.querySelector(".minimizeNotepad");



function changeWindowheightAndWith(targetwindow, width, height) {
    targetwindow.style.width = `${width}%`;
    targetwindow.style.height = `${height}vh`;
}

function resetheightandWidth(targetwindow) {
    targetwindow.style.width = "";
    targetwindow.style.height = "";
}


// Folder btns
maximizeBtn.onclick = function () {
    changeWindowheightAndWith(openFolderContainer, 100, 100)
    changeWindowheightAndWith(artPiecesCategories, "", 80)
}

minimizeBtn.onclick = function () {
    console.log("object");
    resetheightandWidth(openFolderContainer)
    resetheightandWidth(artPiecesCategories)
}

// Notepad btns
maximizeNotepad.onclick = function () {
    changeWindowheightAndWith(contactPage, 100, 100)
}
minimizeNotepad.onclick = function () {
    resetheightandWidth(contactPage)
}

//Image galery display
const photo = photoContainer.querySelector(".photo");
const enlarge = document.querySelector(".enlarge");
let clicks = 0;
enlarge.onclick = function () {
    clicks++
    changeWindowheightAndWith(photoContainer, 100, 100)
    changeWindowheightAndWith(photo, "", 85)
    enlarge.src = "./icons/minimize_arrows.svg";

    if (clicks == 2) {

        resetheightandWidth(photoContainer)
        resetheightandWidth(photo)
        enlarge.src = "./icons/full-screen-selector.svg";
        clicks = 0;
    }
}
