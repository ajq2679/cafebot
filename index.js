const Discord = require("discord.js");
const config = require("dotenv");
// Array of all possible i- combinations
const iArray = ["i-", "I-", "im-", "iM-", "I'm-", "i'm-", "IM-", "I'M-", "Im-"];
const offsenses = ["JohnGow", "Bitch"];
var saidis = new db.table('saidis')
var reports = new db.table('reports')
const Explains = {
  "JohnGow": "You have been found guilty of gaming and/or drinking past 8pm and as such you have broken article 5 of Captain Johjn Gow's 1725 Pirate code",
  "Bitch" : "You have been found guilty of being a bitch"
};
let db = new sqlite3.Database('cafe.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});

const client = new Discord.Client({
  disableEveryone: true,
});
// dotenv directory for retrieving token 
config.config({
  path: __dirname + "/.env",
});
// ready statement, logs to console that bot is online
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
// ping command
client.on("message", (msg) => {
  if (msg.content === "cafe ping") {
    msg.reply("Pong!");
  }
});
// detects when someone types "bad" and reacts with B A D
client.on("message", (msg) => {
  if (msg.content.includes("bad") ) {
    msg.react('🇧').then(msg.react('🇦')).then(msg.react('🇩'));
  }
});
//detects when someone types "i-" and adds to database
client.on("message", (msg) => {
  let userThatSaidI = msg.author.id;
  for (var i = 0; i < iArray.length; i++) {
    if (msg.content.includes(iArray[i])) {
      // msg.reply("oh");
      if (saidis.has(userThatSaidI)) {
        saidis.add(userThatSaidI, 1);
      } else {
        saidis.set(userThatSaidI, 0);
        saidis.add(userThatSaidI, 1);
      }
      break;
    }
  }
  return;
});
// checks to see how many times the person said i-
client.on("message", (msg) => {
  if (msg.content.startsWith("cafe icheck")) {
    let mentionedUser = msg.mentions.users.first();
    if (!mentionedUser) {
      msg.channel.send("Please mention someone to check");
      return;
    } else {
      if (saidis.has(mentionedUser.id)) {
        msg.channel.send("That user has said I- " + saidis.get(mentionedUser.id) + " times.")
      } else {
        saidis.set(mentionedUser.id, 0);
        msg.channel.send("That user has said I- " + saidis.get(mentionedUser.id) + " times.")
      }
    }
  }
});
// db.all command for debug testing
client.on("message", (msg) => {
  if (msg.content === "cafe ilist") {
    msg.channel.send(saidis.all());
  }
});
// detects when someone says "oop" and adds to database
// 8ball
client.on("message", (msg) => {
  if (msg.content.startsWith("cafe 8ball") ) {
    var result = Math.random();
    if (result > 0.5) {
      msg.reply("yeaaaa boiii");
    } else {
      msg.reply("haha nope lol get rekt")
    }
  }
});
// hug
client.on("message", (msg) => {
  if (msg.content.startsWith("cafe hug")) {
    let huggedUser = msg.mentions.users.first();
    let author = msg.author;
    if (!huggedUser) { // check if huggedUser actually exists
      msg.channel.send("dawg you didn't mention somebody to hug")
      return;
    } else if (huggedUser.id == author.id) {
      msg.reply("You can't hug yourself you ding dong");
      return;
    } else {
      msg.channel.send(huggedUser.username + ", You got a hug from " + author.username + "! https://tenor.com/view/anime-cuddle-cute-love-gif-12669038");
    }
  }
});
// high five
client.on("message", (msg) => {
  if (msg.content.startsWith("cafe highfive")) {
    let highfiveduser = msg.mentions.users.first();
    let author = msg.author;
    if (!highfiveduser) {
      return;
    } else if (highfiveduser.id == author.id) {
      msg.reply("You can't hug yourself you ding dong");
      return;
    } else {
      msg.channel.send(highfiveduser.username + ", You got a high five from " + author.username + "! https://tenor.com/view/pokemon-pikachu-piplup-high-five-cute-gif-16832624");
    }
  }
});
//Start of the "reporting" system
client.on("message", (msg) => {
  let reportedusr = msg.mentions.users.first();
  if (msg.content.startsWith("cafe report")) {
    let array = msg.content.split(" ");
      for(var i = 0; i < offsenses.length; i++){
        if(msg.content.includes(offsenses[i])){
          if (reports.has(reportedusr)) {
            reports.add(reportedusr, 1);
          } else {
            reports.set(reportedusr, 0);
            reports.add(reportedusr, 1);
          }
          break;

        }
      }
  }
});

// bot login
client.login(process.env.TOKEN);

// to start bot, run "node index.js"