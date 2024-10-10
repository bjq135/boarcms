import toast from '/admin/js/lib/toast.js';
import { getCookie } from '/admin/js/lib/cookie.js';

// console.log('cookie ', getCookie)

const example_image_upload_handler = (blobInfo, progress) => new Promise((resolve, reject) => {
  var formData = new FormData();
  formData.append('file', blobInfo.blob(), blobInfo.filename());

  fetch('/v1/upload',{
    method: 'POST',
    // headers: {"Content-type": "multipart/form-data; charset=UTF-8"},
    body: formData
  })
  .then(response => response.json())
  .then(json => {
    console.log('222', json)
    resolve(json.url);
  })
  .catch(err => {
    reject('sss: '+err);
  }); 
});


tinymce.init({
    selector: '#editor',
    width: '100%',
    height: 500,
    language:'zh_CN',
    // block_formats: 'Paragraph=p; Header 1=h1; Header 2=h2; Header 3=h3',
    style_formats: [
        { title: 'Paragraph', format: 'p' },
        { title: 'Header 1', format: 'h1' },
        { title: 'Header 2', format: 'h2' },
        { title: 'Header 3', format: 'h3' },
        { title: 'Header 4', format: 'h4' },
        { title: 'Header 5', format: 'h5' },
        { title: 'Preformatted', format: 'pre' }
    ],

    plugins: [
      'advlist', 'autolink', 'link', 'image', 'lists', 'charmap',  'anchor', 'pagebreak',
      'searchreplace', 'wordcount', 'visualblocks', 'visualchars', 'code', 'fullscreen', 'insertdatetime',
      'media', 'table', 'emoticons', 'help'
    ],
    toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | link image media | ' +
      'forecolor backcolor emoticons | code fullscreen help',
    toolbar_mode : 'wrap',
    menu: {
      favs: { title: 'My Favorites', items: 'code visualaid | searchreplace | emoticons' }
    },
    // menubar: 'favs file edit view insert format tools table help',
    menubar:false,
    automatic_uploads: true,
    file_picker_types: 'image',
    images_upload_url: '/v1/upload',
    branding: false,
    images_upload_handler: example_image_upload_handler,
    convert_urls :false,
    skin: getCookie('darkMode')==0 ? 'oxide' : "oxide-dark",
    content_css: getCookie('darkMode')==0 ? 'default' : 'dark',
    // content_css: '/assets/plugins/tinymce/content.css',
    // skin: (window.matchMedia("(prefers-color-scheme: dark)").matches ? "oxide-dark" : "")
    file_picker_callback: function(callback, value, meta) {
      callback('movie.mp4', {source2: 'alt.ogg', poster: 'image.jpg'});
    },
});
