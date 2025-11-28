import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    Alert,
    Clipboard,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getCurrentUser, updateUserBalance, addTransaction } from '.././utils/Database';

export default function WalletScreen() {
    const [balance, setBalance] = useState(0);
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawAddress, setWithdrawAddress] = useState('');
    const [walletAddress] = useState('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh');
    const [userEmail, setUserEmail] = useState<string>('');

    // Load user data when screen is focused
    useFocusEffect(
        React.useCallback(() => {
            const loadUserData = async () => {
                const user = await getCurrentUser();
                if (user) {
                    if (user.balance !== balance) {
                        setBalance(user.balance);
                    }
                    if (user.email !== userEmail) {
                        setUserEmail(user.email);
                    }
                }
            };
            loadUserData();
        }, [balance, userEmail])
    );

    const handleDeposit = async () => {
        if (!userEmail) {
            Alert.alert('Error', 'User not found. Please login again.');
            return;
        }

        const amount = parseFloat(depositAmount);
        if (isNaN(amount) || amount <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount');
            return;
        }

        if (amount < 0.001) {
            Alert.alert('Minimum Deposit', 'Minimum deposit is 0.001 BTC');
            return;
        }

        const newBalance = balance + amount;
        setBalance(newBalance);

        // Save to database
        await updateUserBalance(userEmail, newBalance);
        await addTransaction(userEmail, 'deposit', amount, 'completed');

        Alert.alert(
            '✅ Deposit Successful',
            `Deposited ₿${amount.toFixed(6)}\n\nYour new balance: ₿${newBalance.toFixed(6)}`
        );
        setDepositAmount('');
    };

    const handleWithdraw = async () => {
        if (!userEmail) {
            Alert.alert('Error', 'User not found. Please login again.');
            return;
        }

        const amount = parseFloat(withdrawAmount);
        const networkFee = 0.00001;
        const totalWithdrawAmount = amount + networkFee;

        if (isNaN(amount) || amount <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount');
            return;
        }

        if (amount < 0.001) {
            Alert.alert('Minimum Withdrawal', 'Minimum withdrawal is 0.001 BTC');
            return;
        }

        if (totalWithdrawAmount > balance) {
            Alert.alert(
                'Insufficient Balance',
                `Not enough Bitcoin to cover the withdrawal amount and network fee (Total: ₿${totalWithdrawAmount.toFixed(6)})`
            );
            return;
        }

        if (!withdrawAddress || withdrawAddress.length < 26) {
            Alert.alert('Invalid Address', 'Please enter a valid Bitcoin address');
            return;
        }

        const newBalance = balance - totalWithdrawAmount;
        setBalance(newBalance);

        // Save to database
        await updateUserBalance(userEmail, newBalance);
        await addTransaction(userEmail, 'withdraw', -totalWithdrawAmount, 'pending');

        Alert.alert(
            '✅ Withdrawal Initiated',
            `Withdrawing ₿${amount.toFixed(6)} (Fee: ₿${networkFee.toFixed(5)})\n\nTo: ${withdrawAddress.substring(0, 10)}...${withdrawAddress.substring(withdrawAddress.length - 8)}\n\nProcessing time: 1-2 hours`
        );
        setWithdrawAmount('');
        setWithdrawAddress('');
    };

    const copyAddress = () => {
        Clipboard.setString(walletAddress);
        Alert.alert('✅ Copied!', 'Wallet address copied to clipboard');
    };

    const setQuickAmount = (amount: string, isDeposit: boolean) => {
        if (isDeposit) {
            setDepositAmount(amount);
        } else {
            const maxWithdrawable = balance - 0.00001;

            if (amount === 'Max') {
                if (maxWithdrawable > 0.001) {
                    setWithdrawAmount(maxWithdrawable.toFixed(6));
                } else {
                    Alert.alert('Insufficient Balance', 'Not enough Bitcoin to cover the minimum withdrawal amount and network fee.');
                }
                return;
            }

            const quickAmount = parseFloat(amount);
            if (quickAmount > maxWithdrawable) {
                Alert.alert('Insufficient Balance', 'Not enough Bitcoin for this amount (consider the network fee)');
                return;
            }
            setWithdrawAmount(amount);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>₿ Bitcoin Wallet</Text>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {/* Balance Card */}
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Total Balance</Text>
                    <Text style={styles.balance}>₿ {balance.toFixed(6)}</Text>
                    <Text style={styles.usdValue}>≈ ${(balance * 45000).toFixed(2)} USD</Text>
                    <View style={styles.balanceActions}>
                        <TouchableOpacity style={styles.balanceAction}>
                            <Text style={styles.balanceActionText}>📊 Analytics</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.balanceAction}>
                            <Text style={styles.balanceActionText}>📜 Transactions</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Deposit Address */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>💰 Deposit Address</Text>
                    <Text style={styles.cardDescription}>
                        Send Bitcoin to this address to top up your balance
                    </Text>
                    <View style={styles.addressContainer}>
                        <Text style={styles.address} numberOfLines={1}>
                            {walletAddress}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.copyButton} onPress={copyAddress}>
                        <Text style={styles.copyButtonText}>📋 Copy Address</Text>
                    </TouchableOpacity>
                    <View style={styles.qrPlaceholder}>
                        <Text style={styles.qrText}>📱 QR Code</Text>
                        <Text style={styles.qrSubtext}>Scan to deposit</Text>
                    </View>
                </View>

                {/* Quick Deposit */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>⚡ Quick Deposit</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Amount in BTC (min: 0.001)"
                        placeholderTextColor="#666"
                        keyboardType="decimal-pad"
                        value={depositAmount}
                        onChangeText={setDepositAmount}
                    />
                    <View style={styles.quickActions}>
                        <TouchableOpacity
                            style={styles.quickActionButton}
                            onPress={() => setQuickAmount('0.01', true)}
                        >
                            <Text style={styles.quickActionText}>0.01 BTC</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.quickActionButton}
                            onPress={() => setQuickAmount('0.1', true)}
                        >
                            <Text style={styles.quickActionText}>0.1 BTC</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.quickActionButton}
                            onPress={() => setQuickAmount('1', true)}
                        >
                            <Text style={styles.quickActionText}>1 BTC</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleDeposit}
                    >
                        <Text style={styles.buttonText}>💰 Confirm Deposit</Text>
                    </TouchableOpacity>
                </View>

                {/* Withdraw Section */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>💸 Withdraw Bitcoin</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Withdrawal address"
                        placeholderTextColor="#666"
                        value={withdrawAddress}
                        onChangeText={setWithdrawAddress}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Amount in BTC (min: 0.001)"
                        placeholderTextColor="#666"
                        keyboardType="decimal-pad"
                        value={withdrawAmount}
                        onChangeText={setWithdrawAmount}
                    />
                    <View style={styles.quickActions}>
                        <TouchableOpacity
                            style={styles.quickActionButton}
                            onPress={() => setQuickAmount('0.01', false)}
                        >
                            <Text style={styles.quickActionText}>0.01</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.quickActionButton}
                            onPress={() => setQuickAmount('0.5', false)}
                        >
                            <Text style={styles.quickActionText}>0.5</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.quickActionButton}
                            onPress={() => setQuickAmount('Max', false)}
                        >
                            <Text style={styles.quickActionText}>Max</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.feeInfo}>
                        <Text style={styles.feeText}>Network Fee: ~0.00001 BTC</Text>
                        <Text style={styles.feeText}>Processing: 1-2 hours</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.button, styles.withdrawButton]}
                        onPress={handleWithdraw}
                    >
                        <Text style={styles.buttonText}>💸 Withdraw Now</Text>
                    </TouchableOpacity>
                </View>

                {/* Info */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>ℹ️ Important Information</Text>
                    <Text style={styles.infoText}>
                        • Minimum deposit: 0.001 BTC{'\n'}
                        • Minimum withdrawal: 0.001 BTC{'\n'}
                        • Deposits require 3 confirmations{'\n'}
                        • Withdrawals process in 1-2 hours{'\n'}
                        • Network fees apply for withdrawals{'\n'}
                        • Always verify addresses before sending
                    </Text>
                </View>
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
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    balanceCard: {
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    balanceLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 5,
    },
    balance: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 5,
    },
    usdValue: {
        fontSize: 16,
        color: '#aaa',
        marginBottom: 15,
    },
    balanceActions: {
        flexDirection: 'row',
        gap: 10,
    },
    balanceAction: {
        backgroundColor: '#252525',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
    },
    balanceActionText: {
        color: '#FFD700',
        fontSize: 12,
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#1a1a1a',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 13,
        color: '#888',
        marginBottom: 15,
    },
    addressContainer: {
        backgroundColor: '#252525',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
    },
    address: {
        fontSize: 13,
        color: '#FFD700',
        fontFamily: 'monospace',
    },
    copyButton: {
        backgroundColor: '#252525',
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#444',
        marginBottom: 15,
    },
    copyButtonText: {
        fontSize: 15,
        color: '#fff',
        fontWeight: '600',
    },
    qrPlaceholder: {
        backgroundColor: '#252525',
        borderRadius: 10,
        padding: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#444',
    },
    qrText: {
        fontSize: 24,
        marginBottom: 5,
    },
    qrSubtext: {
        fontSize: 12,
        color: '#888',
    },
    input: {
        backgroundColor: '#252525',
        borderRadius: 10,
        padding: 15,
        fontSize: 15,
        color: '#fff',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#444',
    },
    button: {
        backgroundColor: '#FFD700',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
    },
    withdrawButton: {
        backgroundColor: '#f97316',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        gap: 10,
    },
    quickActionButton: {
        flex: 1,
        backgroundColor: '#252525',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#444',
    },
    quickActionText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FFD700',
    },
    feeInfo: {
        backgroundColor: '#252525',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
    },
    feeText: {
        fontSize: 12,
        color: '#888',
        marginBottom: 3,
    },
    infoCard: {
        backgroundColor: '#1a1a1a',
        borderRadius: 15,
        padding: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 10,
    },
    infoText: {
        fontSize: 13,
        color: '#aaa',
        lineHeight: 20,
    },
});