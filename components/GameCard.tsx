import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface GameCardProps {
    icon: string;
    name: string;
    minBet: number;
    maxWin: number;
    onPress: () => void;
    disabled?: boolean;
}

export default function GameCard({
                                     icon,
                                     name,
                                     minBet,
                                     maxWin,
                                     onPress,
                                     disabled = false
                                 }: GameCardProps) {
    return (
        <TouchableOpacity
            style={[styles.card, disabled && styles.disabled]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <View style={styles.content}>
                <Text style={styles.icon}>{icon}</Text>
                <Text style={styles.name}>{name}</Text>
                <View style={styles.stats}>
                    <Text style={styles.minBet}>Min: ₿{minBet}</Text>
                    <Text style={styles.maxWin}>Max: {maxWin}x</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '48%',
        backgroundColor: '#1a1a1a',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#333',
    },
    disabled: {
        opacity: 0.5,
    },
    content: {
        alignItems: 'center',
    },
    icon: {
        fontSize: 40,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    stats: {
        width: '100%',
    },
    minBet: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
    },
    maxWin: {
        fontSize: 12,
        color: '#FFD700',
        textAlign: 'center',
        marginTop: 3,
    },
});