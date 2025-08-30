import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { 
  Shield, 
  Users,
  Award,
  CheckCircle,
  MessageSquare,
  ChevronRight,
  Sparkles
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const confidenceAreas = [
  { label: 'Self-Worth', value: 78, icon: Shield, color: '#FFD93D' },
  { label: 'Social Confidence', value: 71, icon: Users, color: '#4ECDC4' },
  { label: 'Achievement Pride', value: 89, icon: Award, color: '#6C5CE7' }
];

const todaysChallenges = [
  {
    id: 1,
    title: 'Practice Self-Compassion',
    description: 'Speak to yourself as you would a good friend',
    completed: false,
    points: 15
  },
  {
    id: 2,
    title: 'Make Eye Contact',
    description: 'Maintain eye contact during one conversation',
    completed: true,
    points: 10
  },
  {
    id: 3,
    title: 'Celebrate a Win',
    description: 'Acknowledge one accomplishment from today',
    completed: false,
    points: 12
  }
];

const affirmations = [
  'I am worthy of love and respect',
  'My unique qualities make me valuable',
  'I trust my abilities and judgment',
  'I deserve success and happiness',
  'I am growing stronger every day'
];

export default function ConfidenceScreen() {
  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  const [challenges, setChallenges] = useState(todaysChallenges);

  const renderAreaCard = (area: any, index: number) => {
    const IconComponent = area.icon;
    
    return (
      <View key={index} style={styles.areaCard}>
        <View style={[styles.areaIcon, { backgroundColor: area.color + '20' }]}>
          <IconComponent size={24} color={area.color} />
        </View>
        <Text style={styles.areaLabel}>{area.label}</Text>
        <Text style={styles.areaValue}>{area.value}%</Text>
      </View>
    );
  };

  const handleChallengeToggle = (challengeId: number) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, completed: !challenge.completed }
          : challenge
      )
    );
  };

  const renderChallenge = (challenge: any, index: number) => {
    return (
      <TouchableOpacity 
        key={index} 
        style={styles.challengeCard}
        onPress={() => handleChallengeToggle(challenge.id)}
        activeOpacity={0.7}
      >
        <View style={styles.challengeContent}>
          <View style={styles.challengeInfo}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.challengeDescription}>{challenge.description}</Text>
            <Text style={styles.challengePoints}>+{challenge.points} points</Text>
          </View>
          <View style={[
            styles.challengeButton,
            { backgroundColor: challenge.completed ? '#27AE60' : '#E9ECEF' }
          ]}>
            {challenge.completed && (
              <CheckCircle size={20} color="white" />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };



  const nextAffirmation = () => {
    setCurrentAffirmation((prev) => (prev + 1) % affirmations.length);
  };

  const completedChallenges = challenges.filter(c => c.completed).length;
  const totalPoints = challenges.filter(c => c.completed).reduce((sum, c) => sum + c.points, 0);

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Confidence & Security",
          headerStyle: { backgroundColor: '#FFD93D' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={['#FFD93D', '#FF9F43']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <Shield size={28} color="white" />
              <Text style={styles.headerTitle}>Confidence</Text>
              <Text style={styles.headerScore}>Level 8</Text>
              <Text style={styles.headerSubtitle}>{completedChallenges}/3 challenges • {totalPoints} points today</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Daily Affirmation */}
        <View style={styles.section}>
          <View style={styles.affirmationCard}>
            <Sparkles size={20} color="#FFD93D" style={styles.affirmationIcon} />
            <Text style={styles.affirmationText}>&ldquo;{affirmations[currentAffirmation]}&rdquo;</Text>
            <TouchableOpacity style={styles.nextButton} onPress={nextAffirmation}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Confidence Areas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.areasGrid}>
            {confidenceAreas.map(renderAreaCard)}
          </View>
        </View>

        {/* Today's Challenges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Challenges</Text>
          {challenges.map(renderChallenge)}
        </View>

        {/* AI Coach */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.coachCard}
            onPress={() => router.push('/confidence-chat')}
            activeOpacity={0.8}
          >
            <View style={styles.coachContent}>
              <View style={styles.coachIcon}>
                <MessageSquare size={24} color="#FFD93D" />
              </View>
              <View style={styles.coachInfo}>
                <Text style={styles.coachTitle}>Talk to Sam</Text>
                <Text style={styles.coachDescription}>Your confidence coach is here to help</Text>
              </View>
              <ChevronRight size={20} color="#BDC3C7" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerCard: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 24,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 8,
  },
  headerScore: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 4,
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  affirmationCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  affirmationIcon: {
    marginBottom: 12,
  },
  affirmationText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#2C3E50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  nextButton: {
    backgroundColor: '#FFD93D',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  areasGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  areaCard: {
    backgroundColor: 'white',
    width: (width - 56) / 3,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  areaIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  areaLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 4,
    textAlign: 'center',
  },
  areaValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  challengeCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  challengeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  challengeInfo: {
    flex: 1,
    marginRight: 12,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 4,
  },
  challengePoints: {
    fontSize: 12,
    color: '#FFD93D',
    fontWeight: '600',
  },
  challengeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coachCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  coachContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  coachIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD93D20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  coachInfo: {
    flex: 1,
  },
  coachTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  coachDescription: {
    fontSize: 14,
    color: '#7F8C8D',
  },
});