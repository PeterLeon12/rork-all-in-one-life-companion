import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { 
  Brain, 
  Heart, 
  Sunrise, 
  Moon,
  Play,
  Pause,
  RotateCcw,
  MessageCircle,
  Sparkles
} from 'lucide-react-native';

const mindfulnessStats = [
  { label: 'Current Streak', value: '7 days', color: '#9B59B6' },
  { label: 'Total Minutes', value: '420', color: '#8E44AD' }
];

const quickSessions = [
  {
    title: 'Morning Focus',
    duration: '5 min',
    description: 'Start your day mindfully',
    color: '#E67E22',
    icon: Sunrise
  },
  {
    title: 'Creative Flow',
    duration: '10 min', 
    description: 'Unlock your creative potential',
    color: '#3498DB',
    icon: Sparkles
  },
  {
    title: 'Evening Wind Down',
    duration: '15 min',
    description: 'Prepare for restful sleep',
    color: '#9B59B6',
    icon: Moon
  }
];

const todaysPrompts = [
  "What am I most grateful for in this moment?",
  "What creative idea is calling to me today?",
  "How can I express my authentic self?",
  "What inspires me to create?"
];

const creativeActivities = [
  {
    title: 'Free Writing',
    description: 'Write continuously for 10 minutes without stopping',
    duration: '10 min',
    color: '#E74C3C'
  },
  {
    title: 'Mindful Drawing',
    description: 'Draw what you see or feel in the present moment',
    duration: '15 min',
    color: '#9B59B6'
  },
  {
    title: 'Creative Visualization',
    description: 'Imagine and visualize your next creative project',
    duration: '8 min',
    color: '#3498DB'
  }
];

const todaysPrompt = todaysPrompts[Math.floor(Math.random() * todaysPrompts.length)];

export default function MindfulnessScreen() {
  const [meditationTime, setMeditationTime] = React.useState(5 * 60);
  const [isRunning, setIsRunning] = React.useState(false);
  const [selectedDuration, setSelectedDuration] = React.useState(5);

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && meditationTime > 0) {
      interval = setInterval(() => {
        setMeditationTime(time => time - 1);
      }, 1000);
    } else if (meditationTime === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, meditationTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startMeditation = (duration: number) => {
    setMeditationTime(duration * 60);
    setSelectedDuration(duration);
    setIsRunning(true);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMeditationTime(selectedDuration * 60);
  };

  const renderStatCard = (stat: any, index: number) => {
    return (
      <View key={index} style={styles.statCard}>
        <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
        <Text style={styles.statLabel}>{stat.label}</Text>
      </View>
    );
  };

  const renderQuickSession = (session: any, index: number) => {
    const IconComponent = session.icon;
    const duration = parseInt(session.duration);
    
    return (
      <TouchableOpacity 
        key={index} 
        style={styles.sessionCard} 
        activeOpacity={0.7}
        onPress={() => startMeditation(duration)}
      >
        <View style={[styles.sessionIcon, { backgroundColor: session.color + '20' }]}>
          <IconComponent size={24} color={session.color} />
        </View>
        <View style={styles.sessionContent}>
          <Text style={styles.sessionTitle}>{session.title}</Text>
          <Text style={styles.sessionDescription}>{session.description}</Text>
          <Text style={styles.sessionDuration}>{session.duration}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Mindfulness & Creativity",
          headerStyle: { backgroundColor: '#9B59B6' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={['#9B59B6', '#8E44AD']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Brain size={32} color="white" />
            <Text style={styles.headerTitle}>Mindfulness & Creativity</Text>
            <Text style={styles.headerSubtitle}>7-day meditation streak</Text>
            
            <TouchableOpacity 
              style={styles.aiChatButton}
              onPress={() => router.push('/mindfulness-chat')}
              activeOpacity={0.8}
            >
              <MessageCircle size={18} color="white" />
              <Text style={styles.aiChatButtonText}>Mindfulness Coach</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {mindfulnessStats.map(renderStatCard)}
        </View>

        {/* Meditation Timer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meditation Timer</Text>
          <View style={styles.timerCard}>
            <Text style={styles.timerText}>{formatTime(meditationTime)}</Text>
            <Text style={styles.timerLabel}>Breathe and be present</Text>
            
            <View style={styles.timerControls}>
              <TouchableOpacity 
                style={[styles.timerButton, styles.resetButton]}
                onPress={resetTimer}
              >
                <RotateCcw size={20} color="#666" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.timerButton, styles.playButton]}
                onPress={toggleTimer}
              >
                {isRunning ? (
                  <Pause size={24} color="white" />
                ) : (
                  <Play size={24} color="white" fill="white" />
                )}
              </TouchableOpacity>
              
              <View style={styles.timerButton} />
            </View>
          </View>
        </View>

        {/* Quick Sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Sessions</Text>
          {quickSessions.map(renderQuickSession)}
        </View>

        {/* Daily Reflection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Reflection</Text>
          <View style={styles.reflectionCard}>
            <Sparkles size={24} color="#9B59B6" />
            <Text style={styles.reflectionPrompt}>&ldquo;{todaysPrompt}&rdquo;</Text>
            <Text style={styles.reflectionHint}>Take a moment to reflect</Text>
          </View>
        </View>

        {/* Creative Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Creative Practices</Text>
          {creativeActivities.map((activity, index) => (
            <TouchableOpacity key={index} style={styles.sessionCard} activeOpacity={0.7}>
              <View style={[styles.sessionIcon, { backgroundColor: activity.color + '20' }]}>
                <Sparkles size={24} color={activity.color} />
              </View>
              <View style={styles.sessionContent}>
                <Text style={styles.sessionTitle}>{activity.title}</Text>
                <Text style={styles.sessionDescription}>{activity.description}</Text>
                <Text style={styles.sessionDuration}>{activity.duration}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mindful Quote */}
        <View style={styles.section}>
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>
              &ldquo;Creativity takes courage. The mind that opens to a new idea never returns to its original size.&rdquo;
            </Text>
            <Text style={styles.quoteAuthor}>— Henri Matisse</Text>
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
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 24,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
    marginTop: 4,
  },
  aiChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 16,
  },
  aiChatButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
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
  timerCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '300',
    color: '#2C3E50',
    marginBottom: 8,
  },
  timerLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 24,
  },
  timerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  timerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#9B59B6',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  resetButton: {
    backgroundColor: '#F5F5F5',
  },
  sessionCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sessionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sessionContent: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  sessionDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  sessionDuration: {
    fontSize: 12,
    color: '#9B59B6',
    fontWeight: '500',
  },
  reflectionCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  reflectionPrompt: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#2C3E50',
    textAlign: 'center',
    lineHeight: 24,
    marginVertical: 16,
  },
  reflectionHint: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  quoteCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
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
});