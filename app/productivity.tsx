import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { 
  Target, 
  CheckCircle, 
  Clock, 
  Calendar,
  Plus,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  MessageCircle,
  Zap,
  Timer
} from 'lucide-react-native';
import { useCategories, useCategoryData, createActivityImpact } from '@/contexts/CategoryContext';

const { width } = Dimensions.get('window');

const todayGoals = [
  {
    id: 1,
    title: 'Complete project proposal',
    category: 'Work',
    priority: 'high',
    completed: false,
    estimatedTime: '2h'
  },
  {
    id: 2,
    title: 'Morning workout',
    category: 'Health',
    priority: 'medium',
    completed: true,
    estimatedTime: '45m'
  },
  {
    id: 3,
    title: 'Read 20 pages',
    category: 'Learning',
    priority: 'low',
    completed: false,
    estimatedTime: '30m'
  }
];

const habits = [
  { name: 'Morning meditation', streak: 8, completed: true, icon: '🧘' },
  { name: 'Daily journaling', streak: 15, completed: false, icon: '📝' },
  { name: 'Evening reading', streak: 9, completed: false, icon: '📚' }
];

const focusSessions = [
  { task: 'Project Research', duration: '25:00', status: 'completed' },
  { task: 'Email Management', duration: '15:00', status: 'completed' },
  { task: 'Design Review', duration: '45:00', status: 'in-progress' }
];

export default function ProductivityScreen() {
  const { addActivity } = useCategories();
  const { score: productivityScore, allScores } = useCategoryData('productivity');
  
  const [pomodoroTime, setPomodoroTime] = React.useState(25 * 60);
  const [isRunning, setIsRunning] = React.useState(false);
  const [goals, setGoals] = React.useState(todayGoals);
  const [dailyHabits, setDailyHabits] = React.useState(habits);
  
  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalGoals = goals.length;
  const completedHabits = dailyHabits.filter(habit => habit.completed).length;
  const totalHabits = dailyHabits.length;
  const focusTimeToday = '2.5h';

  // Timer effect
  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isRunning && pomodoroTime > 0) {
      console.log('Starting timer, current time:', pomodoroTime);
      interval = setInterval(() => {
        setPomodoroTime(time => {
          console.log('Timer tick, current time:', time);
          if (time <= 1) {
            setIsRunning(false);
            console.log('Pomodoro session completed!');
            // Add activity when pomodoro session completes
            addActivity({
              ...createActivityImpact.productivityTask(),
              categoryId: 'productivity',
              title: 'Completed Pomodoro Session'
            });
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, pomodoroTime, addActivity]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addNewGoal = () => {
    Alert.prompt(
      'New Goal',
      'What would you like to accomplish today?',
      (text) => {
        if (text && text.trim()) {
          const newGoal = {
            id: Date.now(),
            title: text.trim(),
            category: 'Personal',
            priority: 'medium' as const,
            completed: false,
            estimatedTime: '30m'
          };
          setGoals(prev => [...prev, newGoal]);
        }
      }
    );
  };

  const toggleGoal = (goalId: number) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => {
        if (goal.id === goalId && !goal.completed) {
          // Add activity when completing a goal
          addActivity({
            ...createActivityImpact.productivityTask(),
            categoryId: 'productivity',
            title: `Completed: ${goal.title}`
          });
        }
        return goal.id === goalId ? { ...goal, completed: !goal.completed } : goal;
      })
    );
  };

  const renderGoal = (goal: any, index: number) => {
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'high': return '#FF6B6B';
        case 'medium': return '#FFD93D';
        case 'low': return '#4ECDC4';
        default: return '#7F8C8D';
      }
    };

    const priorityColor = getPriorityColor(goal.priority);
    
    return (
      <View key={index} style={[styles.goalCard, goal.completed && styles.completedGoal]}>
        <TouchableOpacity 
          style={styles.goalCheckbox}
          onPress={() => toggleGoal(goal.id)}
        >
          {goal.completed ? (
            <CheckCircle size={24} color="#27AE60" />
          ) : (
            <View style={styles.uncheckedCircle} />
          )}
        </TouchableOpacity>
        
        <View style={styles.goalContent}>
          <Text style={[styles.goalTitle, goal.completed && styles.completedText]}>
            {goal.title}
          </Text>
          <View style={styles.goalMeta}>
            <View style={[styles.categoryBadge, { backgroundColor: priorityColor + '20' }]}>
              <Text style={[styles.categoryText, { color: priorityColor }]}>
                {goal.category}
              </Text>
            </View>
            <Text style={styles.goalTime}>{goal.estimatedTime}</Text>
          </View>
        </View>
      </View>
    );
  };

  const toggleHabit = (habitIndex: number) => {
    setDailyHabits(prevHabits => 
      prevHabits.map((habit, index) => {
        if (index === habitIndex && !habit.completed) {
          // Add activity when completing a habit
          let activityData;
          if (habit.name.includes('water')) {
            activityData = createActivityImpact.healthActivity();
          } else if (habit.name.includes('meditate')) {
            activityData = createActivityImpact.meditation(10);
          } else if (habit.name.includes('exercise')) {
            activityData = createActivityImpact.exercise('light');
          } else {
            activityData = createActivityImpact.productivityTask();
          }
          
          addActivity({
            ...activityData,
            categoryId: 'productivity',
            title: `Habit: ${habit.name}`
          });
        }
        return index === habitIndex ? { ...habit, completed: !habit.completed } : habit;
      })
    );
  };

  const renderHabit = (habit: any, index: number) => {
    return (
      <View key={index} style={styles.habitCard}>
        <Text style={styles.habitIcon}>{habit.icon}</Text>
        <View style={styles.habitContent}>
          <Text style={styles.habitName}>{habit.name}</Text>
          <Text style={styles.habitStreak}>{habit.streak} day streak</Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.habitCheckbox,
            { backgroundColor: habit.completed ? '#27AE60' : '#E9ECEF' }
          ]}
          onPress={() => toggleHabit(index)}
        >
          {habit.completed && <CheckCircle size={20} color="white" />}
        </TouchableOpacity>
      </View>
    );
  };

  const renderFocusSession = (session: any, index: number) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'completed': return '#27AE60';
        case 'in-progress': return '#3498DB';
        default: return '#7F8C8D';
      }
    };

    const statusColor = getStatusColor(session.status);
    
    return (
      <View key={index} style={styles.sessionCard}>
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionTask}>{session.task}</Text>
        </View>
        <View style={styles.sessionMeta}>
          <Text style={styles.sessionDuration}>{session.duration}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {session.status === 'in-progress' ? 'Active' : 'Done'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Productivity",
          headerStyle: { backgroundColor: '#FD79A8' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => router.push('/productivity-chat')}
              style={{ marginRight: 16 }}
            >
              <MessageCircle size={24} color="white" />
            </TouchableOpacity>
          )
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
            colors={['#FD79A8', '#E84393']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <Zap size={32} color="white" />
              <Text style={styles.headerTitle}>Today&apos;s Progress</Text>
              <Text style={styles.headerScore}>{Math.round((completedGoals / totalGoals + completedHabits / totalHabits) * 50)}%</Text>
              <Text style={styles.headerSubtitle}>
                {completedGoals}/{totalGoals} goals • {completedHabits}/{totalHabits} habits
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Focus Timer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Focus Timer</Text>
          <View style={styles.pomodoroCard}>
            <View style={styles.timerDisplay}>
              <Timer size={28} color="#FD79A8" />
              <Text style={styles.timerText}>{formatTime(pomodoroTime)}</Text>
              <Text style={styles.timerLabel}>Pomodoro Session</Text>
            </View>
            <View style={styles.timerControls}>
              <TouchableOpacity 
                style={[styles.timerButton, { backgroundColor: isRunning ? '#FF6B6B' : '#4ECDC4' }]}
                onPress={() => setIsRunning(!isRunning)}
              >
                {isRunning ? (
                  <Pause size={24} color="white" />
                ) : (
                  <Play size={24} color="white" fill="white" />
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.timerButton, { backgroundColor: '#95A5A6' }]}
                onPress={() => {
                  setIsRunning(false);
                  setPomodoroTime(25 * 60);
                }}
              >
                <RotateCcw size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Overview</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Target size={24} color="#FD79A8" />
              <Text style={styles.statValue}>{completedGoals}/{totalGoals}</Text>
              <Text style={styles.statLabel}>Goals</Text>
            </View>
            <View style={styles.statCard}>
              <Calendar size={24} color="#4ECDC4" />
              <Text style={styles.statValue}>{completedHabits}/{totalHabits}</Text>
              <Text style={styles.statLabel}>Habits</Text>
            </View>
            <View style={styles.statCard}>
              <Clock size={24} color="#FFD93D" />
              <Text style={styles.statValue}>{focusTimeToday}</Text>
              <Text style={styles.statLabel}>Focus Time</Text>
            </View>
          </View>
        </View>

        {/* Today's Goals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today&apos;s Goals</Text>
            <TouchableOpacity style={styles.addButton} onPress={addNewGoal}>
              <Plus size={20} color="#667eea" />
            </TouchableOpacity>
          </View>
          {goals.map(renderGoal)}
        </View>

        {/* Habits Tracker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Habits</Text>
          {dailyHabits.map(renderHabit)}
        </View>

        {/* Recent Sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          <View style={styles.sessionsContainer}>
            {focusSessions.map(renderFocusSession)}
          </View>
        </View>

        {/* Weekly Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <TrendingUp size={24} color="#FD79A8" />
              <Text style={styles.insightTitle}>Your Impact</Text>
            </View>
            <Text style={styles.insightText}>
              Productivity drives growth across all areas. Your focus sessions boost confidence and create momentum for wealth building.
            </Text>
            <View style={styles.insightStats}>
              <View style={styles.insightStat}>
                <Text style={styles.insightStatValue}>{productivityScore}%</Text>
                <Text style={styles.insightStatLabel}>Productivity</Text>
              </View>
              <View style={styles.insightStat}>
                <Text style={styles.insightStatValue}>{allScores.confidence}%</Text>
                <Text style={styles.insightStatLabel}>Confidence</Text>
              </View>
              <View style={styles.insightStat}>
                <Text style={styles.insightStatValue}>{allScores.wealth}%</Text>
                <Text style={styles.insightStatLabel}>Wealth</Text>
              </View>
            </View>
          </View>
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
  pomodoroCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
    marginBottom: 8,
  },
  timerLabel: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  timerControls: {
    flexDirection: 'row',
    gap: 16,
  },
  timerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: (width - 72) / 3,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  goalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  completedGoal: {
    opacity: 0.7,
  },
  goalCheckbox: {
    marginRight: 16,
  },
  uncheckedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#BDC3C7',
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
    marginBottom: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#7F8C8D',
  },
  goalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  goalTime: {
    fontSize: 12,
    color: '#7F8C8D',
  },

  habitCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  habitIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  habitContent: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
    marginBottom: 4,
  },
  habitStreak: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  habitCheckbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  sessionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTask: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
    marginBottom: 4,
  },

  sessionMeta: {
    alignItems: 'flex-end',
  },
  sessionDuration: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
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
});