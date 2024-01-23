const app = require('./app.js')
const config = require('./app/config')
const MongoDB = require('./app/utils/mongodb.util.js')

const PORT = config.app.port
const MONGDB_URI = config.app.db.uri

async function startServer() {
    try {
        await MongoDB.connect(MONGDB_URI)
        console.log("Connected to the databse!")
    
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (err) {
        console.log("Cannot connect to the database!", err)
        process.exit()
    }
}

startServer()