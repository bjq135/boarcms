(function () {
  if (!document.querySelector(".file-btn-add")) {
    return;
  }


  axios.interceptors.response.use(data => {
    return data
  }, error => {
    return error
  })


  var client = {};


  if (document.querySelector("input[name='url']").value) {
    axios({
      method: "get",
      url: "/admin/sts",
      timeout: 5000
    }).then(function (result) {
      console.log("Aliyun OSS STS: ", result);
      var option = {
        region: 'oss-cn-hangzhou',
        // bucket: 'palace',
        bucket: 'user-test-bucket',
        accessKeyId: result.data.AccessKeyId,
        accessKeySecret: result.data.AccessKeySecret,
        stsToken: result.data.SecurityToken
      };
      client = new OSS(option);
      createUrlPreview(client);
    });
  }


  // 上传文件按钮绑定事件
  document.querySelector(".file-btn-add").addEventListener("click", function () {
    var that = this;
    // 获取 STS
    axios({
      method: "get",
      url: "/admin/sts",
      timeout: 5000
    }).then(function (result) {
      console.log("Aliyun OSS STS: ", result);
      var option = {
        region: that.dataset.region,
        bucket: that.dataset.bucket,
        accessKeyId: result.data.AccessKeyId,
        accessKeySecret: result.data.AccessKeySecret,
        stsToken: result.data.SecurityToken
      };
      client = new OSS(option);

      // 如果已有连接，提示用户是否删除资源
      var objectKey = document.querySelector("input[name='url']").value;
      if (objectKey) {
        var cfm = confirm("上传新文件，将会删除当前文件，确定删除？");
        if (cfm == false) {
          return;
        } else {
          client.delete(objectKey)
            .then(function (result) {
              console.log("success: ", result);
              document.querySelector("input[name='url']").value = null;
              alert("文件已经删除，开始上传新文件");
              // document.querySelector("#preview-link").remove();
              document.querySelector("input[name='oss-file']").click();
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      } else {
        document.querySelector("input[name='oss-file']").click();
      }


    }).catch(function (error) {
      console.log(error);
      alert("OSS STS ERROR: " + error.message);
    })
  });



  // 上传控件事件
  document.querySelector("input[name='oss-file']").addEventListener("change", function (file) {
    if (!this.files[0]) { return; }
    var objectKey = getDate() + "/" + random_string(20) + get_suffix(this.files[0].name);
    var fileType = this.files[0].type;
    if (fileType.substring(0, 5) == "audio") {
      objectKey = "audio/" + objectKey;
    } else if (fileType.substring(0, 5) == "video") {
      objectKey = "video/" + objectKey;
    } else {
      objectKey = "file/" + objectKey;
    }
    console.log(objectKey, this.files[0], get_suffix(this.files[0].name));
    var title = "";
    var that = this;
    document.querySelector("#progress-title").style.display = "block";
    client.multipartUpload(objectKey, this.files[0], {
      progress: function (p, checkpoint) {
        // 断点记录点。浏览器重启后无法直接继续上传，您需要手动触发上传操作。
        // console.log(p, checkpoint);
        document.querySelector("#progress-title").innerText = Math.round(p * 100) + "%";
      },
      meta: { year: 2021, people: 'test' },
      mime: that.files[0].type
    }).then(function (result) {
      document.querySelector("input[name='url']").value = result.name;
      document.querySelector("input[name='title']").value = get_name(that.files[0].name);
      setTimeout(function () {
        document.querySelector("#progress-title").style.display = "none";
        document.querySelector("input[name='oss-file']").value = null;
        createUrlPreview(client);
      }, 1000);
    }).catch(function (err) {
      document.querySelector("input[name='oss-file']").value = null;
      console.log("error: ", err);
      alert(err);
    });
  });






  // function init(option) {
  // var client = new OSS(option);
  // console.log(document.querySelector("input[name='url']").value);
  // if (document.querySelector("input[name='url']").value) {
  //   createUrlPreview(client);
  // }
  // }


  function createUrlPreview(client) {
    // 配置响应头实现通过URL访问时自动下载文件，并设置下载后的文件名。
    // filename为自定义下载后的文件名。
    var filename = document.querySelector("input[name='title']").value;
    const response = {
      'content-disposition': `inline; filename=${encodeURIComponent(filename)}`
    }
    // object-key表示从OSS下载文件时需要指定包含文件后缀在内的完整路径，例如abc/efg/123.jpg。
    var objectKey = document.querySelector("input[name='url']").value;
    const url = client.signatureUrl(objectKey, { response });
    var urlLink = '<a href="' + url + '" target="_blank1" id="preview-link">预览</a>'
    document.querySelector(".file-upload-container>div").insertAdjacentHTML("beforeend", urlLink);
    return;
  }


  function random_string(len) {
    len = len || 32;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }


  function get_suffix(filename) {
    var pos = filename.lastIndexOf('.')
    var suffix = ''
    if (pos != -1) {
      suffix = filename.substring(pos)
    }
    return suffix;
  }


  function get_name(filename) {
    var pos = filename.lastIndexOf('.')
    var name = ''
    if (pos != -1) {
      name = filename.substring(0, pos)
    }
    return name;
  }


  function getDate() {
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y.toString() + m + d;
  }





})();
