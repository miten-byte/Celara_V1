import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { trpc } from '@/lib/trpc';
import { useUser } from '@/contexts/UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, Phone, Globe } from 'lucide-react-native';

const COUNTRY_CODES = [
  { code: '+1', country: 'US/CA' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'IN' },
  { code: '+86', country: 'CN' },
  { code: '+81', country: 'JP' },
  { code: '+49', country: 'DE' },
  { code: '+33', country: 'FR' },
  { code: '+61', country: 'AU' },
  { code: '+971', country: 'AE' },
  { code: '+65', country: 'SG' },
];

export default function AuthScreen() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const router = useRouter();
  const { login, loginAsGuest } = useUser();

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async (data) => {
      console.log('Login successful:', data);
      await login(data.token, data.user);
      router.replace('/(tabs)/home' as any);
    },
    onError: (error) => {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    },
  });

  const signupMutation = trpc.auth.signup.useMutation({
    onSuccess: async (data) => {
      console.log('Signup successful:', data);
      await login(data.token, data.user);
      router.replace('/(tabs)/home' as any);
    },
    onError: (error) => {
      console.error('Signup error:', error);
      Alert.alert('Signup Failed', error.message || 'Unable to create account');
    },
  });

  const handleSubmit = () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    if (isSignup) {
      if (!trimmedName) {
        Alert.alert('Error', 'Please enter your name');
        return;
      }
      if (!trimmedPhone) {
        Alert.alert('Error', 'Please enter your phone number');
        return;
      }
      signupMutation.mutate({
        email: trimmedEmail,
        password: trimmedPassword,
        name: trimmedName,
        countryCode: countryCode,
        phone: trimmedPhone,
      });
    } else {
      loginMutation.mutate({ email: trimmedEmail, password: trimmedPassword });
    }
  };

  const handleGuestLogin = async () => {
    try {
      await loginAsGuest();
      router.replace('/(tabs)/home' as any);
    } catch (error) {
      console.error('Guest login error:', error);
      Alert.alert('Error', 'Unable to continue as guest');
    }
  };

  const isLoading = loginMutation.isPending || signupMutation.isPending;

  return (
    <LinearGradient colors={['#ffffff', '#f8f9fa', '#ffffff']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.brandName}>Celara</Text>
                <Text style={styles.tagline}>Crafted by Science. Worn with Soul.</Text>
                <Text style={styles.subtitle}>
                  {isSignup ? 'Create your account' : 'Welcome back'}
                </Text>
              </View>

              <View style={styles.form}>
                {isSignup && (
                  <View style={styles.inputContainer}>
                    <UserIcon size={20} color="#1a1f3a" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Full Name"
                      placeholderTextColor="#9ca3af"
                      value={name}
                      onChangeText={setName}
                      editable={!isLoading}
                      autoCapitalize="words"
                    />
                  </View>
                )}

                <View style={styles.inputContainer}>
                  <Mail size={20} color="#1a1f3a" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!isLoading}
                  />
                </View>

                {isSignup && (
                  <View style={styles.phoneContainer}>
                    <TouchableOpacity
                      style={styles.countryCodeButton}
                      onPress={() => setShowCountryPicker(!showCountryPicker)}
                    >
                      <Globe size={20} color="#1a1f3a" />
                      <Text style={styles.countryCodeText}>{countryCode}</Text>
                    </TouchableOpacity>

                    <View style={styles.phoneInputContainer}>
                      <Phone size={20} color="#1a1f3a" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        placeholderTextColor="#9ca3af"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        editable={!isLoading}
                      />
                    </View>
                  </View>
                )}

                {isSignup && showCountryPicker && (
                  <View style={styles.countryPicker}>
                    <ScrollView style={styles.countryPickerScroll} nestedScrollEnabled>
                      {COUNTRY_CODES.map((item) => (
                        <TouchableOpacity
                          key={item.code}
                          style={styles.countryItem}
                          onPress={() => {
                            setCountryCode(item.code);
                            setShowCountryPicker(false);
                          }}
                        >
                          <Text style={styles.countryItemCode}>{item.code}</Text>
                          <Text style={styles.countryItemCountry}>{item.country}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

                <View style={styles.inputContainer}>
                  <Lock size={20} color="#1a1f3a" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Password"
                    placeholderTextColor="#9ca3af"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#6b7280" />
                    ) : (
                      <Eye size={20} color="#6b7280" />
                    )}
                  </TouchableOpacity>
                </View>

                {isSignup && (
                  <View style={styles.verificationNote}>
                    <Text style={styles.verificationText}>
                      📱 Phone verification will be required after signup
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  <LinearGradient colors={['#1a1f3a', '#2d3561']} style={styles.submitGradient}>
                    {isLoading ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.submitButtonText}>
                        {isSignup ? 'Create Account' : 'Sign In'}
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.divider} />
                </View>

                <TouchableOpacity
                  style={styles.guestButton}
                  onPress={handleGuestLogin}
                  disabled={isLoading}
                >
                  <Text style={styles.guestButtonText}>Continue as Guest</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.switchButton}
                  onPress={() => {
                    setIsSignup(!isSignup);
                    setName('');
                    setPhone('');
                    setShowCountryPicker(false);
                  }}
                  disabled={isLoading}
                >
                  <Text style={styles.switchButtonText}>
                    {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                    <Text style={styles.switchButtonTextBold}>
                      {isSignup ? 'Sign In' : 'Sign Up'}
                    </Text>
                  </Text>
                </TouchableOpacity>

                {!isSignup && (
                  <TouchableOpacity style={styles.forgotButton} disabled={isLoading}>
                    <Text style={styles.forgotButtonText}>Forgot Password?</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandName: {
    fontSize: 48,
    fontWeight: '300' as const,
    color: '#D4AF37',
    letterSpacing: 4,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 13,
    color: '#6b7280',
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '400' as const,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  phoneContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    minWidth: 100,
    gap: 8,
  },
  countryCodeText: {
    fontSize: 16,
    color: '#1a1f3a',
    fontWeight: '600' as const,
  },
  phoneInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  countryPicker: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  countryPickerScroll: {
    maxHeight: 200,
  },
  countryItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  countryItemCode: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1f3a',
    width: 60,
  },
  countryItemCountry: {
    fontSize: 16,
    color: '#6b7280',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    color: '#1a1f3a',
    fontSize: 16,
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute' as const,
    right: 16,
    padding: 8,
  },
  verificationNote: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  verificationText: {
    fontSize: 13,
    color: '#0369a1',
    textAlign: 'center' as const,
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#1a1f3a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitGradient: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500' as const,
  },
  guestButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  guestButtonText: {
    color: '#1a1f3a',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  switchButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchButtonText: {
    color: '#6b7280',
    fontSize: 15,
  },
  switchButtonTextBold: {
    color: '#1a1f3a',
    fontWeight: '700' as const,
  },
  forgotButton: {
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 8,
  },
  forgotButtonText: {
    color: '#1a1f3a',
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
