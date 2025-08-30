import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions, Modal, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pedometer } from 'expo-sensors';
import { 
  Heart, 
  Activity, 
  Brain, 
  Moon, 
  Droplets,
  Plus,
  MessageCircle,
  CheckCircle,
  Utensils,
  X,
  Minus,
  RotateCcw,
  TrendingUp
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

const getInitialHealthMetrics = (): HealthMetric[] => [
  { id: 'steps', label: 'Steps Today', value: 0, target: 10000, unit: 'steps', icon: Activity, color: '#FF6B6B', actionable: false },
  { id: 'water', label: 'Water Intake', value: 0, target: 8, unit: 'glasses', icon: Droplets, color: '#4ECDC4', actionable: true },
  { id: 'sleep', label: 'Sleep Hours', value: 0, target: 8, unit: 'hours', icon: Moon, color: '#6C5CE7', actionable: true },
  { id: 'meditation', label: 'Meditation', value: 0, target: 20, unit: 'minutes', icon: Brain, color: '#FFD93D', actionable: true }
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
    title: 'Mindfulness Journey',
    description: 'Daily meditation practice',
    progress: 29,
    color: '#6C5CE7',
    route: '/mindfulness'
  },
  {
    title: 'Break Free',
    description: 'Overcome harmful habits',
    progress: 0,
    color: '#E74C3C',
    route: '/break-free'
  },
  {
    title: 'Nutrition Guide',
    description: 'Healthy eating habits',
    progress: 45,
    color: '#27AE60'
  }
];

const healthTips = [
  {
    title: 'Stay Hydrated',
    description: 'Drink water first thing in the morning to kickstart your metabolism.',
    icon: Droplets,
    color: '#4ECDC4'
  },
  {
    title: 'Move Every Hour',
    description: 'Take a 2-minute walk every hour to improve circulation and energy.',
    icon: Activity,
    color: '#FF6B6B'
  },
  {
    title: 'Deep Breathing',
    description: 'Practice 4-7-8 breathing: inhale 4, hold 7, exhale 8 seconds.',
    icon: Brain,
    color: '#FFD93D'
  },
  {
    title: 'Sleep Hygiene',
    description: 'Keep your bedroom cool (65-68°F) for optimal sleep quality.',
    icon: Moon,
    color: '#6C5CE7'
  }
];

const weeklyGoals = [
  {
    title: 'Exercise 4x this week',
    current: 2,
    target: 4,
    color: '#FF6B6B'
  },
  {
    title: 'Meditate daily',
    current: 5,
    target: 7,
    color: '#FFD93D'
  },
  {
    title: 'Drink 8 glasses daily',
    current: 6,
    target: 7,
    color: '#4ECDC4'
  }
];

export default function HealthScreen() {
  const { addActivity } = useCategories();
  const { score: healthScore, weeklyImprovement } = useCategoryData('health');
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>(getInitialHealthMetrics());
  const [dailyStreak, setDailyStreak] = useState<number>(0);
  const [selectedMetric, setSelectedMetric] = useState<HealthMetric | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [lastResetDate, setLastResetDate] = useState<string>('');
  const [isPedometerAvailable, setIsPedometerAvailable] = useState<boolean>(false);
  const [pastStepCount, setPastStepCount] = useState<number>(0);
  const [currentStepCount, setCurrentStepCount] = useState<number>(0);

  const loadHealthData = React.useCallback(async () => {
    try {
      const savedMetrics = await AsyncStorage.getItem('healthMetrics');
      const savedStreak = await AsyncStorage.getItem('healthStreak');
      const savedResetDate = await AsyncStorage.getItem('healthResetDate');
      
      if (savedMetrics) {
        const parsedMetrics = JSON.parse(savedMetrics);
        // Restore icon components that were lost during serialization
        const initialMetrics = getInitialHealthMetrics();
        const restoredMetrics = parsedMetrics.map((metric: any) => {
          const initialMetric = initialMetrics.find(m => m.id === metric.id);
          return {
            ...metric,
            icon: initialMetric?.icon || Activity // fallback to Activity icon
          };
        });
        setHealthMetrics(restoredMetrics);
      }
      
      if (savedStreak) {
        setDailyStreak(parseInt(savedStreak));
      }
      
      if (savedResetDate) {
        setLastResetDate(savedResetDate);
      }
    } catch (error) {
      console.error('Error loading health data:', error);
    }
  }, []);

  const saveHealthData = React.useCallback(async () => {
    try {
      // Remove icon components before saving to avoid serialization issues
      const metricsToSave = healthMetrics.map(metric => ({
        ...metric,
        icon: undefined // Remove the icon component
      }));
      await AsyncStorage.setItem('healthMetrics', JSON.stringify(metricsToSave));
      await AsyncStorage.setItem('healthStreak', dailyStreak.toString());
      await AsyncStorage.setItem('healthResetDate', lastResetDate);
    } catch (error) {
      console.error('Error saving health data:', error);
    }
  }, [healthMetrics, dailyStreak, lastResetDate]);

  const checkDailyReset = React.useCallback(() => {
    const today = new Date().toDateString();
    const lastReset = lastResetDate;
    
    if (lastReset !== today) {
      // Reset daily metrics but keep streak if goals were met yesterday
      const yesterdayGoalsMet = healthMetrics.every(metric => 
        !metric.actionable || metric.value >= metric.target
      );
      
      if (lastReset && yesterdayGoalsMet) {
        setDailyStreak(prev => prev + 1);
      } else if (lastReset) {
        setDailyStreak(0);
      }
      
      // Reset daily values
      setHealthMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.id === 'steps' ? 0 : 0 // Reset steps to 0 for new day
      })));
      
      // Reset step counters for new day
      setPastStepCount(0);
      setCurrentStepCount(0);
      
      setLastResetDate(today);
    }
  }, [lastResetDate, healthMetrics]);

  // Load saved metrics from storage and initialize pedometer
  useEffect(() => {
    loadHealthData();
    checkDailyReset();
    initializePedometer();
  }, [loadHealthData, checkDailyReset]);

  // Save data whenever metrics change
  useEffect(() => {
    saveHealthData();
  }, [saveHealthData]);

  // Initialize pedometer for real step tracking
  const initializePedometer = React.useCallback(async () => {
    console.log('Initializing pedometer...');
    
    if (Platform.OS === 'web') {
      console.log('Pedometer not available on web, using simulated steps');
      // Fallback to simulated steps for web
      const updateSteps = () => {
        setHealthMetrics(prev => prev.map(metric => {
          if (metric.id === 'steps') {
            const increment = Math.floor(Math.random() * 50) + 10;
            return { ...metric, value: Math.min(metric.target, metric.value + increment) };
          }
          return metric;
        }));
      };
      const interval = setInterval(updateSteps, 30000);
      return () => clearInterval(interval);
    }
    
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      console.log('Pedometer available:', isAvailable);
      setIsPedometerAvailable(isAvailable);
      
      if (isAvailable) {
        // Get today's steps from midnight
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        
        console.log('Getting step count from', start, 'to', end);
        
        try {
          const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
          console.log('Past step count:', pastStepCountResult.steps);
          setPastStepCount(pastStepCountResult.steps);
          setCurrentStepCount(pastStepCountResult.steps);
          
          // Update the steps metric with real data
          setHealthMetrics(prev => prev.map(metric => {
            if (metric.id === 'steps') {
              return { ...metric, value: pastStepCountResult.steps };
            }
            return metric;
          }));
        } catch (error) {
          console.error('Error getting past step count:', error);
        }
        
        // Subscribe to real-time step updates
        const subscription = Pedometer.watchStepCount(result => {
          console.log('Step count update:', result.steps);
          const totalSteps = pastStepCount + result.steps;
          setCurrentStepCount(totalSteps);
          
          setHealthMetrics(prev => prev.map(metric => {
            if (metric.id === 'steps') {
              return { ...metric, value: totalSteps };
            }
            return metric;
          }));
        });
        
        return () => {
          console.log('Unsubscribing from pedometer');
          subscription && subscription.remove();
        };
      } else {
        console.log('Pedometer not available, using simulated steps');
        // Fallback to simulated steps
        const updateSteps = () => {
          setHealthMetrics(prev => prev.map(metric => {
            if (metric.id === 'steps') {
              const increment = Math.floor(Math.random() * 50) + 10;
              return { ...metric, value: Math.min(metric.target, metric.value + increment) };
            }
            return metric;
          }));
        };
        const interval = setInterval(updateSteps, 30000);
        return () => clearInterval(interval);
      }
    } catch (error) {
      console.error('Error initializing pedometer:', error);
      setIsPedometerAvailable(false);
      
      // Fallback to simulated steps
      const updateSteps = () => {
        setHealthMetrics(prev => prev.map(metric => {
          if (metric.id === 'steps') {
            const increment = Math.floor(Math.random() * 50) + 10;
            return { ...metric, value: Math.min(metric.target, metric.value + increment) };
          }
          return metric;
        }));
      };
      const interval = setInterval(updateSteps, 30000);
      return () => clearInterval(interval);
    }
  }, [pastStepCount]);
  
  // Real step tracking effect
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    const setupPedometer = async () => {
      cleanup = await initializePedometer();
    };
    
    setupPedometer();
    
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [initializePedometer]);
  
  const updateMetric = (metricId: string, increment: number) => {
    setHealthMetrics(prev => prev.map(metric => {
      if (metric.id === metricId) {
        const newValue = Math.max(0, Math.min(metric.target * 1.5, metric.value + increment));
        return { ...metric, value: newValue };
      }
      return metric;
    }));
  };

  const openMetricModal = (metric: HealthMetric) => {
    if (metric.actionable) {
      setSelectedMetric(metric);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMetric(null);
  };

  const handleMetricUpdate = (increment: number) => {
    if (selectedMetric) {
      updateMetric(selectedMetric.id, increment);
      
      // Add activity for significant updates
      if (increment > 0) {
        const action: QuickAction = {
          id: selectedMetric.id,
          title: selectedMetric.label,
          icon: selectedMetric.icon,
          color: selectedMetric.color,
          action: selectedMetric.id,
          increment: increment
        };
        handleQuickAction(action);
      }
    }
  };

  const resetDailyMetrics = () => {
    Alert.alert(
      'Reset Daily Metrics',
      'Are you sure you want to reset all daily metrics? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setHealthMetrics(getInitialHealthMetrics());
            setDailyStreak(0);
            setLastResetDate(new Date().toDateString());
          }
        }
      ]
    );
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
        onPress={() => openMetricModal(metric)}
        activeOpacity={metric.actionable ? 0.8 : 1}
      >
        <View style={styles.metricHeader}>
          <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
            {React.createElement(IconComponent, { size: 20, color: metric.color })}
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
              {metric.id === 'steps' && Platform.OS !== 'web' && (
                <Text style={styles.stepTrackingIndicator}>
                  {isPedometerAvailable ? ' 📱' : ' 🔄'}
                </Text>
              )}
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
          {React.createElement(IconComponent, { size: 20, color: 'white' })}
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

        {/* Daily Streak & Stats */}
        <View style={styles.section}>
          <View style={styles.statsRow}>
            <View style={styles.streakCard}>
              <Text style={styles.streakDays}>{dailyStreak}</Text>
              <Text style={styles.streakTitle}>Day Streak</Text>
            </View>
            
            <View style={styles.statCard}>
              <TrendingUp size={20} color="#27AE60" />
              <Text style={styles.statValue}>{Math.round((healthMetrics.filter(m => m.actionable && m.value >= m.target).length / healthMetrics.filter(m => m.actionable).length) * 100) || 0}%</Text>
              <Text style={styles.statLabel}>Goals Met</Text>
            </View>
            
            <TouchableOpacity style={styles.resetButton} onPress={resetDailyMetrics}>
              <RotateCcw size={16} color="#E74C3C" />
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
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

        {/* Weekly Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Goals</Text>
          <View style={styles.weeklyGoalsContainer}>
            {weeklyGoals.map((goal, index) => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <View key={index} style={styles.weeklyGoalCard}>
                  <View style={styles.weeklyGoalHeader}>
                    <Text style={styles.weeklyGoalTitle}>{goal.title}</Text>
                    <Text style={[styles.weeklyGoalProgress, { color: goal.color }]}>
                      {goal.current}/{goal.target}
                    </Text>
                  </View>
                  <View style={styles.weeklyProgressBar}>
                    <View 
                      style={[
                        styles.weeklyProgressFill, 
                        { width: `${Math.min(progress, 100)}%`, backgroundColor: goal.color }
                      ]} 
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Health Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Health Tips</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tipsScrollView}>
            {healthTips.map((tip, index) => {
              const IconComponent = tip.icon;
              return (
                <View key={index} style={styles.tipCard}>
                  <View style={[styles.tipIcon, { backgroundColor: tip.color + '20' }]}>
                    {React.createElement(IconComponent, { size: 24, color: tip.color })}
                  </View>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipDescription}>{tip.description}</Text>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Programs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Programs</Text>
          {healthPrograms.map(renderProgram)}
        </View>
            </ScrollView>
          </View>
        </LinearGradient>
      </View>

      {/* Metric Update Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMetric && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedMetric.label}</Text>
                  <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton}>
                    <X size={24} color="#7F8C8D" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.modalBody}>
                  <View style={[styles.modalIcon, { backgroundColor: selectedMetric.color + '20' }]}>
                    {(() => {
                      const IconComponent = selectedMetric.icon;
                      return React.createElement(IconComponent, { size: 32, color: selectedMetric.color });
                    })()}
                  </View>
                  
                  <Text style={styles.modalDescription}>
                    Current: {selectedMetric.value} {selectedMetric.unit}
                  </Text>
                  <Text style={styles.modalDescription}>
                    Goal: {selectedMetric.target} {selectedMetric.unit}
                  </Text>
                  
                  <View style={styles.modalActions}>
                    {selectedMetric.id === 'water' && (
                      <>
                        <TouchableOpacity 
                          style={[styles.modalActionButton, { backgroundColor: '#E74C3C' }]}
                          onPress={() => handleMetricUpdate(-1)}
                        >
                          <Minus size={20} color="white" />
                          <Text style={styles.modalActionText}>-1 Glass</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={[styles.modalActionButton, { backgroundColor: selectedMetric.color }]}
                          onPress={() => handleMetricUpdate(1)}
                        >
                          <Plus size={20} color="white" />
                          <Text style={styles.modalActionText}>+1 Glass</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    
                    {selectedMetric.id === 'meditation' && (
                      <>
                        <TouchableOpacity 
                          style={[styles.modalActionButton, { backgroundColor: selectedMetric.color }]}
                          onPress={() => handleMetricUpdate(5)}
                        >
                          <Plus size={20} color="white" />
                          <Text style={styles.modalActionText}>+5 min</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={[styles.modalActionButton, { backgroundColor: selectedMetric.color }]}
                          onPress={() => handleMetricUpdate(10)}
                        >
                          <Plus size={20} color="white" />
                          <Text style={styles.modalActionText}>+10 min</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={[styles.modalActionButton, { backgroundColor: selectedMetric.color }]}
                          onPress={() => handleMetricUpdate(20)}
                        >
                          <Plus size={20} color="white" />
                          <Text style={styles.modalActionText}>+20 min</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    
                    {selectedMetric.id === 'sleep' && (
                      <>
                        <TouchableOpacity 
                          style={[styles.modalActionButton, { backgroundColor: '#E74C3C' }]}
                          onPress={() => handleMetricUpdate(-0.5)}
                        >
                          <Minus size={20} color="white" />
                          <Text style={styles.modalActionText}>-30 min</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={[styles.modalActionButton, { backgroundColor: selectedMetric.color }]}
                          onPress={() => handleMetricUpdate(0.5)}
                        >
                          <Plus size={20} color="white" />
                          <Text style={styles.modalActionText}>+30 min</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={[styles.modalActionButton, { backgroundColor: selectedMetric.color }]}
                          onPress={() => handleMetricUpdate(1)}
                        >
                          <Plus size={20} color="white" />
                          <Text style={styles.modalActionText}>+1 hour</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 80,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7F8C8D',
    marginTop: 2,
  },
  resetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resetButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#E74C3C',
    marginTop: 2,
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
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
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
  modalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    minWidth: 100,
    justifyContent: 'center',
  },
  modalActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  tipsScrollView: {
    paddingLeft: 24,
  },
  tipCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  stepTrackingIndicator: {
    fontSize: 12,
    opacity: 0.7,
  },
});