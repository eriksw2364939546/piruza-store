// Валидация имени (латиница + французские символы)
export const validateName = (name) => {
    if (!name.trim()) {
        return "Veuillez entrer votre nom";
    }
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(name)) {
        return "Le nom ne doit contenir que des lettres latines";
    }
    return null;
};


// Валидация французского телефона
export const validatePhone = (phone) => {
    if (!phone.trim()) {
        return "Veuillez entrer votre téléphone";
    }

    // Проверка на наличие недопустимых символов (включая скобки)
    if (/[()]/.test(phone)) {
        return "Veuillez entrer le numéro sans parenthèses (format: 06 12 34 56 78 ou +33 6 12 34 56 78)";
    }

    // Очистка от допустимых разделителей (для проверки)
    const cleanPhone = phone.replace(/[\s\-.]/g, "");

    // Французский мобильный: +33 6/7 или 06/07 + 8 цифр
    const isFrenchMobile = /^(\+33|0)[67]\d{8}$/.test(cleanPhone);
    // Французский стационарный: +33 1-5 или 01-05 + 8 цифр
    const isFrenchLandline = /^(\+33|0)[1-5]\d{8}$/.test(cleanPhone);

    if (!isFrenchMobile && !isFrenchLandline) {
        return "Numéro de téléphone invalide (format: +33 6 12 34 56 78 ou 06 12 34 56 78)";
    }

    return null;
};

export const formatPhoneForDisplay = (phone) => {
    // Убираем все нецифровые символы кроме +
    const clean = phone.replace(/[^\d+]/g, '');

    // Форматируем французские номера
    if (clean.startsWith('0')) {
        // 0612345678 → 06 12 34 56 78
        if (clean.length === 10) {
            return `${clean.slice(0, 2)} ${clean.slice(2, 4)} ${clean.slice(4, 6)} ${clean.slice(6, 8)} ${clean.slice(8, 10)}`;
        }
    } else if (clean.startsWith('+33')) {
        // +33612345678 → +33 6 12 34 56 78
        if (clean.length === 12) {
            return `${clean.slice(0, 3)} ${clean.slice(3, 4)} ${clean.slice(4, 6)} ${clean.slice(6, 8)} ${clean.slice(8, 10)} ${clean.slice(10, 12)}`;
        }
    }

    // Если не удалось отформатировать, возвращаем оригинал (но очищенный от лишних пробелов)
    return phone.replace(/\s+/g, ' ').trim();
};

// Валидация количества
export const validateQuantity = (quantity, minQuantity) => {
    if (quantity < minQuantity) {
        return `Minimum ${minQuantity} pièces`;
    }
    return null;
};