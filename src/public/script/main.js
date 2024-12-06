const scrollTopBtn = document.querySelector(".scroll-top");
const nav = document.querySelector(".nav");
const fbLink = document.querySelector(".fb-link");
const searchArea = document.querySelector(".search-area");
const searchIcon = document.querySelector("#search-icon");
console.log(fbLink);
console.log(scrollTopBtn);

window.onscroll = () => {
  scrollFunction();
};
function scrollFunction() {
  if (document.documentElement.scrollTop > 150) {
    console.log(window.pageYOffset);
    scrollTopBtn.style.top = "90%";
    nav.style.top = "-150px";
    searchArea.classList.add("hidden");
  } else {
    scrollTopBtn.style.top = "-100px";
    nav.style.top = "0";
  }
}

searchIcon.addEventListener("click", () => {
  searchArea.classList.toggle("hidden");
});

fbLink.addEventListener("click", () => {
  window.open("https://www.facebook.com/datdeeptry03");
});
