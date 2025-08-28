import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
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
  Award
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const productivityMetrics = [
  { label: 'Goals Completed', value: '23/30', percentage: 77, icon: Target, color: '#FD79A8' },
  { label: 'Focus Time', value: '4.2h', target: '6h', icon: Clock, color: '#4ECDC4' },
  { label: 'Habits Streak', value: '12 days', icon: Calendar, color: '#FFD93D' },
  { label: 'Productivity Score', value: '85%', icon: TrendingUp, color: '#6C5CE7' }
];

const todayGoals = [
  {
    id: 1,
    title: 'Complete project proposal',
    category: 'Work',
    priority: 'high',
    completed: false,
    estimatedTime: '2h',
    deadline: '5:00 PM'
  },
  {
    id: 2,
    title: 'Morning workout',
    category: 'Health',
    priority: 'medium',
    completed: true,
    estimatedTime: '45m',
    deadline: '8:00 AM'
  },
  {
    id: 3,
    title: 'Read 20 pages',
    category: 'Learning',
    priority: 'low',
    completed: false,
    estimatedTime: '30m',
    deadline: '9:00 PM'
  },
  {
    id: 4,
    title: 'Call mom',
    category: 'Personal',
    priority: 'medium',
    completed: false,
    estimatedTime: '15m',
    deadline: '7:00 PM'
  }
];

const habits = [
  { name: 'Drink 8 glasses of water', streak: 12, completed: true, icon: '💧' },
  { name: 'Meditate for 10 minutes', streak: 8, completed: true, icon: '🧘' },
  { name: 'Write in journal', streak: 15, completed: false, icon: '📝' },
  { name: 'Exercise', streak: 5, completed: true, icon: '💪' },
  { name: 'Read before bed', streak: 9, completed: false, icon: '📚' }
];

const focusSessions = [
  { task: 'Project Research', duration: '25:00', status: 'completed', type: 'pomodoro' },
  { task: 'Email Management', duration: '15:00', status: 'completed', type: 'focus' },
  { task: 'Design Review', duration: '45:00', status: 'in-progress', type: 'deep-work' }
];

export default function ProductivityScreen() {
  const [pomodoroTime, setPomodoroTime] = React.useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = React.useState(false);
  const [goals, setGoals] = React.useState(todayGoals);
  const [dailyHabits, setDailyHabits] = React.useState(habits);

  // Timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && pomodoroTime > 0) {
      console.log('Starting timer, current time:', pomodoroTime);
      interval = setInterval(() => {
        setPomodoroTime(time => {
          console.log('Timer tick, current time:', time);
          if (time <= 1) {
            setIsRunning(false);
            console.log('Pomodoro session completed!');
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
        {metric.target && (
          <Text style={styles.metricTarget}>Target: {metric.target}</Text>
        )}
      </View>
    );
  };

  const toggleGoal = (goalId: number) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
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
            <Text style={styles.goalDeadline}>Due: {goal.deadline}</Text>
          </View>
        </View>
      </View>
    );
  };

  const toggleHabit = (habitIndex: number) => {
    setDailyHabits(prevHabits => 
      prevHabits.map((habit, index) => 
        index === habitIndex ? { ...habit, completed: !habit.completed } : habit
      )
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
        case 'paused': return '#F39C12';
        default: return '#7F8C8D';
      }
    };

    const statusColor = getStatusColor(session.status);
    
    return (
      <View key={index} style={styles.sessionCard}>
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionTask}>{session.task}</Text>
          <Text style={styles.sessionType}>{session.type.replace('-', ' ')}</Text>
        </View>
        <View style={styles.sessionMeta}>
          <Text style={styles.sessionDuration}>{session.duration}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {session.status.replace('-', ' ')}
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
          title: "Productivity & Goals",
          headerStyle: { backgroundColor: '#FD79A8' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
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
              <Target size={32} color="white" />
              <Text style={styles.headerTitle}>Productivity Score</Text>
              <Text style={styles.headerScore}>85/100</Text>
              <Text style={styles.headerSubtitle}>You&apos;re crushing your goals!</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Pomodoro Timer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Focus Timer</Text>
          <View style={styles.pomodoroCard}>
            <View style={styles.timerDisplay}>
              <Text style={styles.timerText}>{formatTime(pomodoroTime)}</Text>
              <Text style={styles.timerLabel}>Focus Session</Text>
            </View>
            <View style={styles.timerControls}>
              <TouchableOpacity 
                style={[styles.timerButton, { backgroundColor: '#4ECDC4' }]}
                onPress={() => setIsRunning(!isRunning)}
              >
                {isRunning ? (
                  <Pause size={24} color="white" />
                ) : (
                  <Play size={24} color="white" fill="white" />
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.timerButton, { backgroundColor: '#FF6B6B' }]}
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

        {/* Productivity Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Overview</Text>
          <View style={styles.metricsGrid}>
            {productivityMetrics.map(renderMetricCard)}
          </View>
        </View>

        {/* Today's Goals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today&apos;s Goals</Text>
            <TouchableOpacity style={styles.addButton}>
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

        {/* Focus Sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Focus Sessions</Text>
          <View style={styles.sessionsContainer}>
            {focusSessions.map(renderFocusSession)}
          </View>
        </View>

        {/* Weekly Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week&apos;s Progress</Text>
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Award size={24} color="#FD79A8" />
              <Text style={styles.insightTitle}>Productivity Insights</Text>
            </View>
            <Text style={styles.insightText}>
              Excellent week! You completed 89% of your goals and maintained a 12-day habit streak. Your focus sessions averaged 35 minutes.
            </Text>
            <View style={styles.insightStats}>
              <View style={styles.insightStat}>
                <Text style={styles.insightStatValue}>89%</Text>
                <Text style={styles.insightStatLabel}>Goals Completed</Text>
              </View>
              <View style={styles.insightStat}>
                <Text style={styles.insightStatValue}>35m</Text>
                <Text style={styles.insightStatLabel}>Avg Focus Time</Text>
              </View>
              <View style={styles.insightStat}>
                <Text style={styles.insightStatValue}>12</Text>
                <Text style={styles.insightStatLabel}>Habit Streak</Text>
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
  pomodoroCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2C3E50',
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
  metricTarget: {
    fontSize: 10,
    color: '#95A5A6',
    textAlign: 'center',
  },
  goalCard: {
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
  goalDeadline: {
    fontSize: 12,
    color: '#E74C3C',
  },
  habitCard: {
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
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
  sessionType: {
    fontSize: 12,
    color: '#7F8C8D',
    textTransform: 'capitalize',
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