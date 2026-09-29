/**
 * Dashboard Screen - Main Dashboard for Students
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { fetchApplications } from '../store/slices/applicationSlice';
import { fetchNotifications } from '../store/slices/notificationSlice';

const DashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { applications } = useSelector((state) => state.applications);
  const { notifications, unreadCount } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchApplications());
    dispatch(fetchNotifications({ unreadOnly: true }));
  }, [dispatch]);

  const stats = {
    totalApplications: applications.length,
    pendingApplications: applications.filter(
      (a) => a.status === 'submitted' || a.status === 'under_review'
    ).length,
    approvedApplications: applications.filter(
      (a) => a.status === 'approved' || a.status === 'sanctioned'
    ).length,
    disbursedApplications: applications.filter((a) => a.status === 'disbursed').length,
  };

  const StatCard = ({ title, count, icon, color }) => (
    <TouchableOpacity
      style={[styles.statCard, { borderLeftColor: color }]}
      onPress={() => navigation.navigate('Applications')}
    >
      <Icon name={icon} size={32} color={color} />
      <Text style={styles.statCount}>{count}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </TouchableOpacity>
  );

  const RecentApplicationCard = ({ application }) => (
    <TouchableOpacity
      style={styles.applicationCard}
      onPress={() =>
        navigation.navigate('ApplicationDetail', { applicationId: application._id })
      }
    >
      <View style={styles.applicationHeader}>
        <Text style={styles.applicationScheme}>
          {application.scheme.replace('_', ' ').toUpperCase()}
        </Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                application.status === 'approved' ||
                application.status === 'sanctioned' ||
                application.status === 'disbursed'
                  ? '#10b981'
                  : application.status === 'rejected'
                  ? '#ef4444'
                  : '#f59e0b',
            },
          ]}
        >
          <Text style={styles.statusText}>
            {application.status.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>
      <Text style={styles.applicationNumber}>
        Application No: {application.applicationNumber}
      </Text>
      <Text style={styles.applicationYear}>
        Academic Year: {application.academicYear}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => {
            dispatch(fetchApplications());
            dispatch(fetchNotifications({ unreadOnly: true }));
          }}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome,</Text>
          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Icon name="notifications" size={24} color="#fff" />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Total"
          count={stats.totalApplications}
          icon="description"
          color="#2563eb"
        />
        <StatCard
          title="Pending"
          count={stats.pendingApplications}
          icon="pending"
          color="#f59e0b"
        />
        <StatCard
          title="Approved"
          count={stats.approvedApplications}
          icon="check-circle"
          color="#10b981"
        />
        <StatCard
          title="Disbursed"
          count={stats.disbursedApplications}
          icon="account-balance-wallet"
          color="#8b5cf6"
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Scholarships')}
          >
            <Icon name="add-circle" size={32} color="#2563eb" />
            <Text style={styles.quickActionText}>Apply Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Documents')}
          >
            <Icon name="upload-file" size={32} color="#2563eb" />
            <Text style={styles.quickActionText}>Upload Docs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Chatbot')}
          >
            <Icon name="chat" size={32} color="#2563eb" />
            <Text style={styles.quickActionText}>Get Help</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Applications */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Applications</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Applications')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        {applications.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="inbox" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>No applications yet</Text>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => navigation.navigate('Scholarships')}
            >
              <Text style={styles.applyButtonText}>Apply for Scholarship</Text>
            </TouchableOpacity>
          </View>
        ) : (
          applications.slice(0, 5).map((application) => (
            <RecentApplicationCard key={application._id} application={application} />
          ))
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2563eb',
  },
  greeting: {
    fontSize: 14,
    color: '#dbeafe',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    right: -8,
    top: -8,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  seeAllText: {
    color: '#2563eb',
    fontSize: 14,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionButton: {
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 12,
    color: '#1f2937',
    marginTop: 4,
  },
  applicationCard: {
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
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  applicationScheme: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  applicationNumber: {
    fontSize: 14,
    color: '#6b7280',
  },
  applicationYear: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
  applyButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
