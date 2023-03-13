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

const queryAllTypeEntries = async function (table) {
  const sql = `SELECT * FROM ${table};`
  const results = await query(sql)
  return { entries: results }
}

const queryViewEntry = async function (table, id) {
  const sql = `SELECT * FROM ${table} WHERE id = ${id};`
  const results = await query(sql)
  return results.length ? results[0] : []
}


const getServerUrl = function (req) {
  const port = PORT === 80 ? "" : `:${PORT}`
  return `${req.protocol}://${req.hostname}${port}`
}

module.exports = {
  query,
  queryAllTypeEntries,
  queryViewEntry

}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', async function (req, res) {
    const creator = await queryViewEntry('character', 1)
    res.render('pages/index', creator)
  })
  .get('/about', function (req, res) {
    res.render('pages/about')
  })
  .get('/health', async function (req, res) {
    const result = await queryAllTypeEntries('SELECT id FROM character;')
    if (result.length === 0) {
      res.status(500).send('Unhealthy')
    } else {
      res.status(200).send('Healthy')
    }
  })
  
  
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
