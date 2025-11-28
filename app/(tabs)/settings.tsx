import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Switch,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getCurrentUser, clearSession } from '.././utils/Database';
import type { User } from '.././utils/Database';

export default function SettingsScreen() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [notifications, setNotifications] = useState(true);
    const [twoFactor, setTwoFactor] = useState(false);
    const [soundEffects, setSoundEffects] = useState(true);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await clearSession();
                        router.replace('/(auth)/login');
                    },
                },
            ]
        );
    };

    const userName = user?.name || 'Guest';
    const userEmail = user?.email || 'N/A';
    const avatarInitials = userName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    const SettingItem = ({
                             icon,
                             title,
                             subtitle,
                             onPress,
                             showArrow = true,
                             rightComponent,
                         }: any) => (
        <TouchableOpacity
            style={styles.settingItem}
            onPress={onPress}
            disabled={!onPress && !rightComponent}
        >
            <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                    <Ionicons name={icon} size={24} color="#FFD700" />
                </View>
                <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{title}</Text>
                    {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            {rightComponent ||
                (showArrow && <Ionicons name="chevron-forward" size={20} color="#666" />)}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Settings</Text>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {/* Profile Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Profile</Text>
                    <View style={styles.profileCard}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{avatarInitials}</Text>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{userName}</Text>
                            <Text style={styles.profileEmail}>{userEmail}</Text>
                            {user && (
                                <Text style={styles.profileBalance}>
                                    Balance: ₿{user.balance.toFixed(6)}
                                </Text>
                            )}
                        </View>
                        <TouchableOpacity style={styles.editButton}>
                            <Ionicons name="create-outline" size={20} color="#FFD700" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.card}>
                        <SettingItem
                            icon="wallet-outline"
                            title="Payment Methods"
                            subtitle="Manage your payment options"
                            onPress={() => Alert.alert('Payment Methods', 'Coming soon!')}
                        />
                        <SettingItem
                            icon="shield-checkmark-outline"
                            title="Two-Factor Authentication"
                            subtitle="Secure your account"
                            showArrow={false}
                            rightComponent={
                                <Switch
                                    value={twoFactor}
                                    onValueChange={setTwoFactor}
                                    trackColor={{ false: '#333', true: '#FFD700' }}
                                    thumbColor="#fff"
                                />
                            }
                        />
                        <SettingItem
                            icon="key-outline"
                            title="Change Password"
                            subtitle="Update your password"
                            onPress={() => Alert.alert('Change Password', 'Coming soon!')}
                        />
                    </View>
                </View>

                {/* Preferences Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <View style={styles.card}>
                        <SettingItem
                            icon="notifications-outline"
                            title="Push Notifications"
                            subtitle="Get updates about your games"
                            showArrow={false}
                            rightComponent={
                                <Switch
                                    value={notifications}
                                    onValueChange={setNotifications}
                                    trackColor={{ false: '#333', true: '#FFD700' }}
                                    thumbColor="#fff"
                                />
                            }
                        />
                        <SettingItem
                            icon="volume-high-outline"
                            title="Sound Effects"
                            subtitle="Enable game sounds"
                            showArrow={false}
                            rightComponent={
                                <Switch
                                    value={soundEffects}
                                    onValueChange={setSoundEffects}
                                    trackColor={{ false: '#333', true: '#FFD700' }}
                                    thumbColor="#fff"
                                />
                            }
                        />
                        <SettingItem
                            icon="globe-outline"
                            title="Language"
                            subtitle="English"
                            onPress={() => Alert.alert('Language', 'Coming soon!')}
                        />
                    </View>
                </View>

                {/* Support Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <View style={styles.card}>
                        <SettingItem
                            icon="help-circle-outline"
                            title="Help Center"
                            subtitle="Get help with your account"
                            onPress={() =>
                                Alert.alert('Help Center', 'Contact support@casinobitcoin.com')
                            }
                        />
                        <SettingItem
                            icon="document-text-outline"
                            title="Terms & Conditions"
                            onPress={() => Alert.alert('Terms & Conditions', 'Coming soon!')}
                        />
                        <SettingItem
                            icon="shield-outline"
                            title="Privacy Policy"
                            onPress={() => Alert.alert('Privacy Policy', 'Coming soon!')}
                        />
                        <SettingItem
                            icon="information-circle-outline"
                            title="About"
                            subtitle="Version 1.0.0"
                            onPress={() => Alert.alert('About', 'Bitcoin Casino v1.0.0')}
                        />
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#f87171" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Made with ❤️ by Casino Bitcoin</Text>
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
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
    },
    card: {
        backgroundColor: '#1a1a1a',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#333',
        overflow: 'hidden',
    },
    profileCard: {
        flexDirection: 'row',
        backgroundColor: '#1a1a1a',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFD700',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 3,
    },
    profileEmail: {
        fontSize: 14,
        color: '#888',
        marginBottom: 3,
    },
    profileBalance: {
        fontSize: 12,
        color: '#4ade80',
        fontWeight: '600',
    },
    editButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#252525',
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#252525',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#252525',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingText: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 13,
        color: '#888',
    },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: '#1a1a1a',
        borderRadius: 15,
        padding: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#f87171',
        marginBottom: 20,
    },
    logoutText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f87171',
        marginLeft: 10,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    footerText: {
        fontSize: 12,
        color: '#666',
    },
});