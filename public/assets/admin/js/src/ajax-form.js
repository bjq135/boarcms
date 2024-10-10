import axios from '../axios/esm/axios.js';
import toast from './toast.js';

axios.defaults.headers['X-Requested-With'] = "XMLHttpRequest";
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';

export default function () {
  var forms = document.querySelectorAll(".ajax-form");
  if (!forms) {
    return false;
  }
  //获取表单中的所有按钮，绑定事件
  forms.forEach(function (form) {
    var buttons = form.querySelectorAll(".ajax-submit");
    buttons.forEach(function (button) {
      button.onclick = function () {
        //按钮事件处理函数
        var formData = new FormData(form);
        // console.log("stone-ui formData: ", formData.getAll("image_url"));
        var formAction = form.getAttribute("action");
        var buttonAction = button.getAttribute("data-action");
        var url = null;
        if (formAction) {
          url = formAction;
        } else if (buttonAction) {
          url = buttonAction;
        } else {
          toast.open({ title: "没有找到表单地址" });
          return false;
        }
        //有没有弹出信息
        ajaxAction(formData, url);
        return false;
      }
    });
  });
}

//ajax提交函数
async function ajaxAction(formData, url) {
  var str = "";
  formData.forEach(function (value, key) {
    if (key == "content") {
      value = encodeURIComponent(value)
    }
    str += ("&" + key + "=" + value);
  });

  console.log('str', str);

  try {
    var response = await axios.request({
      method: 'POST',
      url: url,
      responseType: 'json',
      data: str
    });
    console.log("ajax: ", response);
    if (response.status == 200) {
      toast.open({ title: response.data.message ? response.data.message : '修改成功' });
      if (response.data.url) {
        var seconds = response.data.seconds ? response.data.seconds : 3;
        setTimeout(function () { location.href = response.data.url; }, seconds * 1000);
      }
    } else if (response.status == 201) {
      toast.open({ title: "新建成功" });
      setTimeout(function () {
        // console.log(this.dataset);
        let url = '/admin/articles/:id/edit';
        location.href = url.replace(':id', response.data.id);
      }, 1000);
    } else {
      toast.open({ title: '待完善' });
    }
  } catch (error) {
    console.log(error);
    toast.open({ title: error.response.data.error });
  }
}
