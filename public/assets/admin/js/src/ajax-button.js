import axios from "../axios/esm/axios.js";
import toast from "./toast.js";

export default function () {
  var buttons = document.querySelectorAll(".ajax-url");
  if (buttons.length) {
    buttons.forEach(function (btn) {
      btn.addEventListener('click', buttonHandler);
    });
  }
}

async function buttonHandler(event) {
  var dialog = confirm(this.dataset.message);
  if (dialog == false) {
    return false;
  }
  
  try{
    var response = await axios.request({
      method: this.dataset.method,
      url: this.dataset.url,
      responseType: 'json',
      data: '{}'
    });
    if (response.status == 204) {
      toast.open({ title: '删除成功' });
      setTimeout(() => location.href = location.href, 1000);
    } else {
      console.log('ajax: ', response);
      toast.open({ title: 'ajaxButton.js 其他状态待完善' })
    }
  }catch(e){
    console.log(e);
    let errorMessage = e.response.data.error ? e.response.data.error : e.message;
    toast.open({ title: errorMessage })
  }
}

