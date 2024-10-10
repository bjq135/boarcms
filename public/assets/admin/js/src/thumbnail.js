import toast from './toast.js';
import axios from '../axios/esm/axios.js';

export default function () {
  document.querySelectorAll(".upload-button").forEach(function (btn) {
    // console.log(btn);
    btn.addEventListener("click", uploadButtonHandler);
  });
  document.querySelectorAll(".delete-button").forEach(function (btn) {
    btn.addEventListener("click", deleteButtonHandler);
  });
  // renderThumbnail();
}

async function uploadButtonHandler(event) {
  var that = this;
  // 删除所有上传表单组件
  document.querySelectorAll('input[name="upload-input-control"]').forEach(function (i) {
    i.remove();
  });

  // 增加上传表单组件
  var uploadInputControlString = '<input type="file" name="upload-input-control" class="upload-input-control" style="display:none;">';
  document.querySelector('body').insertAdjacentHTML("beforeend", uploadInputControlString);

  // 绑定表单组件事件
  var uploadInputControl = document.querySelector('input[name="upload-input-control"]');
  uploadInputControl.click();
  uploadInputControl.onchange = async function () {
    if (!this.files[0] || this.files[0] == undefined) return;

    toast.open({ title: '开始上传' });

    var fd = new FormData();
    fd.append("file", this.files[0]);

    var res = await axios({
      method: 'post',
      url: that.dataset.url ? that.dataset.url : "/v1/upload?thumbnail=true",
      data: fd,
      headers: { 'content-type': 'multipart/form-data' },
    });
    console.log('res: ', res);

    if (res.status == 201) {
      console.log('上传成功', res.data);
      var imageString = `<img src="${res.data.url}"/>`;
      that.parentNode.parentNode.querySelector('.thumbnail-image').innerHTML = imageString;
      that.parentNode.parentNode.querySelector('input[name="thumbnail_id"]').value = res.data.id;
    } else if (res.status == 422) {
      toast.open({ title: "文件类型错误" });
    } else {
      toast.open({ title: "其他问题" });
    }
  }
}

async function deleteButtonHandler() {
  this.parentNode.parentNode.querySelector('.thumbnail-image').innerHTML = "";
  this.parentNode.parentNode.querySelector('input[name="thumbnail_id"]').value = '';
}

// async function renderThumbnail() {
//   var thumbnailUploaders = document.querySelectorAll('.thumbnail-uploader');
//   for (const item of thumbnailUploaders) {
//     var thumbnailId = item.querySelector('input[name="thumbnail_id"]').value;
//     if (thumbnailId) {
//       var res = await axios.request({
//         method: 'get',
//         url: "/v1/images/" + thumbnailId,
//         responseType: 'json'
//       });
//       var imageString = `<img src="${res.data.url}"/>`;
//       item.querySelector('.thumbnail-image').insertAdjacentHTML("afterbegin", imageString);
//     }
//   }

// }





