/**
 * Application Detail Screen - View Application Details and Status
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ApplicationDetailScreen = ({ route }) => {
  const { applicationId } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Application Details</Text>
        <Text style={styles.applicationId}>ID: {applicationId}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Application Status</Text>
        <View style={styles.statusCard}>
          <Icon name="pending" size={48} color="#f59e0b" />
          <Text style={styles.statusText}>Under Review</Text>
          <Text style={styles.statusSubtitle}>Your application is being processed</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Verification Status</Text>
        <View style={styles.verificationItem}>
          <Icon name="check-circle" size={24} color="#10b981" />
          <Text style={styles.verificationText}>Identity Verified</Text>
        </View>
        <View style={styles.verificationItem}>
          <Icon name="check-circle" size={24} color="#10b981" />
          <Text style={styles.verificationText}>ST Certificate Verified</Text>
        </View>
        <View style={styles.verificationItem}>
          <Icon name="pending" size={24} color="#f59e0b" />
          <Text style={styles.verificationText}>Income Verification Pending</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Documents</Text>
        <View style={styles.documentItem}>
          <Icon name="description" size={24} color="#6b7280" />
          <Text style={styles.documentText}>Aadhaar Card</Text>
          <Icon name="check" size={24} color="#10b981" />
        </View>
        <View style={styles.documentItem}>
          <Icon name="description" size={24} color="#6b7280" />
          <Text style={styles.documentText}>ST Certificate</Text>
          <Icon name="check" size={24} color="#10b981" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#2563eb',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  applicationId: {
    fontSize: 14,
    color: '#dbeafe',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 12,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  verificationText: {
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 12,
    flex: 1,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  documentText: {
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 12,
    flex: 1,
  },
});

export default ApplicationDetailScreen;
