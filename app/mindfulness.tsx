import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { 
  Brain, 
  Heart, 
  Sunrise, 
  Moon,
  BookOpen,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Timer,
  Award,
  TrendingUp,
  MessageCircle
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const mindfulnessMetrics = [
  { label: 'Meditation Streak', value: '21 days', icon: Brain, color: '#74B9FF' },
  { label: 'Total Sessions', value: '156', icon: Timer, color: '#0984E3' },
  { label: 'Mindful Minutes', value: '2,340', icon: Heart, color: '#6C5CE7' },
  { label: 'Gratitude Entries', value: '45', icon: Sparkles, color: '#A29BFE' }
];

const meditationSessions = [
  {
    title: 'Morning Mindfulness',
    duration: '10 min',
    type: 'Guided',
    difficulty: 'Beginner',
    description: 'Start your day with clarity and intention',
    color: '#74B9FF',
    icon: Sunrise
  },
  {
    title: 'Stress Relief',
    duration: '15 min',
    type: 'Breathing',
    difficulty: 'Intermediate',
    description: 'Release tension and find calm',
    color: '#0984E3',
    icon: Heart
  },
  {
    title: 'Sleep Meditation',
    duration: '20 min',
    type: 'Body Scan',
    difficulty: 'Beginner',
    description: 'Prepare for restful sleep',
    color: '#6C5CE7',
    icon: Moon
  },
  {
    title: 'Gratitude Practice',
    duration: '8 min',
    type: 'Reflection',
    difficulty: 'All Levels',
    description: 'Cultivate appreciation and joy',
    color: '#A29BFE',
    icon: Sparkles
  }
];

const journalPrompts = [
  "What am I most grateful for today?",
  "How did I show kindness to myself or others?",
  "What challenged me today and how did I grow?",
  "What brought me joy in this moment?",
  "How can I be more present tomorrow?"
];

const achievements = [
  { title: '7-Day Streak', description: 'Meditated for a week straight', earned: true, icon: '🔥' },
  { title: 'Mindful Morning', description: 'Completed 10 morning sessions', earned: true, icon: '🌅' },
  { title: 'Gratitude Master', description: 'Wrote 30 gratitude entries', earned: false, icon: '🙏' },
  { title: 'Zen Master', description: 'Meditated for 100 hours total', earned: false, icon: '🧘' }
];

export default function MindfulnessScreen() {
  const [meditationTime, setMeditationTime] = React.useState(10 * 60); // 10 minutes
  const [isRunning, setIsRunning] = React.useState(false);
  const [currentPrompt, setCurrentPrompt] = React.useState(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMetricCard = (metric: any, index: number) => {
    const IconComponent = metric.icon;
    
    return (
      <View key={index} style={styles.metricCard}>
        <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
          <IconComponent size={20} color={metric.color} />
        </View>
        <Text style={styles.metricValue}>{metric.value}</Text>
        <Text style={styles.metricLabel}>{metric.label}</Text>
      </View>
    );
  };

  const renderMeditationSession = (session: any, index: number) => {
    const IconComponent = session.icon;
    
    return (
      <TouchableOpacity key={index} style={styles.sessionCard} activeOpacity={0.8}>
        <LinearGradient
          colors={[session.color, session.color + 'CC']}
          style={styles.sessionGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.sessionHeader}>
            <IconComponent size={24} color="white" />
            <View style={styles.sessionMeta}>
              <Text style={styles.sessionDuration}>{session.duration}</Text>
              <Text style={styles.sessionType}>{session.type}</Text>
            </View>
          </View>
          <Text style={styles.sessionTitle}>{session.title}</Text>
          <Text style={styles.sessionDescription}>{session.description}</Text>
          <View style={styles.sessionFooter}>
            <Text style={styles.sessionDifficulty}>{session.difficulty}</Text>
            <View style={styles.playButton}>
              <Play size={16} color="white" fill="white" />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderAchievement = (achievement: any, index: number) => {
    return (
      <View key={index} style={[styles.achievementCard, !achievement.earned && styles.lockedAchievement]}>
        <Text style={styles.achievementIcon}>{achievement.icon}</Text>
        <View style={styles.achievementContent}>
          <Text style={[styles.achievementTitle, !achievement.earned && styles.lockedText]}>
            {achievement.title}
          </Text>
          <Text style={[styles.achievementDescription, !achievement.earned && styles.lockedText]}>
            {achievement.description}
          </Text>
        </View>
        {achievement.earned && (
          <View style={styles.earnedBadge}>
            <Award size={16} color="#FFD93D" />
          </View>
        )}
      </View>
    );
  };

  const nextPrompt = () => {
    setCurrentPrompt((prev) => (prev + 1) % journalPrompts.length);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Mindfulness & Spirit",
          headerStyle: { backgroundColor: '#74B9FF' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Stats */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={['#74B9FF', '#0984E3']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <Brain size={32} color="white" />
              <Text style={styles.headerTitle}>Mindfulness Level</Text>
              <Text style={styles.headerScore}>Zen Master</Text>
              <Text style={styles.headerSubtitle}>21-day meditation streak</Text>
              
              <TouchableOpacity 
                style={styles.aiChatButton}
                onPress={() => router.push('/mindfulness-chat')}
                activeOpacity={0.8}
              >
                <MessageCircle size={20} color="white" />
                <Text style={styles.aiChatButtonText}>Chat with AI Mindfulness Coach</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Meditation Timer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meditation Timer</Text>
          <View style={styles.timerCard}>
            <View style={styles.timerDisplay}>
              <Text style={styles.timerText}>{formatTime(meditationTime)}</Text>
              <Text style={styles.timerLabel}>Mindful Breathing</Text>
            </View>
            <View style={styles.timerControls}>
              <TouchableOpacity 
                style={[styles.timerButton, { backgroundColor: '#74B9FF' }]}
                onPress={() => setIsRunning(!isRunning)}
              >
                {isRunning ? (
                  <Pause size={24} color="white" />
                ) : (
                  <Play size={24} color="white" fill="white" />
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.timerButton, { backgroundColor: '#6C5CE7' }]}
                onPress={() => {
                  setIsRunning(false);
                  setMeditationTime(10 * 60);
                }}
              >
                <RotateCcw size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Mindfulness Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Journey</Text>
          <View style={styles.metricsGrid}>
            {mindfulnessMetrics.map(renderMetricCard)}
          </View>
        </View>

        {/* Meditation Sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guided Sessions</Text>
          <View style={styles.sessionsGrid}>
            {meditationSessions.map(renderMeditationSession)}
          </View>
        </View>

        {/* Journal Prompt */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Reflection</Text>
          <View style={styles.journalCard}>
            <BookOpen size={24} color="#6C5CE7" />
            <Text style={styles.journalPrompt}>"{journalPrompts[currentPrompt]}"</Text>
            <TouchableOpacity style={styles.nextPromptButton} onPress={nextPrompt}>
              <Text style={styles.nextPromptText}>New Prompt</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {achievements.map(renderAchievement)}
        </View>

        {/* Weekly Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week's Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <TrendingUp size={24} color="#74B9FF" />
              <Text style={styles.progressTitle}>Mindfulness Growth</Text>
            </View>
            <Text style={styles.progressText}>
              Outstanding week! You meditated 6 out of 7 days and wrote 5 gratitude entries. Your average session length increased to 12 minutes.
            </Text>
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>6/7</Text>
                <Text style={styles.progressStatLabel}>Days Meditated</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>12m</Text>
                <Text style={styles.progressStatLabel}>Avg Session</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>5</Text>
                <Text style={styles.progressStatLabel}>Journal Entries</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Mindful Quote */}
        <View style={styles.section}>
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>
              "The present moment is the only time over which we have dominion."
            </Text>
            <Text style={styles.quoteAuthor}>— Thích Nhất Hạnh</Text>
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
    fontSize: 28,
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
  timerCard: {
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
  timerDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  timerLabel: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  timerControls: {
    flexDirection: 'row',
    gap: 16,
  },
  timerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
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
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  sessionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  sessionCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sessionGradient: {
    padding: 16,
    height: 160,
    justifyContent: 'space-between',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionMeta: {
    alignItems: 'flex-end',
  },
  sessionDuration: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sessionType: {
    color: 'white',
    fontSize: 10,
    opacity: 0.8,
  },
  sessionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sessionDescription: {
    color: 'white',
    fontSize: 12,
    opacity: 0.9,
    lineHeight: 16,
  },
  sessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionDifficulty: {
    color: 'white',
    fontSize: 10,
    opacity: 0.8,
  },
  playButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  journalCard: {
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
  journalPrompt: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#2C3E50',
    textAlign: 'center',
    lineHeight: 26,
    marginVertical: 20,
  },
  nextPromptButton: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  nextPromptText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  achievementCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lockedAchievement: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 18,
  },
  lockedText: {
    color: '#BDC3C7',
  },
  earnedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFD93D20',
    justifyContent: 'center',
    alignItems: 'center',
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
  quoteCard: {
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
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#2C3E50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  aiChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 16,
  },
  aiChatButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});