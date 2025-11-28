import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    Alert,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import GameCard from '@/components/GameCard';
import BalanceCard from '@/components/BalanceCard';
import InfoCard from '@/components/InfoCard';
import GameModal from '@/components/GameModel';
import { getCurrentUser, updateUserBalance, addTransaction, addGameHistory } from '.././utils/Database';

export default function CasinoScreen() {
    const [balance, setBalance] = useState(0);
    const [lastWin, setLastWin] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedGame, setSelectedGame] = useState<any>(null);
    const [showGameModal, setShowGameModal] = useState(false);
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

    const games = [
        { id: 1, name: 'Slot Machine', minBet: 0.001, icon: '🎰', maxWin: 5 },
        { id: 2, name: 'Dice Roll', minBet: 0.001, icon: '🎲', maxWin: 3 },
        { id: 3, name: 'Blackjack', minBet: 0.005, icon: '🃏', maxWin: 2.5 },
        { id: 4, name: 'Roulette', minBet: 0.002, icon: '🎯', maxWin: 35 },
        { id: 5, name: 'Wheel of Fortune', minBet: 0.003, icon: '🎪', maxWin: 10 },
        { id: 6, name: 'Crash', minBet: 0.001, icon: '💎', maxWin: 100 },
    ];

    const openGameModal = (game: any) => {
        setSelectedGame(game);
        setShowGameModal(true);
    };

    const playGame = async () => {
        if (!selectedGame || !userEmail) return;

        const betAmount = selectedGame.minBet;

        if (balance < betAmount) {
            Alert.alert('Insufficient Balance', 'Not enough Bitcoin to play this game');
            return;
        }

        setIsPlaying(true);
        setLastWin(null);

        // Deduct bet from balance
        const newBalanceAfterBet = balance - betAmount;
        setBalance(newBalanceAfterBet);

        // Save bet transaction and update balance
        await updateUserBalance(userEmail, newBalanceAfterBet);
        await addTransaction(userEmail, 'bet', -betAmount, 'completed', selectedGame.name);

        // Simulate game play
        setTimeout(async () => {
            const random = Math.random();
            let winResult = 0;

            if (random > 0.55) {
                // WIN
                const multiplier = 1 + Math.random() * (selectedGame.maxWin - 1);
                winResult = betAmount * multiplier;
                const finalBalance = newBalanceAfterBet + winResult;

                // Update state and database
                setBalance(finalBalance);
                setLastWin(winResult);

                await updateUserBalance(userEmail, finalBalance);
                await addTransaction(userEmail, 'win', winResult, 'completed', selectedGame.name);
                await addGameHistory(userEmail, selectedGame.name, betAmount, winResult, 'win');

                Alert.alert(
                    '🎉 You Won!',
                    `+₿${winResult.toFixed(6)}\n${multiplier.toFixed(2)}x multiplier\n\nNew Balance: ₿${finalBalance.toFixed(6)}`
                );
            } else {
                // LOSS
                setLastWin(0);

                await addGameHistory(userEmail, selectedGame.name, betAmount, 0, 'loss');

                Alert.alert(
                    '😢 You Lost',
                    `-₿${betAmount.toFixed(6)}\n\nNew Balance: ₿${newBalanceAfterBet.toFixed(6)}`
                );
            }

            setIsPlaying(false);
            setShowGameModal(false);
        }, 2000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>🎰 Bitcoin Casino</Text>
                <BalanceCard balance={balance} lastWin={lastWin} />
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>🎮 Select a Game</Text>

                <View style={styles.gamesGrid}>
                    {games.map((game) => (
                        <GameCard
                            key={game.id}
                            icon={game.icon}
                            name={game.name}
                            minBet={game.minBet}
                            maxWin={game.maxWin}
                            onPress={() => openGameModal(game)}
                            disabled={isPlaying}
                        />
                    ))}
                </View>

                <InfoCard
                    title="Welcome Bonus"
                    content="Get 100% match on your first deposit!"
                    icon="🎁"
                    type="success"
                />

                <InfoCard
                    title="How to Play"
                    content="• Select any game above
• Each game has a minimum bet
• 45% chance to win
• Instant payouts
• Provably fair gaming
• Play responsibly!"
                    icon="🎮"
                />
            </ScrollView>

            <GameModal
                visible={showGameModal}
                game={selectedGame}
                balance={balance}
                isPlaying={isPlaying}
                onPlay={playGame}
                onClose={() => setShowGameModal(false)}
            />
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
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
    },
    gamesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
});