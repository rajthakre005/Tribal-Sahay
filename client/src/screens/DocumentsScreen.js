/**
 * Documents Screen - Document Wallet Management
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
import { fetchDocuments } from '../store/slices/documentSlice';

const DocumentsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { documents, loading } = useSelector((state) => state.documents);

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  const getDocumentIcon = (type) => {
    const icons = {
      aadhaar_card: 'badge',
      st_certificate: 'verified',
      income_certificate: 'account-balance',
      marksheet_10th: 'school',
      marksheet_12th: 'menu-book',
      graduation_certificate: 'workspace-premium',
    };
    return icons[type] || 'description';
  };

  const DocumentCard = ({ document }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Icon name={getDocumentIcon(document.documentType)} size={32} color="#2563eb" />
        </View>
        <View style={styles.documentInfo}>
          <Text style={styles.documentName}>{document.documentName}</Text>
          <Text style={styles.documentType}>
            {document.documentType.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
        {document.isVerified && (
          <View style={styles.verifiedBadge}>
            <Icon name="check-circle" size={20} color="#10b981" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.uploadDate}>
          Uploaded: {new Date(document.uploadedAt).toLocaleDateString()}
        </Text>
        <TouchableOpacity>
          <Icon name="more-vert" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* DigiLocker Section */}
      <View style={styles.digilockerSection}>
        <TouchableOpacity style={styles.digilockerButton}>
          <Icon name="folder-shared" size={24} color="#2563eb" />
          <View style={styles.digilockerText}>
            <Text style={styles.digilockerTitle}>Connect DigiLocker</Text>
            <Text style={styles.digilockerSubtitle}>Access your documents instantly</Text>
          </View>
          <Icon name="arrow-forward" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Documents List */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Documents</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => navigation.navigate('DocumentUpload')}
        >
          <Icon name="add" size={20} color="#fff" />
          <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={documents}
        renderItem={({ item }) => <DocumentCard document={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={documents.length === 0 ? styles.emptyContainer : styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => dispatch(fetchDocuments())}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="folder-open" size={64} color="#9ca3af" />
            <Text style={styles.emptyText}>No documents uploaded</Text>
            <TouchableOpacity
              style={styles.uploadButtonLarge}
              onPress={() => navigation.navigate('DocumentUpload')}
            >
              <Text style={styles.uploadButtonTextLarge}>Upload Document</Text>
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
  digilockerSection: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  digilockerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 12,
  },
  digilockerText: {
    flex: 1,
    marginLeft: 12,
  },
  digilockerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  digilockerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
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
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  documentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  documentType: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10b981',
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
  },
  uploadDate: {
    fontSize: 12,
    color: '#9ca3af',
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
  uploadButtonLarge: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  uploadButtonTextLarge: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default DocumentsScreen;
