"use server";

export async function sendToTelegram(formData) {
    const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
    const TG_CHAT_ID = process.env.TG_CHAT_ID;

    if (!TG_BOT_TOKEN || !TG_CHAT_ID) {
        console.error("Telegram credentials missing");
        return {
            success: false,
            error: "Telegram configuration error"
        };
    }

    const TG_URL = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`;

    try {
        const message = `
🏪 <b>Новая заявка продавца!</b>

👤 <b>Имя:</b> ${formData.name || 'Не указано'}
📞 <b>Телефон:</b> ${formData.phone || 'Не указано'}
📍 <b>Город:</b> ${formData.city || 'Не указано'}
💬 <b>Сообщение:</b> ${formData.message || 'Не указано'}

⏰ <b>Время:</b> ${new Date().toLocaleString("fr-FR", {
            timeZone: "Europe/Paris",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })}
        `.trim();

        const response = await fetch(TG_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: TG_CHAT_ID,
                text: message,
                parse_mode: "HTML",
            }),
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error("Telegram API Error Response:", responseData);
            throw new Error(`Telegram API error: ${response.status} - ${JSON.stringify(responseData)}`);
        }

        console.log("Telegram success:", responseData);

        return {
            success: true,
            data: responseData,
            message: "Lead sent successfully"
        };
    } catch (error) {
        console.error("Telegram Catch Error:", error.message);
        return {
            success: false,
            error: error.message || "Failed to send message to Telegram"
        };
    }
}