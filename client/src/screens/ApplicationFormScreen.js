/**
 * Application Form Screen - Apply for Scholarship
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

const ApplicationFormScreen = ({ route }) => {
  const { scholarshipId } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Apply for Scholarship</Text>
        <Text style={styles.subtitle}>Post-Matric Scholarship</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Academic Details</Text>
        
        <Text style={styles.label}>Institution Name *</Text>
        <View style={styles.input}>
          <Text style={styles.inputPlaceholder}>Enter institution name</Text>
        </View>

        <Text style={styles.label}>Institution Type *</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Select Institution Type</Text>
          <Icon name="arrow-drop-down" size={24} color="#6b7280" />
        </TouchableOpacity>

        <Text style={styles.label}>Course Name *</Text>
        <View style={styles.input}>
          <Text style={styles.inputPlaceholder}>Enter course name</Text>
        </View>

        <Text style={styles.label}>Course Level *</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Select course level</Text>
          <Icon name="arrow-drop-down" size={24} color="#6b7280" />
        </TouchableOpacity>

        <Text style={styles.label}>Total Fees *</Text>
        <View style={styles.input}>
          <Text style={styles.inputPlaceholder}>Enter total fees</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Previous Academic Record</Text>

        <Text style={styles.label}>Examination *</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Select examination</Text>
          <Icon name="arrow-drop-down" size={24} color="#6b7280" />
        </TouchableOpacity>

        <Text style={styles.label}>Board *</Text>
        <View style={styles.input}>
          <Text style={styles.inputPlaceholder}>Enter board name</Text>
        </View>

        <Text style={styles.label}>Year *</Text>
        <View style={styles.input}>
          <Text style={styles.inputPlaceholder}>Enter passing year</Text>
        </View>

        <Text style={styles.label}>Percentage *</Text>
        <View style={styles.input}>
          <Text style={styles.inputPlaceholder}>Enter percentage</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Income Details</Text>

        <Text style={styles.label}>Annual Family Income *</Text>
        <View style={styles.input}>
          <Text style={styles.inputPlaceholder}>Enter annual income</Text>
        </View>

        <Text style={styles.label}>Income Source</Text>
        <View style={styles.input}>
          <Text style={styles.inputPlaceholder}>Enter income source</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Documents</Text>
        <TouchableOpacity style={styles.addDocumentButton}>
          <Icon name="add" size={20} color="#2563eb" />
          <Text style={styles.addDocumentText}>Add Document</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit Application</Text>
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
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  inputPlaceholder: {
    fontSize: 14,
    color: '#9ca3af',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 14,
    color: '#6b7280',
  },
  addDocumentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2563eb',
    borderStyle: 'dashed',
  },
  addDocumentText: {
    fontSize: 14,
    color: '#2563eb',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    margin: 16,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ApplicationFormScreen;
