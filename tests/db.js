const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

let con, mongoServer

module.exports = {
	connect: async () => {
		mongoServer = await MongoMemoryServer.create()
		con = await mongoose.connect(mongoServer.getUri(), {})
	},
	closeConnection: async () => {
		if (con) {
			await con.connection.close()

		}
		if (mongoServer) {
			await mongoServer.stop()
		}
	}
}