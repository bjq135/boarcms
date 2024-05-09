通用接口
=======

## 获取系统信息  
项目首页  


## Unload Beacon API 接口
这个接口用于统计页面性能

**Method** : `POST`

**URL** : `/v1/home/unload-beacon`

**Auth required** : `false`

**Body** :

```json
{
    "start":"",
    "end":"",
    "url":""
}
```

### Success Response
**Code** : `201 Created`

