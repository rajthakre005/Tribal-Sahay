/**
 * Scholarships Screen - List of Available Scholarship Schemes
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
import { fetchScholarships } from '../store/slices/scholarshipSlice';

const ScholarshipsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { scholarships, loading, error } = useSelector((state) => state.scholarships);

  useEffect(() => {
    dispatch(fetchScholarships());
  }, [dispatch]);

  const schemeColors = {
    pre_matric: '#3b82f6',
    post_matric: '#10b981',
    top_class: '#f59e0b',
    nfst: '#8b5cf6',
    nos: '#ef4444',
  };

  const schemeIcons = {
    pre_matric: 'school',
    post_matric: 'menu-book',
    top_class: 'workspace-premium',
    nfst: 'science',
    nos: 'public',
  };

  const ScholarshipCard = ({ scheme }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('ScholarshipDetail', { scholarshipId: scheme.id })
      }
    >
      <View style={[styles.cardHeader, { backgroundColor: schemeColors[scheme.id] }]}>
        <Icon name={schemeIcons[scheme.id]} size={40} color="#fff" />
        <Text style={styles.cardTitle}>{scheme.name}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardDescription}>{scheme.description}</Text>
        <View style={styles.eligibilityContainer}>
          <Icon name="check-circle" size={16} color="#10b981" />
          <Text style={styles.eligibilityText} numberOfLines={2}>
            {scheme.eligibility}
          </Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.applyText}>Apply Now</Text>
        <Icon name="arrow-forward" size={20} color="#2563eb" />
      </View>
    </TouchableOpacity>
  );

  if (loading && scholarships.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={scholarships}
        renderItem={({ item }) => <ScholarshipCard scheme={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => dispatch(fetchScholarships())}
          />
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
    flex: 1,
  },
  cardBody: {
    padding: 16,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  eligibilityContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  eligibilityText: {
    fontSize: 13,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  applyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
});

export default ScholarshipsScreen;
