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
