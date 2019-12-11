const contactPage = document.querySelector(".open-contact-page");
const contactIcon = document.querySelector(".contact-page");
const close = document.querySelector(".closeBTn");

contactIcon.addEventListener("click", openContact);
close.addEventListener("click", closeContact)

function openContact() {
    contactPage.classList.remove("d-none")
}

function closeContact() {
    contactPage.classList.add("d-none")
}
