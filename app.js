const express = require('express'), app = express()
const { query } = require('express')
const gis = require('g-i-s')

const decode = s => s.split('a').map(x => String.fromCharCode(x)).join('')

app.use(express.static('public', { index: 'index.html' }))
app.listen(process.env.PORT || 3000)

const callGIS = query => {
  return new Promise((resolve, reject) => {
    gis(query, function (err, data) {
      if (err)
        reject(err)
      else
        resolve(data)
    })
  })
}

async function awaitData(query) {
  data = await callGIS(query)
  if (data) 
    return data.map(x => x.url)
  console.log(`Got ${data} data`)
  process.exit()
}

app.get('/:query', async (req, res) => {
  const decodedQuery = decode(req.params.query)
  const ans = await awaitData(decodedQuery)
  res.status(201).send(ans)
})