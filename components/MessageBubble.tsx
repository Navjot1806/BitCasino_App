import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MessageBubbleProps {
    text: string;
    isUser: boolean;
    timestamp: Date;
}

export default function MessageBubble({
                                          text,
                                          isUser,
                                          timestamp
                                      }: MessageBubbleProps) {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <View
            style={[
                styles.bubble,
                isUser ? styles.userBubble : styles.aiBubble,
            ]}
        >
            <Text style={[
                styles.text,
                isUser ? styles.userText : styles.aiText
            ]}>
                {text}
            </Text>
            <Text style={styles.timestamp}>
                {formatTime(timestamp)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    bubble: {
        maxWidth: '80%',
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#FFD700',
    },
    aiBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#1a1a1a',
        borderWidth: 1,
        borderColor: '#333',
    },
    text: {
        fontSize: 15,
        lineHeight: 22,
    },
    userText: {
        color: '#000',
    },
    aiText: {
        color: '#fff',
    },
    timestamp: {
        fontSize: 10,
        color: '#888',
        marginTop: 5,
        textAlign: 'right',
    },
});