require('dotenv').config()
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5163

const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

const query = async function (sql, params) {
  let client
  let results = []
  try {
    client = await pool.connect()
    const response = await client.query(sql, params)
    if (response && response.rows) {
      results = response.rows
    }
  } catch (err) {
    console.error(err)
  }
  if (client) client.release()
  return results
}

const queryAllTypeEntries = async function () {
  const sql = `SELECT * FROM shelters;`
  const results = await query(sql)
  return { entries: results }
}

const queryAllPets = async function () {
  const sql = `SELECT id, name FROM pets;`
  const results = await query(sql)
  return { pet: results}
}

const queryAllShelters = async function () {
  const sql = `SELECT address FROM shelters;`
  const results = await query(sql)
  return { shelter: results}
}

const getServerUrl = function (req) {
  const port = PORT === 80 ? "" : `:${PORT}`
  return `${req.protocol}://${req.hostname}${port}`
}

module.exports = {
  query,
  queryAllTypeEntries,
  queryAllPets,
  queryAllShelters
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', async function (req, res) {
    const entries = await queryAllTypeEntries()
    res.render('pages/index', entries)
  })
  .get('/about', function (req, res) {
    res.render('pages/about')
  })
  .get('/shelters', async function (req, res) {
    const shelter = await queryAllShelters()
    res.render('pages/shelters', shelter)
  })
  .get('/pets', async function (req, res) {
    const pet = await queryAllPets()
    res.render('pages/pets', pet)
  })
  .get('/login', function (req, res) {
    res.render('pages/login')
  })
  .get('/health', async function (req, res) {
    const entries = await queryAllTypeEntries()
    if (entries.length === 0) {
      res.status(500).send('Unhealthy')
    } else {
      res.status(200).send('Healthy')
    }
  })
  
  
  .post('/cuteOrNot', async function (req, res) {
    res.set({ 'Content-Type': 'application/json' })

    try {
      const client = await pool.connect()
      const id = Number(req.body.petId)
      
      if (!Number.isInteger(id) || id < 1) {
        console.error(`Unexpected pet id of ${req.body.petId}`)
        res.status(400).json({ ok: false })
        return
      }

      let cuteOrNot
      if (req.body.cuteOrNot === 'Cute') cuteOrNot = 1
      else if (req.body.cuteOrNot === 'notCute') cuteOrNot = 0
      else {
        console.error(`Unexpected input of ${req.body.cuteOrNot}`)
        res.status(400).json({ ok: false })
        return
      }

      const insertSql = `INSERT INTO cuteOrNot (pet_id, value, at)
        VALUES ($1::INTEGER, $2::FLOAT, NOW());`
      await client.query(insertSql, [id, cuteOrNot])
  
  res.json({ ok: true })
      client.release()
    } catch (err) {
      console.error(err)
      res.json({error: err})
    }
  })
  
  
  .post('/user', async function (req, res) {
    res.set({ 'Content-Type': 'application/json' })
  
   try {
      const client = await pool.connect()
      const username = req.body.username
      const password = req.body.password

      const insertSql = `INSERT INTO userAccount (username, password) VALUES ($1::TEXT, $2::TEXT);`

      console.log(insertSql, [username, password])
      await client.query(insertSql)

      res.json({ ok: true })
      client.release()
    } catch (err) {
      console.error(err)
      res.json({error: err})
    }
  })

.get('/toPetApi/:table/:id', async function (req, res) {
    const baseURL = 'https://api.petfinder.com/v2/oauth2/token'

    const response = await fetch(petRequest, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Accept': 'application/json'
      }
    })

  })


  .listen(PORT, () => console.log(`Listening on ${PORT}`))
