import React, { useMemo, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Heart, 
  DollarSign, 
  Users, 
  Shield, 
  BookOpen, 
  Target, 
  Brain, 
  Home,
  TrendingUp,
  Sparkles,
  Palette,
  Dumbbell,
  ShieldCheck,
  MapPin
} from 'lucide-react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useCategories } from '@/contexts/CategoryContext';
import { useUser } from '@/contexts/UserContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - 64) / 2;

interface CategoryCard {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  gradient: [string, string];
  route: string;
}

const categories: CategoryCard[] = [
  {
    id: 'health',
    title: 'Health & Fitness',
    subtitle: 'Complete Physical Wellness',
    icon: Heart,
    gradient: ['#FF6B6B', '#FF8E8E'] as [string, string],
    route: '/health'
  },
  {
    id: 'wealth',
    title: 'Wealth & Career',
    subtitle: 'Financial & Professional Growth',
    icon: DollarSign,
    gradient: ['#4ECDC4', '#44A08D'] as [string, string],
    route: '/wealth'
  },
  {
    id: 'relationships',
    title: 'Relationships & Family',
    subtitle: 'Connection & Love',
    icon: Users,
    gradient: ['#A8E6CF', '#7FCDCD'] as [string, string],
    route: '/relationships'
  },
  {
    id: 'confidence',
    title: 'Confidence & Freedom',
    subtitle: 'Inner Strength & Breaking Limits',
    icon: Shield,
    gradient: ['#FFD93D', '#FF9F43'] as [string, string],
    route: '/confidence'
  },
  {
    id: 'learning',
    title: 'Learning & Education',
    subtitle: 'Knowledge & Skill Growth',
    icon: BookOpen,
    gradient: ['#6C5CE7', '#A29BFE'] as [string, string],
    route: '/learning'
  },
  {
    id: 'productivity',
    title: 'Productivity & Goals',
    subtitle: 'Achievement & Focus',
    icon: Target,
    gradient: ['#FD79A8', '#E84393'] as [string, string],
    route: '/productivity'
  },
  {
    id: 'mindfulness',
    title: 'Mindfulness & Creativity',
    subtitle: 'Inner Peace & Expression',
    icon: Brain,
    gradient: ['#74B9FF', '#0984E3'] as [string, string],
    route: '/mindfulness'
  },
  {
    id: 'lifestyle',
    title: 'Home & Lifestyle',
    subtitle: 'Living & Organization',
    icon: Home,
    gradient: ['#55A3FF', '#003D82'] as [string, string],
    route: '/lifestyle'
  },
  {
    id: 'travel',
    title: 'Travel & Community',
    subtitle: 'Adventure & Service',
    icon: MapPin,
    gradient: ['#FF9500', '#FF5722'] as [string, string],
    route: '/travel'
  }
];

const quickActions = [
  { 
    title: 'Daily Check-in', 
    icon: Heart, 
    color: '#FF6B6B',
    action: () => {
      // Add a daily check-in activity
      const { addActivity } = useCategories();
      addActivity({
        categoryId: 'health',
        type: 'health',
        title: 'Daily Check-in Completed',
        impact: { health: 2, mindfulness: 1, confidence: 1 }
      });
    }
  },
  { 
    title: 'Quick Workout', 
    icon: Dumbbell, 
    color: '#FF6B6B',
    action: () => router.push('/health')
  },
  { 
    title: 'Meditation', 
    icon: Brain, 
    color: '#74B9FF',
    action: () => router.push('/mindfulness')
  },
  { 
    title: 'Goal Progress', 
    icon: Target, 
    color: '#FD79A8',
    action: () => router.push('/progress')
  },
  { 
    title: 'Quick Journal', 
    icon: BookOpen, 
    color: '#6C5CE7',
    action: () => router.push('/learning')
  },
  { 
    title: 'Money Check', 
    icon: DollarSign, 
    color: '#4ECDC4',
    action: () => router.push('/wealth')
  },
  { 
    title: 'Connect', 
    icon: Users, 
    color: '#A8E6CF',
    action: () => router.push('/relationships')
  },
  { 
    title: 'Create', 
    icon: Palette, 
    color: '#74B9FF',
    action: () => router.push('/mindfulness')
  },
  { 
    title: 'Home Organize', 
    icon: Home, 
    color: '#55A3FF',
    action: () => router.push('/lifestyle')
  },
  { 
    title: 'Plan Adventure', 
    icon: MapPin, 
    color: '#FF9500',
    action: () => router.push('/travel')
  }
];

// Helper function to get readable category names
const getCategoryName = (key: string): string => {
  const nameMap: Record<string, string> = {
    health: 'Health & Fitness',
    fitness: 'Health & Fitness', // Legacy - now combined with health
    wealth: 'Wealth & Career',
    relationships: 'Relationships & Family',
    confidence: 'Confidence & Freedom',
    learning: 'Learning & Education',
    productivity: 'Productivity & Goals',
    mindfulness: 'Mindfulness & Creativity',
    creativity: 'Mindfulness & Creativity', // Legacy - now combined with mindfulness
    energy: 'Health & Fitness', // Legacy - now combined with health
    lifestyle: 'Home & Lifestyle',
    breakFree: 'Confidence & Freedom', // Legacy - now combined with confidence
    travel: 'Travel & Community',
    community: 'Travel & Community' // Legacy - now combined with travel
  };
  return nameMap[key] || key;
};

// Helper function to get time-based greeting
const getTimeBasedGreeting = (userName: string) => {
  const hour = new Date().getHours();
  const firstName = userName.split(' ')[0];
  
  if (hour >= 5 && hour < 12) {
    return {
      greeting: `Good morning, ${firstName}! ☀️`,
      subtitle: 'Ready to seize the day?',
      timeOfDay: 'morning'
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      greeting: `Good afternoon, ${firstName}! 🌤️`,
      subtitle: 'How\'s your day going?',
      timeOfDay: 'afternoon'
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      greeting: `Good evening, ${firstName}! 🌅`,
      subtitle: 'Time to wind down and reflect?',
      timeOfDay: 'evening'
    };
  } else {
    return {
      greeting: `Good night, ${firstName}! 🌙`,
      subtitle: 'Rest well, tomorrow awaits!',
      timeOfDay: 'night'
    };
  }
};

// Helper function to get personalized greeting based on activities
const getPersonalizedGreeting = (activities: any[], scores: any, timeOfDay: string) => {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const todayActivities = activities.filter(activity => activity.timestamp >= todayStart);
  
  // Find most active category today
  const categoryActivity = todayActivities.reduce((acc: any, activity) => {
    acc[activity.categoryId] = (acc[activity.categoryId] || 0) + 1;
    return acc;
  }, {});
  
  const mostActiveCategory = Object.entries(categoryActivity)
    .sort(([,a]: any, [,b]: any) => b - a)[0];
  
  // Find highest scoring category
  const highestCategory = Object.entries(scores)
    .sort(([,a]: any, [,b]: any) => b - a)[0];
  
  // Generate contextual messages based on time and activity
  const contextualMessages = {
    morning: [
      todayActivities.length > 0 
        ? `Great start! You've already completed ${todayActivities.length} activities today.`
        : "A fresh day full of possibilities awaits!",
      mostActiveCategory 
        ? `You're on fire with ${getCategoryName(mostActiveCategory[0])} today!`
        : "What area of your life will you focus on first?",
      highestCategory && (highestCategory[1] as number) > 80
        ? `Your ${getCategoryName(highestCategory[0] as string)} strength is inspiring!`
        : "Every small step counts toward your bigger goals."
    ],
    afternoon: [
      todayActivities.length > 2
        ? `Productive day! ${todayActivities.length} activities completed so far.`
        : "Perfect time to tackle that next goal!",
      mostActiveCategory
        ? `Your ${getCategoryName(mostActiveCategory[0])} focus is paying off!`
        : "The day is still young - what will you accomplish?",
      "Midday energy is perfect for pushing forward!"
    ],
    evening: [
      todayActivities.length > 0
        ? `Well done today! You completed ${todayActivities.length} meaningful activities.`
        : "It's never too late to make progress on your goals.",
      "Time to reflect on today's wins and plan tomorrow.",
      highestCategory
        ? `Your ${getCategoryName(highestCategory[0])} progress shows real dedication!`
        : "Every evening is a chance to prepare for tomorrow's success."
    ],
    night: [
      todayActivities.length > 0
        ? `Today brought ${todayActivities.length} steps forward in your journey.`
        : "Tomorrow is a new opportunity to grow and thrive.",
      "Rest well - your mind and body deserve it.",
      "Peaceful nights lead to powerful mornings."
    ]
  };
  
  const messages = contextualMessages[timeOfDay as keyof typeof contextualMessages] || contextualMessages.morning;
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  
  return randomMessage;
};

export default function HomeScreen() {
  const { getOverallScore, getCategoryProgress, scores, activities, addActivity } = useCategories();
  const { user, getInitials } = useUser();
  
  const overallScore = getOverallScore();
  
  // Get dynamic greeting based on time and user activity
  const timeGreeting = getTimeBasedGreeting(user.name);
  const personalizedMessage = getPersonalizedGreeting(activities, scores, timeGreeting.timeOfDay);
  
  // Generate personalized insight based on user data
  const todaysInsight = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    // Find lowest and highest scoring categories
    const categoryEntries = Object.entries(scores).map(([key, value]) => ({ key, value }));
    const lowestCategory = categoryEntries.reduce((min, curr) => curr.value < min.value ? curr : min);
    const highestCategory = categoryEntries.reduce((max, curr) => curr.value > max.value ? curr : max);
    
    // Recent activities (last 3 days)
    const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
    const recentActivities = activities.filter(activity => activity.timestamp > threeDaysAgo);
    
    // Different types of insights that rotate based on day
    const insightTypes = [
      // Interconnection insights
      {
        title: "Interconnected Growth",
        text: `Your ${getCategoryName(highestCategory.key)} strength (${highestCategory.value}%) can boost your ${getCategoryName(lowestCategory.key)}! Try activities that connect both areas.`,
        actionText: "Explore Connections"
      },
      // Progress encouragement
      {
        title: "Progress Momentum",
        text: recentActivities.length > 0 
          ? `Great job! You've completed ${recentActivities.length} activities recently. Keep the momentum going!`
          : "Ready for a fresh start? Small actions today create big changes tomorrow.",
        actionText: "Take Action"
      },
      // Focus area suggestion
      {
        title: "Focus Opportunity",
        text: `Your ${getCategoryName(lowestCategory.key)} area (${lowestCategory.value}%) has the most growth potential. Focus here for maximum impact!`,
        actionText: `Improve ${getCategoryName(lowestCategory.key)}`
      },
      // Balance insight
      {
        title: "Life Balance",
        text: overallScore >= 75 
          ? "You're maintaining great balance across life areas! Consider exploring new challenges."
          : "Growth happens when we balance multiple life areas. Your interconnected journey is unique!",
        actionText: "View Progress"
      },
      // Streak motivation
      {
        title: "Daily Wisdom",
        text: "Every small action ripples across your entire life. What you do in one area strengthens others!",
        actionText: "Start Today"
      }
    ];
    
    // Select insight based on day of year to ensure variety
    const selectedInsight = insightTypes[dayOfYear % insightTypes.length];
    return selectedInsight;
  }, [scores, activities, overallScore]);
  
  const renderCategoryCard = useCallback((category: CategoryCard) => {
    const IconComponent = category.icon;
    const categoryScore = getCategoryProgress(category.id);
    
    return (
      <TouchableOpacity
        key={category.id}
        style={[styles.categoryCard, { width: cardWidth }]}
        onPress={() => router.push(category.route as any)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={category.gradient}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardContent}>
            <IconComponent size={32} color="white" />
            <Text style={styles.cardTitle}>{category.title}</Text>
            <Text style={styles.cardSubtitle}>{category.subtitle}</Text>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>{categoryScore}%</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }, [getCategoryProgress, router]);

  const handleQuickAction = useCallback(async (action: any) => {
    // Add haptic feedback for better UX
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (action.title === 'Daily Check-in') {
      // Add a daily check-in activity
      addActivity({
        categoryId: 'health',
        type: 'health',
        title: 'Daily Check-in Completed',
        impact: { health: 2, mindfulness: 1, confidence: 1 }
      });
      console.log('Daily check-in completed!');
    } else if (action.action) {
      action.action();
    }
  }, [addActivity]);

  const renderQuickAction = useCallback((action: any, index: number) => {
    const IconComponent = action.icon;
    
    return (
      <TouchableOpacity 
        key={index} 
        style={styles.quickAction} 
        activeOpacity={0.7}
        onPress={() => handleQuickAction(action)}
      >
        <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
          <IconComponent size={20} color={action.color} />
        </View>
        <Text style={styles.quickActionText}>{action.title}</Text>
      </TouchableOpacity>
    );
  }, [handleQuickAction]);

  return (
    <View style={styles.backgroundContainer}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.backgroundOverlay}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>{timeGreeting.greeting}</Text>
          <Text style={styles.subtitle}>{timeGreeting.subtitle}</Text>
          <Text style={styles.personalizedMessage}>{personalizedMessage}</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/profile')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.profileButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.profileButtonText}>{getInitials()}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Daily Insight */}
      <TouchableOpacity 
        style={styles.insightCard}
        onPress={() => {
          // Navigate to progress or relevant category
          router.push('/progress');
        }}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.insightGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.insightContent}>
            <Sparkles size={24} color="white" />
            <Text style={styles.insightTitle}>{todaysInsight.title}</Text>
            <Text style={styles.insightText}>
              {todaysInsight.text}
            </Text>
            <View style={styles.insightAction}>
              <Text style={styles.insightActionText}>{todaysInsight.actionText} →</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsScrollContainer}
          style={styles.quickActionsScroll}
        >
          {quickActions.map(renderQuickAction)}
        </ScrollView>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Life Areas</Text>
        <View style={styles.categoriesContainer}>
          {categories.map(renderCategoryCard)}
        </View>
      </View>

      {/* Daily Goals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Focus</Text>
        <View style={styles.dailyGoalsCard}>
          <View style={styles.goalItem}>
            <View style={styles.goalCheckbox}>
              <Text style={styles.goalCheckmark}>✓</Text>
            </View>
            <Text style={styles.goalText}>Complete morning routine</Text>
          </View>
          <View style={styles.goalItem}>
            <View style={[styles.goalCheckbox, styles.goalCheckboxEmpty]}>
            </View>
            <Text style={styles.goalText}>30-minute learning session</Text>
          </View>
          <View style={styles.goalItem}>
            <View style={[styles.goalCheckbox, styles.goalCheckboxEmpty]}>
            </View>
            <Text style={styles.goalText}>Connect with a friend</Text>
          </View>
        </View>
      </View>

      {/* Progress Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Week's Progress</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressItem}>
            <TrendingUp size={20} color="#4ECDC4" />
            <Text style={styles.progressLabel}>Overall Score</Text>
            <Text style={styles.progressValue}>{overallScore}%</Text>
          </View>
          <View style={styles.progressDivider} />
          <View style={styles.progressItem}>
            <Target size={20} color="#FF6B6B" />
            <Text style={styles.progressLabel}>Interconnected Growth</Text>
            <Text style={styles.progressValue}>Active</Text>
          </View>
        </View>
      </View>
        </ScrollView>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  backgroundOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  greetingContainer: {
    flex: 1,
    marginRight: 16,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  profileButtonGradient: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 4,
  },
  personalizedMessage: {
    fontSize: 14,
    color: '#5D6D7E',
    marginTop: 8,
    lineHeight: 20,
    fontStyle: 'italic',
  },

  insightCard: {
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  insightGradient: {
    padding: 20,
  },
  insightContent: {
    alignItems: 'center',
  },
  insightTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  insightText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 20,
    marginBottom: 12,
  },
  insightAction: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  insightActionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginHorizontal: 24,
    marginBottom: 16,
  },
  quickActionsScroll: {
    paddingLeft: 24,
  },
  quickActionsScrollContainer: {
    paddingRight: 24,
  },
  quickAction: {
    alignItems: 'center',
    marginRight: 20,
    minWidth: 70,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  categoryCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  cardGradient: {
    height: 120,
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  cardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  cardSubtitle: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
  progressCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressItem: {
    flex: 1,
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 8,
    textAlign: 'center',
  },
  progressValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 4,
  },
  progressDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E9ECEF',
    marginHorizontal: 20,
  },
  scoreContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  scoreText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dailyGoalsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  goalCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00B894',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  goalCheckboxEmpty: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  goalCheckmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  goalText: {
    fontSize: 16,
    color: '#2C3E50',
    flex: 1,
  },
});