/**
 * Scholarship Detail Screen - View Scholarship Scheme Details
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

const ScholarshipDetailScreen = ({ route, navigation }) => {
  const { scholarshipId } = route.params;

  const handleApply = () => {
    navigation.navigate('ApplicationForm', { scholarshipId });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Post-Matric Scholarship</Text>
        <Text style={styles.subtitle}>For ST students at post-matriculation level</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eligibility</Text>
        <View style={styles.card}>
          <View style={styles.eligibilityItem}>
            <Icon name="check-circle" size={20} color="#10b981" />
            <Text style={styles.eligibilityText}>ST student with family income up to ₹2.5 lakhs per annum</Text>
          </View>
          <View style={styles.eligibilityItem}>
            <Icon name="check-circle" size={20} color="#10b981" />
            <Text style={styles.eligibilityText}>Pursuing post-matriculation course</Text>
          </View>
          <View style={styles.eligibilityItem}>
            <Icon name="check-circle" size={20} color="#10b981" />
            <Text style={styles.eligibilityText}>Minimum 75% attendance required</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Benefits</Text>
        <View style={styles.card}>
          <View style={styles.benefitItem}>
            <Icon name="account-balance-wallet" size={20} color="#2563eb" />
            <Text style={styles.benefitText}>Full reimbursement of course fees</Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="home" size={20} color="#2563eb" />
            <Text style={styles.benefitText}>Hostel allowance</Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="book" size={20} color="#2563eb" />
            <Text style={styles.benefitText}>Book allowance</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Required Documents</Text>
        <View style={styles.card}>
          <Text style={styles.documentText}>• Aadhaar Card</Text>
          <Text style={styles.documentText}>• ST Certificate</Text>
          <Text style={styles.documentText}>• Income Certificate</Text>
          <Text style={styles.documentText}>• Previous Year Marksheet</Text>
          <Text style={styles.documentText}>• Admission Letter</Text>
          <Text style={styles.documentText}>• Bank Passbook</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
        <Text style={styles.applyButtonText}>Apply Now</Text>
      </TouchableOpacity>
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
  subtitle: {
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eligibilityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eligibilityText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  documentText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  applyButton: {
    backgroundColor: '#2563eb',
    margin: 16,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScholarshipDetailScreen;
