import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatCardProps {
    label: string;
    value: string | number;
    icon?: string;
    type?: 'default' | 'success' | 'danger' | 'warning';
}

export default function StatCard({
                                     label,
                                     value,
                                     icon,
                                     type = 'default'
                                 }: StatCardProps) {
    const getBorderColor = () => {
        switch (type) {
            case 'success': return '#4ade80';
            case 'danger': return '#f87171';
            case 'warning': return '#f59e0b';
            default: return '#333';
        }
    };

    return (
        <View style={[styles.card, { borderColor: getBorderColor() }]}>
            {icon && <Text style={styles.icon}>{icon}</Text>}
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        borderRadius: 15,
        padding: 15,
        marginHorizontal: 5,
        alignItems: 'center',
        borderWidth: 1,
    },
    icon: {
        fontSize: 24,
        marginBottom: 5,
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 5,
    },
    label: {
        fontSize: 12,
        color: '#888',
    },
});