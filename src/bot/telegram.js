import TelegramBot from "node-telegram-bot-api";

let AUTO_MODE = false;

export function startTelegram(token, onToggleAuto, onStatus) {
  const bot = new TelegramBot(token, { polling: true });

  bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "🤖 Bot aktif!\n\nCommands:\n/auto on\n/auto off\n/status");
  });

  bot.onText(/\/auto on/, (msg) => {
    AUTO_MODE = true;
    onToggleAuto(true);
    bot.sendMessage(msg.chat.id, "🔥 Auto trading ON");
  });

  bot.onText(/\/auto off/, (msg) => {
    AUTO_MODE = false;
    onToggleAuto(false);
    bot.sendMessage(msg.chat.id, "🛑 Auto trading OFF");
  });

  bot.onText(/\/status/, (msg) => {
    const status = onStatus();
    bot.sendMessage(msg.chat.id, status);
  });

  return bot;
}

export function isAutoMode() {
  return AUTO_MODE;
}
