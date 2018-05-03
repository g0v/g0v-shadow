# g0v-shadow API

`g0v-shadow` 專案使用的 API。分為：

* word-embedding API: 計算兩組單字間的相似度
* topics API: 給網頁，回傳該網頁跟 UN Sustainable Developemnt Goals(SDG) 的相似度
* resources API: 給 SDG，回傳跟該 SDG 相關的 open data, API,... 等

## Setup

#### Word-embedding API

參考 [https://github.com/poga/word2vec-api](https://github.com/poga/word2vec-api).

#### Topics API & Resources API

1. 將 `default.env` 複製到 `.env`，填上檔案中的設定檔
2. `npm i`
3. `npm start`

## API

#### `GET /topics?url=...`

取得指定網址的相關主題分析。Score 越高越相關

回傳：

```
{
    "score": [
        {
            "id": "SDG9",
            "name": "Industry, Innovation and Infrastructure",
            "score": 0.2803659146671196
        },
        {
            "id": "SDG12",
            "name": "Responsible Consumption and Production",
            "score": 0.17836946064641415
        },
        ...
    ]
}
```

#### `GET /topics/:id/resources`

取得指定主題相關的連結。ID 為 `SDG1`~`SDG17`，參考 [sdg.json](./sdg.json)

回傳：

```
{
    "result": [
        {
            "id": "recSMExGCHZiK7Dix",
            "fields": {
                "URL": "https://google.com",
                "Name": "test",
                "SDG": [
                "Good Health and Well-being",
                "Zero Hunger"
                ]
            },
            "createdTime": "2018-05-01T08:41:34.000Z"
        }
    ]
}
```

#### `GET /pages`

取得所有曾經產生過的 shadow page，依照瀏覽次數排序

回傳：

```
{
    "result": [
        {
            "id": "BQRvJsg+jIiz3asuq2PQ0WIkrB5WRTX8dc3O7kegk40=",
            "data": {
                "scores": [
                  //...
                ],
                "visit": 3,
                "url": "https://google.com",
                "title": "Google"
            }
        }
    ]
}
```