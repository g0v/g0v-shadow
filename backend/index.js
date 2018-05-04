require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
const googleTranslate = require('google-translate')(process.env.GOOGLE_API_KEY)
const request = require('request-promise')
const LRU = require('lru-cache')
const fs = require('fs')
const crypto = require('crypto')

const wordAPI = process.env.WORD_API
const AIRTABLE_API = process.env.AIRTABLE_API
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY

const firebaseAdmin = require('firebase-admin')
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(require(process.env.SERVICE_ACCOUNT_KEY)),
  databaseURL: process.env.DATABASE_URL
})

var db = firebaseAdmin.firestore()

const resourcesCache = LRU({
  max: 1,
  maxAge: 5 * 60 * 1000
})

const sdgs = JSON.parse(fs.readFileSync('./sdg.json'))

const scoreCache = LRU({
  max: 1000,
  maxAge: 5 * 60 * 1000
})

const catchError = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }

app.get('/topics', catchError(async function (req, res, next) {
  var url = req.query.url
  if (!url) {
    return res.status(401).json({ message: 'URL is required' })
  }

  let hash = crypto.createHash('sha256').update(url).digest('base64')
  let pageRef = db.collection('pages').doc(hash)

  let cachedScore = scoreCache.get(url)
  if (cachedScore) {
    db.runTransaction(t => {
      return t.get(pageRef).then(doc => {
        t.update(pageRef, { visit: doc.data().visit + 1 })
      })
    })

    return res.json({ score: cachedScore })
  }

  // 取得 url 的 <title> tag
  var html = await request(url)
  let title = html.match(/<title>([\s\S]+)<\/title>/)[1]
  if (!title) {
    return res.status(401).json({ message: 'parsing failed' })
  }
  title = title.trim()

  // 翻譯成英文
  let translation = await translate(title)
  var words = translation.split(' ')

  // 對每個 SDG 的 keywords 算 distance
  let scores = []
  for (let sdg of sdgs) {
    let score = await request(wordAPI + '?' + ws('ws1', words) + '&' + ws('ws2', sdg.keywords))
    scores.push({ id: sdg.id, name: sdg.name, score: parseFloat(score) })
  }
  scores = scores.sort((x, y) => y.score - x.score)
  scoreCache.set(url, scores)

  pageRef.set({
    title: title,
    scores: scores,
    url: url
  }, { merge: true })

  db.runTransaction(t => {
    return t.get(pageRef).then(doc => {
      t.update(pageRef, { visit: doc.data().visit + 1 })
    })
  })

  res.send({ title, scores })
}))

app.get('/topics/:sdgID/resources', catchError(async function (req, res, next) {
  let sdgID = req.params.sdgID

  let cachedResources = resourcesCache.get(sdgID)
  if (cachedResources) {
    return res.json({ result: cachedResources })
  }

  let sdgName = sdgs.find(x => x.id === sdgID).name

  if (!sdgName) {
    return res.status(404)
  }

  let resources = JSON.parse(await request(AIRTABLE_API + '?api_key=' + AIRTABLE_API_KEY))

  let related = resources.records.filter(r => r.fields.SDG.includes(sdgName))
  resourcesCache.set(sdgID, related)

  res.json({ result: related })
}))

app.get('/pages', catchError(async function (req, res, next) {
  let pagesRef = db.collection('pages').orderBy('visit', 'desc')
  let pagesSnapshot = await pagesRef.get()

  let result = []
  pagesSnapshot.forEach(page => {
    result.push({ id: page.id, data: page.data() })
  })

  res.json({ result })
}))

app.use(function (err, req, res, next) {
  console.error(err)
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

if (!process.env.GOOGLE_API_KEY) {
  console.error('must provide GOOGLE_API_KEY')
  process.exit(1)
}

app.listen(3000, () => console.log('app listening on port 3000'))

function translate (text) {
  return new Promise((resolve, reject) => {
    googleTranslate.translate(text, 'en', (err, translation) => {
      if (err) return reject(err)

      resolve(translation.translatedText)
    })
  })
}

function ws (key, words) {
  return words.map(w => key + '=' + w).join('&')
}
