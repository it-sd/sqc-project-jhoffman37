const { queryAllPets } = require('../server.js')

describe('pet server', function () {
  const baseUrl = 'http://localhost:5163'
  const shouldBeAbove200 = async function (route) {
    it('should be above 200', async function () {
      const url = new URL(route, baseUrl)
      const res = await fetch(url)
      expect(res.status).toBeGreaterThanOrEqual(200)
    }, 10000)
  }
  const shouldBeLessThan399 = async function (route) {
    it('should be below 399', async function () {
      const url = new URL(route, baseUrl)
      const res = await fetch(url)
      expect(res.status).toBeLessThanOrEqual(399)
    }, 10000)
  }
  describe("GET '/health'", function () {
    shouldBeAbove200('/health')
  })
  describe("GET '/'", function () {
    shouldBeAbove200('/')
  })
  describe("GET '/health'", function () {
    shouldBeLessThan399('/health')
  })
  describe("GET '/'", function () {
    shouldBeLessThan399('/')
  })
  describe("POST '/user'", function () {
    const url = new URL('/user', baseUrl)
    it('should accept user info', async function () {
      const data = {
        username: 'username01',
        password: 'password01'
      }
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      expect(response.ok).toBeTrue()
    })
  })
})