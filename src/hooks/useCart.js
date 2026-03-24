"use client";

// ═══════════════════════════════════════════════════════
// useCart — хук управления корзиной продавца
// src/hooks/useCart.js
//
// Хранит в localStorage:
//   cart_{sellerId}          → { [productId]: quantity }
//   cart_products_{sellerId} → { [productId]: { _id, name, price, image, slug } }
// ═══════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from "react";

const getCartKey = (sellerId) => `cart_${sellerId}`;
const getProductsKey = (sellerId) => `cart_products_${sellerId}`;

const readJson = (key) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
};

const writeJson = (key, data) => {
    try {
        if (Object.keys(data).length === 0) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, JSON.stringify(data));
        }
    } catch { }
};

const useCart = (sellerId) => {
    const [cart, setCart] = useState({});
    const [products, setProducts] = useState({});

    // Читаем корзину при монтировании
    useEffect(() => {
        if (!sellerId) return;
        setCart(readJson(getCartKey(sellerId)));
        setProducts(readJson(getProductsKey(sellerId)));
    }, [sellerId]);

    // Добавить / увеличить количество
    const addItem = useCallback((productId, productData = null) => {
        setCart((prev) => {
            const next = { ...prev, [productId]: (prev[productId] || 0) + 1 };
            writeJson(getCartKey(sellerId), next);
            return next;
        });

        // Кэшируем данные товара если переданы
        if (productData) {
            setProducts((prev) => {
                if (prev[productId]) return prev; // уже есть — не перезаписываем
                const next = {
                    ...prev,
                    [productId]: {
                        _id: productData._id,
                        name: productData.name,
                        price: productData.price,
                        image: productData.image || null,
                        slug: productData.slug,
                    },
                };
                writeJson(getProductsKey(sellerId), next);
                return next;
            });
        }
    }, [sellerId]);

    // Убрать / уменьшить количество
    const removeItem = useCallback((productId) => {
        setCart((prev) => {
            const next = { ...prev };
            if (!next[productId]) return prev;
            next[productId] -= 1;
            if (next[productId] <= 0) {
                delete next[productId];
                // Удаляем из кэша товаров если количество 0
                setProducts((prevP) => {
                    const nextP = { ...prevP };
                    delete nextP[productId];
                    writeJson(getProductsKey(sellerId), nextP);
                    return nextP;
                });
            }
            writeJson(getCartKey(sellerId), next);
            return next;
        });
    }, [sellerId]);

    // Установить точное количество
    const setItem = useCallback((productId, quantity, productData = null) => {
        setCart((prev) => {
            const next = { ...prev };
            if (quantity <= 0) {
                delete next[productId];
                setProducts((prevP) => {
                    const nextP = { ...prevP };
                    delete nextP[productId];
                    writeJson(getProductsKey(sellerId), nextP);
                    return nextP;
                });
            } else {
                next[productId] = quantity;
            }
            writeJson(getCartKey(sellerId), next);
            return next;
        });

        if (productData && quantity > 0) {
            setProducts((prev) => {
                if (prev[productId]) return prev;
                const next = {
                    ...prev,
                    [productId]: {
                        _id: productData._id,
                        name: productData.name,
                        price: productData.price,
                        image: productData.image || null,
                        slug: productData.slug,
                    },
                };
                writeJson(getProductsKey(sellerId), next);
                return next;
            });
        }
    }, [sellerId]);

    // Очистить корзину
    const clearCart = useCallback(() => {
        setCart({});
        setProducts({});
        writeJson(getCartKey(sellerId), {});
        writeJson(getProductsKey(sellerId), {});
    }, [sellerId]);

    // Получить массив товаров из корзины (с данными из кэша)
    // Мёрджим с переданным массивом products — берём актуальные данные если есть
    const getCartItems = useCallback((externalProducts = []) => {
        return Object.keys(cart)
            .filter((id) => cart[id] > 0)
            .map((id) => {
                const external = externalProducts.find((p) => p._id === id);
                const cached = products[id];
                const data = external || cached || null;
                return data ? { ...data, _id: id, quantity: cart[id] } : null;
            })
            .filter(Boolean);
    }, [cart, products]);

    // Подсчёты
    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

    const totalPrice = useCallback((externalProducts = []) => {
        return Object.entries(cart).reduce((sum, [id, qty]) => {
            const external = externalProducts.find((p) => p._id === id);
            const cached = products[id];
            const price = external?.price ?? cached?.price ?? 0;
            return sum + price * qty;
        }, 0);
    }, [cart, products]);

    return {
        cart,
        addItem,
        removeItem,
        setItem,
        clearCart,
        getCartItems,
        totalItems,
        totalPrice,
    };
};

export default useCart;