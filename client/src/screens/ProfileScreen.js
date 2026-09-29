/**
 * Profile Screen - User Profile Management
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { logout } from '../store/slices/authSlice';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const ProfileOption = ({ icon, title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <View style={styles.optionLeft}>
        <Icon name={icon} size={24} color="#2563eb" />
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>{title}</Text>
          {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Icon name="chevron-right" size={24} color="#9ca3af" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Icon name="person" size={64} color="#fff" />
        </View>
        <Text style={styles.userName}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        {user?.isST && (
          <View style={styles.stBadge}>
            <Icon name="verified" size={16} color="#fff" />
            <Text style={styles.stBadgeText}>ST Student</Text>
          </View>
        )}
      </View>

      {/* Profile Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <ProfileOption
          icon="edit"
          title="Edit Profile"
          subtitle="Update your personal information"
          onPress={() => navigation.navigate('EditProfile')}
        />
        <ProfileOption
          icon="school"
          title="Academic Details"
          subtitle="Update education information"
          onPress={() => navigation.navigate('AcademicDetails')}
        />
        <ProfileOption
          icon="account-balance"
          title="Bank Details"
          subtitle="Update bank account for disbursement"
          onPress={() => navigation.navigate('BankDetails')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Documents</Text>
        <ProfileOption
          icon="badge"
          title="Aadhaar Card"
          subtitle={user?.aadhaarNumber ? 'Verified' : 'Not added'}
          onPress={() => navigation.navigate('AadhaarVerification')}
        />
        <ProfileOption
          icon="verified"
          title="ST Certificate"
          subtitle={user?.stCertificateNumber ? 'Added' : 'Not added'}
          onPress={() => navigation.navigate('STCertificate')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <ProfileOption
          icon="notifications"
          title="Notifications"
          subtitle="Manage notification preferences"
          onPress={() => navigation.navigate('NotificationSettings')}
        />
        <ProfileOption
          icon="language"
          title="Language"
          subtitle="English"
          onPress={() => navigation.navigate('LanguageSettings')}
        />
        <ProfileOption
          icon="security"
          title="Security"
          subtitle="Password and authentication"
          onPress={() => navigation.navigate('SecuritySettings')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <ProfileOption
          icon="help"
          title="Help Center"
          subtitle="FAQs and support"
          onPress={() => navigation.navigate('HelpCenter')}
        />
        <ProfileOption
          icon="contact-support"
          title="Contact Us"
          subtitle="Get in touch with support"
          onPress={() => navigation.navigate('ContactUs')}
        />
        <ProfileOption
          icon="info"
          title="About"
          subtitle="App version and information"
          onPress={() => navigation.navigate('About')}
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={24} color="#ef4444" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
        <Text style={styles.footerText}>Ministry of Tribal Affairs</Text>
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
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  stBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
  },
  stBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 4,
  },
  section: {
    marginTop: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    marginLeft: 12,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    color: '#1f2937',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    padding: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
});

export default ProfileScreen;
