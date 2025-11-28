import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getCurrentUser } from '.././utils/Database';
import type { User, Transaction } from '.././utils/Database';

export default function TransactionsScreen() {
    const [filter, setFilter] = useState<'all' | 'deposits' | 'withdrawals' | 'games'>('all');
    const [currentBalance, setCurrentBalance] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // Load user data when screen is focused
    useFocusEffect(
        React.useCallback(() => {
            const loadUserData = async () => {
                const user: User | null = await getCurrentUser();
                if (user) {
                    // Only update if the value has changed
                    if (user.balance !== currentBalance) {
                        setCurrentBalance(user.balance);
                    }
                    // Only update if the array length has changed (a proxy for new transactions)
                    if (user.transactions.length !== transactions.length) {
                        setTransactions([...user.transactions]);
                    }
                }
            };
            loadUserData();
        }, [currentBalance, transactions.length]) // Dependencies trigger callback only when necessary
    );

    const filteredTransactions = transactions.filter(t => {
        if (filter === 'all') return true;
        if (filter === 'deposits') return t.type === 'deposit' || t.type === 'bonus';
        if (filter === 'withdrawals') return t.type === 'withdraw';
        if (filter === 'games') return t.type === 'bet' || t.type === 'win';
        return true;
    });

    const getIcon = (type: string) => {
        switch (type) {
            case 'deposit': return '💰';
            case 'withdraw': return '💸';
            case 'bet': return '🎲';
            case 'win': return '🎉';
            case 'bonus': return '🎁';
            default: return '💵';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return '#4ade80';
            case 'pending': return '#f59e0b';
            case 'failed': return '#f87171';
            default: return '#888';
        }
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const transactionDate = new Date(date);
        const diff = now.getTime() - transactionDate.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Transactions</Text>
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Current Balance</Text>
                    <Text style={[styles.balance, { color: currentBalance >= 0 ? '#4ade80' : '#f87171' }]}>
                        ₿{currentBalance.toFixed(6)}
                    </Text>
                    <Text style={styles.usdValue}>≈ ${(currentBalance * 45000).toFixed(2)} USD</Text>
                </View>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
                    onPress={() => setFilter('all')}
                >
                    <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterTab, filter === 'deposits' && styles.filterTabActive]}
                    onPress={() => setFilter('deposits')}
                >
                    <Text style={[styles.filterText, filter === 'deposits' && styles.filterTextActive]}>Deposits</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterTab, filter === 'withdrawals' && styles.filterTabActive]}
                    onPress={() => setFilter('withdrawals')}
                >
                    <Text style={[styles.filterText, filter === 'withdrawals' && styles.filterTextActive]}>Withdraws</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterTab, filter === 'games' && styles.filterTabActive]}
                    onPress={() => setFilter('games')}
                >
                    <Text style={[styles.filterText, filter === 'games' && styles.filterTextActive]}>Games</Text>
                </TouchableOpacity>
            </View>

            {/* Transactions List */}
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {filteredTransactions.map((transaction) => (
                    <View key={transaction.id} style={styles.transactionCard}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>{getIcon(transaction.type)}</Text>
                        </View>

                        <View style={styles.transactionInfo}>
                            <Text style={styles.transactionType}>
                                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </Text>
                            <Text style={styles.gameName}>
                                {transaction.game ||
                                    (transaction.type === 'deposit' ? 'Wallet Deposit' :
                                        transaction.type === 'withdraw' ? 'Wallet Withdrawal' :
                                            transaction.type === 'bonus' ? 'Welcome Bonus' : 'N/A')}
                            </Text>
                            <View style={styles.statusRow}>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(transaction.status) + '20' }]}>
                                    <Text style={[styles.statusText, { color: getStatusColor(transaction.status) }]}>
                                        {transaction.status}
                                    </Text>
                                </View>
                                <Text style={styles.timestamp}>{formatTime(transaction.timestamp)}</Text>
                            </View>
                        </View>

                        <View style={styles.amountContainer}>
                            <Text style={[
                                styles.amount,
                                { color: transaction.amount >= 0 ? '#4ade80' : '#f87171' }
                            ]}>
                                {transaction.amount >= 0 ? '+' : ''}₿{Math.abs(transaction.amount).toFixed(6)}
                            </Text>
                        </View>
                    </View>
                ))}

                {filteredTransactions.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📭</Text>
                        <Text style={styles.emptyText}>No transactions yet</Text>
                        <Text style={styles.emptySubtext}>Your transaction history will appear here</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

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
        marginBottom: 15,
    },
    balanceCard: {
        backgroundColor: '#252525',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
    },
    balanceLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 5,
    },
    balance: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    usdValue: {
        fontSize: 12,
        color: '#aaa',
        marginTop: 3,
    },
    filterContainer: {
        flexDirection: 'row',
        padding: 15,
        gap: 10,
        backgroundColor: '#1a1a1a',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    filterTab: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#252525',
        alignItems: 'center',
    },
    filterTabActive: {
        backgroundColor: '#FFD700',
    },
    filterText: {
        fontSize: 13,
        color: '#888',
        fontWeight: '600',
    },
    filterTextActive: {
        color: '#000',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 15,
    },
    transactionCard: {
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
    transactionInfo: {
        flex: 1,
    },
    transactionType: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 3,
    },
    gameName: {
        fontSize: 13,
        color: '#888',
        marginBottom: 5,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    timestamp: {
        fontSize: 11,
        color: '#666',
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 18,
        fontWeight: 'bold',
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