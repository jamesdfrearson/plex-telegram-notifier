# Plex Telegram Notifier

A simple Node.js script to listen for Webhook events from Plex, and send a message via Telegram accordingly (using a bot).

## Setup

First, run `npm i` to install all the necessary Node modules.

Clone the contents from `sample.env` into a `.env` file and enter the relevant data into it:

| Key                | Example Value |
| ------------------ | ------------- |
| TELEGRAM_BOT_TOKEN | B0TT0K3N      |
| TELEGRAM_CHAT_ID   | -00123465     |
| LISTEN_PORT        | 5000          |

Run `npm start`.

Within Plex, go to Settings > Webhooks and add this server (with the chosen port) to the Webhooks list - example: `http://localhost:5000`. Webhooks are ran from the server which is running Plex.

## Docker

You can also run this project within docker, simply set up your `.env` file as documented above, and then run `docker compose up -d` or `docker-compose up -d` (depending on which version of Docker you're using).

# Creating a Bot within Telegram

To create a bot, simply message @BotFather on Telegram and create a new bot by messaging `/newbot`, then give the bot a name and a username. BotFather will then message you a HTTP API token, simply copy that token into your `.env` file.

To get the chat ID, create a group chat with yourself and the newly created bot (using its username). Then, log on to the web interface for Telegram [web.telegram.org](https://web.telegram.org) and copy the number **after** the `https://web.telegram.org/z/#-`, simply paste that value into your `.env` file.
