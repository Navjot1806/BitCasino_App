/**
 * Database Utility using a MOCK in-memory store (Map) to simulate persistence.
 * CRITICAL FIX: AsyncStorage usage has been completely removed to resolve
 * startup crashes/flashing (fatal errors) often seen in Expo Go environments
 * during complex async loading operations at launch.
 */

// import AsyncStorage from '@react-native-async-storage/async-storage'; // REMOVED

// --- MOCK IN-MEMORY STORAGE ---
// STORAGE_KEYS are kept for documentation but are no longer used with AsyncStorage.

// In-memory Map to simulate the database state
let userDBMap: Map<string, User> = new Map();
let sessionData: { userEmail: string | null; } = { userEmail: null };

// Constants for initial setup
const INITIAL_BONUS_AMOUNT = 0.002222; // $100 bonus

// --- INITIALIZATION (Critical Fix: Now Synchronous) ---

/**
 * Initializes the in-memory database on app start.
 * If the map is empty, it creates and auto-logs a demo user.
 * This function is now SYNCHRONOUS for maximum stability on launch.
 */
export const initializeData = (): void => {
    // Check if initialization has already run (map should be empty on first run)
    if (userDBMap.size === 0) {
        // --- 1. Initialize Demo User ---
        // We use a simplified synchronous register function for the initial setup
        const success = registerDemoUser('demo@casino.com', 'password123', 'Demo User');

        if (success) {
            sessionData.userEmail = 'demo@casino.com'; // Auto-login demo user
            console.log('Demo user created and logged in: demo@casino.com / password123');
        }
    }
    // No try/catch needed for synchronous map operations
};

/**
 * Register a new user (Synchronous helper for initial setup)
 */
const registerDemoUser = (
    email: string,
    password: string,
    name: string
): boolean => {
    if (userDBMap.has(email)) {
        return false;
    }

    const newUser: User = {
        email,
        password,
        name,
        hasReceivedBonus: true,
        balance: INITIAL_BONUS_AMOUNT,
        transactions: [
            {
                id: 1,
                type: 'bonus',
                amount: INITIAL_BONUS_AMOUNT,
                status: 'completed',
                game: 'Welcome Bonus',
                timestamp: new Date(),
            },
        ],
        gameHistory: [],
        createdAt: new Date(),
    };

    userDBMap.set(email, newUser);
    return true;
};

/**
 * Saves all current in-memory state.
 * NOTE: This no longer saves to AsyncStorage and is NOT asynchronous.
 */
const saveAllData = (): void => {
    // In a real application, this is where a synchronous database write would occur.
    // For this mock, we just ensure the map is updated.
    console.log('DATA PERSISTENCE MOCK: State updated in memory.');
};

// ==================== TYPE DEFINITIONS (Unchanged) ====================

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

// ==================== USER OPERATIONS (Updates to use synchronous save) ====================

/**
 * Get all users (from in-memory map)
 */
export const getAllUsers = (): Map<string, User> => {
    return userDBMap;
};

/**
 * Get a single user by email (from in-memory map)
 */
export const getUser = (email: string): User | null => {
    return userDBMap.get(email) || null;
};

/**
 * Save or update a user (and persist state) - NOW SYNCHRONOUS
 */
export const saveUser = (user: User): void => {
    userDBMap.set(user.email, user);
    saveAllData(); // Synchronous mock save
};

/**
 * Register a new user (and persist state) - NOW SYNCHRONOUS
 */
export const registerUser = (
    email: string,
    password: string,
    name: string
): boolean => {
    // Check if user already exists
    if (userDBMap.has(email)) {
        return false;
    }

    // Create new user with bonus
    const newUser: User = {
        email,
        password,
        name,
        hasReceivedBonus: true,
        balance: INITIAL_BONUS_AMOUNT,
        transactions: [
            {
                id: 1,
                type: 'bonus',
                amount: INITIAL_BONUS_AMOUNT,
                status: 'completed',
                game: 'Welcome Bonus',
                timestamp: new Date(),
            },
        ],
        gameHistory: [],
        createdAt: new Date(),
    };

    userDBMap.set(email, newUser);
    saveAllData(); // Save changes
    return true;
};

/**
 * Update user balance (and persist state) - NOW SYNCHRONOUS
 */
export const updateUserBalance = (
    email: string,
    newBalance: number
): void => {
    const user = getUser(email);
    if (user) {
        user.balance = newBalance;
        saveUser(user);
    }
};

/**
 * Add a transaction to user's history (and persist state) - NOW SYNCHRONOUS
 */
export const addTransaction = (
    email: string,
    type: Transaction['type'],
    amount: number,
    status: Transaction['status'],
    game?: string
): void => {
    const user = getUser(email);
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
        saveUser(user);
    }
};

/**
 * Add a game history entry (and persist state) - NOW SYNCHRONOUS
 */
export const addGameHistory = (
    email: string,
    game: string,
    betAmount: number,
    winAmount: number,
    result: 'win' | 'loss'
): void => {
    const user = getUser(email);
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
        saveUser(user);
    }
};

// ==================== SESSION OPERATIONS (Using in-memory Session Data) ====================

/**
 * Save session (login) and persist state - NOW SYNCHRONOUS
 */
export const saveSession = (email: string): void => {
    sessionData.userEmail = email;
    saveAllData();
};

/**
 * Clear session (logout) and persist state - NOW SYNCHRONOUS
 */
export const clearSession = (): void => {
    sessionData.userEmail = null;
    saveAllData();
};

/**
 * Check if user is logged in (synchronously checks in-memory session)
 */
export const isLoggedIn = (): boolean => {
    return sessionData.userEmail !== null;
};

/**
 * Get current logged in user (synchronously pulls from in-memory map)
 */
export const getCurrentUser = (): User | null => {
    if (!sessionData.userEmail) {
        return null;
    }
    // Pull from the in-memory map
    return getUser(sessionData.userEmail);
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Clear all data (for testing/development) - REMOVES ASYNCSTORAGE dependency
 */
export const clearAllData = (): void => {
    // Removed AsyncStorage.multiRemove to prevent crashes
    userDBMap = new Map();
    sessionData.userEmail = null;
    console.log('All data cleared (in memory)');
};