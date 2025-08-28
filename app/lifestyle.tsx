import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { 
  Home, 
  ChefHat, 
  Palette as PaletteIcon, 
  Sparkles,
  CheckCircle,
  Clock,
  Star,
  Plus,
  TrendingUp,
  Award,
  Calendar,
  Target
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const lifestyleMetrics = [
  { label: 'Home Projects', value: '8', icon: Home, color: '#55A3FF' },
  { label: 'Recipes Tried', value: '23', icon: ChefHat, color: '#003D82' },
  { label: 'Organization Score', value: '87%', icon: Sparkles, color: '#74B9FF' },
  { label: 'Life Quality', value: '92%', icon: Star, color: '#0984E3' }
];

const homeProjects = [
  {
    title: 'Living Room Makeover',
    category: 'Interior Design',
    progress: 75,
    timeSpent: '18h',
    deadline: '2 weeks',
    color: '#55A3FF',
    tasks: ['Paint walls', 'New furniture', 'Lighting setup']
  },
  {
    title: 'Kitchen Organization',
    category: 'Organization',
    progress: 90,
    timeSpent: '6h',
    deadline: '3 days',
    color: '#74B9FF',
    tasks: ['Pantry sorting', 'Cabinet labels', 'Spice rack']
  },
  {
    title: 'Garden Planning',
    category: 'Outdoor',
    progress: 45,
    timeSpent: '12h',
    deadline: '1 month',
    color: '#003D82',
    tasks: ['Soil prep', 'Plant selection', 'Layout design']
  }
];

const weeklyMeals = [
  {
    day: 'Monday',
    breakfast: 'Overnight Oats',
    lunch: 'Quinoa Salad',
    dinner: 'Grilled Salmon',
    prep: true
  },
  {
    day: 'Tuesday',
    breakfast: 'Smoothie Bowl',
    lunch: 'Leftover Salmon',
    dinner: 'Pasta Primavera',
    prep: false
  },
  {
    day: 'Wednesday',
    breakfast: 'Avocado Toast',
    lunch: 'Soup & Sandwich',
    dinner: 'Stir Fry',
    prep: true
  },
  {
    day: 'Thursday',
    breakfast: 'Greek Yogurt',
    lunch: 'Buddha Bowl',
    dinner: 'Tacos',
    prep: false
  }
];

const organizationTasks = [
  { area: 'Bedroom', task: 'Declutter closet', completed: true, priority: 'high' },
  { area: 'Kitchen', task: 'Organize spice rack', completed: true, priority: 'medium' },
  { area: 'Office', task: 'File documents', completed: false, priority: 'high' },
  { area: 'Bathroom', task: 'Medicine cabinet', completed: false, priority: 'low' },
  { area: 'Living Room', task: 'Arrange books', completed: true, priority: 'medium' }
];

const lifestyleGoals = [
  {
    title: 'Sustainable Living',
    description: 'Reduce waste and live more eco-friendly',
    progress: 68,
    actions: ['Composting', 'Reusable containers', 'Energy saving']
  },
  {
    title: 'Minimalist Approach',
    description: 'Simplify possessions and focus on essentials',
    progress: 82,
    actions: ['Decluttering', 'Quality over quantity', 'Mindful purchases']
  },
  {
    title: 'Cozy Home Atmosphere',
    description: 'Create a warm and welcoming living space',
    progress: 91,
    actions: ['Soft lighting', 'Plants', 'Comfortable textiles']
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
            <Text style={styles.projectCategory}>{project.category}</Text>
            <Text style={styles.projectMeta}>
              {project.timeSpent} spent • Due in {project.deadline}
            </Text>
          </View>
          <View style={styles.projectProgress}>
            <Text style={styles.progressPercentage}>{project.progress}%</Text>
          </View>
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
        
        <View style={styles.tasksList}>
          {project.tasks.map((task: string, taskIndex: number) => (
            <View key={taskIndex} style={styles.taskItem}>
              <CheckCircle size={12} color={project.color} />
              <Text style={styles.taskText}>{task}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderMealDay = (meal: any, index: number) => {
    return (
      <View key={index} style={styles.mealCard}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealDay}>{meal.day}</Text>
          {meal.prep && (
            <View style={styles.prepBadge}>
              <Text style={styles.prepText}>Prep Day</Text>
            </View>
          )}
        </View>
        <View style={styles.mealsList}>
          <Text style={styles.mealItem}>🌅 {meal.breakfast}</Text>
          <Text style={styles.mealItem}>☀️ {meal.lunch}</Text>
          <Text style={styles.mealItem}>🌙 {meal.dinner}</Text>
        </View>
      </View>
    );
  };

  const renderOrganizationTask = (task: any, index: number) => {
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'high': return '#FF6B6B';
        case 'medium': return '#FFD93D';
        case 'low': return '#4ECDC4';
        default: return '#7F8C8D';
      }
    };

    const priorityColor = getPriorityColor(task.priority);
    
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
          <View style={styles.taskMeta}>
            <Text style={styles.taskArea}>{task.area}</Text>
            <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '20' }]}>
              <Text style={[styles.priorityText, { color: priorityColor }]}>
                {task.priority}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderLifestyleGoal = (goal: any, index: number) => {
    const progressWidth = (width - 72) * (goal.progress / 100);
    
    return (
      <View key={index} style={styles.goalCard}>
        <Text style={styles.goalTitle}>{goal.title}</Text>
        <Text style={styles.goalDescription}>{goal.description}</Text>
        
        <View style={styles.goalProgress}>
          <View style={styles.goalProgressBar}>
            <View 
              style={[
                styles.goalProgressFill, 
                { width: progressWidth, backgroundColor: '#55A3FF' }
              ]} 
            />
          </View>
          <Text style={styles.goalProgressText}>{goal.progress}%</Text>
        </View>
        
        <View style={styles.actionsList}>
          {goal.actions.map((action: string, actionIndex: number) => (
            <View key={actionIndex} style={styles.actionItem}>
              <Text style={styles.actionText}>• {action}</Text>
            </View>
          ))}
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
        {/* Header Stats */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={['#55A3FF', '#003D82']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <Home size={32} color="white" />
              <Text style={styles.headerTitle}>Lifestyle Score</Text>
              <Text style={styles.headerScore}>89/100</Text>
              <Text style={styles.headerSubtitle}>Creating your perfect home</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Lifestyle Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Home Overview</Text>
          <View style={styles.metricsGrid}>
            {lifestyleMetrics.map(renderMetricCard)}
          </View>
        </View>

        {/* Home Projects */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Projects</Text>
            <TouchableOpacity style={styles.addButton}>
              <Plus size={20} color="#667eea" />
            </TouchableOpacity>
          </View>
          {homeProjects.map(renderProject)}
        </View>

        {/* Meal Planning */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week's Meals</Text>
          <View style={styles.mealsContainer}>
            {weeklyMeals.map(renderMealDay)}
          </View>
        </View>

        {/* Organization Tasks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Organization Checklist</Text>
          {organizationTasks.map(renderOrganizationTask)}
        </View>

        {/* Lifestyle Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lifestyle Goals</Text>
          {lifestyleGoals.map(renderLifestyleGoal)}
        </View>

        {/* Weekly Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week's Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <TrendingUp size={24} color="#55A3FF" />
              <Text style={styles.progressTitle}>Home Improvement</Text>
            </View>
            <Text style={styles.progressText}>
              Great week for home projects! You completed 3 organization tasks and made significant progress on your living room makeover. Your home is becoming more beautiful and functional.
            </Text>
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>3</Text>
                <Text style={styles.progressStatLabel}>Tasks Done</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>15h</Text>
                <Text style={styles.progressStatLabel}>Project Time</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>+12%</Text>
                <Text style={styles.progressStatLabel}>Organization</Text>
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
  projectCategory: {
    fontSize: 14,
    color: '#667eea',
    marginBottom: 8,
  },
  projectMeta: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  projectProgress: {
    alignItems: 'center',
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
  mealsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  mealCard: {
    backgroundColor: 'white',
    width: (width - 60) / 2,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealDay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  prepBadge: {
    backgroundColor: '#4ECDC420',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  prepText: {
    fontSize: 10,
    color: '#4ECDC4',
    fontWeight: '600',
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
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskArea: {
    fontSize: 12,
    color: '#667eea',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
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
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 16,
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  actionsList: {
    gap: 4,
  },
  actionItem: {
    marginLeft: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  progressCard: {
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
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 12,
  },
  progressText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 20,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  progressStatLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
    textAlign: 'center',
  },
});