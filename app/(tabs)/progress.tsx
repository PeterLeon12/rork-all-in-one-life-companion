import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Award,
  Heart,
  DollarSign,
  Users,
  Shield,
  BookOpen,
  Zap,
  Dumbbell,
  Brain,
  Palette,
  Coffee,
  ShieldCheck,
  MapPin,
  HandHeart
} from 'lucide-react-native';
import { useCategories } from '@/contexts/CategoryContext';
import { useUser, useUserAchievements } from '@/contexts/UserContext';

const { width } = Dimensions.get('window');

interface ProgressData {
  category: string;
  icon: React.ComponentType<any>;
  color: string;
  progress: number;
  recentActivities: number;
  categoryId: string;
}

const categoryConfig = {
  health: { icon: Heart, color: '#FF6B6B', name: 'Health' },
  fitness: { icon: Dumbbell, color: '#E17055', name: 'Fitness' },
  wealth: { icon: DollarSign, color: '#4ECDC4', name: 'Wealth' },
  relationships: { icon: Users, color: '#7FCDCD', name: 'Relationships' },
  confidence: { icon: Shield, color: '#FFD93D', name: 'Confidence' },
  learning: { icon: BookOpen, color: '#6C5CE7', name: 'Learning' },
  productivity: { icon: Target, color: '#E84393', name: 'Productivity' },
  mindfulness: { icon: Brain, color: '#8E44AD', name: 'Mindfulness' },
  creativity: { icon: Palette, color: '#D35400', name: 'Creativity' },
  energy: { icon: Zap, color: '#E67E22', name: 'Energy' },
  lifestyle: { icon: Coffee, color: '#1ABC9C', name: 'Lifestyle' },
  'break-free': { icon: ShieldCheck, color: '#00B894', name: 'Break Free' },
  travel: { icon: MapPin, color: '#FF5722', name: 'Travel' },
  community: { icon: HandHeart, color: '#4CAF50', name: 'Community' }
};

export default function ProgressScreen() {
  const { scores, activities, getCategoryProgress } = useCategories();
  const { user } = useUser();
  const { unlockedAchievements, recentAchievements } = useUserAchievements();
  
  // Calculate real progress data from user activities
  const progressData: ProgressData[] = useMemo(() => {
    return Object.entries(categoryConfig).map(([categoryId, config]) => {
      const progress = getCategoryProgress(categoryId);
      const recentActivities = activities.filter(activity => 
        activity.categoryId === categoryId && 
        activity.timestamp > Date.now() - (7 * 24 * 60 * 60 * 1000) // Last 7 days
      ).length;
      
      return {
        category: config.name,
        icon: config.icon,
        color: config.color,
        progress,
        recentActivities,
        categoryId
      };
    }).sort((a, b) => b.progress - a.progress); // Sort by progress descending
  }, [scores, activities, getCategoryProgress]);
  
  // Calculate overall stats
  const overallStats = useMemo(() => {
    const totalActivities = activities.length;
    const thisWeekActivities = activities.filter(activity => 
      activity.timestamp > Date.now() - (7 * 24 * 60 * 60 * 1000)
    ).length;
    
    const averageScore = Math.round(
      Object.values(scores).reduce((sum: number, score: any) => sum + score, 0) / Object.keys(scores).length
    );
    
    const activeDays = new Set(
      activities
        .filter(activity => activity.timestamp > Date.now() - (7 * 24 * 60 * 60 * 1000))
        .map(activity => new Date(activity.timestamp).toDateString())
    ).size;
    
    return {
      averageScore,
      totalActivities,
      thisWeekActivities,
      activeDays,
      currentStreak: user.stats.currentStreak
    };
  }, [activities, scores, user.stats.currentStreak]);
  const renderProgressCard = (data: ProgressData, index: number) => {
    const IconComponent = data.icon;
    const progressWidth = Math.max((width - 72) * (data.progress / 100), 8); // Minimum width for visibility
    
    return (
      <TouchableOpacity key={index} style={styles.progressCard} activeOpacity={0.8}>
        <View style={styles.progressHeader}>
          <View style={styles.categoryInfo}>
            <View style={[styles.iconContainer, { backgroundColor: data.color + '20' }]}>
              <IconComponent size={20} color={data.color} />
            </View>
            <Text style={styles.categoryName}>{data.category}</Text>
          </View>
          <Text style={styles.progressPercentage}>{data.progress}%</Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: progressWidth, backgroundColor: data.color }
              ]} 
            />
          </View>
        </View>
        
        <View style={styles.progressStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{data.recentActivities}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{data.progress > 0 ? '✓' : '○'}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderAchievement = (achievement: any, index: number) => {
    return (
      <View key={index} style={styles.achievementCard}>
        <View style={[styles.achievementIcon, { backgroundColor: '#667eea20' }]}>
          <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
        </View>
        <View style={styles.achievementContent}>
          <Text style={styles.achievementTitle}>{achievement.title}</Text>
          <Text style={styles.achievementDescription}>{achievement.description}</Text>
          <Text style={styles.achievementDate}>
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
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
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Your Progress</Text>
              <Text style={styles.subtitle}>Track your growth across all life areas</Text>
            </View>

            <ScrollView 
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
        {/* Overall Stats */}
        <View style={styles.overallStatsCard}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.statsGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statsContent}>
              <View style={styles.statColumn}>
                <TrendingUp size={24} color="white" />
                <Text style={styles.statNumber}>{overallStats.averageScore}%</Text>
                <Text style={styles.statText}>Average Score</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statColumn}>
                <Target size={24} color="white" />
                <Text style={styles.statNumber}>{overallStats.totalActivities}</Text>
                <Text style={styles.statText}>Total Activities</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statColumn}>
                <Zap size={24} color="white" />
                <Text style={styles.statNumber}>{overallStats.currentStreak}</Text>
                <Text style={styles.statText}>Day Streak</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Category Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category Progress</Text>
          {progressData.map(renderProgressCard)}
        </View>

        {/* Recent Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          {recentAchievements.length > 0 ? (
            recentAchievements.map(renderAchievement)
          ) : (
            <View style={styles.emptyState}>
              <Award size={48} color="#BDC3C7" />
              <Text style={styles.emptyStateText}>Complete activities to unlock achievements!</Text>
            </View>
          )}
        </View>

        {/* Weekly Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Days Active</Text>
              <Text style={styles.summaryValue}>{overallStats.activeDays}/7</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Activities This Week</Text>
              <Text style={styles.summaryValue}>{overallStats.thisWeekActivities}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Achievements Unlocked</Text>
              <Text style={styles.summaryValue}>{unlockedAchievements.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Categories Active</Text>
              <Text style={styles.summaryValue}>{progressData.filter(p => p.progress > 0).length}</Text>
            </View>
          </View>
        </View>
            </ScrollView>
          </View>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  overallStatsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
  },
  statsGradient: {
    padding: 24,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statColumn: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statText: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
    marginTop: 4,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
  achievementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 18,
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  achievementEmoji: {
    fontSize: 24,
    textAlign: 'center',
  },
  achievementDate: {
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 4,
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#95A5A6',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
});