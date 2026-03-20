"use client";

// ═══════════════════════════════════════════════════════
// useCart — хук управления корзиной продавца
// src/hooks/useCart.js
// Хранит { [productId]: quantity } в localStorage
// ═══════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from "react";

const getStorageKey = (sellerId) => `cart_${sellerId}`;

const readCart = (sellerId) => {
    try {
        const raw = localStorage.getItem(getStorageKey(sellerId));
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
};

const writeCart = (sellerId, cart) => {
    try {
        if (Object.keys(cart).length === 0) {
            localStorage.removeItem(getStorageKey(sellerId));
        } else {
            localStorage.setItem(getStorageKey(sellerId), JSON.stringify(cart));
        }
    } catch { }
};

const useCart = (sellerId) => {
    const [cart, setCart] = useState({});

    // Читаем корзину из localStorage при монтировании
    useEffect(() => {
        if (!sellerId) return;
        setCart(readCart(sellerId));
    }, [sellerId]);

    // Добавить / увеличить количество
    const addItem = useCallback((productId) => {
        setCart((prev) => {
            const next = { ...prev, [productId]: (prev[productId] || 0) + 1 };
            writeCart(sellerId, next);
            return next;
        });
    }, [sellerId]);

    // Убрать / уменьшить количество
    const removeItem = useCallback((productId) => {
        setCart((prev) => {
            const next = { ...prev };
            if (!next[productId]) return prev;
            next[productId] -= 1;
            if (next[productId] <= 0) delete next[productId];
            writeCart(sellerId, next);
            return next;
        });
    }, [sellerId]);

    // Установить точное количество
    const setItem = useCallback((productId, quantity) => {
        setCart((prev) => {
            const next = { ...prev };
            if (quantity <= 0) delete next[productId];
            else next[productId] = quantity;
            writeCart(sellerId, next);
            return next;
        });
    }, [sellerId]);

    // Очистить корзину
    const clearCart = useCallback(() => {
        setCart({});
        writeCart(sellerId, {});
    }, [sellerId]);

    // Подсчёты
    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

    const totalPrice = (products = []) =>
        Object.entries(cart).reduce((sum, [id, qty]) => {
            const p = products.find((p) => p._id === id);
            return sum + (p?.price || 0) * qty;
        }, 0);

    return { cart, addItem, removeItem, setItem, clearCart, totalItems, totalPrice };
};

export default useCart;