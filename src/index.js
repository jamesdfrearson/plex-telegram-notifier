/**
 * Plex Telegram Notifier
 * A simple Node.js script to listen for Webhook events from Plex, and send a message via Telegram accordingly (using a bot).
 *
 * © 2022 James Frearson
 */

// Import required modules.
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Telegram = require('telegram-bot-api');
const multer = require('multer');
const fs = require('fs');

let instance;

class PlexTelegramNotifier {
  constructor() {
    if (!instance) instance = this;

    instance.TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID
      ? process.env.TELEGRAM_CHAT_ID.includes('-')
        ? process.env.TELEGRAM_CHAT_ID
        : `-${process.env.TELEGRAM_CHAT_ID}`
      : undefined;
    instance.TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    instance.LISTEN_PORT = process.env.LISTEN_PORT;

    instance.tempPath = `${__dirname}/temp/`;
    instance.upload = multer({ dest: instance.tempPath });

    if (!(instance.TELEGRAM_BOT_TOKEN && instance.TELEGRAM_CHAT_ID && instance.LISTEN_PORT)) {
      console.log(
        "Please ensure you have set the required fields in the '.env' file. Please see the 'README.md' document and the 'sample.env' provided.",
      );

      return process.exit(1);
    }

    instance.server = express();

    instance.server.listen(instance.LISTEN_PORT, async () => {
      console.log(`[Plex Telegram Notifier] Listening on port ${instance.LISTEN_PORT}.`);

      // Initialise the Telegram API.
      instance.telegramApi = new Telegram({
        token: instance.TELEGRAM_BOT_TOKEN,
        updates: {
          enabled: true,
          get_interval: 1000,
        },
      });

      try {
        // Send a test message via the bot to the specified chat.
        await instance.telegramApi.sendMessage({
          chat_id: instance.TELEGRAM_CHAT_ID,
          text: `Plex Telegram Notifier is now active.`,
        });
        // Success!
        console.log('[Plex Telegram Notifier] Connected successfully.');
      } catch (e) {
        // Did Telegram fail to find the chat?
        if (e.description === 'Bad Request: chat not found') {
          console.log("Unable to find the specified chat - please check your '.env' file.", e.description);
          return process.exit(1);
        }
        // Did Telegram fail to find the bot?
        if (e.description === 'Not Found') {
          console.log("Unable to find the specified bot - please check your '.env' file.", e.description);
          return process.exit(1);
        }
        // Unknown error...
        console.log(e);
        return process.exit(1);
      }
    });

    instance.server.get('/', this.getAny);
    instance.server.post('/', instance.upload.single('thumb'), this.postAny);
  }

  getAny(_, res) {
    return res.status(200).json({
      success: true,
      message: 'Connected successfully.',
      telegram: {
        chat_id: instance.TELEGRAM_CHAT_ID,
        bot_id: instance.TELEGRAM_BOT_TOKEN,
      },
    });
  }

  async postAny(req, res) {
    if (!req?.body?.payload)
      return res.status(200).jsonp({
        success: false,
        message: 'No payload data.',
      });

    const payload = JSON.parse(req.body.payload);

    if (payload.event !== 'library.new') return;

    const _formatName = (grandparentTitle, parentTitle, title) => {
      let titleString = '';

      if (grandparentTitle) {
        titleString += `${grandparentTitle}`;
      }

      if (parentTitle) {
        titleString += grandparentTitle ? ` > ${parentTitle}` : parentTitle;
      }

      if (title) {
        titleString += grandparentTitle || parentTitle ? ` > ${title}` : title;
      }

      return titleString;
    };

    const title = _formatName(
      payload?.Metadata?.grandparentTitle,
      payload?.Metadata?.parentTitle,
      payload?.Metadata?.title,
    );

    console.log(`${title} has just been added to the Plex library.`);

    try {
      await instance.telegramApi.sendPhoto({
        chat_id: instance.TELEGRAM_CHAT_ID,
        caption: `${title} has just been added to the Plex library.`,
        photo: req?.file?.path ? fs.createReadStream(req?.file?.path) : '',
      });

      // Remove the temporary file.
      req?.file?.path && fs.rmSync(req?.file?.path);
    } catch (e) {
      console.log(e);
    }

    return res.status(200).jsonp({});
  }
}

module.exports = new PlexTelegramNotifier();
