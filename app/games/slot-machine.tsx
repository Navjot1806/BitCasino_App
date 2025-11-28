import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Animated,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣', '🔔', '⭐'];

export default function SlotMachineGame() {
    const router = useRouter();
    const [balance, setBalance] = useState(100);
    const [bet, setBet] = useState(5);
    const [isSpinning, setIsSpinning] = useState(false);
    const [reels, setReels] = useState(['🍒', '🍒', '🍒']);
    const [lastWin, setLastWin] = useState(0);

    const spinAnimation1 = useRef(new Animated.Value(0)).current;
    const spinAnimation2 = useRef(new Animated.Value(0)).current;
    const spinAnimation3 = useRef(new Animated.Value(0)).current;

    const spinReel = (animValue: Animated.Value) => {
        return Animated.timing(animValue, {
            toValue: 1,
            duration: 1000 + Math.random() * 1000,
            useNativeDriver: true,
        });
    };

    const handleSpin = () => {
        if (isSpinning) return;

        if (balance < bet) {
            Alert.alert('Insufficient Balance', 'You don\'t have enough money to place this bet!');
            return;
        }

        setIsSpinning(true);
        setBalance(prev => prev - bet);
        setLastWin(0);

        // Reset animations
        spinAnimation1.setValue(0);
        spinAnimation2.setValue(0);
        spinAnimation3.setValue(0);

        // Start spinning animations
        Animated.parallel([
            spinReel(spinAnimation1),
            spinReel(spinAnimation2),
            spinReel(spinAnimation3),
        ]).start(() => {
            // Generate random results
            const newReels = [
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            ];

            setReels(newReels);

            // Check for win
            let winAmount = 0;

            // Three of a kind
            if (newReels[0] === newReels[1] && newReels[1] === newReels[2]) {
                if (newReels[0] === '💎') {
                    winAmount = bet * 50; // Diamond jackpot
                    Alert.alert('💎 JACKPOT! 💎', `You won $${winAmount}!`);
                } else if (newReels[0] === '7️⃣') {
                    winAmount = bet * 20; // Lucky 7
                    Alert.alert('🎰 Lucky 7! 🎰', `You won $${winAmount}!`);
                } else {
                    winAmount = bet * 10; // Regular match
                    Alert.alert('🎉 Winner! 🎉', `You won $${winAmount}!`);
                }
            }
            // Two of a kind
            else if (newReels[0] === newReels[1] || newReels[1] === newReels[2] || newReels[0] === newReels[2]) {
                winAmount = bet * 2;
                Alert.alert('Nice!', `You won $${winAmount}!`);
            }

            if (winAmount > 0) {
                setBalance(prev => prev + winAmount);
                setLastWin(winAmount);
            } else {
                Alert.alert('Try Again!', 'Better luck next time!');
            }

            setIsSpinning(false);
        });
    };

    const adjustBet = (amount: number) => {
        const newBet = bet + amount;
        if (newBet >= 1 && newBet <= balance && newBet <= 50) {
            setBet(newBet);
        }
    };

    const spin1 = spinAnimation1.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '1080deg'],
    });

    const spin2 = spinAnimation2.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '1440deg'],
    });

    const spin3 = spinAnimation3.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '1800deg'],
    });

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFD700" />
                </TouchableOpacity>
                <Text style={styles.title}>🎰 Slot Machine</Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.content}>
                {/* Balance Display */}
                <View style={styles.balanceContainer}>
                    <View style={styles.balanceCard}>
                        <Text style={styles.balanceLabel}>Balance</Text>
                        <Text style={styles.balance}>${balance.toFixed(2)}</Text>
                    </View>
                    {lastWin > 0 && (
                        <View style={styles.winCard}>
                            <Text style={styles.winLabel}>Last Win</Text>
                            <Text style={styles.winAmount}>+${lastWin.toFixed(2)}</Text>
                        </View>
                    )}
                </View>

                {/* Slot Machine */}
                <View style={styles.slotMachine}>
                    <View style={styles.reelsContainer}>
                        <Animated.View style={[styles.reel, { transform: [{ rotate: spin1 }] }]}>
                            <Text style={styles.symbol}>{reels[0]}</Text>
                        </Animated.View>
                        <Animated.View style={[styles.reel, { transform: [{ rotate: spin2 }] }]}>
                            <Text style={styles.symbol}>{reels[1]}</Text>
                        </Animated.View>
                        <Animated.View style={[styles.reel, { transform: [{ rotate: spin3 }] }]}>
                            <Text style={styles.symbol}>{reels[2]}</Text>
                        </Animated.View>
                    </View>
                </View>

                {/* Bet Controls */}
                <View style={styles.betContainer}>
                    <Text style={styles.betLabel}>Bet Amount</Text>
                    <View style={styles.betControls}>
                        <TouchableOpacity
                            style={styles.betButton}
                            onPress={() => adjustBet(-5)}
                            disabled={isSpinning}
                        >
                            <Text style={styles.betButtonText}>-$5</Text>
                        </TouchableOpacity>

                        <View style={styles.betDisplay}>
                            <Text style={styles.betAmount}>${bet}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.betButton}
                            onPress={() => adjustBet(5)}
                            disabled={isSpinning}
                        >
                            <Text style={styles.betButtonText}>+$5</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.quickBets}>
                        <TouchableOpacity
                            style={styles.quickBet}
                            onPress={() => setBet(1)}
                            disabled={isSpinning}
                        >
                            <Text style={styles.quickBetText}>Min</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.quickBet}
                            onPress={() => setBet(10)}
                            disabled={isSpinning}
                        >
                            <Text style={styles.quickBetText}>$10</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.quickBet}
                            onPress={() => setBet(25)}
                            disabled={isSpinning}
                        >
                            <Text style={styles.quickBetText}>$25</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.quickBet}
                            onPress={() => setBet(Math.min(50, balance))}
                            disabled={isSpinning}
                        >
                            <Text style={styles.quickBetText}>Max</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Spin Button */}
                <TouchableOpacity
                    style={[styles.spinButton, isSpinning && styles.spinButtonDisabled]}
                    onPress={handleSpin}
                    disabled={isSpinning}
                >
                    <Text style={styles.spinButtonText}>
                        {isSpinning ? '🎰 SPINNING...' : '🎰 SPIN'}
                    </Text>
                </TouchableOpacity>

                {/* Pay table */}
                <View style={styles.payTable}>
                    <Text style={styles.payTableTitle}>💰 Paytable</Text>
                    <View style={styles.payTableRow}>
                        <Text style={styles.payTableSymbol}>💎 💎 💎</Text>
                        <Text style={styles.payTablePayout}>50x</Text>
                    </View>
                    <View style={styles.payTableRow}>
                        <Text style={styles.payTableSymbol}>7️⃣ 7️⃣ 7️⃣</Text>
                        <Text style={styles.payTablePayout}>20x</Text>
                    </View>
                    <View style={styles.payTableRow}>
                        <Text style={styles.payTableSymbol}>🔔 🔔 🔔 (Any Match)</Text>
                        <Text style={styles.payTablePayout}>10x</Text>
                    </View>
                    <View style={styles.payTableRow}>
                        <Text style={styles.payTableSymbol}>🍒 🍒 (Two Match)</Text>
                        <Text style={styles.payTablePayout}>2x</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 10,
        backgroundColor: '#1a1a1a',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#252525',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD700',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    balanceContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 30,
    },
    balanceCard: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        borderRadius: 15,
        padding: 15,
        borderWidth: 2,
        borderColor: '#FFD700',
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
        color: '#FFD700',
    },
    winCard: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        borderRadius: 15,
        padding: 15,
        borderWidth: 2,
        borderColor: '#4ade80',
        alignItems: 'center',
    },
    winLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 5,
    },
    winAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4ade80',
    },
    slotMachine: {
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        padding: 30,
        marginBottom: 30,
        borderWidth: 3,
        borderColor: '#FFD700',
    },
    reelsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    reel: {
        width: 80,
        height: 80,
        backgroundColor: '#252525',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#444',
    },
    symbol: {
        fontSize: 48,
    },
    betContainer: {
        marginBottom: 20,
    },
    betLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    betControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        gap: 20,
    },
    betButton: {
        backgroundColor: '#252525',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#444',
    },
    betButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFD700',
    },
    betDisplay: {
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    betAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD700',
    },
    quickBets: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    quickBet: {
        backgroundColor: '#252525',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
    quickBetText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#888',
    },
    spinButton: {
        backgroundColor: '#FFD700',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8,
    },
    spinButtonDisabled: {
        opacity: 0.5,
    },
    spinButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    payTable: {
        backgroundColor: '#1a1a1a',
        borderRadius: 15,
        padding: 15,
        borderWidth: 1,
        borderColor: '#333',
    },
    payTableTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 10,
        textAlign: 'center',
    },
    payTableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#252525',
    },
    payTableSymbol: {
        fontSize: 14,
        color: '#fff',
    },
    payTablePayout: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4ade80',
    },
});