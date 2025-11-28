import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BalanceCardProps {
    balance: number;
    showUSD?: boolean;
    lastWin?: number | null;
    btcToUsd?: number;
}
const USD_RATE = 45000;
export default function BalanceCard({
                                        balance,
                                        showUSD = true,
                                        lastWin = null,
                                        btcToUsd = 45000
                                    }: BalanceCardProps) {
    return (
        <View style={styles.card}>
            <View>
                <Text style={styles.label}>Your Balance</Text>
                <Text style={styles.balance}>₿ {balance.toFixed(6)}</Text>
                {/* FIX: Ensure the conditional text is properly contained */}
                {showUSD && (
                    <Text style={styles.usdValue}>
                        ≈ ${(balance * USD_RATE).toFixed(2)} USD
                    </Text>
                )}
            </View>

            {/* Display last win amount if it exists and is greater than 0 */}
            {lastWin !== null && lastWin > 0 && (
                <View style={styles.winContainer}>
                    <Text style={styles.winLabel}>Last Win</Text>
                    <Text style={styles.winAmount}>+{lastWin.toFixed(6)} ₿</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#252525',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    label: {
        fontSize: 12,
        color: '#888',
        marginBottom: 5,
    },
    balance: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD700',
    },
    usdValue: {
        fontSize: 14,
        color: '#aaa',
        marginTop: 5,
    },
    lastWin: {
        fontSize: 12,
        color: '#4ade80',
        marginTop: 10,
        fontWeight: '600',
    },
    winContainer: {
        alignItems: 'flex-end',
        backgroundColor: '#252525',
        borderRadius: 10,
        padding: 10,
    },
    winLabel: {
        fontSize: 12,
        color: '#4ade80',
        marginBottom: 2,
    },
    winAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4ade80',
    },
});