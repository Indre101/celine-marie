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
    console.log("object");
    contactPage.classList.add("d-none")
    contactPage.style.zIndex = 1;

}