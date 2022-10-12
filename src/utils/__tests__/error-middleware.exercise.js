// Testing Middleware
import {UnauthorizedError} from 'express-jwt'
import errorMiddleware from '../error-middleware'
// 💣 remove this todo test (it's only here so you don't get an error about missing tests)

// 🐨 you'll need both of these:

// 🐨 Write a test for the UnauthorizedError case
const error = new UnauthorizedError('some_error_code', {
  message: 'Some message',
})
const res = {json: jest.fn(() => res), status: jest.fn(() => res)}
test('errorMiddleware should status should be 401 if error', () => {
  console.log(errorMiddleware(error, null, res, null))
  // expect(errormid.status).toBe(401)
})
// 🐨 Write a test for the headersSent case

// 🐨 Write a test for the else case (responds with a 500)
