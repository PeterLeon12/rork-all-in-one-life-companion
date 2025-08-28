import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { 
  Heart, 
  Activity, 
  Brain, 
  Moon, 
  Droplets,
  TrendingUp,
  Plus,
  Play,
  MessageCircle,
  Shield,
  Dumbbell,
  Target
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const healthMetrics = [
  { label: 'Steps Today', value: '8,432', target: '10,000', icon: Activity, color: '#FF6B6B', progress: 84 },
  { label: 'Water Intake', value: '6 glasses', target: '8 glasses', icon: Droplets, color: '#4ECDC4', progress: 75 },
  { label: 'Sleep Hours', value: '7.5h', target: '8h', icon: Moon, color: '#6C5CE7', progress: 94 },
  { label: 'Meditation', value: '15 min', target: '20 min', icon: Brain, color: '#FFD93D', progress: 75 }
];

const quickActions = [
  { title: 'Start Workout', icon: Activity, color: '#FF6B6B', description: '30 min HIIT', route: '/fitness' },
  { title: 'Meditate', icon: Brain, color: '#6C5CE7', description: 'Guided session' },
  { title: 'Log Mood', icon: Heart, color: '#FFD93D', description: 'Track feelings' },
  { title: 'Break Free', icon: Shield, color: '#E74C3C', description: 'Freedom journey', route: '/break-free' },
  { title: 'Fitness Coach', icon: Dumbbell, color: '#FF7675', description: 'AI trainer', route: '/fitness-chat' },
  { title: 'Sports Training', icon: Target, color: '#74B9FF', description: 'Skill building', route: '/fitness' }
];

const healthPrograms = [
  {
    title: 'Stress Management',
    description: '7-day program to reduce stress and anxiety',
    duration: '7 days',
    progress: 43,
    color: '#FF6B6B'
  },
  {
    title: 'Fitness Challenge',
    description: '30-day full body transformation',
    duration: '30 days',
    progress: 67,
    color: '#4ECDC4',
    route: '/fitness'
  },
  {
    title: 'Mindfulness Journey',
    description: 'Build a sustainable meditation practice',
    duration: '21 days',
    progress: 29,
    color: '#6C5CE7'
  },
  {
    title: 'Break Free',
    description: 'Break free from harmful habits and addictions',
    duration: 'Ongoing',
    progress: 0,
    color: '#E74C3C',
    isNew: true
  },
  {
    title: 'Athletic Performance',
    description: 'Optimize your sports performance and training',
    duration: '12 weeks',
    progress: 15,
    color: '#FF7675',
    route: '/fitness'
  }
];

export default function HealthScreen() {
  const renderMetricCard = (metric: any, index: number) => {
    const IconComponent = metric.icon;
    const progressWidth = (width - 72) * (metric.progress / 100);
    
    return (
      <View key={index} style={styles.metricCard}>
        <View style={styles.metricHeader}>
          <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
            <IconComponent size={20} color={metric.color} />
          </View>
          <View style={styles.metricInfo}>
            <Text style={styles.metricLabel}>{metric.label}</Text>
            <Text style={styles.metricValue}>{metric.value}</Text>
            <Text style={styles.metricTarget}>Goal: {metric.target}</Text>
          </View>
          <Text style={styles.metricProgress}>{metric.progress}%</Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: progressWidth, backgroundColor: metric.color }
              ]} 
            />
          </View>
        </View>
      </View>
    );
  };

  const renderQuickAction = (action: any, index: number) => {
    const IconComponent = action.icon;
    
    return (
      <TouchableOpacity 
        key={index} 
        style={styles.quickActionCard} 
        activeOpacity={0.8}
        onPress={() => action.route ? router.push(action.route) : null}
      >
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
            <View style={styles.programTitleRow}>
              <Text style={styles.programTitle}>{program.title}</Text>
              {program.isNew && (
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>NEW</Text>
                </View>
              )}
            </View>
            <Text style={styles.programDescription}>{program.description}</Text>
            <Text style={styles.programDuration}>
              {program.duration} {program.progress > 0 ? `• ${program.progress}% complete` : ''}
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.continueButton, { backgroundColor: program.color }]}
            onPress={() => {
              if (program.title === 'Break Free') {
                router.push('/break-free');
              } else if (program.route) {
                router.push(program.route);
              }
            }}
          >
            <Text style={styles.continueButtonText}>
              {program.progress === 0 ? 'Start' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {program.progress > 0 && (
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
        )}
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Health & Wellness",
          headerStyle: { backgroundColor: '#FF6B6B' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Stats */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <Heart size={32} color="white" />
              <Text style={styles.headerTitle}>Your Health Score</Text>
              <Text style={styles.headerScore}>82/100</Text>
              <Text style={styles.headerSubtitle}>Great progress! Keep it up</Text>
              
              <TouchableOpacity 
                style={styles.aiChatButton}
                onPress={() => router.push('/health-chat')}
                activeOpacity={0.8}
              >
                <MessageCircle size={20} color="white" />
                <Text style={styles.aiChatButtonText}>Chat with AI Health Coach</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Today's Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Metrics</Text>
          {healthMetrics.map(renderMetricCard)}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Active Programs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Programs</Text>
            <TouchableOpacity style={styles.addButton}>
              <Plus size={20} color="#667eea" />
            </TouchableOpacity>
          </View>
          {healthPrograms.map(renderProgram)}
        </View>

        {/* Weekly Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week&apos;s Insights</Text>
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <TrendingUp size={24} color="#4ECDC4" />
              <Text style={styles.insightTitle}>Improvement Trend</Text>
            </View>
            <Text style={styles.insightText}>
              Your sleep quality improved by 15% this week. Your consistent bedtime routine is paying off!
            </Text>
            <View style={styles.insightStats}>
              <View style={styles.insightStat}>
                <Text style={styles.insightStatValue}>+15%</Text>
                <Text style={styles.insightStatLabel}>Sleep Quality</Text>
              </View>
              <View style={styles.insightStat}>
                <Text style={styles.insightStatValue}>5/7</Text>
                <Text style={styles.insightStatLabel}>Workout Days</Text>
              </View>
              <View style={styles.insightStat}>
                <Text style={styles.insightStatValue}>92%</Text>
                <Text style={styles.insightStatLabel}>Goal Achievement</Text>
              </View>
            </View>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  metricCard: {
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
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  metricInfo: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  metricTarget: {
    fontSize: 12,
    color: '#95A5A6',
  },
  metricProgress: {
    fontSize: 16,
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
    maxWidth: width - 140,
  },
  programDuration: {
    fontSize: 12,
    color: '#95A5A6',
  },
  continueButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  insightCard: {
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
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 20,
  },
  insightStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  insightStat: {
    alignItems: 'center',
  },
  insightStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  insightStatLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
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
  programInfo: {
    flex: 1,
  },
  programTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  newBadge: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  newBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});