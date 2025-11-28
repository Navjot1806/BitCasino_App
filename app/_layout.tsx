import { Stack, useRouter, useSegments, Redirect } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { isLoggedIn, initializeDemoUser } from './utils/Database';

export default function RootLayout() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // 1. Initialize demo user (this will create a user if the database is empty)
            await initializeDemoUser();

            // 2. Check if user is logged in (this must complete without hanging)
            const loggedIn = await isLoggedIn();

            setIsAuthenticated(loggedIn);

        } catch (error) {
            // If the database setup or check fails (e.g., AsyncStorage issue), handle the error.
            console.error('Error during database or auth check:', error);
            setIsAuthenticated(false); // Assume logged out on failure
        } finally {
            // FIX: This block always runs, ensuring the loading screen disappears.
            // Navigation happens immediately after checking the auth status.
            setIsLoading(false);
        }
    };

    if (isLoading || isAuthenticated === null) {
        // Shows the loading screen while the initial check is ongoing
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.logo}>🎰</Text>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={styles.loadingText}>Loading Casino...</Text>
            </View>
        );
    }

    if (isAuthenticated === true) {
        // If logged in, redirect to the main app tabs
        return <Redirect href="/(tabs)" />;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0a0a0a',
    },
    logo: {
        fontSize: 80,
        marginBottom: 20,
    },
    loadingText: {
        color: '#FFD700',
        marginTop: 15,
        fontSize: 16,
    },
});