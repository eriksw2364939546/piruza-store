"use server";

export async function sendToTelegram(formData, flavors, totalPrice) {
    const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
    const TG_CHAT_ID = process.env.TG_CHAT_ID;
    const TG_URL = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`;

    // Формируем сообщение
    const flavorsList = flavors
        .map(
            (item) =>
                `   • ${item.flavor.split(" - ")[0]} - ${item.quantity} шт. (${(item.quantity * 2.5).toFixed(2)}€)`
        )
        .join("\n");

    const message = `
🆕 <b>Новый заказ!</b>

👤 <b>Имя:</b> ${formData.name}
📞 <b>Телефон:</b> ${formData.phone}

🍇 <b>Заказ:</b>
${flavorsList}

💰 <b>Общая сумма:</b> ${totalPrice}€
  `.trim();

    try {
        const response = await fetch(TG_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: TG_CHAT_ID,
                text: message,
                parse_mode: "HTML",
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to send message to Telegram");
        }

        const result = await response.json();
        return { success: true, data: result };
    } catch (error) {
        console.error("Telegram Error:", error);
        return { success: false, error: error.message };
    }
}