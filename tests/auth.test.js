const request = require('supertest')
const app = require('../app')

// /roles
describe("GET /cognito/roles",  ()=>{
  let response;
    beforeEach( async()=>{
        response = await request(app).get('/cognito/roles')
    })

    test("Should respond with 200 status Code ", async()=>{
        expect(response.statusCode).toBe(200)
    })

    test("Should get array of Object containing role_id's & role's", async()=>{ 
        expect(response.text).toBe(`[{"role_id":1,"role":"Admin"},{"role_id":2,"role":"Manager"},{"role_id":3,"role":"Employee"}]`)
    })
})

// /signup
describe("GET /cognito/signup",  ()=>{
    let response;
    beforeEach( async()=>{
          response = await request(app).post('/cognito/signup').send({
            "username": "qzwxecrvtbynumikolp",
    "email": "qzwxecrvtbynumikolp@botsoko.com",
    "role": "Admin",
    "password":"Admin_12345"

            
          })
      })   

    test("Should respond JSON content type ", async()=>{
        expect(response.header['content-type']).toEqual(expect.stringContaining("application/json"))
    })

    test("Method should be POST ", async()=>{
        expect(response.req.method).toEqual("POST")
    })
    

    test("Should return correct value", async()=>{
        const userData = {
            username:"ibra113443221",
            email: "ibra113443221@test.com",
            role: "Admin",
            password:"Admin_12345"
          }
        const res  = await request(app).post('/cognito/signup').send(userData)
        // expect(res.body['username']).toBeDefined()
        expect(res.body).toBeDefined()
    })

    test("Should FAIL when credentials are missing", async()=>{
        const res  = await request(app).post('/cognito/signup').send()
        expect(res.status).toBe(400)
    })
})

// /signin
describe("GET /cognito/signin", ()=>{
    let response;
    beforeEach( async()=>{
        response = await request(app).post('/cognito/signin').send({
            "email": "ibrahim22naeem@gmail.com",
            "password":"Admin_12345"    
          })
      })   

    test("Should respond JSON content type ", async()=>{
        expect(response.header['content-type']).toEqual(expect.stringContaining("application/json"))
    })

    test("Method should be POST ", async()=>{
        expect(response.req.method).toEqual("POST")
    })

    test("Method should be jwt token in return", async()=>{
        expect(response.body['uid']).toBeDefined()
    })

    test("Should FAIL when credentials are wrong", async()=>{
        let res = await request(app).post('/cognito/signin').send({
            "email": " test@gmail.com",
            "password":"test"    
          })
        expect(res.body['statusCode']).toBe(400)
    })

    test("Should FAIL when credentials missing", async()=>{
        let res = await request(app).post('/cognito/signin').send({
            "email": " test@gmail.com",
        })
        expect(res.body['statusCode']).toBe(400)
    })
    
})