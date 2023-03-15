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
  const sql = `SELECT name FROM shelters;`
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
  
  .post('/user', async function (req, res) {
    res.set({ 'Content-Type': 'application/json' })
  
   try {
      const client = await pool.connect()
      const username = req.body.username
      const password = req.body.password

      const insertSql = `INSERT INTO users (user_username, user_password) VALUES ($1::TEXT, $2::TEXT);`

      console.log(insertSql, [username, password])
      await client.query(insertSql)

      res.json({ ok: true })
      client.release()
    } catch (err) {
      console.error(err)
      res.json({error: err})
    }
  })

  .listen(PORT, () => console.log(`Listening on ${PORT}`))
