import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
} from 'react-native';

interface Game {
    id: number;
    name: string;
    minBet: number;
    icon: string;
    maxWin: number;
}

interface GameModalProps {
    visible: boolean;
    game: Game | null;
    balance: number;
    isPlaying: boolean;
    onPlay: () => void;
    onClose: () => void;
}

export default function GameModal({
                                      visible,
                                      game,
                                      balance,
                                      isPlaying,
                                      onPlay,
                                      onClose,
                                  }: GameModalProps) {
    if (!game) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <Text style={styles.icon}>{game.icon}</Text>
                    <Text style={styles.title}>{game.name}</Text>

                    <View style={styles.stats}>
                        <View style={styles.stat}>
                            <Text style={styles.statLabel}>Min Bet</Text>
                            <Text style={styles.statValue}>₿ {game.minBet}</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statLabel}>Max Win</Text>
                            <Text style={styles.statValue}>{game.maxWin}x</Text>
                        </View>
                    </View>

                    <View style={styles.balanceContainer}>
                        <Text style={styles.balanceLabel}>Your Balance</Text>
                        <Text style={styles.balance}>₿ {balance.toFixed(6)}</Text>
                    </View>

                    {isPlaying && (
                        <View style={styles.playingContainer}>
                            <Text style={styles.playingText}>🎲 Playing...</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.playButton, isPlaying && styles.playButtonDisabled]}
                        onPress={onPlay}
                        disabled={isPlaying}
                    >
                        <Text style={styles.playButtonText}>
                            {isPlaying ? '⏳ Playing...' : '🎮 Play Now'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={onClose}
                        disabled={isPlaying}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <View style={styles.oddsInfo}>
                        <Text style={styles.oddsText}>
                            🎯 Win Chance: 45% | House Edge: 10%
                        </Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        padding: 30,
        width: '100%',
        maxWidth: 400,
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    icon: {
        fontSize: 60,
        textAlign: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        backgroundColor: '#252525',
        borderRadius: 12,
        padding: 15,
    },
    stat: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 5,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFD700',
    },
    balanceContainer: {
        backgroundColor: '#252525',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        marginBottom: 20,
    },
    balanceLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 5,
    },
    balance: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFD700',
    },
    playingContainer: {
        backgroundColor: '#252525',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        marginBottom: 15,
    },
    playingText: {
        fontSize: 16,
        color: '#FFD700',
        fontWeight: '600',
    },
    playButton: {
        backgroundColor: '#FFD700',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
    },
    playButtonDisabled: {
        opacity: 0.5,
    },
    playButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
    },
    cancelButton: {
        backgroundColor: '#333',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
    },
    oddsInfo: {
        backgroundColor: '#252525',
        borderRadius: 8,
        padding: 10,
    },
    oddsText: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
    },
});