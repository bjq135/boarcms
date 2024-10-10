import { getCookie, setCookie } from './cookie.js';

export default function(){
  if (document.querySelector(".night-mode-button")) {
    document.querySelectorAll(".night-mode-button").forEach(function (btn) {
      btn.addEventListener("click", darkMode);
    });
  }

  function darkMode() {
    console.log("cookie: ", getCookie("darkMode"));
    var isDarkMode = document.body.classList.contains('dark-mode');
    if (isDarkMode) {
      setCookie("darkMode", 0);
    } else {
      setCookie("darkMode", 1);
    }
    document.body.classList.toggle("dark-mode");
    document.querySelectorAll(".night-mode-button").forEach(function (btn) {
      btn.classList.toggle("sun-icon");
    });
  }
}