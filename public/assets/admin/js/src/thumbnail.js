import utils from './utils.js';
import LightTip from '../../lib/ui/light-tip.js';
import fetchWrapper from './fetch-wrapper.js';

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

    var fd = new FormData();
    fd.append("file", this.files[0]);

    try{
      let url = '/v1/upload?thumbnail=true';
      let res = await fetchWrapper(url, {
          method: 'POST',
          // headers: new Headers({'content-type': 'multipart/form-data'}),
          body: fd
      });
      let responseJson = await res.json();
      console.log('responseJson',responseJson)
      if (res.status == 201) {
        LightTip.success('修改成功', 1000);
        var imageString = `<img src="${responseJson.url}"/>`;
        that.parentNode.parentNode.querySelector('.thumbnail-image').innerHTML = imageString;
        that.parentNode.parentNode.querySelector('input[name="thumbnail_id"]').value = responseJson.id;
      } else {
        LightTip.error('修改失败', 1000);
      }
    }catch(e){
      console.log(e)
      LightTip.error(e.message, 1000);
    }
  }
}


async function deleteButtonHandler() {
  this.parentNode.parentNode.querySelector('.thumbnail-image').innerHTML = "";
  this.parentNode.parentNode.querySelector('input[name="thumbnail_id"]').value = '';
}


