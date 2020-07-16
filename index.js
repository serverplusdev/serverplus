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
//MODULES---------------------

//CONNECT TO MONGO------------
mongo.connect("serverplus")
//CONNECT TO MONGO------------

//CLIENT INIT-----------------
const client = new Discord.Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
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
    client.guilds.cache.forEach(g => {
        Guilds.findOne({
            guildID: g.id
        }, (err, guild) => {
            if (err) return console.log(err)

            if (!guild) {
                const newGuild = new Guilds({
                    guildID: g.id,
                    modules: [],
                    settings: {
                        prefix: "+",
                        locale: "en-us"
                    }
                })

                client.modules.forEach(module => {
                    newGuild.modules.push({
                        name: module,
                        enabled: true,
                        statusEmote: "<:sp_online:732346896173236296>"
                    })
                })


                newGuild.save().catch(err => console.log(err))
                console.log(`Saved ${g.name}`)

                return;
            } else {

                setInterval(() => {
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

                    for (var i = 0; i < guild.modules.length; i += 1) {
                        if (guild.modules[i].enabled === true) {
                            const mod = guild.modules.find(m => m.name === guild.modules[i].name)

                            mod.enabled = true
                            mod.statusEmote = "<:sp_online:732346896173236296>"

                        } else {
                            const mod = guild.modules.find(m => m.name === guild.modules[i].name)

                            mod.enabled = false
                            mod.statusEmote = "<:sp_dnd:732346896458448979>"
                        }
                    }

                    guild.save()
                }, 30000)
                // client.modules.forEach(module => {
                //     newGuild.modules.push({
                //         name: module,
                //         enabled: true,
                //         statusEmote: "<:sp_online:732346896173236296>"
                //     })
                // })
            }
        })
    })
}
//SET GUILD THINGS------------

//COMMENTED OUT---------------

// client.modules.forEach(module => {
//     if (!guild.modules) {
//         guild.modules.push[{
//             name: module,
//             module: true,
//             statusEmote: "<:sp_online:732346896173236296>"
//         }]
//     }

//     for (var i = 0; i < guild.modules.length; i += 1) {
//         if (guild.modules[i].module === false) return;
//     }


// })
// guild.save()

//COMMENTED OUT---------------

client.once("ready", () => {
    handler.loadCmds(client)
    setGuilds()

    setTimeout(() => {
        console.log(`Logged in as ${client.user.tag}`)
    }, 1000)
})

client.on("message", async message => {
    if (message.author.bot) return;

    if (!message.guild || message.channel.type === "dm") {
        // const error = new Discord.MessageEmbed()
        //     .setColor(config.colors.red)
        //     .setThumbnail(message.author.displayAvatarURL())
        //     .setTitle(`Server+ | An error occurred.`)
        //     .setDescription(`My commands do not work in DMs!`)
        //     .setFooter(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL())

        // message.author.send(error)

        errorHandler.errorEmbed(message.author, message, "My commands do not work in DMs!")

        return;
    }

    const prefix = config.prefix

    var regex = new RegExp(/<@!{0,1}731386757320278016>/)

    if (message.content.match(regex)) {
        message.delete({
            timeout: 3000
        })

        embeds.embedBaseThenDelete(message.author, message, `My prefix is \`${prefix}\`, type \`${prefix}help\` for commands!`, [], 5000)
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const cmd = args.shift().toLowerCase()

    if (!message.content.startsWith(prefix)) return;

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd)

    if (!command) command = client.commands.get(client.aliases.get(cmd))

    if (command) command.execute(client, message, args)
})

client.login(process.env.TOKEN)