//FILES-----------------------
const handler = require('./handler.js')
const config = require('./config.js')
const errorHandler = require('./embeds/error.js')
const embeds = require('./embeds/general.js')
const mongo = require("./mongoConnect.js")
//FILES-----------------------

//MODULES---------------------
const Discord = require("discord.js")
require("dotenv").config()
require("fs").promises
//MODULES---------------------

//CONNECT TO MONGO------------
mongo.connect("serverplus")
//CONNECT TO MONGO------------

//CLIENT INIT-----------------
const client = new Discord.Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER']
})
//CLIENT INIT-----------------

//MODELS----------------------
const Guilds = require("./models/guild.js")
//MODELS----------------------

//COLLECTIONS-----------------
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.modules = new Discord.Collection()
//COLLECTIONS-----------------

//SET GUILD THINGS------------
function setGuilds() {
    client.guilds.cache.forEach(async g => {
        const guild = await Guilds.findOne({
            guildID: g.id
        })

        if (!guild) {
            const newGuild = new Guilds({
                guildID: g.id,
                modules: [],
                settings: {
                    prefix: "+",
                    locale: "en-us"
                },
                blacklist: {
                    moduleBlacklist: []
                }
            })

            client.modules.forEach(module => {
                newGuild.modules.push(module)
            })

            newGuild.save().catch(err => console.log(err))
            console.log(`Saved ${g.name}`)

            return;
        } else {

            // setInterval(() => {
            if (!guild.settings) {
                guild.settings = {
                    prefix: "+",
                    locale: "en-us"
                }
            }
            if (!guild.settings.prefix) {
                guild.settings.prefix = "+";
            }
            if (!guild.settings.locale) {
                guild.settings.locale = "en-us";
            }

            if (!guild.blacklist) {
                guild.blacklist = {}
                guild.blacklist.moduleBlacklist = []
            }

            if(!guild.sessionStorage){
                guild.sessionStorage = null
            }

            guild.save().catch(err => console.log(err))
            // }, 30000)
        }
    })
}
//SET GUILD THINGS------------

handler.loadCmds(client)

client.once("ready", () => {

    setGuilds()

    //SET ACTIVITY--------
    setInterval(() => {
        client.user.setActivity(`over ${client.guilds.cache.array().length} servers.`, {type: "WATCHING"})
    }, 20000)
    //SET ACTIVITY--------

    setTimeout(() => {
        console.log(`Logged in as ${client.user.tag}`)
    }, 1000)
})

client.on("message", async message => {
    if (message.author.bot) return;

    if (!message.guild || message.channel.type === "dm") {
        errorHandler.errorEmbed(message.author, message, "My commands do not work in DMs!")

        return;
    }

    Guilds.findOne({
        guildID: message.guild.id
    }, (err, guild) => {
        if (err) return console.log(err)

        const {
            settings,
            blacklist
        } = guild;

        const prefix = settings.prefix

        var regex = new RegExp(/<@!{0,1}731386757320278016>/)

        if (!message.content.startsWith(prefix)) {
            if (message.content.match(regex)) {
                if(!message) return;
                message.delete({
                    timeout: 3000
                })

                embeds.embedBaseThenDelete(message.author, message, `My prefix is \`${prefix}\`, type \`${prefix}help\` for commands!`, [], 5000)
            }
        }


        const args = message.content.slice(prefix.length).trim().split(/ +/g)
        const cmd = args.shift().toLowerCase()

        if (!message.content.startsWith(prefix)) return;

        if (cmd.length === 0) return;

        let command = client.commands.get(cmd)

        if (!command) command = client.commands.get(client.aliases.get(cmd))

        if (command) command.execute(client, message, args)
    })
})

// client.on('messageReactionAdd', async(reaction, user) => {
//     let { id } = reaction.message
// })

client.login(process.env.TOKEN)