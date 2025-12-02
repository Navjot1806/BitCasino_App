import { Stack } from 'expo-router';
import React from 'react';

export interface User {
    email: string;
    password: string;
    hasReceivedBonus: boolean;
    balance: number;
    transactions: Transaction[];
    gameHistory: GameHistory[];
}

interface Transaction {
    id: number;
    type: 'deposit' | 'withdraw' | 'bet' | 'win' | 'bonus';
    amount: number; // Positive for income, negative for expense/withdraw
    game?: string;
    status: 'completed' | 'pending' | 'failed';
    timestamp: Date;
}

interface GameHistory {
    id: number;
    game: string;
    betAmount: number;
    winAmount: number;
    netAmount: number; // winAmount - betAmount
    result: 'win' | 'loss';
    timestamp: Date;
}
// Constants
const BONUS_AMOUNT_BTC = 0.002222;
const INITIAL_ZERO_BALANCE = 0.000000;

let userDBMap: Map<string, User> = new Map<string, User>();

// This holds the current login status.
let sessionData: { userEmail: string | null; } = { userEmail: null };

// In-memory 'database' of registered users. Use a Map for easy lookups.
export const userDB = new Map<string, User>();

const initializeData = () => {

    sessionData.userEmail = null;

    if (userDBMap.size === 0) {
        userDBMap.set('test@example.com', {
            email: 'test@example.com',
            password: 'password',
            hasReceivedBonus: true,
            balance: BONUS_AMOUNT_BTC,
            transactions: [{
                id: 1, type: 'bonus', amount: BONUS_AMOUNT_BTC, status: 'completed', timestamp: new Date(Date.now() - 1000 * 60 * 60)
            }],
            gameHistory: [],
        });
        // NOTE: In a real app, this map would be loaded from AsyncStorage here.
    }
};
initializeData();

// --- Session Persistence Functions (Simulating Async Storage) ---

// Returns the session state (which would typically be loaded asynchronously)
export const loadSession = async (): Promise<string | null> => {
    // In a real app, this would be: return await AsyncStorage.getItem('sessionKey');
    return sessionData.userEmail;
};

// Saves the session state (which would typically be saved asynchronously)
export const saveSession = async (email: string | null) => {
    // In a real app, this would be: await AsyncStorage.setItem('sessionKey', email || '');
    sessionData.userEmail = email;
};

// --- Utility Functions use the Map/Session holders ---

export const getCurrentUser = (): User | undefined => {
    return sessionData.userEmail ? userDBMap.get(sessionData.userEmail) : undefined;
};

export const loginUser = async (email: string) => {
    await saveSession(email);
};

export const logoutUser = async () => {
    await saveSession(null);
};

export const registerUser = (email: string, password: string) => {
    if (userDBMap.has(email)) return false;

    userDBMap.set(email, {
        email,
        password,
        hasReceivedBonus: false,
        balance: 0,
        transactions: [],
        gameHistory: [],
    });
    // NOTE: In a real app, we would also persist the whole userDBMap here.
    return true;
};

export const updateUserBalance = (newBalance: number) => {
    const user = getCurrentUser();
    if (user) {
        user.balance = newBalance;
    }
};

export const addTransaction = (type: 'deposit' | 'withdraw' | 'bet' | 'win' | 'bonus', amount: number, status: 'completed' | 'pending' | 'failed', game?: string) => {
    const user = getCurrentUser();
    if (user) {
        const newId = user.transactions.length + 1;
        user.transactions.unshift({
            id: newId,
            type,
            amount,
            status,
            game,
            timestamp: new Date(),
        });
    }
};

export const addGameHistory = (game: string, betAmount: number, winAmount: number, result: 'win' | 'loss') => {
    const user = getCurrentUser();
    if (user) {
        const newId = user.gameHistory.length + 1;
        user.gameHistory.unshift({
            id: newId,
            game,
            betAmount,
            winAmount,
            netAmount: winAmount - betAmount,
            result,
            timestamp: new Date(),
        });
    }
};

export const markBonusReceived = (email: string) => {
    const user = userDBMap.get(email);
    if (user && !user.hasReceivedBonus) {
        user.hasReceivedBonus = true;
        user.balance += BONUS_AMOUNT_BTC;
        userDBMap.set(email, user);
        addTransaction('bonus', BONUS_AMOUNT_BTC, 'completed', 'Welcome Bonus');
    }
};

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
        </Stack>
    );
}