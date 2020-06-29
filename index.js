const Discord = require("discord.js");
const config = require("dotenv");
// Array of all possible i- combinations
const iArray = ["i-", "I-", "im-", "iM-", "I'm-", "i'm-", "IM-", "I'M-", "Im-"];
// SQLite stuff
const SQLite = require("better-sqlite3");
const sql = new SQLite("./counter.sqlite");
// const sqlconfig = require("./config.json");
//beginning of discord bot stuff
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
  // SQL table creation if SQL table does not exist yet
  const table = sql
    .prepare(
      "SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'counter';"
    )
    .get();
  if (!table["count(*)"]) {
    sql
      .prepare(
        "CREATE TABLE counter (id TEXT PRIMARY KEY, user TEXT, guild TEXT, icount INTEGER);"
      )
      .run();
    // ensure "id" row is always unique and indexed - no repeat user IDs allowed
    sql.prepare("CREATE UNIQUE INDEX idx_counter_id ON counter (id);").run();
    // magic pragma shit, makes the database run faster apparently
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
  }
  // get and set counter data
  client.getCounter = sql.prepare(
    "SELECT * FROM counter WHERE user = ? AND guild = ?"
  );
  client.setCounter = sql.prepare(
    "INSERT OR REPLACE INTO counter (id, user, guild, icount) VALUES (@id, @user, @guild, @icount);"
  );
});
client.on("message", (msg) => {
  if (msg.author.bot) return;
  let counter = client.getCounter.get(msg.author.id, msg.guild.id);
  if (msg.guild) {
    counter = client.getCounter.get(msg.author.id, msg.guild.id);
    if (!counter) {
      counter = {
        id: `${msg.guild.id}-${msg.author.id}`,
        user: msg.author.id,
        guild: msg.guild.id,
        icount: 0,
      };
    }
    for (var i = 0; i < iArray.length; i++) {
      if (msg.content.includes(iArray[i])) {
        counter.icount++;
        client.setCounter.run(counter);
        break;
      }
    }
    // command for checking how many times you said i-
    if (msg.content.startsWith("cafe counter")) {
      const user = msg.mentions.users.first() || client.users.get(msg.content)
      msg.reply(
        `You currently have said i- a total of ${counter.icount} times.`
      );
    }
    // displays top 10 i-
    if (msg.content.startsWith("cafe leaderboard")) {
      const top10 = sql
        .prepare(
          "SELECT * FROM counter WHERE guild = ? ORDER BY icount DESC LIMIT 10;"
        )
        .all(msg.guild.id);
      // Now shake it and show it! (as a nice embed, too!)
      const embed = new Discord.MessageEmbed()
        .setTitle("I- Leaderboard")
        .setAuthor(client.user.username, client.user.avatarURL)
        .setDescription(
          "Our top 10 points leaders! these people said i one too many times lol"
        )
        .setColor(0x00ae86);
      for (const data of top10) {
        embed.addField(
          client.users.cache.get(data.user).tag,
          `${data.icount} times`
        );
      }
      return msg.channel.send({ embed });
    }
  }
});
client.on("message", (msg) => {
  if (msg.author.bot) return;
  if (msg.guild) {
    // ping command
    if (msg.content === "cafe ping") {
      msg.reply("Pong!");
    }
    // detects when someone types "bad" and reacts with B A D
    if (msg.content.includes("bad")) {
      msg.react("🇧").then(msg.react("🇦")).then(msg.react("🇩"));
    }
    // 8ball
    if (msg.content.startsWith("cafe 8ball")) {
      var result = Math.random();
      if (result >= 0.5) {
        msg.reply("yeaaaa boiii");
      } else {
        msg.reply("nah, doesn't look like it chief");
      }
    }
    // hug
    if (msg.content.startsWith("cafe hug")) {
      let huggedUser = msg.mentions.users.first();
      let author = msg.author;
      if (!huggedUser) {
        // check if huggedUser actually exists
        msg.channel.send("who are you tryna hug again?");
        return;
      } else if (huggedUser.id == author.id) {
        msg.reply("You can't hug yourself you ding dong");
        return;
      } else {
        result = Math.floor((Math.random() * 5) + 1);
        possibleGIFs = [
          "https://tenor.com/bbQCJ.gif",
          "https://tenor.com/7Xh1.gif",
          "https://66.media.tumblr.com/b3b033f62ed1b20ee842e2e76b20b871/tumblr_ni8acmfO631qfjr5zo1_500.gif",
          "https://tenor.com/thvU.gif",
          "https://tenor.com/TrcC.gif",
        ];
        msg.channel.send(
          huggedUser.username +
            ", You got a hug from " +
            author.username +
            "! " +
            possibleGIFs[result]
        );
      }
    }
    // highfive
    if (msg.content.startsWith("cafe highfive")) {
      let highfiveduser = msg.mentions.users.first();
      let author = msg.author;
      if (!highfiveduser) {
        msg.reply(
          "dawg are you trying to slap somebody? please mention someone to highfive"
        );
      } else if (highfiveduser.id == author.id) {
        msg.reply("Congrats! you literally just clapped yourself");
        return;
      } else {
        msg.channel.send(
          highfiveduser.username +
            ", You got a high five from " +
            author.username +
            "! https://tenor.com/view/pokemon-pikachu-piplup-high-five-cute-gif-16832624"
        );
      }
    }
  }
});
//Start of the "reporting" system
client.on("message", (msg) => {
  if (msg.content == "=report") {
    msg.reply("EHHHHHK");
  }
});
// bot login
client.login(process.env.TOKEN);
// to start bot, run "node index.js"
