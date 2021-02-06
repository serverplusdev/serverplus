const config = require('../../config.js')
const errorHandler = require('../../embeds/error.js')
const embeds = require('../../embeds/general.js')
const Discord = require("discord.js")
const Guild = require("../../models/guild.js")
const fs = require("fs")

module.exports = {
    name: 'help',
    aliases: ['h', 'commands', 'modules', 'enabled'],
    description: 'Get a full list of enabled modules, and their commands.',
    category: "Info",
    usage: "(command name | modules)",
    async execute(client, message, args) {
        message.delete()

        Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) return console.log(err)

            const {
                settings
            } = guild;

            if (!args[0]) {
                let base = new Discord.MessageEmbed()
                    .setColor(config.colors.blue)
                    .setThumbnail(message.guild.iconURL())
                    .setTitle(`Enabled Modules for \`${message.guild.name}\``)
                    .setFooter(`Requested By: ${message.author.username}#${message.author.discriminator} | ${settings.prefix}help modules [module name]`)
                    .setTimestamp()

                for (var i = 0; i < guild.modules.length; i += 1) {

                    if (!guild.blacklist.moduleBlacklist.includes(guild.modules[i])) {
                        base.addField(`\u200b`, `<:sp_online:732346896173236296> \`${guild.modules[i]}\``, true)
                    }

                }

                message.channel.send(base)

                return;
            }

            if (args[0].toLowerCase() === "modules" || args[0].toLowerCase() === "mods") {
                if (!args[1]) {
                    const mods = guild.modules.filter(m => m)

                    for (const m of mods) {
                        var desc = `__**Modules**__ (\`${message.guild.name}\`)\n`;
                        client.modules.forEach(module => {
                            desc += `${module} - ${guild.blacklist.moduleBlacklist.includes(module) ? '<:sp_dnd:732346896458448979>' : '<:sp_online:732346896173236296>'}\n`
                        })
                    }

                    embeds.embedBase(message.author, message, `${desc}`)

                    return;
                }
                if (args[1]) {
                    const mod = guild.modules.find(m => m === args[1].toLowerCase())
                    if (!mod) return errorHandler.errorEmbed(message.author, message, "That's not a valid module!")

                    let whatever;

                    function defineFields() {
                        var fields = []
                        fs.readdir("./src/" + mod + "/", (error, files) => {

                            if (error) console.log(error)
                            whatever = files
                            console.log(`${files} - FILES`)

                            let jsfile = files.filter(f => f.endsWith(".js"))
                            if (jsfile.length <= 0) {
                                errorHandler.errorEmbed(message.author, message, `No commands were found for the \`${mod}\` module!`)

                                return;
                            }
                            jsfile.forEach((f) => {
                                let props = require("../" + mod + "/" + f);

                                if (props.usage) {
                                    fields.push({
                                        title: props.name,
                                        content: `\`${guild.settings.prefix}${props.name} ${props.usage}\``,
                                        inline: true
                                    })
                                } else {
                                    fields.push({
                                        title: props.name,
                                        content: `\`No Usage Found.\``,
                                        inline: true
                                    })
                                }

                                fields = fields
                            });

                            embeds.embedBase(message.author, message, `\`${mod}\` Module`, fields)
                        });

                    }

                    defineFields()

                    return;
                }
            }

            if (args[0]) {
                let cmd = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]))
                // if (!cmd) return errorHandler.errorEmbed(message.author, message, `That's not a valid command!`)
                if (!cmd) {
                    const mod = guild.modules.find(m => m.toLowerCase() === args[0].toLowerCase())
                    if (!mod) return errorHandler.errorEmbed(message.author, message, `That's not a valid command!`)

                    let whatever;

                    function defineFields() {
                        var fields = []
                        fs.readdir("./src/" + mod + "/", (error, files) => {

                            if (error) console.log(error)
                            whatever = files
                            console.log(`${files} - FILES`)

                            let jsfile = files.filter(f => f.endsWith(".js"))
                            if (jsfile.length <= 0) {
                                errorHandler.errorEmbed(message.author, message, `No commands were found for the \`${mod}\` module!`)

                                return;
                            }
                            jsfile.forEach((f) => {
                                let props = require("../" + mod + "/" + f);

                                if (props.usage) {
                                    fields.push({
                                        title: props.name,
                                        content: `\`${guild.settings.prefix}${props.name} ${props.usage}\``,
                                        inline: true
                                    })
                                } else {
                                    fields.push({
                                        title: props.name,
                                        content: `\`No Usage Found.\``,
                                        inline: true
                                    })
                                }

                                fields = fields
                            });

                            embeds.embedBase(message.author, message, `\`${mod}\` Module`, fields)
                        });

                    }

                    defineFields()

                    return;
                }

                const embed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL())
                    .setColor(config.colors.blue)
                    .setDescription(`\`${cmd.name}\``)
                    .setFooter(`Requested By: ${message.author.username}#${message.author.discriminator} | [] = Required () = Optional`, message.author.displayAvatarURL())

                if (cmd.category) {
                    embed.setDescription(`\`${cmd.name}\` (${cmd.category})`)
                }
                if (cmd.description) {
                    embed.addField("Description", cmd.description, true)
                }
                if (cmd.usage) {
                    embed.addField("Usage", `\`${settings.prefix}${cmd.name} ${cmd.usage}\``, true)
                }
                if (cmd.aliases) {
                    embed.addField("Aliases", cmd.aliases.map(x => `**${x}**`).join(", "))
                }

                message.channel.send(embed)
            }

        })

    }
}