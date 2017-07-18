# Various Telegram Bots 1.2.2

A set of small bots for telegrams built in Node.js.
They're all combined into all-in-one bot (but you can easily separate them).

All app settings are specified in `.env.example` file.
To run the app, you have to create your own `.env` file with all options from the example.

You might also need to install `dotenv` npm package to use .env settings (or just run the app with `heroku local` command).

## QuoteBot.js

This bot stores last N messages in a chat and can forward random one of them using command `/quote`.

Quotes are being automatically loaded from a dropbox folder at the startup, and saved to the same folder in an specified interval.

Available commands:
- `/quote` - Forwards random message from the quote list
- `/quotes` - Shows a size of the quote list

## ChooseBot.js

This bot chooses one variant from the list, separated by commas or spaces.

Available commands:
- `/choose <variants>` - Sends randomly selected variant from the list
- `/yes_or_no` - Sends `yes` or `no`

Examples:
- `/choose my variant 1, something else, idk`
- `/choose yes no maybe`
- `/choose yes, no maybe` - It won't work as you, I think, want it to. The bot will choose whether `yes` or `no maybe`, because when you use commas to separate variants, spaces are being ignored (so you can build sentences with more than one word).

## ReactionBot.js

This bot reacts to some chat messages with an emoji or random predefined text.
You can reply to some message with command `/react` and bot will reply to the exact message with an emoji or text (as set in the code).

Available commands:
- `/react` - Reacts to a message with an emoji or random predefined text

## KernelBot.js

Bot- and app-specific commands.

Available commands:
- `/version` - Shows app version (from `package.json`)


## Dependencies (npm)
- `node-telegram-bot-api`: **0.27.1**
- `dropbox`: **2.5.4**
- `express`: **4.15.2**