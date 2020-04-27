const Discord = require("discord.js");
const config = require("dotenv");
const client = new Discord.Client({
  disableEveryone: true,
});
config.config({
  path: __dirname + "/.env",
});
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  if (msg.content === "ping") {
    msg.reply("Pong!");
  }
});

client.login(process.env.TOKEN);
