import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
} from 'react-native';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
    style?: ViewStyle;
}

export default function CustomButton({
                                         title,
                                         onPress,
                                         variant = 'primary',
                                         disabled = false,
                                         loading = false,
                                         icon,
                                         style,
                                     }: CustomButtonProps) {
    const getBackgroundColor = () => {
        if (disabled || loading) return '#333';
        switch (variant) {
            case 'primary': return '#FFD700';
            case 'secondary': return '#252525';
            case 'danger': return '#f87171';
            case 'success': return '#4ade80';
            default: return '#FFD700';
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case 'primary': return '#000';
            case 'secondary': return '#fff';
            case 'danger': return '#fff';
            case 'success': return '#000';
            default: return '#000';
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor() },
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }]}>
                    {icon && `${icon} `}{title}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});