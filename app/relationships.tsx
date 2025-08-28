import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Calendar,
  UserPlus,
  Baby,
  Home,
  Coffee,
  Gift,
  Phone,
  Star,
  TrendingUp
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const relationshipMetrics = [
  { label: 'Connection Score', value: '85/100', icon: Heart, color: '#FF6B6B', description: 'Strong bonds' },
  { label: 'Social Activities', value: '12 this month', icon: Calendar, color: '#4ECDC4', description: 'Active social life' },
  { label: 'Quality Time', value: '18 hours/week', icon: Coffee, color: '#FFD93D', description: 'With loved ones' },
  { label: 'Communication', value: '92% positive', icon: MessageCircle, color: '#6C5CE7', description: 'Healthy dialogue' }
];

const quickActions = [
  { title: 'Plan Date Night', icon: Heart, color: '#FF6B6B', description: 'Romantic evening' },
  { title: 'Call Family', icon: Phone, color: '#4ECDC4', description: 'Stay connected' },
  { title: 'Meet Friends', icon: Users, color: '#FFD93D', description: 'Social gathering' },
  { title: 'Send Gift', icon: Gift, color: '#6C5CE7', description: 'Show appreciation' }
];

const relationshipPrograms = [
  {
    title: 'Communication Mastery',
    description: 'Learn effective communication techniques for stronger relationships',
    progress: 67,
    lessons: '8/12 lessons',
    color: '#4ECDC4'
  },
  {
    title: 'Dating Confidence',
    description: 'Build confidence and skills for meaningful connections',
    progress: 34,
    activities: '5/15 activities',
    color: '#FF6B6B'
  },
  {
    title: 'Family Harmony',
    description: 'Strengthen family bonds and resolve conflicts',
    progress: 78,
    sessions: '7/9 sessions',
    color: '#6C5CE7'
  }
];

const relationshipInsights = [
  {
    type: 'romantic',
    title: 'Romantic Relationship',
    status: 'Thriving',
    score: 92,
    lastActivity: 'Date night yesterday',
    suggestion: 'Plan a weekend getaway',
    color: '#FF6B6B'
  },
  {
    type: 'family',
    title: 'Family Connections',
    status: 'Good',
    score: 78,
    lastActivity: 'Family dinner 3 days ago',
    suggestion: 'Schedule weekly video calls',
    color: '#4ECDC4'
  },
  {
    type: 'friends',
    title: 'Friendships',
    status: 'Active',
    score: 85,
    lastActivity: 'Group hangout last week',
    suggestion: 'Organize a group activity',
    color: '#FFD93D'
  }
];

export default function RelationshipsScreen() {
  const renderMetricCard = (metric: any, index: number) => {
    const IconComponent = metric.icon;
    
    return (
      <View key={index} style={styles.metricCard}>
        <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
          <IconComponent size={20} color={metric.color} />
        </View>
        <Text style={styles.metricLabel}>{metric.label}</Text>
        <Text style={styles.metricValue}>{metric.value}</Text>
        <Text style={styles.metricDescription}>{metric.description}</Text>
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
              {program.lessons && (
                <Text style={styles.programDetail}>{program.lessons}</Text>
              )}
              {program.activities && (
                <Text style={styles.programDetail}>{program.activities}</Text>
              )}
              {program.sessions && (
                <Text style={styles.programDetail}>{program.sessions}</Text>
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

  const renderRelationshipInsight = (insight: any, index: number) => {
    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case 'thriving': return '#27AE60';
        case 'good': return '#F39C12';
        case 'active': return '#3498DB';
        default: return '#7F8C8D';
      }
    };

    const statusColor = getStatusColor(insight.status);
    
    return (
      <View key={index} style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <View style={styles.insightTitleContainer}>
            <Text style={styles.insightTitle}>{insight.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>{insight.status}</Text>
            </View>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreValue}>{insight.score}</Text>
            <Text style={styles.scoreLabel}>Score</Text>
          </View>
        </View>
        
        <Text style={styles.lastActivity}>{insight.lastActivity}</Text>
        <Text style={styles.suggestion}>💡 {insight.suggestion}</Text>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Relationships",
          headerStyle: { backgroundColor: '#A8E6CF' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Stats */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={['#A8E6CF', '#7FCDCD']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <Users size={32} color="white" />
              <Text style={styles.headerTitle}>Relationship Health</Text>
              <Text style={styles.headerScore}>85/100</Text>
              <Text style={styles.headerSubtitle}>Strong connections across all areas</Text>
              
              <TouchableOpacity 
                style={styles.aiChatButton}
                onPress={() => router.push('/relationships-chat')}
                activeOpacity={0.8}
              >
                <MessageCircle size={20} color="white" />
                <Text style={styles.aiChatButtonText}>Chat with AI Relationship Coach</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Relationship Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection Overview</Text>
          <View style={styles.metricsGrid}>
            {relationshipMetrics.map(renderMetricCard)}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Relationship Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Relationship Status</Text>
          {relationshipInsights.map(renderRelationshipInsight)}
        </View>

        {/* Active Programs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Growth Programs</Text>
          {relationshipPrograms.map(renderProgram)}
        </View>

        {/* Weekly Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week's Insights</Text>
          <View style={styles.weeklyInsightCard}>
            <View style={styles.insightHeader}>
              <TrendingUp size={24} color="#A8E6CF" />
              <Text style={styles.insightTitle}>Connection Trends</Text>
            </View>
            <Text style={styles.insightText}>
              You've had 15% more meaningful conversations this week. Your active listening skills are improving!
            </Text>
            <View style={styles.insightStats}>
              <View style={styles.insightStat}>
                <Text style={styles.insightStatValue}>+15%</Text>
                <Text style={styles.insightStatLabel}>Quality Conversations</Text>
              </View>
              <View style={styles.insightStat}>
                <Text style={styles.insightStatValue}>8</Text>
                <Text style={styles.insightStatLabel}>Social Activities</Text>
              </View>
              <View style={styles.insightStat}>
                <Text style={styles.insightStatValue}>92%</Text>
                <Text style={styles.insightStatLabel}>Positive Interactions</Text>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    paddingHorizontal: 24,
    marginBottom: 16,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
    textAlign: 'center',
  },
  metricDescription: {
    fontSize: 10,
    color: '#95A5A6',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  quickActionDescription: {
    color: 'white',
    fontSize: 12,
    opacity: 0.9,
    marginTop: 4,
    textAlign: 'center',
  },
  insightCard: {
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
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightTitleContainer: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  lastActivity: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  suggestion: {
    fontSize: 14,
    color: '#27AE60',
    fontStyle: 'italic',
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
  weeklyInsightCard: {
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
});