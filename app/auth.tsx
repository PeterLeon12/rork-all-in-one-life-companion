import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, User, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import { router } from 'expo-router';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { signIn } = useUser();

  const handleAuth = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email to continue.');
      return;
    }

    // Validate email format for both login and signup
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    
    if (!isLogin && !name.trim()) {
      Alert.alert('Name Required', 'Please enter your name to continue.');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Password Required', 'Please enter your password.');
      return;
    }

    if (!isLogin) {
      if (password.length < 6) {
        Alert.alert('Password Too Short', 'Password must be at least 6 characters long.');
        return;
      }
      
      if (password !== confirmPassword) {
        Alert.alert('Passwords Don&apos;t Match', 'Please make sure both passwords are identical.');
        return;
      }
    }

    setIsLoading(true);
    
    try {
      const result = await signIn(name.trim(), email.trim(), password, isLogin);
      
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        // More specific error messages
        let errorTitle = 'Authentication Failed';
        let errorMessage = result.message;
        
        if (result.message.includes('Invalid email or password')) {
          errorTitle = isLogin ? 'Login Failed' : 'Registration Failed';
          errorMessage = isLogin 
            ? 'The email or password you entered is incorrect. Please try again.'
            : 'There was an issue creating your account. Please check your information and try again.';
        } else if (result.message.includes('User with this email already exists')) {
          errorTitle = 'Account Already Exists';
          errorMessage = 'An account with this email already exists. Please try logging in instead.';
        } else if (result.message.includes('Invalid email address')) {
          errorTitle = 'Invalid Email';
          errorMessage = 'Please enter a valid email address.';
        }
        
        Alert.alert(errorTitle, errorMessage);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      Alert.alert('Connection Error', 'Unable to connect to the server. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    // Clear fields when switching modes
    setEmail('');
    setName('');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView 
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Sparkles size={48} color="white" />
              </View>
              <Text style={styles.title}>
                {isLogin ? 'Welcome Back' : 'Welcome to Life Mastery'}
              </Text>
              <Text style={styles.subtitle}>
                {isLogin 
                  ? 'Sign in to continue your growth journey'
                  : 'Your journey to interconnected growth starts here. Track your progress across all areas of life and discover how they strengthen each other.'
                }
              </Text>
            </View>

            <View style={styles.form}>
              {!isLogin && (
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <User size={20} color="#667eea" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Your name"
                    placeholderTextColor="rgba(102, 126, 234, 0.6)"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              )}

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Mail size={20} color="#667eea" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Your email"
                  placeholderTextColor="rgba(102, 126, 234, 0.6)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Lock size={20} color="#667eea" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder={isLogin ? "Your password" : "Create a password"}
                  placeholderTextColor="rgba(102, 126, 234, 0.6)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#667eea" />
                  ) : (
                    <Eye size={20} color="#667eea" />
                  )}
                </TouchableOpacity>
              </View>

              {!isLogin && (
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <Lock size={20} color="#667eea" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    placeholderTextColor="rgba(102, 126, 234, 0.6)"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color="#667eea" />
                    ) : (
                      <Eye size={20} color="#667eea" />
                    )}
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleAuth}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.buttonText}>
                    {isLoading 
                      ? (isLogin ? 'Signing In...' : 'Creating Account...') 
                      : (isLogin ? 'Sign In' : 'Start Your Journey')
                    }
                  </Text>
                  {!isLoading && <ArrowRight size={20} color="white" />}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.switchButton}
                onPress={toggleAuthMode}
                disabled={isLoading}
              >
                <Text style={styles.switchText}>
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"
                  }
                </Text>
              </TouchableOpacity>
            </View>

            {!isLogin && (
              <View style={styles.features}>
                <Text style={styles.featuresTitle}>What you&apos;ll discover:</Text>
                <View style={styles.featuresList}>
                  <Text style={styles.featureItem}>🎯 Track progress across 14 life areas</Text>
                  <Text style={styles.featureItem}>🔗 See how your actions interconnect</Text>
                  <Text style={styles.featureItem}>🏆 Unlock achievements as you grow</Text>
                  <Text style={styles.featureItem}>📈 Get personalized insights daily</Text>
                  <Text style={styles.featureItem}>☁️ Sync across all your devices</Text>
                </View>
                
                <View style={styles.privacyInfo}>
                  <Text style={styles.privacyTitle}>🔒 Your Data Privacy</Text>
                  <Text style={styles.privacyText}>
                    Your account data is securely stored and encrypted. Only you have access to your personal progress and achievements.
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#2C3E50',
  },
  eyeIcon: {
    padding: 4,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  switchButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '500',
  },
  features: {
    alignItems: 'center',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  featuresList: {
    alignItems: 'flex-start',
  },
  featureItem: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    lineHeight: 20,
  },
  privacyInfo: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 18,
  },
});