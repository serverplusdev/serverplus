const mongoose = require("mongoose")

const newGuild = new mongoose.Schema({
    guildID: String,
    modules: Array,
    settings: Object
})

module.exports = new mongoose.model("guild", newGuild)