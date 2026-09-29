/**
 * OTP Verification Screen - Phone Number Verification
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OTPVerificationScreen = ({ navigation }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    // TODO: Implement actual OTP verification
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Phone verified successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('MainTabs'),
        },
      ]);
    }, 1500);
  };

  const handleResendOTP = () => {
    Alert.alert('OTP Sent', 'A new OTP has been sent to your phone number');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="verified-user" size={64} color="#2563eb" />
        </View>
        
        <Text style={styles.title}>Verify Phone Number</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit OTP to your registered phone number
        </Text>

        <View style={styles.otpContainer}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              value={otp[index] || ''}
              onChangeText={(text) => {
                if (text.length <= 1) {
                  const newOtp = otp.split('');
                  newOtp[index] = text;
                  setOtp(newOtp.join(''));
                }
              }}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify OTP</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.resendButton} onPress={handleResendOTP}>
          <Text style={styles.resendButtonText}>Resend OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.changeNumberText}>Change Phone Number</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  verifyButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendButton: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resendButtonText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: 'bold',
  },
  changeNumberText: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default OTPVerificationScreen;
