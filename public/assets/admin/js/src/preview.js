export default function () {
  document.querySelectorAll(".preview-image").forEach(function (item) {
    item.addEventListener("click", imagePreviewHandler);
  });
}

function imagePreviewHandler() {
  console.log('xxxxxx: ', this);
  // var imageSelector = this.querySelector('img');
  var url = this.src;
  imagePreview(url);
}

function imagePreview(url) {
  var html = '<div class="image-preview-background">\
                <div class="image-preview-background-color"></div>\
              </div>';
  document.querySelector('body').insertAdjacentHTML("beforeend", html);

  var img = new Image();
  img.src = url;
  document.querySelector('.image-preview-background').appendChild(img);
  document.querySelector('.image-preview-background img').classList.add("image-preview-image");
  img.onload = function () {
    imagePreviewSize(img);
  }
  document.querySelector('.image-preview-background').addEventListener("click", function () {
    document.querySelector('body').removeChild(this);
  });
  document.querySelector('.image-preview-background').addEventListener("mousewheel", function (e) {
    e.preventDefault();
  });
}

function imagePreviewSize(img) {
  var myClientWidth = document.documentElement.clientWidth * 0.8;
  var myClientHeight = document.documentElement.clientHeight * 0.8;

  if (myClientWidth > myClientHeight) {
    img.width = myClientHeight;
    img.height = myClientHeight;
  } else {
    img.width = myClientWidth;
    img.height = myClientWidth;
  }

  document.querySelector('.image-preview-image').style.top = "calc(50% - " + img.height / 2 + "px)";
  document.querySelector('.image-preview-image').style.left = "calc(50% - " + img.width / 2 + "px)";
  return false;
}
