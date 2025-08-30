import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { 
  HandHeart, 
  Users, 
  Heart, 
  TreePine, 
  MessageCircle,
  Calendar,
  Star,
  Award,
  Globe,
  Handshake,
  Clock,
  Target
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const communityMetrics = [
  { label: 'Impact Score', value: '94%', icon: HandHeart, color: '#8BC34A', trend: '+12%' },
  { label: 'Hours Volunteered', value: '48', icon: Clock, color: '#4ECDC4', trend: '+8h' },
  { label: 'Lives Touched', value: '127', icon: Heart, color: '#45B7D1', trend: '+23' },
  { label: 'Projects Completed', value: '15', icon: Award, color: '#96CEB4', trend: '+3' }
];

const activeProjects = [
  {
    name: 'Food Bank Support',
    organization: 'Local Food Bank',
    type: 'Weekly Volunteering',
    progress: 85,
    icon: Heart,
    color: '#8BC34A'
  },
  {
    name: 'Community Garden',
    organization: 'Green Initiative',
    type: 'Environmental',
    progress: 60,
    icon: TreePine,
    color: '#4ECDC4'
  },
  {
    name: 'Youth Mentoring',
    organization: 'Big Brothers Big Sisters',
    type: 'Mentorship',
    progress: 40,
    icon: Users,
    color: '#45B7D1'
  }
];

const communityGoals = [
  { goal: 'Volunteer 100 hours', progress: 48, target: '100 hours', current: '48 hours' },
  { goal: 'Support 5 causes', progress: 80, target: '5 causes', current: '4 causes' },
  { goal: 'Mentor 3 people', progress: 67, target: '3 people', current: '2 people' },
  { goal: 'Organize 2 events', progress: 50, target: '2 events', current: '1 event' }
];

const todaysActivities = [
  {
    activity: 'Food bank shift',
    time: '10:00 AM',
    description: 'Sort donations - 3 hours',
    completed: true,
    icon: Heart,
    color: '#8BC34A'
  },
  {
    activity: 'Community meeting',
    time: '2:00 PM',
    description: 'Neighborhood planning',
    completed: false,
    icon: Users,
    color: '#4ECDC4'
  },
  {
    activity: 'Mentoring session',
    time: '4:00 PM',
    description: 'Career guidance call',
    completed: false,
    icon: Target,
    color: '#45B7D1'
  },
  {
    activity: 'Fundraiser prep',
    time: '7:00 PM',
    description: 'Event planning',
    completed: false,
    icon: Star,
    color: '#96CEB4'
  }
];

const quickActions = [
  {
    title: 'Find Opportunities',
    duration: '10 min',
    benefit: 'Perfect match',
    icon: HandHeart,
    color: '#8BC34A'
  },
  {
    title: 'Join Group',
    duration: '5 min',
    benefit: 'New connections',
    icon: Users,
    color: '#4ECDC4'
  },
  {
    title: 'Make Donation',
    duration: '3 min',
    benefit: 'Instant impact',
    icon: Heart,
    color: '#45B7D1'
  },
  {
    title: 'Share Story',
    duration: '15 min',
    benefit: 'Inspire others',
    icon: Globe,
    color: '#96CEB4'
  }
];

export default function CommunityScreen() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const handleHapticFeedback = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleChatPress = async () => {
    await handleHapticFeedback();
    router.push('/community-chat');
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
        <Text style={styles.metricTrend}>{metric.trend}</Text>
      </View>
    );
  };

  const renderActiveProject = (project: any, index: number) => {
    const IconComponent = project.icon;
    
    return (
      <TouchableOpacity 
        key={index} 
        style={styles.projectCard}
        activeOpacity={0.8}
        onPress={handleHapticFeedback}
      >
        <View style={[styles.projectIcon, { backgroundColor: project.color + '20' }]}>
          <IconComponent size={20} color={project.color} />
        </View>
        <View style={styles.projectContent}>
          <Text style={styles.projectName}>{project.name}</Text>
          <Text style={styles.projectOrg}>{project.organization}</Text>
          <Text style={styles.projectType}>{project.type}</Text>
        </View>
        <View style={styles.projectProgress}>
          <Text style={styles.projectProgressText}>{project.progress}%</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressBarFill, 
                { 
                  width: `${project.progress}%`,
                  backgroundColor: project.color
                }
              ]} 
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderQuickAction = (action: any, index: number) => {
    const IconComponent = action.icon;
    const isSelected = selectedAction === action.title;
    
    return (
      <TouchableOpacity 
        key={index} 
        style={[styles.actionCard, isSelected && styles.actionCardSelected]} 
        activeOpacity={0.8}
        onPress={async () => {
          await handleHapticFeedback();
          setSelectedAction(isSelected ? null : action.title);
        }}
      >
        <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
          <IconComponent size={20} color={action.color} />
        </View>
        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>{action.title}</Text>
          <Text style={styles.actionDuration}>{action.duration}</Text>
        </View>
        <Text style={styles.actionBenefit}>{action.benefit}</Text>
      </TouchableOpacity>
    );
  };

  const renderCommunityActivity = (activity: any, index: number) => {
    const IconComponent = activity.icon;
    
    return (
      <TouchableOpacity 
        key={index} 
        style={[styles.activityCard, activity.completed && styles.completedActivity]}
        activeOpacity={0.8}
        onPress={handleHapticFeedback}
      >
        <View style={[styles.activityIcon, { backgroundColor: activity.color + '20' }]}>
          <IconComponent size={16} color={activity.color} />
        </View>
        <View style={styles.activityContent}>
          <Text style={styles.activityName}>{activity.activity}</Text>
          <Text style={styles.activityDescription}>{activity.description}</Text>
        </View>
        <View style={styles.activityTime}>
          <Text style={styles.activityTimeText}>{activity.time}</Text>
          {activity.completed && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderCommunityGoal = (goal: any, index: number) => {
    return (
      <View key={index} style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalName}>{goal.goal}</Text>
          <Text style={styles.goalProgress}>{goal.progress}%</Text>
        </View>

        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressBarFill, 
              { 
                width: `${goal.progress}%`,
                backgroundColor: goal.progress >= 80 ? '#8BC34A' : goal.progress >= 60 ? '#4ECDC4' : '#45B7D1'
              }
            ]} 
          />
        </View>

        <Text style={styles.goalDetail}>
          {goal.current} / {goal.target}
        </Text>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Community & Service",
          headerStyle: { backgroundColor: '#8BC34A' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Stats */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={['#8BC34A', '#4ECDC4']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <HandHeart size={32} color="white" />
              <Text style={styles.headerTitle}>Impact Score</Text>
              <Text style={styles.headerScore}>94%</Text>
              <Text style={styles.headerSubtitle}>Making a difference every day</Text>
            </View>

            <TouchableOpacity 
              style={styles.chatButton}
              onPress={handleChatPress}
              activeOpacity={0.8}
            >
              <MessageCircle size={20} color="white" />
              <Text style={styles.chatButtonText}>Community Guide</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Community Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Overview</Text>
          <View style={styles.metricsGrid}>
            {communityMetrics.map(renderMetricCard)}
          </View>
        </View>

        {/* Active Projects */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Projects</Text>
          {activeProjects.map(renderActiveProject)}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Boosters</Text>
          <View style={styles.actionsList}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Today's Community Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Service</Text>
          {todaysActivities.map(renderCommunityActivity)}
        </View>

        {/* Community Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Year&apos;s Goals</Text>
          {communityGoals.map(renderCommunityGoal)}
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
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },
  chatButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
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
    marginBottom: 4,
  },
  metricTrend: {
    fontSize: 10,
    color: '#27AE60',
    textAlign: 'center',
    fontWeight: '600',
  },
  projectCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  projectIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  projectContent: {
    flex: 1,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  projectOrg: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  projectType: {
    fontSize: 12,
    color: '#8BC34A',
    fontWeight: '600',
  },
  projectProgress: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  projectProgressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  actionsList: {
    paddingHorizontal: 24,
  },
  actionCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionCardSelected: {
    borderWidth: 2,
    borderColor: '#8BC34A',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  actionDuration: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  actionBenefit: {
    fontSize: 12,
    color: '#8BC34A',
    fontWeight: '600',
  },
  activityCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  completedActivity: {
    opacity: 0.7,
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  activityTime: {
    alignItems: 'flex-end',
  },
  activityTimeText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  completedBadge: {
    backgroundColor: '#27AE60',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  goalCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  goalProgress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8BC34A',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalDetail: {
    fontSize: 12,
    color: '#7F8C8D',
  },
});