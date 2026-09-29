/**
 * App Navigation Configuration
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';

// Main Screens
import DashboardScreen from '../screens/DashboardScreen';
import ScholarshipsScreen from '../screens/ScholarshipsScreen';
import ApplicationsScreen from '../screens/ApplicationsScreen';
import DocumentsScreen from '../screens/DocumentsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatbotScreen from '../screens/ChatbotScreen';

// Detail Screens
import ApplicationDetailScreen from '../screens/ApplicationDetailScreen';
import ScholarshipDetailScreen from '../screens/ScholarshipDetailScreen';
import DocumentUploadScreen from '../screens/DocumentUploadScreen';
import ApplicationFormScreen from '../screens/ApplicationFormScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator for main screens
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Scholarships') {
            iconName = 'school';
          } else if (route.name === 'Applications') {
            iconName = 'description';
          } else if (route.name === 'Documents') {
            iconName = 'folder';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Scholarships" component={ScholarshipsScreen} />
      <Tab.Screen name="Applications" component={ApplicationsScreen} />
      <Tab.Screen name="Documents" component={DocumentsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2563eb',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* Auth Stack */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Create Account' }}
      />
      <Stack.Screen
        name="OTPVerification"
        component={OTPVerificationScreen}
        options={{ title: 'Verify OTP' }}
      />

      {/* Main App */}
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />

      {/* Detail Screens */}
      <Stack.Screen
        name="ApplicationDetail"
        component={ApplicationDetailScreen}
        options={{ title: 'Application Details' }}
      />
      <Stack.Screen
        name="ScholarshipDetail"
        component={ScholarshipDetailScreen}
        options={{ title: 'Scholarship Details' }}
      />
      <Stack.Screen
        name="DocumentUpload"
        component={DocumentUploadScreen}
        options={{ title: 'Upload Document' }}
      />
      <Stack.Screen
        name="ApplicationForm"
        component={ApplicationFormScreen}
        options={{ title: 'Apply for Scholarship' }}
      />
      <Stack.Screen
        name="Chatbot"
        component={ChatbotScreen}
        options={{ title: 'JAGO Assistant' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
