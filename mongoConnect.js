const mongoose = require("mongoose")
require("dotenv").config()
const {
    MONGOUN,
    MONGOPS
} = process.env

module.exports = {
    connect: async (database) => {
        mongoose.connect(`mongodb+srv://${MONGOUN}:${MONGOPS}@serverplus.jqd9s.mongodb.net/${database}?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log("Initializing database connection...")

        mongoose.connection.once("open", () => {
            console.log("Connected to the database.")
        });
    }
}