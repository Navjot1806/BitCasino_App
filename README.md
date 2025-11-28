# 💕 Dating App - React Native

A full-featured dating application built with React Native and Expo.

## ✨ Features

- 🔥 Tinder-style swipe cards
- 💘 Matching system
- 💬 Real-time chat messaging
- 📍 Location-based user discovery (5-mile radius)
- 👤 User profiles with photos and interests
- ⚙️ Customizable preferences (age range, distance)
- 🔐 User authentication (login/signup)

## 🛠️ Tech Stack

- React Native + Expo
- TypeScript
- React Navigation
- AsyncStorage (local database)
- Expo Location API

## 📱 Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/dating-app.git

# Navigate to project
cd dating-app

# Install dependencies
npm install

# Start the app
npx expo start
\`\`\`

## 🚀 Running the App

1. Install Expo Go on your phone
2. Scan the QR code from terminal
3. Or press 'i' for iOS simulator, 'a' for Android emulator

## 👤 Demo Account

- Email: `sarah@example.com`
- Password: `password123`

## 📂 Project Structure

\`\`\`
DatingApp/
├── app/
│   └── _layout.tsx          # Root navigation
├── screens/
│   ├── LoginScreen.tsx
│   ├── SignupScreen.tsx
│   ├── HomeScreen.tsx       # Swipe cards
│   ├── MatchesScreen.tsx
│   ├── ChatListScreen.tsx
│   ├── ChatScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── SettingsScreen.tsx
│   └── ActiveUsersScreen.tsx
├── services/
│   ├── database.ts          # Data management
│   ├── auth.ts             # Authentication
│   └── location.ts         # Location services
├── components/
│   ├── Card.tsx            # Profile card component
│   └── ChatMessage.tsx     # Message bubble component
└── utils/
    └── helpers.ts          # Utility functions
\`\`\`

## 👨‍💻 Author

NavjyotSingh
