const express = require('express');
const app = express();
const port = process.env.PORT || 3000
const url = process.env.URL
const express = require('express');
const cron = require('node-cron');
const https = require('https');
const { fork } = require('child_process');

# const PORT = 3000;
const appFunction = () => {
    const app = express();
    app.get('/', (req, res) => {
        res.send('Server is running!');
    });

    cron.schedule('* * * * *', () => {
        https.get(url, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                console.log(`Server pinged at ${new Date()}. Response: ${data}`);
            });
        }).on("error", (err) => {
            console.log(`Error: ${err.message}`);
        });
    });

    const server = app.listen(7000, () => {
        console.log("Server running");
    });
}



// Define route for root URL
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Hello World</title>
    </head>
    <body>
        <h1>Hello World</h1>
    </body>
    </html>
    `);
});

const TeleBot = require('telebot');
const { spawn } = require('child_process');

const config = require('./config').config();
const { adminUsers } = config;

const bot = new TeleBot(config.botToken);
bot.on('text', (msg) => {
  const { id } = msg.from;
  msg.reply.text('$:' + msg.text);
  if (!adminUsers.includes(id)) {
    msg.reply.text('You are not admin!');
    return;
  }
  const words = msg.text.split(' ');
  const len = words.length;
  let args = [];
  if (len > 1) {
    args = words.slice(1, len);
  }
  console.log('args:' + args);

  const shell = spawn(words[0], args).on('error', (err) => {
    msg.reply.text('error while executing:' + words[0]);
    msg.reply.text(err);
  });

  if (shell) {
    shell.stdout.on('data', (data) => {
      msg.reply.text(`stdout:\n ${data}`);
    });

    shell.stderr.on('data', (data) => {
      msg.reply.text(`stderr: ${data}`);
    });

    shell.on('close', (code) => {
      msg.reply.text(`shell exited with code ${code}`);
    });
  }
});

bot.start();

const appProcess = fork(appFunction);
app.listen(port, () => {
  console.log('Server started');
});
