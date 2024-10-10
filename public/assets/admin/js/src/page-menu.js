/**
 * 移动端 header
 */
export default function () {
  menuSelect();
  mobileMenu();
  pcMenu();
}

function menuSelect(){
  var navs = document.querySelectorAll(".nav-list li a");
  if (!navs) {
    return;
  }
  navs.forEach(function (nav) {
    if (!nav.parentNode.children[1]) {
      return;
    }
    nav.addEventListener("click", function () {
      this.parentNode.classList.toggle("active");
    });
  });
}

function mobileMenu() {
  document.querySelector('.mobile-siderbar-show-button')?.addEventListener('click', function () {
    document.querySelector('.app-menu').classList.toggle('show');
  });
}

function pcMenu() {
  document.querySelector('.menu-toggle-button')?.addEventListener('click', function () {
    document.querySelector('.app-menu').classList.toggle('hide');
  });
}
