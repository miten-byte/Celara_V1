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
  { code: '+93', country: 'Afghanistan' },
  { code: '+355', country: 'Albania' },
  { code: '+213', country: 'Algeria' },
  { code: '+1684', country: 'American Samoa' },
  { code: '+376', country: 'Andorra' },
  { code: '+244', country: 'Angola' },
  { code: '+1264', country: 'Anguilla' },
  { code: '+672', country: 'Antarctica' },
  { code: '+1268', country: 'Antigua and Barbuda' },
  { code: '+54', country: 'Argentina' },
  { code: '+374', country: 'Armenia' },
  { code: '+297', country: 'Aruba' },
  { code: '+61', country: 'Australia' },
  { code: '+43', country: 'Austria' },
  { code: '+994', country: 'Azerbaijan' },
  { code: '+1242', country: 'Bahamas' },
  { code: '+973', country: 'Bahrain' },
  { code: '+880', country: 'Bangladesh' },
  { code: '+1246', country: 'Barbados' },
  { code: '+375', country: 'Belarus' },
  { code: '+32', country: 'Belgium' },
  { code: '+501', country: 'Belize' },
  { code: '+229', country: 'Benin' },
  { code: '+1441', country: 'Bermuda' },
  { code: '+975', country: 'Bhutan' },
  { code: '+591', country: 'Bolivia' },
  { code: '+387', country: 'Bosnia and Herzegovina' },
  { code: '+267', country: 'Botswana' },
  { code: '+55', country: 'Brazil' },
  { code: '+246', country: 'British Indian Ocean Territory' },
  { code: '+673', country: 'Brunei' },
  { code: '+359', country: 'Bulgaria' },
  { code: '+226', country: 'Burkina Faso' },
  { code: '+257', country: 'Burundi' },
  { code: '+855', country: 'Cambodia' },
  { code: '+237', country: 'Cameroon' },
  { code: '+1', country: 'Canada' },
  { code: '+238', country: 'Cape Verde' },
  { code: '+1345', country: 'Cayman Islands' },
  { code: '+236', country: 'Central African Republic' },
  { code: '+235', country: 'Chad' },
  { code: '+56', country: 'Chile' },
  { code: '+86', country: 'China' },
  { code: '+61', country: 'Christmas Island' },
  { code: '+61', country: 'Cocos Islands' },
  { code: '+57', country: 'Colombia' },
  { code: '+269', country: 'Comoros' },
  { code: '+242', country: 'Congo' },
  { code: '+243', country: 'Congo (DRC)' },
  { code: '+682', country: 'Cook Islands' },
  { code: '+506', country: 'Costa Rica' },
  { code: '+225', country: "Côte d'Ivoire" },
  { code: '+385', country: 'Croatia' },
  { code: '+53', country: 'Cuba' },
  { code: '+599', country: 'Curaçao' },
  { code: '+357', country: 'Cyprus' },
  { code: '+420', country: 'Czech Republic' },
  { code: '+45', country: 'Denmark' },
  { code: '+253', country: 'Djibouti' },
  { code: '+1767', country: 'Dominica' },
  { code: '+1809', country: 'Dominican Republic' },
  { code: '+593', country: 'Ecuador' },
  { code: '+20', country: 'Egypt' },
  { code: '+503', country: 'El Salvador' },
  { code: '+240', country: 'Equatorial Guinea' },
  { code: '+291', country: 'Eritrea' },
  { code: '+372', country: 'Estonia' },
  { code: '+251', country: 'Ethiopia' },
  { code: '+500', country: 'Falkland Islands' },
  { code: '+298', country: 'Faroe Islands' },
  { code: '+679', country: 'Fiji' },
  { code: '+358', country: 'Finland' },
  { code: '+33', country: 'France' },
  { code: '+594', country: 'French Guiana' },
  { code: '+689', country: 'French Polynesia' },
  { code: '+241', country: 'Gabon' },
  { code: '+220', country: 'Gambia' },
  { code: '+995', country: 'Georgia' },
  { code: '+49', country: 'Germany' },
  { code: '+233', country: 'Ghana' },
  { code: '+350', country: 'Gibraltar' },
  { code: '+30', country: 'Greece' },
  { code: '+299', country: 'Greenland' },
  { code: '+1473', country: 'Grenada' },
  { code: '+590', country: 'Guadeloupe' },
  { code: '+1671', country: 'Guam' },
  { code: '+502', country: 'Guatemala' },
  { code: '+44', country: 'Guernsey' },
  { code: '+224', country: 'Guinea' },
  { code: '+245', country: 'Guinea-Bissau' },
  { code: '+592', country: 'Guyana' },
  { code: '+509', country: 'Haiti' },
  { code: '+504', country: 'Honduras' },
  { code: '+852', country: 'Hong Kong' },
  { code: '+36', country: 'Hungary' },
  { code: '+354', country: 'Iceland' },
  { code: '+91', country: 'India' },
  { code: '+62', country: 'Indonesia' },
  { code: '+98', country: 'Iran' },
  { code: '+964', country: 'Iraq' },
  { code: '+353', country: 'Ireland' },
  { code: '+44', country: 'Isle of Man' },
  { code: '+972', country: 'Israel' },
  { code: '+39', country: 'Italy' },
  { code: '+1876', country: 'Jamaica' },
  { code: '+81', country: 'Japan' },
  { code: '+44', country: 'Jersey' },
  { code: '+962', country: 'Jordan' },
  { code: '+7', country: 'Kazakhstan' },
  { code: '+254', country: 'Kenya' },
  { code: '+686', country: 'Kiribati' },
  { code: '+383', country: 'Kosovo' },
  { code: '+965', country: 'Kuwait' },
  { code: '+996', country: 'Kyrgyzstan' },
  { code: '+856', country: 'Laos' },
  { code: '+371', country: 'Latvia' },
  { code: '+961', country: 'Lebanon' },
  { code: '+266', country: 'Lesotho' },
  { code: '+231', country: 'Liberia' },
  { code: '+218', country: 'Libya' },
  { code: '+423', country: 'Liechtenstein' },
  { code: '+370', country: 'Lithuania' },
  { code: '+352', country: 'Luxembourg' },
  { code: '+853', country: 'Macau' },
  { code: '+389', country: 'North Macedonia' },
  { code: '+261', country: 'Madagascar' },
  { code: '+265', country: 'Malawi' },
  { code: '+60', country: 'Malaysia' },
  { code: '+960', country: 'Maldives' },
  { code: '+223', country: 'Mali' },
  { code: '+356', country: 'Malta' },
  { code: '+692', country: 'Marshall Islands' },
  { code: '+596', country: 'Martinique' },
  { code: '+222', country: 'Mauritania' },
  { code: '+230', country: 'Mauritius' },
  { code: '+262', country: 'Mayotte' },
  { code: '+52', country: 'Mexico' },
  { code: '+691', country: 'Micronesia' },
  { code: '+373', country: 'Moldova' },
  { code: '+377', country: 'Monaco' },
  { code: '+976', country: 'Mongolia' },
  { code: '+382', country: 'Montenegro' },
  { code: '+1664', country: 'Montserrat' },
  { code: '+212', country: 'Morocco' },
  { code: '+258', country: 'Mozambique' },
  { code: '+95', country: 'Myanmar' },
  { code: '+264', country: 'Namibia' },
  { code: '+674', country: 'Nauru' },
  { code: '+977', country: 'Nepal' },
  { code: '+31', country: 'Netherlands' },
  { code: '+687', country: 'New Caledonia' },
  { code: '+64', country: 'New Zealand' },
  { code: '+505', country: 'Nicaragua' },
  { code: '+227', country: 'Niger' },
  { code: '+234', country: 'Nigeria' },
  { code: '+683', country: 'Niue' },
  { code: '+672', country: 'Norfolk Island' },
  { code: '+850', country: 'North Korea' },
  { code: '+1670', country: 'Northern Mariana Islands' },
  { code: '+47', country: 'Norway' },
  { code: '+968', country: 'Oman' },
  { code: '+92', country: 'Pakistan' },
  { code: '+680', country: 'Palau' },
  { code: '+970', country: 'Palestine' },
  { code: '+507', country: 'Panama' },
  { code: '+675', country: 'Papua New Guinea' },
  { code: '+595', country: 'Paraguay' },
  { code: '+51', country: 'Peru' },
  { code: '+63', country: 'Philippines' },
  { code: '+48', country: 'Poland' },
  { code: '+351', country: 'Portugal' },
  { code: '+1787', country: 'Puerto Rico' },
  { code: '+974', country: 'Qatar' },
  { code: '+262', country: 'Réunion' },
  { code: '+40', country: 'Romania' },
  { code: '+7', country: 'Russia' },
  { code: '+250', country: 'Rwanda' },
  { code: '+590', country: 'Saint Barthélemy' },
  { code: '+290', country: 'Saint Helena' },
  { code: '+1869', country: 'Saint Kitts and Nevis' },
  { code: '+1758', country: 'Saint Lucia' },
  { code: '+590', country: 'Saint Martin' },
  { code: '+508', country: 'Saint Pierre and Miquelon' },
  { code: '+1784', country: 'Saint Vincent and the Grenadines' },
  { code: '+685', country: 'Samoa' },
  { code: '+378', country: 'San Marino' },
  { code: '+239', country: 'São Tomé and Príncipe' },
  { code: '+966', country: 'Saudi Arabia' },
  { code: '+221', country: 'Senegal' },
  { code: '+381', country: 'Serbia' },
  { code: '+248', country: 'Seychelles' },
  { code: '+232', country: 'Sierra Leone' },
  { code: '+65', country: 'Singapore' },
  { code: '+1721', country: 'Sint Maarten' },
  { code: '+421', country: 'Slovakia' },
  { code: '+386', country: 'Slovenia' },
  { code: '+677', country: 'Solomon Islands' },
  { code: '+252', country: 'Somalia' },
  { code: '+27', country: 'South Africa' },
  { code: '+82', country: 'South Korea' },
  { code: '+211', country: 'South Sudan' },
  { code: '+34', country: 'Spain' },
  { code: '+94', country: 'Sri Lanka' },
  { code: '+249', country: 'Sudan' },
  { code: '+597', country: 'Suriname' },
  { code: '+47', country: 'Svalbard and Jan Mayen' },
  { code: '+268', country: 'Eswatini' },
  { code: '+46', country: 'Sweden' },
  { code: '+41', country: 'Switzerland' },
  { code: '+963', country: 'Syria' },
  { code: '+886', country: 'Taiwan' },
  { code: '+992', country: 'Tajikistan' },
  { code: '+255', country: 'Tanzania' },
  { code: '+66', country: 'Thailand' },
  { code: '+670', country: 'Timor-Leste' },
  { code: '+228', country: 'Togo' },
  { code: '+690', country: 'Tokelau' },
  { code: '+676', country: 'Tonga' },
  { code: '+1868', country: 'Trinidad and Tobago' },
  { code: '+216', country: 'Tunisia' },
  { code: '+90', country: 'Turkey' },
  { code: '+993', country: 'Turkmenistan' },
  { code: '+1649', country: 'Turks and Caicos Islands' },
  { code: '+688', country: 'Tuvalu' },
  { code: '+256', country: 'Uganda' },
  { code: '+380', country: 'Ukraine' },
  { code: '+971', country: 'United Arab Emirates' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+1', country: 'United States' },
  { code: '+598', country: 'Uruguay' },
  { code: '+998', country: 'Uzbekistan' },
  { code: '+678', country: 'Vanuatu' },
  { code: '+379', country: 'Vatican City' },
  { code: '+58', country: 'Venezuela' },
  { code: '+84', country: 'Vietnam' },
  { code: '+1284', country: 'British Virgin Islands' },
  { code: '+1340', country: 'U.S. Virgin Islands' },
  { code: '+681', country: 'Wallis and Futuna' },
  { code: '+212', country: 'Western Sahara' },
  { code: '+967', country: 'Yemen' },
  { code: '+260', country: 'Zambia' },
  { code: '+263', country: 'Zimbabwe' },
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
