# g0v-shadow API

`g0v-shadow` 專案使用的 API。分為：

* word-embedding API: 計算兩組單字間的相似度
* topics API: 給網頁，回傳該網頁跟 UN Sustainable Developemnt Goals(SDG) 的相似度
* resources API: 給 SDG，回傳跟該 SDG 相關的 open data, API,... 等

## Setup

#### Word-embedding API

1. `git clone git@github.com:3Top/word2vec-api.git`
2. 取得 word-embedding model。來源可能是：
    * 從 https://github.com/3Top/word2vec-api 的列表自行挑選，這些 model 包含的文字很完整，會需要 6G 以上的記憶體才能啟動 API
    * https://github.com/eyaler/word2vec-slim 有簡化過的 model，只需 ~500MB 記憶體即可載入。
3. 按照 https://github.com/3Top/word2vec-api 的說明啟動 API

#### Topics API & Resources API

1. 將 `default.env` 複製到 `.env`，填上檔案中的設定檔
2. `npm i`
3. `npm start`