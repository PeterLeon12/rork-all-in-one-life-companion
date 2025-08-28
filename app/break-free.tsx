import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { 
  Shield, 
  Target, 
  MessageCircle,
  Clock,
  Award,
  Users,
  BookOpen,
  Phone,
  AlertTriangle,
  CheckCircle
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const addictionTypes = [
  { name: 'Alcohol', color: '#E74C3C', icon: '🍺' },
  { name: 'Nicotine', color: '#F39C12', icon: '🚬' },
  { name: 'Pornography', color: '#8E44AD', icon: '📱' },
  { name: 'Drugs', color: '#E67E22', icon: '💊' },
  { name: 'Gambling', color: '#27AE60', icon: '🎰' },
  { name: 'Social Media', color: '#3498DB', icon: '📲' },
  { name: 'Gaming', color: '#9B59B6', icon: '🎮' },
  { name: 'Shopping', color: '#1ABC9C', icon: '🛍️' },
];

const recoveryMilestones = [
  { days: 1, title: '24 Hours Clean', description: 'First step towards freedom', achieved: true },
  { days: 7, title: '1 Week Strong', description: 'Building momentum', achieved: true },
  { days: 30, title: '1 Month Milestone', description: 'Significant progress', achieved: false },
  { days: 90, title: '3 Months Clean', description: 'Major achievement', achieved: false },
  { days: 365, title: '1 Year Sober', description: 'Life transformation', achieved: false },
];

const dailyTasks = [
  { id: 1, task: 'Morning meditation (10 min)', completed: true, points: 10 },
  { id: 2, task: 'Journal your feelings', completed: true, points: 15 },
  { id: 3, task: 'Exercise or walk', completed: false, points: 20 },
  { id: 4, task: 'Connect with support person', completed: false, points: 25 },
  { id: 5, task: 'Evening reflection', completed: false, points: 10 },
];

const emergencyContacts = [
  { name: 'Crisis Hotline', number: '988', type: 'crisis' },
  { name: 'Sponsor/Mentor', number: 'Contact', type: 'support' },
  { name: 'Trusted Friend', number: 'Contact', type: 'friend' },
];

export default function BreakFreeScreen() {
  const [selectedAddiction, setSelectedAddiction] = useState<string>('Alcohol');
  const [sobrietyDays] = useState<number>(8);
  const [tasks, setTasks] = useState(dailyTasks);

  const toggleTask = (taskId: number) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalPoints = tasks.filter(task => task.completed).reduce((sum, task) => sum + task.points, 0);

  const renderAddictionType = (addiction: any, index: number) => {
    const isSelected = selectedAddiction === addiction.name;
    
    return (
      <TouchableOpacity 
        key={index} 
        style={[
          styles.addictionCard, 
          { borderColor: isSelected ? addiction.color : '#E9ECEF' },
          { backgroundColor: isSelected ? addiction.color + '10' : 'white' }
        ]}
        onPress={() => setSelectedAddiction(addiction.name)}
        activeOpacity={0.8}
      >
        <Text style={styles.addictionEmoji}>{addiction.icon}</Text>
        <Text style={[styles.addictionName, { color: isSelected ? addiction.color : '#2C3E50' }]}>
          {addiction.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMilestone = (milestone: any, index: number) => {
    const isAchieved = milestone.achieved || sobrietyDays >= milestone.days;
    const isCurrent = !isAchieved && sobrietyDays < milestone.days;
    
    return (
      <View key={index} style={styles.milestoneCard}>
        <View style={[
          styles.milestoneIcon,
          { backgroundColor: isAchieved ? '#27AE60' : isCurrent ? '#F39C12' : '#BDC3C7' }
        ]}>
          {isAchieved ? (
            <CheckCircle size={20} color="white" />
          ) : (
            <Target size={20} color="white" />
          )}
        </View>
        <View style={styles.milestoneInfo}>
          <Text style={styles.milestoneTitle}>{milestone.title}</Text>
          <Text style={styles.milestoneDescription}>{milestone.description}</Text>
          <Text style={styles.milestoneDays}>{milestone.days} days</Text>
        </View>
        {isCurrent && (
          <View style={styles.currentBadge}>
            <Text style={styles.currentBadgeText}>CURRENT</Text>
          </View>
        )}
      </View>
    );
  };

  const renderTask = (task: any) => {
    return (
      <TouchableOpacity 
        key={task.id}
        style={[
          styles.taskCard,
          { backgroundColor: task.completed ? '#E8F5E8' : 'white' }
        ]}
        onPress={() => toggleTask(task.id)}
        activeOpacity={0.8}
      >
        <View style={styles.taskContent}>
          <View style={[
            styles.taskCheckbox,
            { backgroundColor: task.completed ? '#27AE60' : 'transparent' }
          ]}>
            {task.completed && <CheckCircle size={16} color="white" />}
          </View>
          <View style={styles.taskInfo}>
            <Text style={[
              styles.taskText,
              { textDecorationLine: task.completed ? 'line-through' : 'none' },
              { color: task.completed ? '#7F8C8D' : '#2C3E50' }
            ]}>
              {task.task}
            </Text>
            <Text style={styles.taskPoints}>+{task.points} points</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmergencyContact = (contact: any, index: number) => {
    const getIcon = () => {
      switch (contact.type) {
        case 'crisis': return <AlertTriangle size={20} color="#E74C3C" />;
        case 'support': return <Users size={20} color="#3498DB" />;
        case 'friend': return <Phone size={20} color="#27AE60" />;
        default: return <Phone size={20} color="#7F8C8D" />;
      }
    };

    return (
      <TouchableOpacity 
        key={index}
        style={styles.emergencyCard}
        onPress={() => Alert.alert('Call ' + contact.name, 'This would open your phone app')}
        activeOpacity={0.8}
      >
        <View style={styles.emergencyIcon}>
          {getIcon()}
        </View>
        <View style={styles.emergencyInfo}>
          <Text style={styles.emergencyName}>{contact.name}</Text>
          <Text style={styles.emergencyNumber}>{contact.number}</Text>
        </View>
        <Phone size={16} color="#7F8C8D" />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Break Free",
          headerStyle: { backgroundColor: '#E74C3C' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Stats */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={['#E74C3C', '#C0392B']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <Shield size={32} color="white" />
              <Text style={styles.headerTitle}>Freedom Journey</Text>
              <Text style={styles.headerScore}>{sobrietyDays} Days</Text>
              <Text style={styles.headerSubtitle}>Clean & Strong</Text>
              
              <TouchableOpacity 
                style={styles.aiChatButton}
                onPress={() => router.push('/break-free-chat' as any)}
                activeOpacity={0.8}
              >
                <MessageCircle size={20} color="white" />
                <Text style={styles.aiChatButtonText}>Chat with Freedom Coach</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Addiction Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Freedom Focus</Text>
          <View style={styles.addictionGrid}>
            {addictionTypes.map(renderAddictionType)}
          </View>
        </View>

        {/* Daily Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <View style={styles.progressStat}>
                <Text style={styles.progressValue}>{completedTasks}/{tasks.length}</Text>
                <Text style={styles.progressLabel}>Tasks Done</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressValue}>{totalPoints}</Text>
                <Text style={styles.progressLabel}>Points Earned</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressValue}>{Math.round((completedTasks / tasks.length) * 100)}%</Text>
                <Text style={styles.progressLabel}>Daily Goal</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Daily Tasks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Tasks</Text>
          {tasks.map(renderTask)}
        </View>

        {/* Recovery Milestones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Freedom Milestones</Text>
          {recoveryMilestones.map(renderMilestone)}
        </View>

        {/* Emergency Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Support</Text>
          <Text style={styles.sectionSubtitle}>Reach out when you need help</Text>
          {emergencyContacts.map(renderEmergencyContact)}
        </View>

        {/* Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Freedom Resources</Text>
          <View style={styles.resourcesGrid}>
            <TouchableOpacity style={styles.resourceCard} activeOpacity={0.8}>
              <BookOpen size={24} color="#3498DB" />
              <Text style={styles.resourceTitle}>Educational Content</Text>
              <Text style={styles.resourceDescription}>Articles & guides</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resourceCard} activeOpacity={0.8}>
              <Users size={24} color="#27AE60" />
              <Text style={styles.resourceTitle}>Support Groups</Text>
              <Text style={styles.resourceDescription}>Connect with others</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resourceCard} activeOpacity={0.8}>
              <Award size={24} color="#F39C12" />
              <Text style={styles.resourceTitle}>Achievements</Text>
              <Text style={styles.resourceDescription}>Track your progress</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resourceCard} activeOpacity={0.8}>
              <Clock size={24} color="#9B59B6" />
              <Text style={styles.resourceTitle}>Relapse Prevention</Text>
              <Text style={styles.resourceDescription}>Stay on track</Text>
            </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    paddingHorizontal: 24,
    marginBottom: 16,
    marginTop: -8,
  },
  addictionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  addictionCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addictionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  addictionName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
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
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  progressLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
  },
  taskCard: {
    marginHorizontal: 24,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#27AE60',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  taskPoints: {
    fontSize: 12,
    color: '#27AE60',
    fontWeight: '600',
  },
  milestoneCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  milestoneIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  milestoneDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  milestoneDays: {
    fontSize: 12,
    color: '#95A5A6',
  },
  currentBadge: {
    backgroundColor: '#F39C12',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  currentBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emergencyCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  emergencyNumber: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  resourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  resourceCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  resourceDescription: {
    fontSize: 12,
    color: '#7F8C8D',
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
});