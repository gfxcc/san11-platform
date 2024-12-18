# Gateway usage

## List all packages for a category

```
» curl -X GET "https://api.san11pk.org/v1/categories/4/packages" | jq                                                                          324ms
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   411  100   411    0     0   1376      0 --:--:-- --:--:-- --:--:--  1397
{
  "packages": [
    {
      "name": "categories/4/packages/118",
      "packageName": "事件-三顾茅庐",
      "description": "<p>重置三顾茅庐事件，添加手动触发功能</p>",
      "createTime": "6月前",
      "updateTime": "6月前",
      "state": "NORMAL",
      "authorId": "53",
      "imageUrls": [],
      "tags": [],
      "downloadCount": "8",
      "likeCount": "0",
      "dislikeCount": "0"
    }
  ],
  "nextPageToken": "b'\\n\\x0ccategories/4\\x10\\xe8\\x07\\x18\\x01\"\\x10create_time DESC'"
}
```


## List all binaries for a package

```
» curl -X GET "https://api.san11pk.org/v1/categories/2/packages/120/binaries" | jq                                                              24ms
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   787  100   787    0     0   2306      0 --:--:-- --:--:-- --:--:--  2342
{
  "binaries": [
    {
      "binaryId": "0",
      "packageId": "0",
      "downloadCount": "12",
      "version": {
        "major": "1",
        "minor": "4",
        "patch": "3"
      },
      "description": "<p>新增：<br>&nbsp;1. 补充兵器的可用战法、地形移动消耗修改功能<br>&nbsp;2. 地形、设施的修改、Excel导入导出功能<br>&nbsp;3. 基础
  改的光环自定义<br>优化：<br>&nbsp;1. 下拉框格式的表格单元格文本显示优化</p>",
      "createTime": "22天前",
      "tag": "默认",
      "size": "3.37 MB",
      "name": "categories/2/packages/120/binaries/219",
      "updateTime": "4天前",
      "file": {
        "filename": "",
        "ext": ".7z",
        "server": "AWS_S3",
        "uri": "categories/2/packages/120/binaries/v1.4.3-d3300b04-6984-11ee-865a-0242ac120005.7z",
        "url": ""
      }
    }
  ],
  "nextPageToken": "b'\\n\\x19categories/2/packages/120\\x10\\xe8\\x07\\x18\\x01\"\\x10create_time DESC'"
}
```

## Download a binary

Please note this is a **POST** request.

```
» curl -X POST "https://api.san11pk.org/v1/categories/2/packages/120/binaries/219:download" | jq                                               359ms
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  1267  100  1267    0     0   3918      0 --:--:-- --:--:-- --:--:--  3959
{
  "binaryId": "0",
  "packageId": "0",
  "downloadCount": "13",
  "version": {
    "major": "1",
    "minor": "4",
    "patch": "3"
  },
  "description": "<p>新增：<br>&nbsp;1. 补充兵器的可用战法、地形移动消耗修改功能<br>&nbsp;2. 地形、设施的修改、Excel导入导出功能<br>&nbsp;3. 基础修改
  光环自定义<br>优化：<br>&nbsp;1. 下拉框格式的表格单元格文本显示优化</p>",
  "createTime": "22天前",
  "tag": "默认",
  "size": "3.37 MB",
  "name": "categories/2/packages/120/binaries/219",
  "updateTime": "0秒前",
  "file": {
    "filename": "",
    "ext": ".7z",
    "server": "AWS_S3",
    "uri": "categories/2/packages/120/binaries/v1.4.3-d3300b04-6984-11ee-865a-0242ac120005.7z",
    "url": "https://san11-resources.s3.ap-east-1.amazonaws.com/categories/2/packages/120/binaries/v1.4.3-d3300b04-6984-11ee-865a-0242ac120005.7z?response-content-disposition=attachment%3B%20filename%20%3D%22%25E9%259F%25A9%25E7%2589%2588pkHH%25E5%25A4%259A%25E5%258A%259F%25E8%2583%25BD%25E4%25BF%25AE%25E6%2594%25B9%25E5%2599%25A8-v1.4.3.7z%22&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAY2GXL5CG5GVALTN6%2F20231104%2Fap-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231104T200055Z&X-Amz-Expires=600&X-Amz-SignedHeaders=host&X-Amz-Signature=5d4c015f5d1de66647f8edd58086951e2db3f589acab22588822f65beb47d1d5"
  }
}
```