import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { 
  BookOpen, 
  Play, 
  Award, 
  Clock,
  Target,
  TrendingUp,
  Star,
  CheckCircle,
  Plus,
  Bookmark,
  Users,
  Brain
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const learningMetrics = [
  { label: 'Courses Completed', value: '12', icon: Award, color: '#6C5CE7', change: '+3 this month' },
  { label: 'Study Hours', value: '47h', icon: Clock, color: '#4ECDC4', change: 'This month' },
  { label: 'Skills Acquired', value: '8', icon: Brain, color: '#FFD93D', change: 'New skills' },
  { label: 'Certificates', value: '5', icon: Star, color: '#FF6B6B', change: 'Earned' }
];

const activeCourses = [
  {
    title: 'Advanced JavaScript',
    provider: 'TechAcademy',
    progress: 78,
    totalLessons: 24,
    completedLessons: 19,
    timeLeft: '2h 15m',
    color: '#6C5CE7',
    category: 'Programming'
  },
  {
    title: 'Digital Marketing Mastery',
    provider: 'MarketPro',
    progress: 45,
    totalLessons: 18,
    completedLessons: 8,
    timeLeft: '4h 30m',
    color: '#4ECDC4',
    category: 'Marketing'
  },
  {
    title: 'UI/UX Design Principles',
    provider: 'DesignHub',
    progress: 92,
    totalLessons: 15,
    completedLessons: 14,
    timeLeft: '30m',
    color: '#FFD93D',
    category: 'Design'
  }
];

const recommendedCourses = [
  {
    title: 'Machine Learning Basics',
    provider: 'AI Institute',
    rating: 4.8,
    students: '12.5k',
    duration: '6 weeks',
    price: 'Free',
    color: '#FF6B6B'
  },
  {
    title: 'Public Speaking Mastery',
    provider: 'SpeakWell',
    rating: 4.9,
    students: '8.2k',
    duration: '4 weeks',
    price: '$49',
    color: '#4ECDC4'
  },
  {
    title: 'Financial Planning 101',
    provider: 'MoneyWise',
    rating: 4.7,
    students: '15.3k',
    duration: '8 weeks',
    price: '$29',
    color: '#6C5CE7'
  }
];

const learningGoals = [
  {
    title: 'Complete JavaScript Course',
    deadline: '2 days left',
    progress: 78,
    priority: 'high'
  },
  {
    title: 'Earn UX Design Certificate',
    deadline: '1 week left',
    progress: 92,
    priority: 'medium'
  },
  {
    title: 'Learn Python Basics',
    deadline: '2 weeks left',
    progress: 0,
    priority: 'low'
  }
];

export default function LearningScreen() {
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

  const renderActiveCourse = (course: any, index: number) => {
    const progressWidth = (width - 72) * (course.progress / 100);
    
    return (
      <View key={index} style={styles.courseCard}>
        <View style={styles.courseHeader}>
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseProvider}>{course.provider} • {course.category}</Text>
            <Text style={styles.courseProgress}>
              {course.completedLessons}/{course.totalLessons} lessons • {course.timeLeft} left
            </Text>
          </View>
          <TouchableOpacity style={[styles.playButton, { backgroundColor: course.color }]}>
            <Play size={20} color="white" fill="white" />
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
      </View>
    );
  };

  const renderRecommendedCourse = (course: any, index: number) => {
    return (
      <View key={index} style={styles.recommendedCard}>
        <View style={[styles.courseImage, { backgroundColor: course.color + '20' }]}>
          <BookOpen size={24} color={course.color} />
        </View>
        <View style={styles.recommendedInfo}>
          <Text style={styles.recommendedTitle}>{course.title}</Text>
          <Text style={styles.recommendedProvider}>{course.provider}</Text>
          <View style={styles.courseStats}>
            <View style={styles.statItem}>
              <Star size={12} color="#FFD93D" fill="#FFD93D" />
              <Text style={styles.statText}>{course.rating}</Text>
            </View>
            <View style={styles.statItem}>
              <Users size={12} color="#7F8C8D" />
              <Text style={styles.statText}>{course.students}</Text>
            </View>
            <View style={styles.statItem}>
              <Clock size={12} color="#7F8C8D" />
              <Text style={styles.statText}>{course.duration}</Text>
            </View>
          </View>
          <View style={styles.courseFooter}>
            <Text style={[styles.coursePrice, { color: course.price === 'Free' ? '#27AE60' : '#2C3E50' }]}>
              {course.price}
            </Text>
            <TouchableOpacity style={styles.enrollButton}>
              <Text style={styles.enrollText}>Enroll</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderLearningGoal = (goal: any, index: number) => {
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'high': return '#FF6B6B';
        case 'medium': return '#FFD93D';
        case 'low': return '#4ECDC4';
        default: return '#7F8C8D';
      }
    };

    const priorityColor = getPriorityColor(goal.priority);
    const progressWidth = (width - 120) * (goal.progress / 100);
    
    return (
      <View key={index} style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <View style={styles.goalInfo}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalDeadline}>{goal.deadline}</Text>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '20' }]}>
            <Text style={[styles.priorityText, { color: priorityColor }]}>
              {goal.priority.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <View style={styles.goalProgress}>
          <View style={styles.goalProgressBar}>
            <View 
              style={[
                styles.goalProgressFill, 
                { width: progressWidth, backgroundColor: priorityColor }
              ]} 
            />
          </View>
          <Text style={styles.goalProgressText}>{goal.progress}%</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Learning & Growth",
          headerStyle: { backgroundColor: '#6C5CE7' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Stats */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={['#6C5CE7', '#A29BFE']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <BookOpen size={32} color="white" />
              <Text style={styles.headerTitle}>Learning Progress</Text>
              <Text style={styles.headerScore}>Level 8</Text>
              <Text style={styles.headerSubtitle}>Knowledge seeker on a growth journey</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Learning Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Overview</Text>
          <View style={styles.metricsGrid}>
            {learningMetrics.map(renderMetricCard)}
          </View>
        </View>

        {/* Active Courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue Learning</Text>
            <TouchableOpacity style={styles.addButton}>
              <Plus size={20} color="#667eea" />
            </TouchableOpacity>
          </View>
          {activeCourses.map(renderActiveCourse)}
        </View>

        {/* Learning Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Goals</Text>
          {learningGoals.map(renderLearningGoal)}
        </View>

        {/* Recommended Courses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          {recommendedCourses.map(renderRecommendedCourse)}
        </View>

        {/* Weekly Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week's Progress</Text>
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <TrendingUp size={24} color="#6C5CE7" />
              <Text style={styles.insightTitle}>Learning Streak</Text>
            </View>
            <Text style={styles.insightText}>
              Amazing! You've maintained a 12-day learning streak. You spent 8.5 hours learning this week across 3 different subjects.
            </Text>
            <View style={styles.insightStats}>
              <View style={styles.insightStat}>
                <Text style={styles.insightStatValue}>12</Text>
                <Text style={styles.insightStatLabel}>Day Streak</Text>
              </View>
              <View style={styles.insightStat}>
                <Text style={styles.insightStatValue}>8.5h</Text>
                <Text style={styles.insightStatLabel}>This Week</Text>
              </View>
              <View style={styles.insightStat}>
                <Text style={styles.insightStatValue}>3</Text>
                <Text style={styles.insightStatLabel}>Subjects</Text>
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
  recommendedCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  courseImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  recommendedInfo: {
    flex: 1,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  recommendedProvider: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  courseStats: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coursePrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  enrollButton: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  enrollText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  goalCard: {
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
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  goalDeadline: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 12,
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
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
});