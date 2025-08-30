import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { 
  BookOpen, 
  Play, 
  Award, 
  Clock,
  Target,
  TrendingUp,
  Star,
  CheckCircle,
  MessageCircle,
  Pause,
  Brain
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const learningMetrics = [
  { label: 'Study Streak', value: '12', icon: Target, color: '#6C5CE7', change: 'days' },
  { label: 'This Week', value: '8.5h', icon: Clock, color: '#4ECDC4', change: 'hours' },
  { label: 'Completed', value: '3', icon: CheckCircle, color: '#27AE60', change: 'courses' },
  { label: 'Level', value: '8', icon: Award, color: '#FF6B6B', change: 'progress' }
];

const todaysFocus = {
  subject: 'JavaScript Fundamentals',
  timeSpent: 45,
  targetTime: 60,
  streak: 12,
  nextMilestone: 'Complete Module 5'
};

const quickActions = [
  { id: 1, title: 'Continue JavaScript', time: '30 min left', color: '#6C5CE7', icon: Play },
  { id: 2, title: 'Review Design Notes', time: '15 min', color: '#FFD93D', icon: BookOpen },
  { id: 3, title: 'Practice Quiz', time: '10 min', color: '#4ECDC4', icon: Brain }
];

const activeCourses = [
  {
    id: 1,
    title: 'Advanced JavaScript',
    provider: 'TechAcademy',
    progress: 78,
    totalLessons: 24,
    completedLessons: 19,
    timeLeft: '2h 15m',
    color: '#6C5CE7',
    category: 'Programming',
    isActive: false,
    nextLesson: 'Async/Await Patterns'
  },
  {
    id: 2,
    title: 'UI/UX Design Principles',
    provider: 'DesignHub',
    progress: 92,
    totalLessons: 15,
    completedLessons: 14,
    timeLeft: '30m',
    color: '#FFD93D',
    category: 'Design',
    isActive: false,
    nextLesson: 'Final Project Review'
  }
];

export default function LearningScreen() {
  const [activeStudySession, setActiveStudySession] = useState<number | null>(null);
  const [courses, setCourses] = useState(activeCourses);

  const handleStartStudy = (courseId: number) => {
    if (activeStudySession === courseId) {
      // Pause current session
      setActiveStudySession(null);
      Alert.alert('Study Paused', 'Great work! Your progress has been saved.');
    } else {
      // Start new session
      setActiveStudySession(courseId);
      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? { ...course, isActive: true }
          : { ...course, isActive: false }
      ));
      Alert.alert('Study Started', 'Focus mode activated. Good luck!');
    }
  };

  const handleQuickAction = (action: any) => {
    Alert.alert(action.title, `Starting ${action.title.toLowerCase()}...`);
  };

  const handleAskCoach = () => {
    router.push('/learning-chat');
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
        <Text style={styles.metricChange}>{metric.change}</Text>
      </View>
    );
  };

  const renderQuickAction = (action: any, index: number) => {
    const IconComponent = action.icon;
    
    return (
      <TouchableOpacity 
        key={index} 
        style={[styles.quickActionCard, { borderLeftColor: action.color }]}
        onPress={() => handleQuickAction(action)}
      >
        <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
          <IconComponent size={20} color={action.color} />
        </View>
        <View style={styles.quickActionInfo}>
          <Text style={styles.quickActionTitle}>{action.title}</Text>
          <Text style={styles.quickActionTime}>{action.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderActiveCourse = (course: any, index: number) => {
    const progressWidth = (width - 72) * (course.progress / 100);
    const isActive = activeStudySession === course.id;
    
    return (
      <View key={index} style={[styles.courseCard, isActive && styles.activeCourseCard]}>
        <View style={styles.courseHeader}>
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseProvider}>{course.provider} • {course.category}</Text>
            <Text style={styles.courseProgress}>
              {course.completedLessons}/{course.totalLessons} lessons • {course.timeLeft} left
            </Text>
            {course.nextLesson && (
              <Text style={styles.nextLesson}>Next: {course.nextLesson}</Text>
            )}
          </View>
          <TouchableOpacity 
            style={[styles.playButton, { backgroundColor: course.color }]}
            onPress={() => handleStartStudy(course.id)}
          >
            {isActive ? (
              <Pause size={20} color="white" fill="white" />
            ) : (
              <Play size={20} color="white" fill="white" />
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: progressWidth, backgroundColor: course.color }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{course.progress}%</Text>
        </View>
        
        {isActive && (
          <View style={styles.activeIndicator}>
            <View style={styles.pulseIndicator} />
            <Text style={styles.activeText}>Study session active</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Learning",
          headerStyle: { backgroundColor: '#6C5CE7' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Today's Focus */}
        <View style={styles.focusCard}>
          <View style={styles.focusHeader}>
            <View>
              <Text style={styles.focusTitle}>Today&apos;s Focus</Text>
              <Text style={styles.focusSubject}>{todaysFocus.subject}</Text>
            </View>
            <TouchableOpacity style={styles.coachButton} onPress={handleAskCoach}>
              <MessageCircle size={20} color="#6C5CE7" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.focusProgress}>
            <View style={styles.focusProgressBar}>
              <View 
                style={[
                  styles.focusProgressFill, 
                  { width: `${(todaysFocus.timeSpent / todaysFocus.targetTime) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.focusTime}>
              {todaysFocus.timeSpent}/{todaysFocus.targetTime} min
            </Text>
          </View>
          
          <View style={styles.focusStats}>
            <View style={styles.focusStat}>
              <Target size={16} color="#6C5CE7" />
              <Text style={styles.focusStatText}>{todaysFocus.streak} day streak</Text>
            </View>
            <View style={styles.focusStat}>
              <Star size={16} color="#FFD93D" />
              <Text style={styles.focusStatText}>{todaysFocus.nextMilestone}</Text>
            </View>
          </View>
        </View>

        {/* Learning Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.metricsGrid}>
            {learningMetrics.map(renderMetricCard)}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          {quickActions.map(renderQuickAction)}
        </View>

        {/* Active Courses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Courses</Text>
          {courses.map(renderActiveCourse)}
        </View>

        {/* Learning Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <TrendingUp size={20} color="#6C5CE7" />
              <Text style={styles.insightTitle}>Keep it up!</Text>
            </View>
            <Text style={styles.insightText}>
              You&apos;re on a 12-day learning streak. Consistency is key to mastering new skills.
            </Text>
            <TouchableOpacity style={styles.insightAction} onPress={handleAskCoach}>
              <Text style={styles.insightActionText}>Get personalized tips</Text>
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
  focusCard: {
    backgroundColor: 'white',
    margin: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  focusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  focusTitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  focusSubject: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  coachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6C5CE7' + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  focusProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  focusProgressFill: {
    height: '100%',
    backgroundColor: '#6C5CE7',
    borderRadius: 4,
  },
  focusTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  focusStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  focusStat: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  focusStatText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginLeft: 6,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 4,
    textAlign: 'center',
  },
  metricChange: {
    fontSize: 10,
    color: '#27AE60',
    textAlign: 'center',
  },
  quickActionCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quickActionInfo: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  quickActionTime: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  courseCard: {
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
  activeCourseCard: {
    borderWidth: 2,
    borderColor: '#6C5CE7',
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  courseInfo: {
    flex: 1,
    marginRight: 16,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  courseProvider: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  courseProgress: {
    fontSize: 12,
    color: '#95A5A6',
    marginBottom: 4,
  },
  nextLesson: {
    fontSize: 12,
    color: '#6C5CE7',
    fontWeight: '500',
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  pulseIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#27AE60',
    marginRight: 8,
  },
  activeText: {
    fontSize: 12,
    color: '#27AE60',
    fontWeight: '500',
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
    marginLeft: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 16,
  },
  insightAction: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  insightActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});