const { Schema, model } = require("mongoose")

const data = new Schema({
    messageID: String,
    guildID: String,
    roles: Object
})

module.exports = new model("reactionRole", data)