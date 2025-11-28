import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import StatCard from '@/components/StatCard';
import TransactionItem from '@/components/TransactionItem';
import { getCurrentUser } from '.././utils/Database';
import type { User, GameHistory } from '.././utils/Database';

function HistoryScreen() {
    const [history, setHistory] = useState<GameHistory[]>([]);

    // Load user data when screen is focused
    useFocusEffect(
        React.useCallback(() => {
            const loadUserData = async () => {
                const user: User | null = await getCurrentUser();
                if (user) {
                    // Only update if the array length has changed
                    if (user.gameHistory.length !== history.length) {
                        setHistory([...user.gameHistory]);
                    }
                }
            };
            loadUserData();
        }, [history.length])
    );

    // Calculate dynamic stats based on the user's history
    const totalWins = history.filter(h => h.result === 'win').length;
    const totalLosses = history.filter(h => h.result === 'loss').length;

    // Total profit is the sum of netAmount (winAmount - betAmount)
    const totalProfit = history.reduce((sum, h) => {
        return sum + h.netAmount;
    }, 0);

    const winRate = history.length > 0 ? ((totalWins / history.length) * 100).toFixed(1) : '0.0';

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>📊 Game History</Text>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <StatCard
                        label="Wins"
                        value={totalWins}
                        icon="🎉"
                        type="success"
                    />
                    <StatCard
                        label="Losses"
                        value={totalLosses}
                        icon="😢"
                        type="danger"
                    />
                    <StatCard
                        label={totalProfit >= 0 ? 'Net Profit' : 'Net Loss'}
                        value={`${totalProfit >= 0 ? '+' : ''}₿${Math.abs(totalProfit).toFixed(6)}`}
                        icon={totalProfit >= 0 ? '💰' : '💸'}
                        type={totalProfit >= 0 ? 'success' : 'danger'}
                    />
                </View>

                {/* Win Rate */}
                <View style={styles.winRateCard}>
                    <Text style={styles.winRateLabel}>Win Rate</Text>
                    <View style={styles.winRateBar}>
                        <View
                            style={[
                                styles.winRateFill,
                            ]}
                        />
                    </View>
                    <Text style={styles.winRateText}>
                        {winRate}% ({totalWins}/{history.length} games)
                    </Text>
                </View>

                {/* History List */}
                <Text style={styles.sectionTitle}>Recent Games</Text>
                {history.length > 0 ? (
                    history.map((item) => (
                        <TransactionItem
                            key={item.id}
                            type={item.result}
                            amount={item.netAmount}
                            timestamp={item.timestamp}
                            description={`${item.game} (Bet: ₿${item.betAmount.toFixed(6)})`}
                        />
                    ))
                ) : (
                    /* Empty State */
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>🎮</Text>
                        <Text style={styles.emptyText}>No game history yet</Text>
                        <Text style={styles.emptySubtext}>
                            Play some games to see your history here!
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

export default HistoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    header: {
        padding: 20,
        paddingTop: 40,
        backgroundColor: '#1a1a1a',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFD700',
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    winRateCard: {
        backgroundColor: '#1a1a1a',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    winRateLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    winRateBar: {
        height: 8,
        backgroundColor: '#252525',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    winRateFill: {
        height: '100%',
        backgroundColor: '#4ade80',
    },
    winRateText: {
        fontSize: 14,
        color: '#aaa',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#666',
    },
});