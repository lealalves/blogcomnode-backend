const request = require('supertest')
const app = require('../config/server')
const Postagem = require('../models/Postagem')
const db = require('./db')

beforeAll(async () => await db.connect())
afterAll(async () => await db.closeConnection())

describe('Test my app server', () => {

	it('test', async () => {
		const post = await Postagem.find()

    console.log(post)

	})
})