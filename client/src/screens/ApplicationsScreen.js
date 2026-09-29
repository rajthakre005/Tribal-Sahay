/**
 * Applications Screen - List of User's Scholarship Applications
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { fetchApplications } from '../store/slices/applicationSlice';

const ApplicationsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { applications, loading } = useSelector((state) => state.applications);

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
      case 'sanctioned':
      case 'disbursed':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      default:
        return '#f59e0b';
    }
  };

  const ApplicationCard = ({ application }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('ApplicationDetail', { applicationId: application._id })
      }
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.schemeName}>
            {application.scheme.replace('_', ' ').toUpperCase()}
          </Text>
          <Text style={styles.applicationNumber}>
            {application.applicationNumber}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(application.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {application.status.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Icon name="calendar-today" size={16} color="#6b7280" />
          <Text style={styles.infoText}>Academic Year: {application.academicYear}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="schedule" size={16} color="#6b7280" />
          <Text style={styles.infoText}>
            Applied: {new Date(application.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={applications}
        renderItem={({ item }) => <ApplicationCard application={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={applications.length === 0 ? styles.emptyContainer : styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => dispatch(fetchApplications())}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="inbox" size={64} color="#9ca3af" />
            <Text style={styles.emptyText}>No applications yet</Text>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => navigation.navigate('Scholarships')}
            >
              <Text style={styles.applyButtonText}>Apply for Scholarship</Text>
            </TouchableOpacity>
          </View>
        }
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
  emptyContainer: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  schemeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  applicationNumber: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardBody: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
  applyButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ApplicationsScreen;
