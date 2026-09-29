/**
 * Notifications Screen - View User Notifications
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NotificationsScreen = () => {
  const notifications = [
    {
      id: '1',
      title: 'Application Submitted Successfully',
      message: 'Your scholarship application has been submitted successfully.',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      title: 'Document Verified',
      message: 'Your Aadhaar card has been verified successfully.',
      timestamp: '1 day ago',
      read: true,
    },
  ];

  const NotificationCard = ({ notification }) => (
    <TouchableOpacity
      style={[styles.card, !notification.read && styles.unreadCard]}
    >
      <View style={styles.cardHeader}>
        <Icon
          name={notification.read ? 'notifications-none' : 'notifications'}
          size={24}
          color={notification.read ? '#9ca3af' : '#2563eb'}
        />
        <Text style={styles.timestamp}>{notification.timestamp}</Text>
      </View>
      <Text style={styles.title}>{notification.title}</Text>
      <Text style={styles.message}>{notification.message}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationCard notification={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default NotificationsScreen;
