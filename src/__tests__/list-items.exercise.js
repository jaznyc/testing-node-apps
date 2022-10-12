// Testing CRUD API Routes

import axios from 'axios'
import {resetDb, insertTestUser} from 'utils/db-utils'
import {getData, handleRequestFailure, resolve} from 'utils/async'
import * as generate from 'utils/generate'
import * as booksDB from '../db/books'
import startServer from '../start'

let baseURL, server

beforeAll(async () => {
  server = await startServer()
  baseURL = `http://localhost:${server.address().port}/api`
})

afterAll(() => server.close())

beforeEach(() => resetDb())

async function setup() {
  // 💰 this bit isn't as important as the rest of what you'll be learning today
  // so I'm going to give it to you, but don't just skip over it. Try to figure
  // out what's going on here.
  const testUser = await insertTestUser()
  const authAPI = axios.create({baseURL})
  authAPI.defaults.headers.common.authorization = `Bearer ${testUser.token}`
  authAPI.interceptors.response.use(getData, handleRequestFailure)
  return {testUser, authAPI}
}

test('listItem CRUD', async () => {
  const {testUser, authAPI} = await setup()

  // 🐨 create a book object and insert it into the database
  // 💰 use generate.buildBook and await booksDB.insert
  const book = generate.buildBook()
  await booksDB.insert(book)

  // CREATE
  // 🐨 create a new list-item by posting to the list-items endpoint with a bookId
  // 💰 the data you send should be: {bookId: book.id}
  const postData = await authAPI.post('/list-items', {bookId: book.id})
  // 🐨 assert that the data you get back is correct
  // 💰 it should have an ownerId (testUser.id) and a bookId (book.id)
  // 💰 if you don't want to assert on all the other properties, you can use
  // toMatchObject: https://jestjs.io/docs/en/expect#tomatchobjectobject
  expect(postData.listItem.book).toMatchObject(book)
  expect(postData.listItem.ownerId).toEqual(testUser.id)
  // 💰 you might find this useful for the future requests:
  const listItemId = postData.listItem.id
  const listItemIdUrl = `list-items/${listItemId}`

  // READ
  // 🐨 make a GET to the `listItemIdUrl`
  // 🐨 assert that this returns the same thing you got when you created the list item
  const getIDData = await authAPI.get(listItemIdUrl)
  expect(getIDData).toEqual(postData)

  // UPDATE
  // 🐨 make a PUT request to the `listItemIdUrl` with some updates
  // 💰 const updates = {notes: generate.notes()}
  // 🐨 assert that this returns the right stuff (should be the same as the READ except with the updated notes)
  const updateData = await authAPI.put(listItemIdUrl, {notes: generate.notes()})
  expect(updateData.listItem.notes).not.toEqual(getIDData.listItem.notes)
  // DELETE
  // 🐨 make a DELETE request to the `listItemIdUrl`
  // 🐨 assert that this returns the right stuff (💰 {success: true})
  const deleteData = await authAPI.delete(listItemIdUrl)
  expect(deleteData).toEqual({success: true})
  // 🐨 try to make a GET request to the `listItemIdUrl` again.
  const getIDDataDupe = await authAPI.get(listItemIdUrl).catch(resolve)

  // 💰 this promise should reject. You can do a try/catch if you want, or you
  // can use the `resolve` utility from utils/async:
  // 💰 const error = await authAPI.get(listItemIdUrl).catch(resolve)
  // 🐨 assert that the status is 404 and the error.data is correct
  expect(getIDDataDupe.status).toBe(404)
  expect(getIDDataDupe.data.message).toMatchInlineSnapshot(
    // eslint-disable-next-line jest/no-interpolation-in-snapshots
    `"No list item was found with the id of ${listItemId}"`,
  )
})

/* eslint no-unused-vars:0 */
