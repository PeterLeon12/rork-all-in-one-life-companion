import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
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
  Zap,
  Coffee,
  Dumbbell,
  ShieldCheck,
  MapPin,
  HandHeart
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useCategories } from '@/contexts/CategoryContext';

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
    title: 'Health',
    subtitle: 'Mind & Body Wellness',
    icon: Heart,
    gradient: ['#FF6B6B', '#FF8E8E'] as [string, string],
    route: '/health'
  },
  {
    id: 'fitness',
    title: 'Fitness',
    subtitle: 'Sports & Training',
    icon: Dumbbell,
    gradient: ['#FF7675', '#E17055'] as [string, string],
    route: '/fitness'
  },
  {
    id: 'wealth',
    title: 'Wealth',
    subtitle: 'Career & Finance',
    icon: DollarSign,
    gradient: ['#4ECDC4', '#44A08D'] as [string, string],
    route: '/wealth'
  },
  {
    id: 'relationships',
    title: 'Relationships',
    subtitle: 'Family & Connection',
    icon: Users,
    gradient: ['#A8E6CF', '#7FCDCD'] as [string, string],
    route: '/relationships'
  },
  {
    id: 'confidence',
    title: 'Confidence',
    subtitle: 'Inner Strength',
    icon: Shield,
    gradient: ['#FFD93D', '#FF9F43'] as [string, string],
    route: '/confidence'
  },
  {
    id: 'learning',
    title: 'Learning',
    subtitle: 'Education & Growth',
    icon: BookOpen,
    gradient: ['#6C5CE7', '#A29BFE'] as [string, string],
    route: '/learning'
  },
  {
    id: 'productivity',
    title: 'Productivity',
    subtitle: 'Goals & Habits',
    icon: Target,
    gradient: ['#FD79A8', '#E84393'] as [string, string],
    route: '/productivity'
  },
  {
    id: 'mindfulness',
    title: 'Mindfulness',
    subtitle: 'Inner Peace',
    icon: Brain,
    gradient: ['#9B59B6', '#8E44AD'] as [string, string],
    route: '/mindfulness'
  },
  {
    id: 'creativity',
    title: 'Creativity',
    subtitle: 'Arts & Expression',
    icon: Palette,
    gradient: ['#E67E22', '#D35400'] as [string, string],
    route: '/creativity'
  },
  {
    id: 'energy',
    title: 'Energy',
    subtitle: 'Vitality & Focus',
    icon: Zap,
    gradient: ['#F39C12', '#E67E22'] as [string, string],
    route: '/energy'
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle',
    subtitle: 'Home & Balance',
    icon: Coffee,
    gradient: ['#16A085', '#1ABC9C'] as [string, string],
    route: '/lifestyle'
  },
  {
    id: 'break-free',
    title: 'Break Free',
    subtitle: 'Habit Freedom',
    icon: ShieldCheck,
    gradient: ['#00B894', '#55A3FF'] as [string, string],
    route: '/break-free'
  },
  {
    id: 'travel',
    title: 'Travel',
    subtitle: 'Adventure & Culture',
    icon: MapPin,
    gradient: ['#FF9500', '#FF5722'] as [string, string],
    route: '/travel'
  },
  {
    id: 'community',
    title: 'Community',
    subtitle: 'Service & Impact',
    icon: HandHeart,
    gradient: ['#8BC34A', '#4CAF50'] as [string, string],
    route: '/community'
  }
];

const quickActions = [
  { title: 'Daily Check-in', icon: Heart, color: '#FF6B6B' },
  { title: 'Goal Progress', icon: Target, color: '#4ECDC4' },
  { title: 'Mood Tracker', icon: Brain, color: '#6C5CE7' },
  { title: 'Quick Journal', icon: BookOpen, color: '#FFD93D' }
];

export default function HomeScreen() {
  const { getOverallScore, getCategoryProgress } = useCategories();
  
  const overallScore = getOverallScore();
  
  const renderCategoryCard = (category: CategoryCard) => {
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
  };

  const renderQuickAction = (action: any, index: number) => {
    const IconComponent = action.icon;
    
    return (
      <TouchableOpacity key={index} style={styles.quickAction} activeOpacity={0.7}>
        <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
          <IconComponent size={20} color={action.color} />
        </View>
        <Text style={styles.quickActionText}>{action.title}</Text>
      </TouchableOpacity>
    );
  };

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
        <View>
          <Text style={styles.greeting}>Good morning! 👋</Text>
          <Text style={styles.subtitle}>Ready to grow today?</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitial}>U</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Daily Insight */}
      <View style={styles.insightCard}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.insightGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.insightContent}>
            <Sparkles size={24} color="white" />
            <Text style={styles.insightTitle}>Today's Insight</Text>
            <Text style={styles.insightText}>
              Your actions in one area boost others! Exercise improves health, energy, and confidence.
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          {quickActions.map(renderQuickAction)}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Life Areas</Text>
        <View style={styles.categoriesContainer}>
          {categories.map(renderCategoryCard)}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
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
  profileButton: {
    padding: 4,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
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
});