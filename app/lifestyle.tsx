import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { 
  Home, 
  ChefHat, 
  Sparkles,
  CheckCircle,
  Star,
  Plus,
  MessageCircle
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const lifestyleMetrics = [
  { label: 'Home Score', value: '89%', icon: Home, color: '#55A3FF' },
  { label: 'Organization', value: '92%', icon: Sparkles, color: '#74B9FF' },
  { label: 'Meal Planning', value: '85%', icon: ChefHat, color: '#003D82' },
  { label: 'Life Quality', value: '94%', icon: Star, color: '#0984E3' }
];

const activeProjects = [
  {
    title: 'Living Room Refresh',
    progress: 75,
    deadline: '2 weeks',
    color: '#55A3FF'
  },
  {
    title: 'Kitchen Organization',
    progress: 90,
    deadline: '3 days',
    color: '#74B9FF'
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
  { task: 'File documents', area: 'Office', completed: false },
  { task: 'Organize spice rack', area: 'Kitchen', completed: true },
  { task: 'Arrange books', area: 'Living Room', completed: true }
];

const lifestyleGoals = [
  {
    title: 'Organized Home',
    progress: 82,
    target: 'Complete by month end'
  },
  {
    title: 'Healthy Meal Planning',
    progress: 91,
    target: '5 days per week'
  }
];

export default function LifestyleScreen() {
  const renderMetricCard = (metric: any, index: number) => {
    const IconComponent = metric.icon;
    
    return (
      <View key={index} style={styles.metricCard}>
        <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
          <IconComponent size={20} color={metric.color} />
        </View>
        <Text style={styles.metricValue}>{metric.value}</Text>
        <Text style={styles.metricLabel}>{metric.label}</Text>
      </View>
    );
  };

  const renderProject = (project: any, index: number) => {
    const progressWidth = (width - 72) * (project.progress / 100);
    
    return (
      <View key={index} style={styles.projectCard}>
        <View style={styles.projectHeader}>
          <View style={styles.projectInfo}>
            <Text style={styles.projectTitle}>{project.title}</Text>
            <Text style={styles.projectMeta}>Due in {project.deadline}</Text>
          </View>
          <Text style={styles.progressPercentage}>{project.progress}%</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: progressWidth, backgroundColor: project.color }
              ]} 
            />
          </View>
        </View>
      </View>
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
    return (
      <View key={index} style={[styles.taskCard, task.completed && styles.completedTask]}>
        <TouchableOpacity style={styles.taskCheckbox}>
          {task.completed ? (
            <CheckCircle size={20} color="#27AE60" />
          ) : (
            <View style={styles.uncheckedCircle} />
          )}
        </TouchableOpacity>
        
        <View style={styles.taskContent}>
          <Text style={[styles.taskTitle, task.completed && styles.completedText]}>
            {task.task}
          </Text>
          <Text style={styles.taskArea}>{task.area}</Text>
        </View>
      </View>
    );
  };

  const renderGoal = (goal: any, index: number) => {
    const progressWidth = (width - 72) * (goal.progress / 100);
    
    return (
      <View key={index} style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalTitle}>{goal.title}</Text>
          <Text style={styles.goalProgress}>{goal.progress}%</Text>
        </View>
        <Text style={styles.goalTarget}>{goal.target}</Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: progressWidth, backgroundColor: '#55A3FF' }
              ]} 
            />
          </View>
        </View>
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
              onPress={() => router.push('/lifestyle-chat')}
            >
              <MessageCircle size={20} color="white" />
              <Text style={styles.chatButtonText}>Get Advice</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.metricsGrid}>
            {lifestyleMetrics.map(renderMetricCard)}
          </View>
        </View>

        {/* Active Projects */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Projects</Text>
            <TouchableOpacity style={styles.addButton}>
              <Plus size={20} color="#55A3FF" />
            </TouchableOpacity>
          </View>
          {activeProjects.map(renderProject)}
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

        {/* Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goals</Text>
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
  },
  projectCard: {
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
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  projectInfo: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  projectMeta: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
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
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  completedTask: {
    opacity: 0.7,
  },
  taskCheckbox: {
    marginRight: 16,
  },
  uncheckedCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#BDC3C7',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#7F8C8D',
  },
  taskArea: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
  goalCard: {
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
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  goalProgress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#55A3FF',
  },
  goalTarget: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 16,
  },

});