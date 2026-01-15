"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppNotification = {
    id: string;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    type: 'alarm' | 'info' | 'success';
};

interface NotificationContextType {
    notifications: AppNotification[];
    unreadCount: number;
    addNotification: (title: string, message: string, type?: 'alarm' | 'info' | 'success') => void;
    markAsRead: (id: string) => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    // Load from LocalStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('applyfollow_notifications');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Convert string dates back to Date objects
                const withDates = parsed.map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) }));
                setNotifications(withDates);
            } catch (e) {
                console.error("Failed to parse notifications", e);
            }
        }
    }, []);

    // Save to LocalStorage on change
    useEffect(() => {
        localStorage.setItem('applyfollow_notifications', JSON.stringify(notifications));
    }, [notifications]);

    const addNotification = (title: string, message: string, type: 'alarm' | 'info' | 'success' = 'info') => {
        // Safe UUID generation (crypto.randomUUID may not be available in non-HTTPS contexts)
        const generateId = () => {
            if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
            return Math.random().toString(36).substring(2, 9);
        };

        const newNotif: AppNotification = {
            id: generateId(),
            title,
            message,
            timestamp: new Date(),
            read: false,
            type
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, clearAll }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
