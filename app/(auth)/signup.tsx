import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { registerUser, saveSession } from '.././utils/Database';

export default function SignUpScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Register user in database
            const success = await registerUser(
                email.toLowerCase().trim(),
                password,
                name.trim()
            );

            if (!success) {
                Alert.alert('Error', 'An account with this email already exists.');
                setLoading(false);
                return;
            }

            // Save session (auto-login)
            await saveSession(email.toLowerCase().trim());

            // Show success message
            Alert.alert(
                '🎉 Welcome to Bitcoin Casino!',
                `Account created successfully!\n\nYou received ₿0.002222 ($100) as a welcome bonus!\n\nStart playing now!`,
                [
                    {
                        text: 'Start Playing',
                        onPress: () => router.replace('/(tabs)'),
                    },
                ]
            );
        } catch (error) {
            console.error('Signup error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.logo}>🎰</Text>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Get $100 sign-up bonus!</Text>
                    </View>

                    {/* Bonus Banner */}
                    <View style={styles.bonusBanner}>
                        <Text style={styles.bonusIcon}>🎁</Text>
                        <View style={styles.bonusContent}>
                            <Text style={styles.bonusTitle}>Welcome Bonus</Text>
                            <Text style={styles.bonusAmount}>$100 FREE</Text>
                            <Text style={styles.bonusText}>≈ ₿0.002222 • Start playing immediately!</Text>
                        </View>
                    </View>

                    {/* Sign Up Form */}
                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your name"
                                placeholderTextColor="#666"
                                value={name}
                                onChangeText={setName}
                                autoComplete="name"
                                contextMenuHidden={true}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor="#666"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                autoComplete="email"
                                contextMenuHidden={true}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Create a password (min 6 characters)"
                                placeholderTextColor="#666"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoComplete="password-new"
                                contextMenuHidden={true}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm your password"
                                placeholderTextColor="#666"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                autoComplete="password-new"
                                contextMenuHidden={true}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.signupButton, loading && styles.signupButtonDisabled]}
                            onPress={handleSignUp}
                            disabled={loading}
                        >
                            <Text style={styles.signupButtonText}>
                                {loading ? 'Creating Account...' : '🎁 Sign Up & Get $100'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.loginLink}>Login</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Terms */}
                    <Text style={styles.terms}>
                        By signing up, you agree to our Terms of Service and Privacy Policy
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        fontSize: 64,
        marginBottom: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#4ade80',
        fontWeight: '600',
    },
    bonusBanner: {
        flexDirection: 'row',
        backgroundColor: '#1a1a1a',
        borderRadius: 15,
        padding: 20,
        marginBottom: 30,
        borderWidth: 2,
        borderColor: '#4ade80',
        alignItems: 'center',
    },
    bonusIcon: {
        fontSize: 48,
        marginRight: 15,
    },
    bonusContent: {
        flex: 1,
    },
    bonusTitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 3,
    },
    bonusAmount: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4ade80',
        marginBottom: 3,
    },
    bonusText: {
        fontSize: 12,
        color: '#aaa',
    },
    form: {
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        color: '#fff',
        borderWidth: 1,
        borderColor: '#333',
    },
    signupButton: {
        backgroundColor: '#4ade80',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    signupButtonDisabled: {
        opacity: 0.5,
    },
    signupButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    loginText: {
        color: '#888',
        fontSize: 14,
    },
    loginLink: {
        color: '#FFD700',
        fontSize: 14,
        fontWeight: 'bold',
    },
    terms: {
        fontSize: 11,
        color: '#666',
        textAlign: 'center',
        lineHeight: 16,
    },
});