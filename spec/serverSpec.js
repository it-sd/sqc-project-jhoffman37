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
  describe("GET '/about'", function () {
    shouldBeAbove200('/about')
  })
  describe("GET '/about'", function () {
    shouldBeLessThan399('/about')
  })
  describe("GET '/pets'", function () {
    shouldBeAbove200('/pets')
  })
  describe("GET '/pets'", function () {
    shouldBeLessThan399('/pets')
  })
  describe("GET '/shelters'", function () {
    shouldBeAbove200('/shelters')
  })
  describe("GET '/shelters'", function () {
    shouldBeLessThan399('/shelters')
  })
  describe("GET '/login'", function () {
    shouldBeAbove200('/login')
  })
  describe("GET '/login'", function () {
    shouldBeLessThan399('/login')
  })

  describe("POST '/userAccount'", function () {
    const url = new URL('/userAccount', baseUrl)
    it('should accept userAccount info', async function () {
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
      expect(response.ok).toBeFalse()
    })
  })
})
