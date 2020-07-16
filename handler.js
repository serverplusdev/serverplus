const fs = require("fs")
const Discord = require("discord.js")

module.exports = {
    loadCmds: function(client){
            const { commands, aliases, modules } = client

            function loadAll(cmds, alts, mods){
                fs.readdirSync("./src").forEach(dir => {
                    const files = fs.readdirSync(`./src/${dir}/`).filter(file => file.endsWith(".js"))
                    mods.set(dir.toString(), dir)

                    for(const file of files){
                        if(!file) return console.log("No commands were loaded.")
                        const cmd = require(`./src/${dir}/${file}`)
                        cmds.set(cmd.name, cmd)
                        if(cmd.aliases && Array.isArray(cmd.aliases)) cmd.aliases.forEach(alias => alts.set(alias, cmd.name))

                        console.log(`${cmd.name} command loaded!`)
                    }
                })

                
            }

            loadAll(commands, aliases, modules)
    }
}