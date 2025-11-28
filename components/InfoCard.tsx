import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface InfoCardProps {
    title: string;
    content: string;
    icon?: string;
    type?: 'default' | 'warning' | 'success' | 'info';
}

export default function InfoCard({
                                     title,
                                     content,
                                     icon = 'ℹ️',
                                     type = 'default'
                                 }: InfoCardProps) {
    const getBorderColor = () => {
        switch (type) {
            case 'warning': return '#f59e0b';
            case 'success': return '#4ade80';
            case 'info': return '#3b82f6';
            default: return '#333';
        }
    };

    const getTitleColor = () => {
        switch (type) {
            case 'warning': return '#f59e0b';
            case 'success': return '#4ade80';
            case 'info': return '#3b82f6';
            default: return '#FFD700';
        }
    };

    return (
        <View style={[styles.card, { borderColor: getBorderColor() }]}>
            <Text style={[styles.title, { color: getTitleColor() }]}>
                {icon} {title}
            </Text>
            <Text style={styles.content}>{content}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1a1a1a',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    content: {
        fontSize: 14,
        color: '#aaa',
        lineHeight: 22,
    },
});