import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { 
  Home, 
  ChefHat, 
  Sparkles,
  Star,
  MessageCircle
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const lifestyleMetrics = [
  { label: 'Home Score', value: '89%', icon: Home, color: '#55A3FF', trend: '+5%' },
  { label: 'Organization', value: '92%', icon: Sparkles, color: '#74B9FF', trend: '+8%' },
  { label: 'Meal Planning', value: '85%', icon: ChefHat, color: '#003D82', trend: '+12%' },
  { label: 'Life Quality', value: '94%', icon: Star, color: '#0984E3', trend: '+3%' }
];

const activeProjects = [
  {
    title: 'Living Room Refresh',
    progress: 75,
    deadline: '2 weeks',
    color: '#55A3FF',
    icon: Home,
    description: 'Furniture arrangement & decor'
  },
  {
    title: 'Kitchen Organization',
    progress: 90,
    deadline: '3 days',
    color: '#74B9FF',
    icon: ChefHat,
    description: 'Pantry & cabinet optimization'
  }
];

const todaysMeals = {
  breakfast: 'Overnight Oats',
  lunch: 'Quinoa Salad',
  dinner: 'Grilled Salmon'
};

const weeklyStats = {
  mealsPlanned: 18,
  recipesCooked: 5,
  mealPrepDays: 2
};

const todaysTasks = [
  {
    task: 'File documents',
    area: 'Office',
    time: '9:00 AM',
    description: 'Sort and organize paperwork',
    completed: false,
    icon: Sparkles,
    color: '#74B9FF'
  },
  {
    task: 'Organize spice rack',
    area: 'Kitchen',
    time: '2:00 PM',
    description: 'Alphabetical arrangement',
    completed: true,
    icon: ChefHat,
    color: '#003D82'
  },
  {
    task: 'Arrange books',
    area: 'Living Room',
    time: '4:00 PM',
    description: 'By genre and author',
    completed: true,
    icon: Home,
    color: '#55A3FF'
  }
];

const lifestyleGoals = [
  {
    goal: 'Organized Home',
    progress: 82,
    target: '15 areas',
    current: '12 areas'
  },
  {
    goal: 'Healthy Meal Planning',
    progress: 91,
    target: '35 meals',
    current: '32 meals'
  },
  {
    goal: 'Daily Routines',
    progress: 76,
    target: '7 routines',
    current: '5 routines'
  },
  {
    goal: 'Home Projects',
    progress: 68,
    target: '10 projects',
    current: '7 projects'
  }
];

export default function LifestyleScreen() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const handleHapticFeedback = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleChatPress = async () => {
    await handleHapticFeedback();
    router.push('/lifestyle-chat');
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

  const renderProject = (project: any, index: number) => {
    const IconComponent = project.icon;
    const isSelected = selectedProject === project.title;
    
    return (
      <TouchableOpacity 
        key={index} 
        style={[styles.projectCard, isSelected && styles.projectCardSelected]}
        activeOpacity={0.8}
        onPress={async () => {
          await handleHapticFeedback();
          setSelectedProject(isSelected ? null : project.title);
        }}
      >
        <View style={styles.projectHeader}>
          <View style={[styles.projectIcon, { backgroundColor: project.color + '20' }]}>
            <IconComponent size={20} color={project.color} />
          </View>
          <View style={styles.projectInfo}>
            <Text style={styles.projectTitle}>{project.title}</Text>
            <Text style={styles.projectDescription}>{project.description}</Text>
          </View>
          <View style={styles.projectMeta}>
            <Text style={styles.progressPercentage}>{project.progress}%</Text>
            <Text style={styles.projectDeadline}>{project.deadline}</Text>
          </View>
        </View>
        
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
      </TouchableOpacity>
    );
  };

  const renderMealCard = () => {
    return (
      <View style={styles.mealCard}>
        <Text style={styles.mealTitle}>Today&apos;s Meals</Text>
        <View style={styles.mealsList}>
          <Text style={styles.mealItem}>🌅 {todaysMeals.breakfast}</Text>
          <Text style={styles.mealItem}>☀️ {todaysMeals.lunch}</Text>
          <Text style={styles.mealItem}>🌙 {todaysMeals.dinner}</Text>
        </View>
      </View>
    );
  };

  const renderTask = (task: any, index: number) => {
    const IconComponent = task.icon;
    
    return (
      <TouchableOpacity 
        key={index} 
        style={[styles.taskCard, task.completed && styles.completedTask]}
        activeOpacity={0.8}
        onPress={handleHapticFeedback}
      >
        <View style={[styles.taskIcon, { backgroundColor: task.color + '20' }]}>
          <IconComponent size={16} color={task.color} />
        </View>
        <View style={styles.taskContent}>
          <Text style={styles.taskName}>{task.task}</Text>
          <Text style={styles.taskDescription}>{task.description}</Text>
        </View>
        <View style={styles.taskTime}>
          <Text style={styles.taskTimeText}>{task.time}</Text>
          {task.completed && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderGoal = (goal: any, index: number) => {
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
                backgroundColor: goal.progress >= 80 ? '#55A3FF' : goal.progress >= 60 ? '#FFD93D' : '#FF6B6B'
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
          title: "Home & Lifestyle",
          headerStyle: { backgroundColor: '#55A3FF' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={['#55A3FF', '#003D82']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <Home size={32} color="white" />
              <Text style={styles.headerTitle}>Lifestyle</Text>
              <Text style={styles.headerScore}>89%</Text>
              <Text style={styles.headerSubtitle}>Home & Life Balance</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.chatButton}
              onPress={handleChatPress}
              activeOpacity={0.8}
            >
              <MessageCircle size={20} color="white" />
              <Text style={styles.chatButtonText}>Lifestyle Coach</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Lifestyle Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Metrics</Text>
          <View style={styles.metricsGrid}>
            {lifestyleMetrics.map(renderMetricCard)}
          </View>
        </View>

        {/* Active Projects */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Projects</Text>
          <View style={styles.projectsList}>
            {activeProjects.map(renderProject)}
          </View>
        </View>

        {/* Today's Meals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Meals</Text>
          {renderMealCard()}
          
          <View style={styles.weeklyStatsCard}>
            <Text style={styles.statsTitle}>This Week</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{weeklyStats.mealsPlanned}</Text>
                <Text style={styles.statLabel}>Meals Planned</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{weeklyStats.recipesCooked}</Text>
                <Text style={styles.statLabel}>Recipes Cooked</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{weeklyStats.mealPrepDays}</Text>
                <Text style={styles.statLabel}>Prep Days</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Today's Tasks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Tasks</Text>
          {todaysTasks.map(renderTask)}
        </View>

        {/* This Week's Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week&apos;s Goals</Text>
          {lifestyleGoals.map(renderGoal)}
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
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
    gap: 8,
  },
  chatButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
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
  projectsList: {
    paddingHorizontal: 24,
  },
  projectCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  projectCardSelected: {
    borderWidth: 2,
    borderColor: '#55A3FF',
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  projectInfo: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  projectDescription: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  projectMeta: {
    alignItems: 'flex-end',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#55A3FF',
    marginBottom: 2,
  },
  projectDeadline: {
    fontSize: 10,
    color: '#7F8C8D',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  tasksList: {
    gap: 8,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  mealCard: {
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
  mealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  weeklyStatsCard: {
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
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#55A3FF',
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
    textAlign: 'center',
  },
  mealsList: {
    gap: 8,
  },
  mealItem: {
    fontSize: 12,
    color: '#7F8C8D',
    lineHeight: 16,
  },
  taskCard: {
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
  completedTask: {
    opacity: 0.7,
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
  },
  taskIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  taskDescription: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  taskTime: {
    alignItems: 'flex-end',
  },
  taskTimeText: {
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
    color: '#55A3FF',
  },
  goalDetail: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 8,
  },

});