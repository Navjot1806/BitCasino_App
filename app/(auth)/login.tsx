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
} from 'react-native';
import { useRouter } from 'expo-router';
import { getUser, saveSession } from '.././utils/Database';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);

        try {
            // Get user from database
            const user = await getUser(email.toLowerCase().trim());

            if (!user) {
                Alert.alert(
                    'Login Failed',
                    'No account found for this email. Please sign up first.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Sign Up', onPress: () => router.push('/(auth)/signup') },
                    ]
                );
                setLoading(false);
                return;
            }

            if (user.password !== password) {
                Alert.alert('Login Failed', 'Invalid password. Please try again.');
                setLoading(false);
                return;
            }

            // Save session
            await saveSession(user.email);

            // Success - navigate to main app
            Alert.alert('Welcome Back!', `Logged in as ${user.name || user.email}`, [
                {
                    text: 'Start Playing',
                    onPress: () => router.replace('/(tabs)'),
                },
            ]);
        } catch (error) {
            console.error('Login error:', error);
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
                <View style={styles.content}>
                    {/* Logo/Header */}
                    <View style={styles.header}>
                        <Text style={styles.logo}>🎰</Text>
                        <Text style={styles.title}>Bitcoin Casino</Text>
                        <Text style={styles.subtitle}>Login to start playing</Text>
                    </View>

                    {/* Demo Account Info */}
                    <View style={styles.demoInfo}>
                        <Text style={styles.demoTitle}>📝 Demo Account</Text>
                        <Text style={styles.demoText}>
                            Email: demo@casino.com{'\n'}
                            Password: password123
                        </Text>
                    </View>

                    {/* Login Form */}
                    <View style={styles.form}>
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
                                placeholder="Enter your password"
                                placeholderTextColor="#666"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoComplete="current-password"
                                contextMenuHidden={true}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <Text style={styles.loginButtonText}>
                                {loading ? 'Logging in...' : 'Login'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Sign Up Link */}
                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                            <Text style={styles.signupLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Features */}
                    <View style={styles.features}>
                        <View style={styles.feature}>
                            <Text style={styles.featureIcon}>🎁</Text>
                            <Text style={styles.featureText}>$100 Sign-up Bonus</Text>
                        </View>
                        <View style={styles.feature}>
                            <Text style={styles.featureIcon}>⚡</Text>
                            <Text style={styles.featureText}>Instant Withdrawals</Text>
                        </View>
                        <View style={styles.feature}>
                            <Text style={styles.featureIcon}>🔒</Text>
                            <Text style={styles.featureText}>Secure & Fair</Text>
                        </View>
                    </View>
                </View>
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
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
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
        color: '#888',
    },
    demoInfo: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#4ade80',
    },
    demoTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4ade80',
        marginBottom: 5,
    },
    demoText: {
        fontSize: 12,
        color: '#aaa',
        lineHeight: 18,
    },
    form: {
        marginBottom: 30,
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
    loginButton: {
        backgroundColor: '#FFD700',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    loginButtonDisabled: {
        opacity: 0.5,
    },
    loginButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    signupText: {
        color: '#888',
        fontSize: 14,
    },
    signupLink: {
        color: '#FFD700',
        fontSize: 14,
        fontWeight: 'bold',
    },
    features: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    feature: {
        alignItems: 'center',
    },
    featureIcon: {
        fontSize: 24,
        marginBottom: 5,
    },
    featureText: {
        fontSize: 11,
        color: '#888',
        textAlign: 'center',
    },
});