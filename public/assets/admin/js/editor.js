
window.addEventListener('load', function () {
  //初始化编辑器
  var toolbarOptions = [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{  'list': 'ordered'}, {  'list': 'bullet' }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['link', 'image'],
    ['clean']
  ];

  if (!document.querySelector('#editor')) {
    return false;
  }

  var editor = new Quill('#editor', {
    theme: 'snow',
    modules: {
      'toolbar': toolbarOptions,
      clipboard: { matchVisual: false }  // 内容反显的时候会多出无用的<p><br></p>
    }
  });
  // clipboard.matchVisual
  // 默认情况下，Quill是不会为每一行提供填充(padding)或边距(margin)的，但是从其他网站或来源粘贴过来的可能会含有。
  // 默认情况下，Quill通过添加额外行来匹配这个间距，以弥补缺失的margin/padding。这个选择项将禁用这个行为。


  var textareaContent = document.querySelector("textarea[name='content']");
  // 如果文章处在编辑状态，此时 textarea 中有数据，使用textarea的数据，初始化编辑器
  if (textareaContent.value != '') {
    //   console.log("textarea[name='content']: ", textareaContent.value);
    //   document.querySelector('input[name="thumbnail"]').value = textareaContent.value;
    //   // editor.pasteHTML(textareaContent.value)
    //   // editor.setContents(textareaContent.value);
    //   // editor.root.innerHTML = textareaContent.value; xxxxxx
    //   // editor.setContents(editor.clipboard.convert(textareaContent.value));
    //   const delta = editor.clipboard.dangerouslyPasteHTML(textareaContent.value);
    //   // const delta = editor.clipboard.convert(textareaContent.innerHTML);
    //   console.log(delta);
    //   // editor.setContents(delta, 'api');
  }

  //同步编辑器内容到 textarea
  // var html = editor.container.firstChild.innerHTML;
  // 参考：https://stackoverflow.com/questions/39519950/convert-quill-delta-to-html
  // convert html to delta https://github.com/quilljs/delta/issues/6
  var html = editor.root.innerHTML;
  textareaContent.value = html;

  editor.on('text-change', function (delta, oldDelta, source) {
    var str = editor.root.innerHTML;
    // str = str.replace(/<\/p>/g, "");
    console.log("editor.root.innerHTML:", str);
    textareaContent.value = str;
  });




  let toolbar = editor.getModule('toolbar');
  toolbar.addHandler('image', function () {
    var fileInput = this.container.querySelector('input.ql-image[type=file]');
    if (fileInput == null) {
      fileInput = document.createElement('input');
      fileInput.setAttribute('type', 'file');
      fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
      fileInput.classList.add('ql-image');
      fileInput.addEventListener('change', function () {
        if (fileInput.files != null && fileInput.files[0] != null) {
          var formData = new FormData();
          formData.append('file', fileInput.files[0]);
          axios({
            url: '/v1/upload',
            method: 'POST',
            data: formData,
            headers: { 'content-type': 'multipart/form-data' },
          }).then(function (res) {
            if (res.status != 201) {
              alert(res.data.error);
              return;
            }
            var range = editor.getSelection(true);
            editor.insertEmbed(range.index, 'image', res.data.file_url);
            editor.setSelection(range.index + 1);
            fileInput.value = null;
          }).catch(function (error) {
            fileInput.value = null;
            alert(error.response.data.error ? error.response.data.error : error );
          });
        }
      });
      this.container.appendChild(fileInput);
    }
    fileInput.click();
  });

});


