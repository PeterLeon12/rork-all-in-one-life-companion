import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  User, 
  Save,
  Calendar,
  Ruler,
  Weight,
  Activity,
  Heart
} from 'lucide-react-native';

interface UserProfile {
  name: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  fitnessGoals: string[];
  medicalConditions: string[];
  preferredWorkoutTime: 'morning' | 'afternoon' | 'evening';
  workoutDuration: number; // in minutes
}

const activityLevels = [
  { key: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
  { key: 'light', label: 'Light', description: 'Light exercise 1-3 days/week' },
  { key: 'moderate', label: 'Moderate', description: 'Moderate exercise 3-5 days/week' },
  { key: 'active', label: 'Active', description: 'Hard exercise 6-7 days/week' },
  { key: 'very_active', label: 'Very Active', description: 'Very hard exercise, physical job' }
];

const fitnessGoalOptions = [
  'Weight Loss',
  'Muscle Gain',
  'Endurance',
  'Strength',
  'Flexibility',
  'General Health',
  'Stress Relief',
  'Better Sleep'
];

const workoutTimes = [
  { key: 'morning', label: 'Morning', description: '6:00 AM - 12:00 PM' },
  { key: 'afternoon', label: 'Afternoon', description: '12:00 PM - 6:00 PM' },
  { key: 'evening', label: 'Evening', description: '6:00 PM - 10:00 PM' }
];

export default function ProfileSetupScreen() {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 25,
    height: 170,
    weight: 70,
    gender: 'male',
    activityLevel: 'moderate',
    fitnessGoals: [],
    medicalConditions: [],
    preferredWorkoutTime: 'morning',
    workoutDuration: 30
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const saved = await AsyncStorage.getItem('userProfile');
      if (saved) {
        const parsedProfile = JSON.parse(saved);
        // Ensure all required properties exist with default values
        setProfile({
          name: parsedProfile.name || '',
          age: parsedProfile.age || 25,
          height: parsedProfile.height || 170,
          weight: parsedProfile.weight || 70,
          gender: parsedProfile.gender || 'male',
          activityLevel: parsedProfile.activityLevel || 'moderate',
          fitnessGoals: parsedProfile.fitnessGoals || [],
          medicalConditions: parsedProfile.medicalConditions || [],
          preferredWorkoutTime: parsedProfile.preferredWorkoutTime || 'morning',
          workoutDuration: parsedProfile.workoutDuration || 30
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const saveProfile = async () => {
    if (!profile.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (profile.fitnessGoals.length === 0) {
      Alert.alert('Error', 'Please select at least one fitness goal');
      return;
    }

    setIsLoading(true);
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      Alert.alert(
        'Success', 
        'Profile saved successfully! Your AI fitness plan will be personalized based on this information.',
        [
          {
            text: 'View AI Plan',
            onPress: () => router.push('/ai-fitness-plan')
          },
          {
            text: 'OK',
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFitnessGoal = (goal: string) => {
    setProfile(prev => ({
      ...prev,
      fitnessGoals: prev.fitnessGoals.includes(goal)
        ? prev.fitnessGoals.filter(g => g !== goal)
        : [...prev.fitnessGoals, goal]
    }));
  };

  const calculateBMI = () => {
    if (!profile.height || !profile.weight || profile.height <= 0 || profile.weight <= 0) {
      return '0.0';
    }
    const heightInM = profile.height / 100;
    return (profile.weight / (heightInM * heightInM)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#3498DB' };
    if (bmi < 25) return { category: 'Normal', color: '#27AE60' };
    if (bmi < 30) return { category: 'Overweight', color: '#F39C12' };
    return { category: 'Obese', color: '#E74C3C' };
  };

  const bmi = parseFloat(calculateBMI());
  const bmiInfo = getBMICategory(bmi);

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Profile Setup",
          headerStyle: { backgroundColor: '#FF6B6B' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb', '#f5576c']}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.backgroundOverlay}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
              
              {/* Header */}
              <View style={styles.headerCard}>
                <LinearGradient
                  colors={['#FF6B6B', '#FF8E8E']}
                  style={styles.headerGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <User size={32} color="white" />
                  <Text style={styles.headerTitle}>Personal Profile</Text>
                  <Text style={styles.headerSubtitle}>
                    Help us create your perfect fitness plan
                  </Text>
                </LinearGradient>
              </View>

              {/* Basic Information */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Basic Information</Text>
                
                <View style={styles.inputCard}>
                  <Text style={styles.inputLabel}>Name</Text>
                  <TextInput
                    style={styles.textInput}
                    value={profile.name}
                    onChangeText={(text) => setProfile(prev => ({ ...prev, name: text }))}
                    placeholder="Enter your name"
                    placeholderTextColor="#BDC3C7"
                  />
                </View>

                <View style={styles.rowInputs}>
                  <View style={[styles.inputCard, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.inputLabel}>Age</Text>
                    <TextInput
                      style={styles.textInput}
                      value={profile.age?.toString() || ''}
                      onChangeText={(text) => setProfile(prev => ({ ...prev, age: parseInt(text) || 25 }))}
                      placeholder="25"
                      keyboardType="numeric"
                      placeholderTextColor="#BDC3C7"
                    />
                  </View>
                  
                  <View style={[styles.inputCard, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.inputLabel}>Gender</Text>
                    <View style={styles.genderSelector}>
                      {['male', 'female', 'other'].map((gender) => (
                        <TouchableOpacity
                          key={gender}
                          style={[
                            styles.genderButton,
                            profile.gender === gender && styles.selectedGenderButton
                          ]}
                          onPress={() => setProfile(prev => ({ ...prev, gender: gender as any }))}
                        >
                          <Text style={[
                            styles.genderButtonText,
                            profile.gender === gender && styles.selectedGenderButtonText
                          ]}>
                            {gender.charAt(0).toUpperCase() + gender.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.rowInputs}>
                  <View style={[styles.inputCard, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.inputLabel}>Height (cm)</Text>
                    <View style={styles.inputWithIcon}>
                      <Ruler size={20} color="#7F8C8D" />
                      <TextInput
                        style={styles.textInputWithIcon}
                        value={profile.height?.toString() || ''}
                        onChangeText={(text) => setProfile(prev => ({ ...prev, height: parseInt(text) || 170 }))}
                        placeholder="170"
                        keyboardType="numeric"
                        placeholderTextColor="#BDC3C7"
                      />
                    </View>
                  </View>
                  
                  <View style={[styles.inputCard, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.inputLabel}>Weight (kg)</Text>
                    <View style={styles.inputWithIcon}>
                      <Weight size={20} color="#7F8C8D" />
                      <TextInput
                        style={styles.textInputWithIcon}
                        value={profile.weight?.toString() || ''}
                        onChangeText={(text) => setProfile(prev => ({ ...prev, weight: parseInt(text) || 70 }))}
                        placeholder="70"
                        keyboardType="numeric"
                        placeholderTextColor="#BDC3C7"
                      />
                    </View>
                  </View>
                </View>

                {/* BMI Display */}
                <View style={styles.bmiCard}>
                  <View style={styles.bmiHeader}>
                    <Heart size={20} color={bmiInfo.color} />
                    <Text style={styles.bmiTitle}>BMI: {calculateBMI()}</Text>
                  </View>
                  <Text style={[styles.bmiCategory, { color: bmiInfo.color }]}>
                    {bmiInfo.category}
                  </Text>
                </View>
              </View>

              {/* Activity Level */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Activity Level</Text>
                {activityLevels.map((level) => (
                  <TouchableOpacity
                    key={level.key}
                    style={[
                      styles.optionCard,
                      profile.activityLevel === level.key && styles.selectedOptionCard
                    ]}
                    onPress={() => setProfile(prev => ({ ...prev, activityLevel: level.key as any }))}
                  >
                    <View style={styles.optionContent}>
                      <Text style={[
                        styles.optionTitle,
                        profile.activityLevel === level.key && styles.selectedOptionTitle
                      ]}>
                        {level.label}
                      </Text>
                      <Text style={[
                        styles.optionDescription,
                        profile.activityLevel === level.key && styles.selectedOptionDescription
                      ]}>
                        {level.description}
                      </Text>
                    </View>
                    {profile.activityLevel === level.key && (
                      <Activity size={20} color="#FF6B6B" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Fitness Goals */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Fitness Goals</Text>
                <Text style={styles.sectionSubtitle}>Select all that apply</Text>
                <View style={styles.goalsGrid}>
                  {fitnessGoalOptions.map((goal) => (
                    <TouchableOpacity
                      key={goal}
                      style={[
                        styles.goalChip,
                        profile.fitnessGoals.includes(goal) && styles.selectedGoalChip
                      ]}
                      onPress={() => toggleFitnessGoal(goal)}
                    >
                      <Text style={[
                        styles.goalChipText,
                        profile.fitnessGoals.includes(goal) && styles.selectedGoalChipText
                      ]}>
                        {goal}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Workout Preferences */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Workout Preferences</Text>
                
                <Text style={styles.inputLabel}>Preferred Workout Time</Text>
                {workoutTimes.map((time) => (
                  <TouchableOpacity
                    key={time.key}
                    style={[
                      styles.optionCard,
                      profile.preferredWorkoutTime === time.key && styles.selectedOptionCard
                    ]}
                    onPress={() => setProfile(prev => ({ ...prev, preferredWorkoutTime: time.key as any }))}
                  >
                    <View style={styles.optionContent}>
                      <Text style={[
                        styles.optionTitle,
                        profile.preferredWorkoutTime === time.key && styles.selectedOptionTitle
                      ]}>
                        {time.label}
                      </Text>
                      <Text style={[
                        styles.optionDescription,
                        profile.preferredWorkoutTime === time.key && styles.selectedOptionDescription
                      ]}>
                        {time.description}
                      </Text>
                    </View>
                    {profile.preferredWorkoutTime === time.key && (
                      <Calendar size={20} color="#FF6B6B" />
                    )}
                  </TouchableOpacity>
                ))}

                <View style={styles.inputCard}>
                  <Text style={styles.inputLabel}>Preferred Workout Duration (minutes)</Text>
                  <View style={styles.durationSelector}>
                    {[15, 30, 45, 60, 90].map((duration) => (
                      <TouchableOpacity
                        key={duration}
                        style={[
                          styles.durationButton,
                          profile.workoutDuration === duration && styles.selectedDurationButton
                        ]}
                        onPress={() => setProfile(prev => ({ ...prev, workoutDuration: duration }))}
                      >
                        <Text style={[
                          styles.durationButtonText,
                          profile.workoutDuration === duration && styles.selectedDurationButtonText
                        ]}>
                          {duration}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {/* Save Button */}
              <View style={styles.saveSection}>
                <TouchableOpacity 
                  style={[styles.saveButton, isLoading && styles.disabledButton]}
                  onPress={saveProfile}
                  disabled={isLoading}
                >
                  <Save size={24} color="white" />
                  <Text style={styles.saveButtonText}>
                    {isLoading ? 'Saving...' : 'Save Profile & Generate AI Plan'}
                  </Text>
                </TouchableOpacity>
              </View>
              
            </ScrollView>
          </View>
        </LinearGradient>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  backgroundOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  container: {
    flex: 1,
  },
  headerCard: {
    margin: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 24,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    paddingHorizontal: 24,
    marginBottom: 16,
    marginTop: -8,
  },
  inputCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  textInput: {
    fontSize: 16,
    color: '#2C3E50',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    paddingVertical: 8,
  },
  rowInputs: {
    flexDirection: 'row',
    paddingHorizontal: 24,
  },
  genderSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    marginHorizontal: 2,
    alignItems: 'center',
  },
  selectedGenderButton: {
    backgroundColor: '#FF6B6B',
  },
  genderButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  selectedGenderButtonText: {
    color: 'white',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    paddingVertical: 8,
  },
  textInputWithIcon: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 8,
  },
  bmiCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  bmiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bmiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 8,
  },
  bmiCategory: {
    fontSize: 14,
    fontWeight: '600',
  },
  optionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOptionCard: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  selectedOptionTitle: {
    color: '#FF6B6B',
  },
  optionDescription: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  selectedOptionDescription: {
    color: '#FF6B6B',
    opacity: 0.8,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
  },
  goalChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedGoalChip: {
    backgroundColor: '#FF6B6B',
  },
  goalChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  selectedGoalChipText: {
    color: 'white',
  },
  durationSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 2,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
  },
  selectedDurationButton: {
    backgroundColor: '#FF6B6B',
  },
  durationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  selectedDurationButtonText: {
    color: 'white',
  },
  saveSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});