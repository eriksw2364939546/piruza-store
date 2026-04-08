// Валидация имени
export const validateLeadName = (name, lang = 'fr') => {
    if (!name.trim()) {
        return lang === 'ru' ? 'Введите ваше имя' : 'Veuillez entrer votre nom';
    }
    if (name.trim().length < 2) {
        return lang === 'ru' ? 'Минимум 2 символа' : 'Minimum 2 caractères';
    }
    return null;
};

// Валидация французского телефона
export const validateLeadPhone = (phone, lang = 'fr') => {
    if (!phone.trim()) {
        return lang === 'ru' ? 'Введите номер телефона' : 'Veuillez entrer votre téléphone';
    }

    if (/[()]/.test(phone)) {
        return lang === 'ru'
            ? 'Введите номер без скобок'
            : 'Veuillez entrer le numéro sans parenthèses';
    }

    const cleanPhone = phone.replace(/[\s\-.]/g, '');
    const isFrenchMobile = /^(\+33|0)[67]\d{8}$/.test(cleanPhone);
    const isFrenchLandline = /^(\+33|0)[1-5]\d{8}$/.test(cleanPhone);

    if (!isFrenchMobile && !isFrenchLandline) {
        return lang === 'ru'
            ? 'Неверный формат (пример: +33 6 12 34 56 78 или 06 12 34 56 78)'
            : 'Numéro invalide (format: +33 6 12 34 56 78 ou 06 12 34 56 78)';
    }

    return null;
};

// Валидация города
export const validateLeadCity = (city, lang = 'fr') => {
    if (!city.trim()) {
        return lang === 'ru' ? 'Введите ваш город' : 'Veuillez entrer votre ville';
    }
    if (city.trim().length < 2) {
        return lang === 'ru' ? 'Минимум 2 символа' : 'Minimum 2 caractères';
    }
    return null;
};

// Валидация сообщения
export const validateLeadMessage = (message, lang = 'fr') => {
    if (!message.trim()) {
        return lang === 'ru' ? 'Введите сообщение' : 'Veuillez entrer un message';
    }
    if (message.trim().length < 10) {
        return lang === 'ru' ? 'Минимум 10 символов' : 'Minimum 10 caractères';
    }
    return null;
};

// Валидация всей формы
export const validateLeadForm = (formData, lang = 'fr') => {
    const errors = {};

    const nameError = validateLeadName(formData.name, lang);
    if (nameError) errors.name = nameError;

    const phoneError = validateLeadPhone(formData.phone, lang);
    if (phoneError) errors.phone = phoneError;

    const cityError = validateLeadCity(formData.city, lang);
    if (cityError) errors.city = cityError;

    const messageError = validateLeadMessage(formData.message, lang);
    if (messageError) errors.message = messageError;

    return errors;
};