# Various Telegram Bots

A set of small bots for telegrams built in Node.js.
They're all combined into all-in-one bot (but you can easily separate them).

## QuoteBot.js

This bot stores last N messages in a chat and can forward random one of them using command /quote.

Quotes are being automatically loaded from a dropbox folder at the startup, and saved to the same folder in an specified interval.

Available commands:
- /quote - Forwards random message from the quote list
- /quotes - Shows a size of the quote list

## ChooseBot.js

This bot chooses one variant from the list, separated by commas or

Available commands:
- /choose \<variants\> - Sends randomly selected variant from the list

## KernelBot.js

Bot- and app-specific commands.

Available commands:
- /version - Shows app version (from package.json)


## Dependencies (npm)
- node-telegram-bot-api: **0.27.1**
- dropbox: **2.5.4**
- express: **4.15.2**