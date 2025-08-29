import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { 
  Heart, 
  Activity, 
  Brain, 
  Moon, 
  Droplets,
  Plus,
  MessageCircle,
  CheckCircle,
  Utensils
} from 'lucide-react-native';
import { useCategories, useCategoryData, createActivityImpact } from '@/contexts/CategoryContext';

const { width } = Dimensions.get('window');

interface HealthMetric {
  id: string;
  label: string;
  value: number;
  target: number;
  unit: string;
  icon: React.ComponentType<any>;
  color: string;
  actionable: boolean;
}

interface QuickAction {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  action?: string;
  increment?: number;
}

const initialHealthMetrics: HealthMetric[] = [
  { id: 'steps', label: 'Steps Today', value: 8432, target: 10000, unit: 'steps', icon: Activity, color: '#FF6B6B', actionable: false },
  { id: 'water', label: 'Water Intake', value: 6, target: 8, unit: 'glasses', icon: Droplets, color: '#4ECDC4', actionable: true },
  { id: 'sleep', label: 'Sleep Hours', value: 7.5, target: 8, unit: 'hours', icon: Moon, color: '#6C5CE7', actionable: true },
  { id: 'meditation', label: 'Meditation', value: 15, target: 20, unit: 'minutes', icon: Brain, color: '#FFD93D', actionable: true }
];

const quickActions: QuickAction[] = [
  { id: 'water', title: 'Water', icon: Droplets, color: '#4ECDC4', action: 'water', increment: 1 },
  { id: 'meditation', title: 'Meditate', icon: Brain, color: '#6C5CE7', action: 'meditation', increment: 10 },
  { id: 'meal', title: 'Meal', icon: Utensils, color: '#27AE60', action: 'meal' },
  { id: 'mood', title: 'Mood', icon: Heart, color: '#FFD93D', action: 'mood' }
];

const healthPrograms = [
  {
    title: 'Fitness Challenge',
    description: '30-day transformation',
    progress: 67,
    color: '#4ECDC4',
    route: '/fitness'
  },
  {
    title: 'Mindfulness',
    description: 'Daily meditation practice',
    progress: 29,
    color: '#6C5CE7'
  },
  {
    title: 'Break Free',
    description: 'Overcome harmful habits',
    progress: 0,
    color: '#E74C3C',
    route: '/break-free'
  }
];

export default function HealthScreen() {
  const { addActivity } = useCategories();
  const { score: healthScore, weeklyImprovement } = useCategoryData('health');
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>(initialHealthMetrics);
  const [dailyStreak] = useState<number>(5);

  // Load saved metrics from storage
  useEffect(() => {
    // In a real app, you'd load this from AsyncStorage
    // For now, we'll simulate some dynamic data
    const updateMetrics = () => {
      setHealthMetrics(prev => prev.map(metric => {
        if (metric.id === 'steps') {
          // Simulate step counter updates
          return { ...metric, value: Math.min(metric.target, metric.value + Math.floor(Math.random() * 100)) };
        }
        return metric;
      }));
    };

    const interval = setInterval(updateMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);
  
  const updateMetric = (metricId: string, increment: number) => {
    setHealthMetrics(prev => prev.map(metric => {
      if (metric.id === metricId) {
        const newValue = Math.min(metric.target, metric.value + increment);
        return { ...metric, value: newValue };
      }
      return metric;
    }));
  };

  const handleQuickAction = (action: QuickAction) => {
    executeAction(action);
  };

  const executeAction = (action: QuickAction) => {
    let activityData;
    let metricUpdate = null;
    
    switch (action.action) {
      case 'meditation':
        activityData = {
          ...createActivityImpact.meditation(action.increment || 10),
          categoryId: 'health',
          title: `Meditation - ${action.increment} min`
        };
        metricUpdate = { id: 'meditation', increment: action.increment || 10 };
        break;
      case 'water':
        activityData = {
          ...createActivityImpact.healthActivity(),
          categoryId: 'health',
          title: 'Drank water',
          impact: { health: 1, energy: 1 }
        };
        metricUpdate = { id: 'water', increment: action.increment || 1 };
        break;
      case 'mood':
        activityData = {
          ...createActivityImpact.healthActivity(),
          categoryId: 'health',
          title: 'Logged mood',
          impact: { health: 2, mindfulness: 1 }
        };
        break;
      case 'meal':
        activityData = {
          ...createActivityImpact.healthActivity(),
          categoryId: 'health',
          title: 'Logged meal',
          impact: { health: 2, energy: 1 }
        };
        break;
      default:
        activityData = {
          type: 'health',
          categoryId: 'health',
          title: action.title,
          impact: { health: 2 }
        };
    }
    
    addActivity(activityData);
    
    if (metricUpdate) {
      updateMetric(metricUpdate.id, metricUpdate.increment);
    }
  };
  
  const renderMetricCard = (metric: HealthMetric, index: number) => {
    const IconComponent = metric.icon;
    const progress = Math.round((metric.value / metric.target) * 100);
    const progressWidth = (width - 72) * (progress / 100);
    const isCompleted = metric.value >= metric.target;
    
    return (
      <TouchableOpacity 
        key={index} 
        style={[
          styles.metricCard,
          isCompleted && styles.metricCardCompleted
        ]}
        onPress={() => {
          if (metric.actionable) {
            const action: QuickAction = {
              id: metric.id,
              title: metric.label,
              icon: metric.icon,
              color: metric.color,
              action: metric.id,
              increment: metric.id === 'water' ? 1 : metric.id === 'meditation' ? 10 : undefined
            };
            handleQuickAction(action);
          }
        }}
        activeOpacity={metric.actionable ? 0.8 : 1}
      >
        <View style={styles.metricHeader}>
          <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
            <IconComponent size={20} color={metric.color} />
            {isCompleted && (
              <View style={styles.completedBadge}>
                <CheckCircle size={12} color="#27AE60" />
              </View>
            )}
          </View>
          <View style={styles.metricInfo}>
            <Text style={styles.metricLabel}>{metric.label}</Text>
            <Text style={styles.metricValue}>
              {metric.value.toLocaleString()} {metric.unit}
            </Text>
            <Text style={styles.metricTarget}>Goal: {metric.target.toLocaleString()} {metric.unit}</Text>
          </View>
          <View style={styles.metricProgressContainer}>
            <Text style={[styles.metricProgress, isCompleted && styles.metricProgressCompleted]}>
              {progress}%
            </Text>
            {metric.actionable && (
              <TouchableOpacity style={styles.metricAddButton}>
                <Plus size={16} color={metric.color} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: progressWidth, backgroundColor: metric.color },
                isCompleted && styles.progressBarCompleted
              ]} 
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderQuickAction = (action: QuickAction, index: number) => {
    const IconComponent = action.icon;
    
    return (
      <TouchableOpacity 
        key={index} 
        style={styles.quickActionCard} 
        activeOpacity={0.7}
        onPress={() => handleQuickAction(action)}
      >
        <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
          <IconComponent size={20} color="white" />
        </View>
        <Text style={styles.quickActionTitle}>{action.title}</Text>
      </TouchableOpacity>
    );
  };

  const renderProgram = (program: any, index: number) => {
    const progressWidth = (width - 72) * (program.progress / 100);
    
    return (
      <TouchableOpacity 
        key={index} 
        style={styles.programCard}
        onPress={() => program.route && router.push(program.route)}
        activeOpacity={0.8}
      >
        <View style={styles.programHeader}>
          <View style={styles.programInfo}>
            <Text style={styles.programTitle}>{program.title}</Text>
            <Text style={styles.programDescription}>{program.description}</Text>
            {program.progress > 0 && (
              <Text style={styles.programDescription}>{program.progress}% complete</Text>
            )}
          </View>
          <View style={[styles.programIndicator, { backgroundColor: program.color }]} />
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
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Health",
          headerStyle: { backgroundColor: '#FF6B6B' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.backgroundOverlay}>
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
              <Text style={styles.headerTitle}>Health</Text>
              <Text style={styles.headerScore}>{healthScore}/100</Text>
              <Text style={styles.headerSubtitle}>
                {weeklyImprovement > 0 ? `+${weeklyImprovement} this week` : 'Keep building healthy habits'}
              </Text>
              
              <TouchableOpacity 
                style={styles.aiChatButton}
                onPress={() => router.push('/health-chat')}
                activeOpacity={0.8}
              >
                <MessageCircle size={20} color="white" />
                <Text style={styles.aiChatButtonText}>AI Coach</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Daily Streak */}
        <View style={styles.section}>
          <View style={styles.streakCard}>
            <Text style={styles.streakDays}>{dailyStreak}</Text>
            <Text style={styles.streakTitle}>Day Streak</Text>
          </View>
        </View>

        {/* Today's Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today</Text>
          {healthMetrics.map(renderMetricCard)}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Log</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Programs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Programs</Text>
          {healthPrograms.map(renderProgram)}
        </View>




            </ScrollView>
          </View>
        </LinearGradient>
      </View>


    </>
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    marginBottom: 12,
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
    width: (width - 60) / 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    marginBottom: 16,
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
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
  programIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
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
  // New styles for enhanced functionality
  metricCardCompleted: {
    borderColor: '#27AE60',
    borderWidth: 2,
  },
  completedBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  metricProgressContainer: {
    alignItems: 'center',
  },
  metricProgressCompleted: {
    color: '#27AE60',
  },
  metricAddButton: {
    marginTop: 4,
    padding: 4,
  },
  progressBarCompleted: {
    backgroundColor: '#27AE60',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    paddingHorizontal: 24,
    marginBottom: 16,
    marginTop: -8,
  },
  streakCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  streakTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  streakDays: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  streakSubtitle: {
    color: 'white',
    fontSize: 12,
    opacity: 0.9,
    marginTop: 4,
  },
  weeklyGoalsContainer: {
    paddingHorizontal: 24,
  },
  weeklyGoalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  weeklyGoalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  weeklyGoalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  weeklyGoalProgress: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  weeklyProgressBar: {
    height: 4,
    backgroundColor: '#E9ECEF',
    borderRadius: 2,
    overflow: 'hidden',
  },
  weeklyProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  durationText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginLeft: 8,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});