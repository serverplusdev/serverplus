const mongoose = require("mongoose")

const newGuild = new mongoose.Schema({
    guildID: String,
    modules: Array,
    settings: Object,
    blacklist: Object,
    sessionStorage: String
})

module.exports = new mongoose.model("guild", newGuild)