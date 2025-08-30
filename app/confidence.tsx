import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { 
  Shield, 
  Users,
  Award,
  CheckCircle,
  MessageSquare,
  ChevronRight,
  Sparkles,
  Target,
  TrendingUp,
  Calendar
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const confidenceAreas = [
  { label: 'Self-Worth', value: 78, icon: Shield, color: '#FFD93D', trend: '+5%' },
  { label: 'Social Skills', value: 71, icon: Users, color: '#4ECDC4', trend: '+12%' },
  { label: 'Achievements', value: 89, icon: Award, color: '#6C5CE7', trend: '+3%' }
];

const initialChallenges = [
  {
    id: 1,
    title: 'Practice Self-Compassion',
    description: 'Speak to yourself as you would a good friend',
    completed: false,
    points: 15,
    category: 'mindset'
  },
  {
    id: 2,
    title: 'Make Eye Contact',
    description: 'Maintain eye contact during one conversation',
    completed: false,
    points: 10,
    category: 'social'
  },
  {
    id: 3,
    title: 'Celebrate a Win',
    description: 'Acknowledge one accomplishment from today',
    completed: false,
    points: 12,
    category: 'achievement'
  },
  {
    id: 4,
    title: 'Power Posture',
    description: 'Stand tall for 2 minutes before an important moment',
    completed: false,
    points: 8,
    category: 'body'
  },
  {
    id: 5,
    title: 'Break a Bad Habit',
    description: 'Identify and avoid one limiting habit today',
    completed: false,
    points: 20,
    category: 'freedom'
  },
  {
    id: 6,
    title: 'Face a Fear',
    description: 'Do something that makes you slightly uncomfortable',
    completed: false,
    points: 25,
    category: 'courage'
  }
];

const affirmations = [
  'I am worthy of love and respect',
  'My unique qualities make me valuable', 
  'I trust my abilities and judgment',
  'I deserve success and happiness',
  'I am growing stronger every day',
  'I choose courage over comfort',
  'My voice matters and deserves to be heard',
  'I embrace challenges as opportunities to grow'
];

const confidenceTips = [
  {
    title: 'Body Language',
    tip: 'Stand tall, shoulders back. Your posture affects how you feel.',
    icon: Target
  },
  {
    title: 'Small Wins',
    tip: 'Celebrate every achievement, no matter how small.',
    icon: Award
  },
  {
    title: 'Break Free',
    tip: 'Identify limiting habits and replace them with empowering ones.',
    icon: Shield
  },
  {
    title: 'Face Fears',
    tip: 'Take one small step outside your comfort zone daily.',
    icon: TrendingUp
  }
];

export default function ConfidenceScreen() {
  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  const [challenges, setChallenges] = useState(initialChallenges);
  const [currentTip, setCurrentTip] = useState(0);
  const [streak, setStreak] = useState(7);

  const renderAreaCard = (area: any, index: number) => {
    const IconComponent = area.icon;
    
    return (
      <TouchableOpacity key={index} style={styles.areaCard} activeOpacity={0.7}>
        <View style={[styles.areaIcon, { backgroundColor: area.color + '20' }]}>
          <IconComponent size={20} color={area.color} />
        </View>
        <Text style={styles.areaLabel}>{area.label}</Text>
        <Text style={styles.areaValue}>{area.value}%</Text>
        <View style={styles.trendContainer}>
          <TrendingUp size={12} color={area.color} />
          <Text style={[styles.trendText, { color: area.color }]}>{area.trend}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleChallengeToggle = (challengeId: number) => {
    setChallenges(prev => {
      const updated = prev.map(challenge => {
        if (challenge.id === challengeId && !challenge.completed) {
          Alert.alert(
            'Great Job! 🎉',
            `You earned ${challenge.points} confidence points!`,
            [{ text: 'Continue', style: 'default' }]
          );
          return { ...challenge, completed: true };
        }
        return challenge;
      });
      return updated;
    });
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

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % confidenceTips.length);
  };

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % confidenceTips.length);
    }, 8000);
    
    return () => clearInterval(tipInterval);
  }, []);

  const completedChallenges = challenges.filter(c => c.completed).length;
  const totalPoints = challenges.filter(c => c.completed).reduce((sum, c) => sum + c.points, 0);

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Confidence & Freedom",
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
              <Shield size={32} color="white" />
              <Text style={styles.headerTitle}>Confidence & Freedom</Text>
              <Text style={styles.headerScore}>Level 8</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Calendar size={16} color="white" />
                  <Text style={styles.statText}>{streak} day streak</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Target size={16} color="white" />
                  <Text style={styles.statText}>{completedChallenges}/{challenges.length} today</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Daily Affirmation & Tip */}
        <View style={styles.section}>
          <View style={styles.affirmationCard}>
            <Sparkles size={20} color="#FFD93D" style={styles.affirmationIcon} />
            <Text style={styles.affirmationText}>&ldquo;{affirmations[currentAffirmation]}&rdquo;</Text>
            <TouchableOpacity style={styles.nextButton} onPress={nextAffirmation}>
              <Text style={styles.nextButtonText}>Next Affirmation</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              {React.createElement(confidenceTips[currentTip].icon, { size: 18, color: '#6C5CE7' })}
              <Text style={styles.tipTitle}>{confidenceTips[currentTip].title}</Text>
            </View>
            <Text style={styles.tipText}>{confidenceTips[currentTip].tip}</Text>
          </View>
        </View>

        {/* Confidence Areas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress Overview</Text>
          <View style={styles.areasGrid}>
            {confidenceAreas.map(renderAreaCard)}
          </View>
        </View>

        {/* Today's Challenges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Challenges</Text>
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
                <Text style={styles.coachTitle}>Confidence Coach</Text>
                <Text style={styles.coachDescription}>Get personalized guidance and support</Text>
              </View>
              <ChevronRight size={20} color="#BDC3C7" />
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={{ height: 20 }} />
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
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: 'white',
    fontSize: 13,
    opacity: 0.9,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'white',
    opacity: 0.3,
    marginHorizontal: 12,
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
    fontSize: 13,
    fontWeight: '600',
  },
  tipCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
  },
  tipText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  areasGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  areaCard: {
    backgroundColor: 'white',
    width: (width - 56) / 3,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  areaIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  areaLabel: {
    fontSize: 11,
    color: '#7F8C8D',
    marginBottom: 2,
    textAlign: 'center',
  },
  areaValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '600',
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