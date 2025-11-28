/**
 * Database Utility using AsyncStorage
 * Persists user data, sessions, and app state
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage Keys
const STORAGE_KEYS = {
    USERS: '@casino_users',
    SESSION: '@casino_session',
    CURRENT_USER: '@casino_current_user',
};

export interface User {
    email: string;
    password: string;
    name: string;
    hasReceivedBonus: boolean;
    balance: number;
    transactions: Transaction[];
    gameHistory: GameHistory[];
    createdAt: Date;
}

export interface Transaction {
    id: number;
    type: 'deposit' | 'withdraw' | 'bet' | 'win' | 'bonus';
    amount: number;
    game?: string;
    status: 'completed' | 'pending' | 'failed';
    timestamp: Date;
}

export interface GameHistory {
    id: number;
    game: string;
    betAmount: number;
    winAmount: number;
    netAmount: number;
    result: 'win' | 'loss';
    timestamp: Date;
}

export interface Session {
    userEmail: string | null;
    loginTime: Date | null;
}

// ==================== USER OPERATIONS ====================

/**
 * Get all users from storage
 */
export const getAllUsers = async (): Promise<Map<string, User>> => {
    try {
        const usersJSON = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
        if (!usersJSON) {
            return new Map();
        }

        const usersArray = JSON.parse(usersJSON);
        const usersMap = new Map<string, User>();

        usersArray.forEach((user: User) => {
            // Convert date strings back to Date objects
            user.createdAt = new Date(user.createdAt);
            user.transactions = user.transactions.map(t => ({
                ...t,
                timestamp: new Date(t.timestamp),
            }));
            user.gameHistory = user.gameHistory.map(g => ({
                ...g,
                timestamp: new Date(g.timestamp),
            }));
            usersMap.set(user.email, user);
        });

        return usersMap;
    } catch (error) {
        console.error('Error getting users:', error);
        return new Map();
    }
};

/**
 * Save all users to storage
 */
export const saveAllUsers = async (usersMap: Map<string, User>): Promise<void> => {
    try {
        const usersArray = Array.from(usersMap.values());
        await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersArray));
    } catch (error) {
        console.error('Error saving users:', error);
    }
};

/**
 * Get a single user by email
 */
export const getUser = async (email: string): Promise<User | null> => {
    try {
        const users = await getAllUsers();
        return users.get(email) || null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
};

/**
 * Save or update a user
 */
export const saveUser = async (user: User): Promise<void> => {
    try {
        const users = await getAllUsers();
        users.set(user.email, user);
        await saveAllUsers(users);
    } catch (error) {
        console.error('Error saving user:', error);
    }
};

/**
 * Register a new user
 */
export const registerUser = async (
    email: string,
    password: string,
    name: string
): Promise<boolean> => {
    try {
        const users = await getAllUsers();

        // Check if user already exists
        if (users.has(email)) {
            return false;
        }

        // Create new user with $100 bonus (0.002222 BTC)
        const newUser: User = {
            email,
            password,
            name,
            hasReceivedBonus: true,
            balance: 0.002222, // $100 bonus
            transactions: [
                {
                    id: 1,
                    type: 'bonus',
                    amount: 0.002222,
                    status: 'completed',
                    game: 'Welcome Bonus',
                    timestamp: new Date(),
                },
            ],
            gameHistory: [],
            createdAt: new Date(),
        };

        users.set(email, newUser);
        await saveAllUsers(users);
        return true;
    } catch (error) {
        console.error('Error registering user:', error);
        return false;
    }
};

/**
 * Update user balance
 */
export const updateUserBalance = async (
    email: string,
    newBalance: number
): Promise<void> => {
    try {
        const user = await getUser(email);
        if (user) {
            user.balance = newBalance;
            await saveUser(user);
        }
    } catch (error) {
        console.error('Error updating balance:', error);
    }
};

/**
 * Add a transaction to user's history
 */
export const addTransaction = async (
    email: string,
    type: Transaction['type'],
    amount: number,
    status: Transaction['status'],
    game?: string
): Promise<void> => {
    try {
        const user = await getUser(email);
        if (user) {
            const newTransaction: Transaction = {
                id: user.transactions.length + 1,
                type,
                amount,
                status,
                game,
                timestamp: new Date(),
            };

            user.transactions.unshift(newTransaction);
            await saveUser(user);
        }
    } catch (error) {
        console.error('Error adding transaction:', error);
    }
};

/**
 * Add a game history entry
 */
export const addGameHistory = async (
    email: string,
    game: string,
    betAmount: number,
    winAmount: number,
    result: 'win' | 'loss'
): Promise<void> => {
    try {
        const user = await getUser(email);
        if (user) {
            const newHistory: GameHistory = {
                id: user.gameHistory.length + 1,
                game,
                betAmount,
                winAmount,
                netAmount: winAmount - betAmount,
                result,
                timestamp: new Date(),
            };

            user.gameHistory.unshift(newHistory);
            await saveUser(user);
        }
    } catch (error) {
        console.error('Error adding game history:', error);
    }
};

// ==================== SESSION OPERATIONS ====================

/**
 * Get current session
 */
export const getSession = async (): Promise<Session | null> => {
    try {
        const sessionJSON = await AsyncStorage.getItem(STORAGE_KEYS.SESSION);
        if (!sessionJSON) {
            return null;
        }

        const session = JSON.parse(sessionJSON);
        if (session.loginTime) {
            session.loginTime = new Date(session.loginTime);
        }
        return session;
    } catch (error) {
        console.error('Error getting session:', error);
        return null;
    }
};

/**
 * Save session (login)
 */
export const saveSession = async (email: string): Promise<void> => {
    try {
        const session: Session = {
            userEmail: email,
            loginTime: new Date(),
        };
        await AsyncStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    } catch (error) {
        console.error('Error saving session:', error);
    }
};

/**
 * Clear session (logout)
 */
export const clearSession = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch (error) {
        console.error('Error clearing session:', error);
    }
};

/**
 * Check if user is logged in
 */
export const isLoggedIn = async (): Promise<boolean> => {
    try {
        const session = await getSession();
        return session !== null && session.userEmail !== null;
    } catch (error) {
        console.error('Error checking login status:', error);
        return false;
    }
};

/**
 * Get current logged in user
 */
export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const session = await getSession();
        if (!session || !session.userEmail) {
            return null;
        }

        return await getUser(session.userEmail);
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Clear all data (for testing/development)
 */
export const clearAllData = async (): Promise<void> => {
    try {
        await AsyncStorage.multiRemove([
            STORAGE_KEYS.USERS,
            STORAGE_KEYS.SESSION,
            STORAGE_KEYS.CURRENT_USER,
        ]);
        console.log('All data cleared');
    } catch (error) {
        console.error('Error clearing data:', error);
    }
};

/**
 * Initialize demo user (for testing)
 */
export const initializeDemoUser = async (): Promise<void> => {
    try {
        const users = await getAllUsers();

        // Only create demo user if no users exist
        if (users.size === 0) {
            await registerUser('demo@casino.com', 'password123', 'Demo User');
            console.log('Demo user created: demo@casino.com / password123');
        }
    } catch (error) {
        console.error('Error initializing demo user:', error);
    }
};