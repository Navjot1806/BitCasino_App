import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TransactionItemProps {
    type: 'deposit' | 'withdraw' | 'win' | 'loss';
    amount: number;
    timestamp: Date;
    description?: string;
}

export default function TransactionItem({
                                            type,
                                            amount,
                                            timestamp,
                                            description
                                        }: TransactionItemProps) {
    const getIcon = () => {
        switch (type) {
            case 'deposit': return '💰';
            case 'withdraw': return '💸';
            case 'win': return '🎉';
            case 'loss': return '😢';
            default: return '💵';
        }
    };

    const getColor = () => {
        switch (type) {
            case 'deposit':
            case 'win':
                return '#4ade80';
            case 'withdraw':
            case 'loss':
                return '#f87171';
            default:
                return '#888';
        }
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Text style={styles.icon}>{getIcon()}</Text>
            </View>

            <View style={styles.info}>
                <Text style={styles.type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
                {description && (
                    <Text style={styles.description}>{description}</Text>
                )}
                <Text style={styles.timestamp}>{formatTime(timestamp)}</Text>
            </View>

            <View style={styles.amountContainer}>
                <Text style={[styles.amount, { color: getColor() }]}>
                    {amount >= 0 ? '+' : ''}₿{Math.abs(amount).toFixed(6)}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#1a1a1a',
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#252525',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    icon: {
        fontSize: 24,
    },
    info: {
        flex: 1,
    },
    type: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        color: '#888',
        marginBottom: 2,
    },
    timestamp: {
        fontSize: 12,
        color: '#666',
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});