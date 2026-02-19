export async function sendTelegramNotification(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram credentials not set (TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing)");
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const result = await response.json();

    if (!response.ok) {
        console.error("Telegram API Error:", result);
    } else {
        console.log("Telegram Notification Sent Successfully:", result.ok);
    }
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
  }
}
