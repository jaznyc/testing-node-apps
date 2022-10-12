// Testing Authentication API Routes

import axios from 'axios'
import {resetDb} from 'utils/db-utils'
import * as generate from 'utils/generate'
import startServer from '../start'

// 🐨 you'll need to start/stop the server using beforeAll and afterAll
// 💰 This might be helpful: server = await startServer({port: 8000})
let server
beforeAll(async () => {
  server = await startServer({port: 8000})
})
afterAll(async () => {
  await server.close()
})
// 🐨 beforeEach test in this file we want to reset the database
beforeEach(async () => {
  await resetDb()
})

test('auth flow', async () => {
  const {username, password} = generate.loginForm()
  // register
  // 🐨 use axios.post to post the username and password to the registration endpoint
  // 💰 http://localhost:8000/api/auth/register
  const registerResult = await axios.post(
    'http://localhost:8000/api/auth/register',
    {username, password},
  )
  // 🐨 assert that the result you get back is correct
  // 💰 it'll have an id and a token that will be random every time.
  // You can either only check that `result.data.user.username` is correct, or
  // for a little extra credit 💯 you can try using `expect.any(String)`
  // (an asymmetric matcher) with toEqual.
  // 📜 https://jestjs.io/docs/en/expect#expectanyconstructor
  // 📜 https://jestjs.io/docs/en/expect#toequalvalue
  expect(registerResult.data.user.username).toEqual(username)
  // login
  // 🐨 use axios.post to post the username and password again, but to the login endpoint
  // 💰 http://localhost:8000/api/auth/login
  const loginResult = await axios.post('http://localhost:8000/api/auth/login', {
    username,
    password,
  })
  // 🐨 assert that the result you get back is correct
  // 💰 tip: the data you get back is exactly the same as the data you get back
  // from the registration call, so this can be done really easily by comparing
  // the data of those results with toEqual
  expect(loginResult.data.user.username).toEqual(username)
  // authenticated request
  // 🐨 use axios.get(url, config) to GET the user's information
  // 💰 http://localhost:8000/api/auth/me
  // 💰 This request must be authenticated via the Authorization header which
  // you can add to the config object: {headers: {Authorization: `Bearer ${token}`}}
  // Remember that you have the token from the registration and login requests.
  const token = loginResult.data.user.token
  const authResult = await axios.get('http://localhost:8000/api/auth/me', {
    headers: {Authorization: `Bearer ${token}`},
  })

  // 🐨 assert that the result you get back is correct
  // 💰 (again, this should be the same data you get back in the other requests,
  // so you can compare it with that).
  expect(authResult.data.user.username).toEqual(username)
})
