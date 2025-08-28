import React from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
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
  Zap
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ProgressData {
  category: string;
  icon: React.ComponentType<any>;
  color: string;
  progress: number;
  streak: number;
  completedGoals: number;
  totalGoals: number;
}

const progressData: ProgressData[] = [
  {
    category: 'Health',
    icon: Heart,
    color: '#FF6B6B',
    progress: 78,
    streak: 12,
    completedGoals: 8,
    totalGoals: 10
  },
  {
    category: 'Wealth',
    icon: DollarSign,
    color: '#4ECDC4',
    progress: 65,
    streak: 8,
    completedGoals: 6,
    totalGoals: 12
  },
  {
    category: 'Relationships',
    icon: Users,
    color: '#A8E6CF',
    progress: 82,
    streak: 15,
    completedGoals: 9,
    totalGoals: 11
  },
  {
    category: 'Confidence',
    icon: Shield,
    color: '#FFD93D',
    progress: 71,
    streak: 6,
    completedGoals: 5,
    totalGoals: 8
  },
  {
    category: 'Learning',
    icon: BookOpen,
    color: '#6C5CE7',
    progress: 89,
    streak: 21,
    completedGoals: 12,
    totalGoals: 14
  }
];

const achievements = [
  { title: '7-Day Streak', description: 'Completed daily check-ins for a week', icon: Calendar, color: '#FF6B6B' },
  { title: 'Goal Crusher', description: 'Completed 50 goals this month', icon: Target, color: '#4ECDC4' },
  { title: 'Learning Master', description: 'Finished 5 courses', icon: BookOpen, color: '#6C5CE7' },
  { title: 'Wellness Warrior', description: 'Maintained health habits for 30 days', icon: Heart, color: '#A8E6CF' }
];

export default function ProgressScreen() {
  const renderProgressCard = (data: ProgressData, index: number) => {
    const IconComponent = data.icon;
    const progressWidth = (width - 72) * (data.progress / 100);
    
    return (
      <View key={index} style={styles.progressCard}>
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
            <Text style={styles.statValue}>{data.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{data.completedGoals}/{data.totalGoals}</Text>
            <Text style={styles.statLabel}>Goals</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderAchievement = (achievement: any, index: number) => {
    const IconComponent = achievement.icon;
    
    return (
      <View key={index} style={styles.achievementCard}>
        <View style={[styles.achievementIcon, { backgroundColor: achievement.color + '20' }]}>
          <IconComponent size={24} color={achievement.color} />
        </View>
        <View style={styles.achievementContent}>
          <Text style={styles.achievementTitle}>{achievement.title}</Text>
          <Text style={styles.achievementDescription}>{achievement.description}</Text>
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
                <Text style={styles.statNumber}>+18%</Text>
                <Text style={styles.statText}>Overall Growth</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statColumn}>
                <Target size={24} color="white" />
                <Text style={styles.statNumber}>47</Text>
                <Text style={styles.statText}>Goals Completed</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statColumn}>
                <Zap size={24} color="white" />
                <Text style={styles.statNumber}>28</Text>
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
          {achievements.map(renderAchievement)}
        </View>

        {/* Weekly Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Days Active</Text>
              <Text style={styles.summaryValue}>6/7</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Goals Completed</Text>
              <Text style={styles.summaryValue}>12</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time Invested</Text>
              <Text style={styles.summaryValue}>4h 32m</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Categories Improved</Text>
              <Text style={styles.summaryValue}>5</Text>
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
});