/**
 * Document Upload Screen - Upload Documents
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DocumentUploadScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.uploadArea}>
        <Icon name="cloud-upload" size={64} color="#9ca3af" />
        <Text style={styles.uploadTitle}>Upload Document</Text>
        <Text style={styles.uploadSubtitle}>Tap to select a file</Text>
        <TouchableOpacity style={styles.selectButton}>
          <Text style={styles.selectButtonText}>Select File</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Document Type</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Select Document Type</Text>
          <Icon name="arrow-drop-down" size={24} color="#6b7280" />
        </TouchableOpacity>

        <Text style={styles.label}>Document Number (Optional)</Text>
        <View style={styles.input}>
          <Text style={styles.inputPlaceholder}>Enter document number</Text>
        </View>

        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Upload Document</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  uploadArea: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  selectButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
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
  },
  dropdownText: {
    fontSize: 14,
    color: '#6b7280',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  inputPlaceholder: {
    fontSize: 14,
    color: '#9ca3af',
  },
  uploadButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DocumentUploadScreen;
