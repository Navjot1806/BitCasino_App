import { Stack, Redirect } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { clearSession } from './utils/Database';

export default function RootLayout() {
    // isLoading tracks initial data load (AsyncStorage + Demo User setup)
    useEffect(() => {
        clearSession();
    }, []);

    // If not authenticated (isAuthenticated === false), render the auth stack
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