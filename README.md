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
