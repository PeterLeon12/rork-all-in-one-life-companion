import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { 
  MapPin, 
  Camera, 
  Globe, 
  MessageCircle,
  Calendar,
  Star,
  Users,
  Book,
  Compass,
  Heart
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const travelMetrics = [
  { label: 'Adventure Score', value: '92%', icon: Compass, color: '#FF6B35', trend: '+15%' },
  { label: 'Countries Visited', value: '12', icon: Globe, color: '#4ECDC4', trend: '+2' },
  { label: 'Cultural Immersion', value: '88%', icon: Heart, color: '#45B7D1', trend: '+8%' },
  { label: 'Memories Created', value: '247', icon: Camera, color: '#96CEB4', trend: '+23' }
];

const upcomingTrips = [
  {
    destination: 'Tokyo, Japan',
    date: 'March 15-22',
    type: 'Cultural Exploration',
    progress: 85,
    icon: Globe,
    color: '#FF6B35'
  },
  {
    destination: 'Iceland Road Trip',
    date: 'June 10-18',
    type: 'Nature Adventure',
    progress: 45,
    icon: Compass,
    color: '#4ECDC4'
  },
  {
    destination: 'Tuscany, Italy',
    date: 'September 5-12',
    type: 'Culinary Journey',
    progress: 20,
    icon: Heart,
    color: '#45B7D1'
  }
];

const travelGoals = [
  { goal: 'Visit 3 new countries', progress: 67, target: '3 countries', current: '2 countries' },
  { goal: 'Learn basic phrases', progress: 80, target: '5 languages', current: '4 languages' },
  { goal: 'Cultural experiences', progress: 90, target: '20 activities', current: '18 activities' },
  { goal: 'Photo documentation', progress: 75, target: '500 photos', current: '375 photos' }
];

const travelActivities = [
  {
    activity: 'Language practice',
    time: '9:00 AM',
    description: 'Japanese conversation - 30 min',
    completed: true,
    icon: Book,
    color: '#FF6B35'
  },
  {
    activity: 'Trip research',
    time: '2:00 PM',
    description: 'Tokyo neighborhoods guide',
    completed: false,
    icon: MapPin,
    color: '#4ECDC4'
  },
  {
    activity: 'Photo editing',
    time: '7:00 PM',
    description: 'Last trip memories',
    completed: false,
    icon: Camera,
    color: '#45B7D1'
  },
  {
    activity: 'Travel planning',
    time: '8:30 PM',
    description: 'Book accommodations',
    completed: false,
    icon: Calendar,
    color: '#96CEB4'
  }
];

const quickActions = [
  {
    title: 'Plan Trip',
    duration: '30 min',
    benefit: 'Perfect itinerary',
    icon: Calendar,
    color: '#FF6B35'
  },
  {
    title: 'Learn Phrases',
    duration: '15 min',
    benefit: 'Local connection',
    icon: Book,
    color: '#4ECDC4'
  },
  {
    title: 'Find Experiences',
    duration: '20 min',
    benefit: 'Hidden gems',
    icon: Star,
    color: '#45B7D1'
  },
  {
    title: 'Connect Travelers',
    duration: '10 min',
    benefit: 'Travel buddies',
    icon: Users,
    color: '#96CEB4'
  }
];

export default function TravelScreen() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const handleHapticFeedback = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleChatPress = async () => {
    await handleHapticFeedback();
    router.push('/travel-chat');
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

  const renderUpcomingTrip = (trip: any, index: number) => {
    const IconComponent = trip.icon;
    
    return (
      <TouchableOpacity 
        key={index} 
        style={styles.tripCard}
        activeOpacity={0.8}
        onPress={handleHapticFeedback}
      >
        <View style={[styles.tripIcon, { backgroundColor: trip.color + '20' }]}>
          <IconComponent size={20} color={trip.color} />
        </View>
        <View style={styles.tripContent}>
          <Text style={styles.tripDestination}>{trip.destination}</Text>
          <Text style={styles.tripDate}>{trip.date}</Text>
          <Text style={styles.tripType}>{trip.type}</Text>
        </View>
        <View style={styles.tripProgress}>
          <Text style={styles.tripProgressText}>{trip.progress}%</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressBarFill, 
                { 
                  width: `${trip.progress}%`,
                  backgroundColor: trip.color
                }
              ]} 
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderQuickAction = (action: any, index: number) => {
    const IconComponent = action.icon;
    const isSelected = selectedAction === action.title;
    
    return (
      <TouchableOpacity 
        key={index} 
        style={[styles.actionCard, isSelected && styles.actionCardSelected]} 
        activeOpacity={0.8}
        onPress={async () => {
          await handleHapticFeedback();
          setSelectedAction(isSelected ? null : action.title);
        }}
      >
        <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
          <IconComponent size={20} color={action.color} />
        </View>
        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>{action.title}</Text>
          <Text style={styles.actionDuration}>{action.duration}</Text>
        </View>
        <Text style={styles.actionBenefit}>{action.benefit}</Text>
      </TouchableOpacity>
    );
  };

  const renderTravelActivity = (activity: any, index: number) => {
    const IconComponent = activity.icon;
    
    return (
      <TouchableOpacity 
        key={index} 
        style={[styles.activityCard, activity.completed && styles.completedActivity]}
        activeOpacity={0.8}
        onPress={handleHapticFeedback}
      >
        <View style={[styles.activityIcon, { backgroundColor: activity.color + '20' }]}>
          <IconComponent size={16} color={activity.color} />
        </View>
        <View style={styles.activityContent}>
          <Text style={styles.activityName}>{activity.activity}</Text>
          <Text style={styles.activityDescription}>{activity.description}</Text>
        </View>
        <View style={styles.activityTime}>
          <Text style={styles.activityTimeText}>{activity.time}</Text>
          {activity.completed && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderTravelGoal = (goal: any, index: number) => {
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
                backgroundColor: goal.progress >= 80 ? '#FF6B35' : goal.progress >= 60 ? '#4ECDC4' : '#45B7D1'
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
          title: "Travel & Adventure",
          headerStyle: { backgroundColor: '#FF6B35' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Stats */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={['#FF6B35', '#4ECDC4']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <MapPin size={32} color="white" />
              <Text style={styles.headerTitle}>Adventure Score</Text>
              <Text style={styles.headerScore}>92%</Text>
              <Text style={styles.headerSubtitle}>Ready for your next journey</Text>
            </View>

            <TouchableOpacity 
              style={styles.chatButton}
              onPress={handleChatPress}
              activeOpacity={0.8}
            >
              <MessageCircle size={20} color="white" />
              <Text style={styles.chatButtonText}>Travel Guide</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Travel Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travel Overview</Text>
          <View style={styles.metricsGrid}>
            {travelMetrics.map(renderMetricCard)}
          </View>
        </View>

        {/* Upcoming Trips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Adventures</Text>
          {upcomingTrips.map(renderUpcomingTrip)}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travel Boosters</Text>
          <View style={styles.actionsList}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Today's Travel Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Travel Tasks</Text>
          {travelActivities.map(renderTravelActivity)}
        </View>

        {/* Travel Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Year&apos;s Goals</Text>
          {travelGoals.map(renderTravelGoal)}
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
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },
  chatButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
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
  tripCard: {
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
  tripIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tripContent: {
    flex: 1,
  },
  tripDestination: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  tripDate: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  tripType: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
  },
  tripProgress: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  tripProgressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  actionsList: {
    paddingHorizontal: 24,
  },
  actionCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionCardSelected: {
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  actionDuration: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  actionBenefit: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
  },
  activityCard: {
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
  completedActivity: {
    opacity: 0.7,
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  activityTime: {
    alignItems: 'flex-end',
  },
  activityTimeText: {
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
    color: '#FF6B35',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalDetail: {
    fontSize: 12,
    color: '#7F8C8D',
  },
});