/**
 * Register Screen - User Registration
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/slices/authSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    state: '',
  });

  const handleRegister = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    const result = await dispatch(register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      state: formData.state,
      address: {
        state: formData.state,
      },
    }));

    if (register.fulfilled.match(result)) {
      Alert.alert('Success', 'Registration successful! Please verify your phone number.');
      navigation.navigate('OTPVerification');
    } else if (register.rejected.match(result)) {
      Alert.alert('Registration Failed', result.payload);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Register to apply for scholarships</Text>

        <View style={styles.form}>
          <View style={styles.nameRow}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              />
            </View>
          </View>

          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="10-digit Phone Number"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
            maxLength={10}
          />

          <Text style={styles.label}>Password *</Text>
          <TextInput
            style={styles.input}
            placeholder="Min 8 characters"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
          />

          <Text style={styles.label}>Confirm Password *</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            secureTextEntry
          />

          <Text style={styles.label}>State *</Text>
          <TextInput
            style={styles.input}
            placeholder="Select State"
            value={formData.state}
            onChangeText={(text) => setFormData({ ...formData, state: text })}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Register</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 32,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
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
    fontSize: 14,
    marginBottom: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#6b7280',
    fontSize: 14,
  },
  loginLink: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
