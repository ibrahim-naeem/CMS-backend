const request = require('supertest')
const app = require('../app') 
const token = require('./auth.test')

// getUserName

console.log("userADetails => " + token)

describe("GET /user",  ()=>{
    let response;
      beforeEach( async()=>{
        // request.user = token
          response = await request(app).get('/user/')
          
      })
      test("Should respond with 200 status Code ",token, async()=>{
          expect(response.statusCode).toBe(200)
      })

      test("Should respond with USERNAME",token, async()=>{
        expect(response.body['user_name']).toBe('ibrahim')
    })
})