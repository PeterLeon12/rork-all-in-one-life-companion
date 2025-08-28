import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { 
  Shield, 
  Star, 
  Zap, 
  Eye,
  Users,
  Award,
  Target,
  TrendingUp,
  CheckCircle,
  Play,
  BookOpen,
  MessageSquare
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const confidenceMetrics = [
  { label: 'Self-Confidence', value: '78%', change: '+12%', icon: Shield, color: '#FFD93D' },
  { label: 'Body Image', value: '82%', change: '+8%', icon: Eye, color: '#FF6B6B' },
  { label: 'Social Comfort', value: '71%', change: '+15%', icon: Users, color: '#4ECDC4' },
  { label: 'Achievement Pride', value: '89%', change: '+5%', icon: Award, color: '#6C5CE7' }
];

const quickActions = [
  { title: 'Daily Affirmations', icon: Star, color: '#FFD93D', description: 'Boost self-worth' },
  { title: 'Power Pose', icon: Zap, color: '#FF6B6B', description: '2-min confidence' },
  { title: 'Achievement Log', icon: Award, color: '#4ECDC4', description: 'Record wins' },
  { title: 'Social Challenge', icon: Users, color: '#6C5CE7', description: 'Step out comfort zone' }
];

const confidencePrograms = [
  {
    title: 'Impostor Syndrome Recovery',
    description: 'Overcome self-doubt and recognize your true worth',
    progress: 56,
    sessions: '8/14 sessions',
    color: '#FFD93D'
  },
  {
    title: 'Body Positivity Journey',
    description: 'Build a healthy relationship with your body image',
    progress: 73,
    activities: '11/15 activities',
    color: '#FF6B6B'
  },
  {
    title: 'Social Anxiety Mastery',
    description: 'Develop confidence in social situations',
    progress: 41,
    exercises: '6/16 exercises',
    color: '#4ECDC4'
  }
];

const dailyChallenges = [
  {
    title: 'Compliment Yourself',
    description: 'Give yourself 3 genuine compliments',
    completed: true,
    points: 10,
    category: 'Self-Love'
  },
  {
    title: 'Make Eye Contact',
    description: 'Maintain eye contact during conversations',
    completed: false,
    points: 15,
    category: 'Social Skills'
  },
  {
    title: 'Celebrate Small Win',
    description: 'Acknowledge one accomplishment today',
    completed: true,
    points: 12,
    category: 'Achievement'
  },
  {
    title: 'Positive Self-Talk',
    description: 'Replace negative thoughts with positive ones',
    completed: false,
    points: 18,
    category: 'Mindset'
  }
];

const affirmations = [
  "I am worthy of love and respect",
  "My unique qualities make me special",
  "I trust my abilities and judgment",
  "I deserve success and happiness",
  "I am confident in who I am becoming"
];

export default function ConfidenceScreen() {
  const [currentAffirmation, setCurrentAffirmation] = React.useState(0);

  const renderMetricCard = (metric: any, index: number) => {
    const IconComponent = metric.icon;
    
    return (
      <View key={index} style={styles.metricCard}>
        <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
          <IconComponent size={20} color={metric.color} />
        </View>
        <Text style={styles.metricLabel}>{metric.label}</Text>
        <Text style={styles.metricValue}>{metric.value}</Text>
        <Text style={styles.metricChange}>{metric.change} this month</Text>
      </View>
    );
  };

  const renderQuickAction = (action: any, index: number) => {
    const IconComponent = action.icon;
    
    return (
      <TouchableOpacity key={index} style={styles.quickActionCard} activeOpacity={0.8}>
        <LinearGradient
          colors={[action.color, action.color + 'CC']}
          style={styles.quickActionGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <IconComponent size={24} color="white" />
          <Text style={styles.quickActionTitle}>{action.title}</Text>
          <Text style={styles.quickActionDescription}>{action.description}</Text>
          <View style={styles.playButton}>
            <Play size={16} color="white" fill="white" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderProgram = (program: any, index: number) => {
    const progressWidth = (width - 72) * (program.progress / 100);
    
    return (
      <View key={index} style={styles.programCard}>
        <View style={styles.programHeader}>
          <View style={styles.programInfo}>
            <Text style={styles.programTitle}>{program.title}</Text>
            <Text style={styles.programDescription}>{program.description}</Text>
            <View style={styles.programDetails}>
              {program.sessions && (
                <Text style={styles.programDetail}>{program.sessions}</Text>
              )}
              {program.activities && (
                <Text style={styles.programDetail}>{program.activities}</Text>
              )}
              {program.exercises && (
                <Text style={styles.programDetail}>{program.exercises}</Text>
              )}
            </View>
          </View>
          <View style={styles.programProgress}>
            <Text style={styles.progressPercentage}>{program.progress}%</Text>
          </View>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: progressWidth, backgroundColor: program.color }
              ]} 
            />
          </View>
        </View>
      </View>
    );
  };

  const renderChallenge = (challenge: any, index: number) => {
    return (
      <View key={index} style={styles.challengeCard}>
        <View style={styles.challengeHeader}>
          <View style={styles.challengeInfo}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.challengeDescription}>{challenge.description}</Text>
            <Text style={styles.challengeCategory}>{challenge.category} • {challenge.points} points</Text>
          </View>
          <TouchableOpacity 
            style={[
              styles.challengeButton,
              { backgroundColor: challenge.completed ? '#27AE60' : '#667eea' }
            ]}
          >
            {challenge.completed ? (
              <CheckCircle size={20} color="white" />
            ) : (
              <Target size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const nextAffirmation = () => {
    setCurrentAffirmation((prev) => (prev + 1) % affirmations.length);
  };

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
        {/* Header Stats */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={['#FFD93D', '#FF9F43']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <Shield size={32} color="white" />
              <Text style={styles.headerTitle}>Confidence Level</Text>
              <Text style={styles.headerScore}>80/100</Text>
              <Text style={styles.headerSubtitle}>You're growing stronger every day</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Daily Affirmation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Affirmation</Text>
          <View style={styles.affirmationCard}>
            <Text style={styles.affirmationText}>"{affirmations[currentAffirmation]}"</Text>
            <TouchableOpacity style={styles.nextButton} onPress={nextAffirmation}>
              <Text style={styles.nextButtonText}>Next Affirmation</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Confidence Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Confidence Areas</Text>
          <View style={styles.metricsGrid}>
            {confidenceMetrics.map(renderMetricCard)}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Confidence Boosters</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Daily Challenges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Challenges</Text>
          {dailyChallenges.map(renderChallenge)}
        </View>

        {/* Active Programs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Growth Programs</Text>
          {confidencePrograms.map(renderProgram)}
        </View>

        {/* Weekly Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week's Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <TrendingUp size={24} color="#FFD93D" />
              <Text style={styles.progressTitle}>Confidence Growth</Text>
            </View>
            <Text style={styles.progressText}>
              You've completed 18 confidence-building activities this week. Your self-assurance is noticeably improving!
            </Text>
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>18</Text>
                <Text style={styles.progressStatLabel}>Activities Done</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>+22%</Text>
                <Text style={styles.progressStatLabel}>Confidence Boost</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>7</Text>
                <Text style={styles.progressStatLabel}>Day Streak</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Helpful Resources</Text>
          <View style={styles.resourcesContainer}>
            <TouchableOpacity style={styles.resourceCard}>
              <BookOpen size={24} color="#667eea" />
              <Text style={styles.resourceTitle}>Confidence Library</Text>
              <Text style={styles.resourceDescription}>Articles and guides</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resourceCard}>
              <MessageSquare size={24} color="#667eea" />
              <Text style={styles.resourceTitle}>Support Community</Text>
              <Text style={styles.resourceDescription}>Connect with others</Text>
            </TouchableOpacity>
          </View>
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
    margin: 24,
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
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  headerScore: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 8,
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
    marginTop: 4,
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
  affirmationCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  affirmationText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#2C3E50',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: '#FFD93D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: 'white',
    width: (width - 60) / 2,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  metricIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 4,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  metricChange: {
    fontSize: 10,
    color: '#27AE60',
    textAlign: 'center',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 60) / 2,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickActionGradient: {
    padding: 20,
    height: 120,
    justifyContent: 'space-between',
  },
  quickActionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  quickActionDescription: {
    color: 'white',
    fontSize: 12,
    opacity: 0.9,
  },
  playButton: {
    alignSelf: 'flex-end',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  challengeCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeInfo: {
    flex: 1,
    marginRight: 16,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 8,
  },
  challengeCategory: {
    fontSize: 12,
    color: '#95A5A6',
  },
  challengeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  programCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  programInfo: {
    flex: 1,
    marginRight: 16,
  },
  programTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  programDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 8,
  },
  programDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  programDetail: {
    fontSize: 12,
    color: '#95A5A6',
  },
  programProgress: {
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 12,
  },
  progressText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 20,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  progressStatLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
    textAlign: 'center',
  },
  resourcesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  resourceCard: {
    backgroundColor: 'white',
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  resourceDescription: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
  },
});