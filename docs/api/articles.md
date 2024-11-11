文章接口
======

## 文章列表

**Method** : `GET`

**URL** : `/v1/articles`

**URL Parameters** : 

`page=[string]` 页码  
`perPage=[string]` 每页条数  
`categoryId=[string]` 分类IDS  
`is_show=[string]` 是否显示  
`keyword=[string]` 关键词  

**Auth required** : `false`

### Success Response

**Code** : `201 Created`

**Content example** :
```json
[
    {
    "id": 1081,
    "user_id": 2,
    "categories": "12,17",
    "title": "文章标题",
    "description": "文章描述",
    "content": "文章内容",
    "more": null,
    "url": "",
    "hit_counter": null,
    "created_at": "2024-03-31",
    "is_show": 1,
    "thumbnail": "",
    "user": {
      "id": 2,
      "nickname": "小猪佩奇",
      "avatar": ""
    }
  },
  {
    "id": 1080,
    "user_id": 2,
    "categories": "12,17",
    "title": "文章标题",
    "description": "文章描述",
    "content": "文章内容",
    "more": null,
    "url": "",
    "hit_counter": null,
    "created_at": "2024-04-01",
    "is_show": 1,
    "thumbnail": "",
    "user": {
      "id": 2,
      "nickname": "小猪佩奇",
      "avatar": ""
    }
  }
]
```



## 添加文章

**Method** : `POST`

**URL** : `/v1/articles`

**Auth required** : `true`

**Body** :

```json
{
  "title":"文章标题",
  "categories":"12,17",
  "description":"文章描述",
  "thumbnail_id":23,
  "content":"文章内容",
  "more":"更多内容",
  "tags":"991",
  "url":"",
  "list_order":"8989",
  "is_show":1,
  "meta":{
    "price":"1200",
    "brand":"apple"
  }
}
```

可以添加多个meta属性，设置属性的值为null可以删除属性

### Success Response

**Code** : `201 Created`

**Content example** :

```json
{
  "id": 1284,
  "user_id": 3,
  "categories": "12,17",
  "title": "文章标题 123",
  "thumbnail_id": 23,
  "content": "文章内容",
  "description": "文章描述",
  "more": "更多内容",
  "created_at": "2024-04-10T13:53:02.000Z",
  "updated_at": null,
  "deleted_at": null,
  "status": 0,
  "url": "",
  "tags_old": null,
  "hit_counter": null,
  "list_order": 8989,
  "is_show": 1,
  "user": {
    "id": 3,
    "nickname": "sui****.com",
    "avatar": null
  },
  "meta": {
    "price": "1200",
    "brond": "apple"
  }
}
```


## 编辑文章

**Method** : `PUT`

**URL** : `/v1/articles/:ID`

**Auth required** : `true`

**Body** :

```json
{
  "title":"文章标题",
  "categories":"12,17",
  "description":"文章描述",
  "thumbnail_id":23,
  "content":"文章内容",
  "more":"更多内容",
  "tags":"991",
  "url":"",
  "list_order":"8989",
  "is_show":1,
  "meta":{
    "price":null, // 设置 null 可删除 meta
    "brand":"apple"
  }
}
```

可以添加多个meta属性，设置属性的值为null可以删除属性

### Success Response

**Code** : `200 Ok`

**Content example** :

```json
{
  "id": 1284,
  "user_id": 3,
  "categories": "12,17",
  "title": "文章标题 123",
  "thumbnail_id": 23,
  "content": "文章内容",
  "description": "文章描述",
  "more": "更多内容",
  "created_at": "2024-04-10T13:53:02.000Z",
  "updated_at": null,
  "deleted_at": null,
  "status": 0,
  "url": "",
  "tags_old": null,
  "hit_counter": null,
  "list_order": 8989,
  "is_show": 1,
  "user": {
    "id": 3,
    "nickname": "sui****.com",
    "avatar": null
  },
  "meta": {
    "brond": "apple"
  }
}
```


## 删除文章

**Method** : `DELETE`

**URL** : `/v1/articles/:ID`

**Auth required** : `true`

### Success Response

**Code** : `204 No Content`



## 批量操作

**Method** : `POST`

**URL** : `/v1/articles/bulk-action`

**Auth required** : `true`

**Body** :

```json
{
  "ids":"5,12,13",
  "action":"is_show=true"
}
```
action 是 `is_show=true` 时，批量显示 ID 在 ids 的所有文章，`is_show=false` 时，批量隐藏文章。

### Success Response

**Code** : `200 Ok`

**Content example** :

```json
{
  "message": "修改成功"
}
```
