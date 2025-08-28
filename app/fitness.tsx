import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Dumbbell,
  Target,
  Trophy,
  Timer,
  Activity,
  Users,
  Calendar,
  TrendingUp,
  Heart,
  Zap,
  Mountain,
  Waves,
  Wind,
  Bike,
  ArrowRight,
  MessageCircle
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Stack } from 'expo-router';

interface FitnessCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string[];
  activities: string[];
  route?: string;
}

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  route?: string;
}

const fitnessCategories: FitnessCategory[] = [
  {
    id: 'strength',
    title: 'Strength Training',
    description: 'Build muscle, increase power, and enhance overall strength',
    icon: Dumbbell,
    gradient: ['#FF7675', '#E17055'],
    activities: ['Weightlifting', 'Powerlifting', 'Bodybuilding', 'CrossFit', 'Functional Training', 'Calisthenics']
  },
  {
    id: 'cardio',
    title: 'Cardio & Endurance',
    description: 'Improve cardiovascular health and build endurance',
    icon: Heart,
    gradient: ['#FF6B6B', '#FF8E8E'],
    activities: ['Running', 'Cycling', 'Swimming', 'Rowing', 'HIIT', 'Marathon Training']
  },
  {
    id: 'team-sports',
    title: 'Team Sports',
    description: 'Competitive team-based athletic activities',
    icon: Users,
    gradient: ['#74B9FF', '#0984E3'],
    activities: ['Basketball', 'Football', 'Soccer', 'Volleyball', 'Baseball', 'Hockey']
  },
  {
    id: 'individual-sports',
    title: 'Individual Sports',
    description: 'Personal athletic challenges and competitions',
    icon: Target,
    gradient: ['#6C5CE7', '#A29BFE'],
    activities: ['Tennis', 'Golf', 'Boxing', 'MMA', 'Track & Field', 'Gymnastics']
  },
  {
    id: 'outdoor-adventure',
    title: 'Outdoor & Adventure',
    description: 'Nature-based fitness and adventure sports',
    icon: Mountain,
    gradient: ['#00B894', '#00CEC9'],
    activities: ['Hiking', 'Rock Climbing', 'Skiing', 'Snowboarding', 'Surfing', 'Kayaking']
  },
  {
    id: 'mind-body',
    title: 'Mind-Body Fitness',
    description: 'Holistic approaches combining physical and mental wellness',
    icon: Wind,
    gradient: ['#A8E6CF', '#7FCDCD'],
    activities: ['Yoga', 'Pilates', 'Tai Chi', 'Martial Arts', 'Dance', 'Barre']
  },
  {
    id: 'water-sports',
    title: 'Water Sports',
    description: 'Aquatic fitness and competitive water activities',
    icon: Waves,
    gradient: ['#55A3FF', '#003D82'],
    activities: ['Swimming', 'Water Polo', 'Diving', 'Synchronized Swimming', 'Surfing', 'Wakeboarding']
  },
  {
    id: 'cycling',
    title: 'Cycling & Biking',
    description: 'Road, mountain, and recreational cycling activities',
    icon: Bike,
    gradient: ['#FD79A8', '#E84393'],
    activities: ['Road Cycling', 'Mountain Biking', 'BMX', 'Track Cycling', 'Spin Classes', 'Bike Touring']
  }
];

const fitnessTools: Tool[] = [
  {
    id: 'workout-planner',
    title: 'Workout Planner',
    description: 'Create personalized workout routines',
    icon: Calendar,
    color: '#FF7675'
  },
  {
    id: 'progress-tracker',
    title: 'Progress Tracker',
    description: 'Monitor your fitness journey and achievements',
    icon: TrendingUp,
    color: '#74B9FF'
  },
  {
    id: 'performance-analytics',
    title: 'Performance Analytics',
    description: 'Analyze your athletic performance data',
    icon: Activity,
    color: '#6C5CE7'
  },
  {
    id: 'nutrition-guide',
    title: 'Sports Nutrition',
    description: 'Optimize your diet for athletic performance',
    icon: Zap,
    color: '#00B894'
  },
  {
    id: 'injury-prevention',
    title: 'Injury Prevention',
    description: 'Stay healthy with proper form and recovery',
    icon: Heart,
    color: '#FF6B6B'
  },
  {
    id: 'competition-prep',
    title: 'Competition Prep',
    description: 'Prepare for athletic competitions and events',
    icon: Trophy,
    color: '#FFD93D'
  },
  {
    id: 'ai-fitness-coach',
    title: 'AI Fitness Coach',
    description: 'Get personalized coaching and advice',
    icon: MessageCircle,
    color: '#FD79A8',
    route: '/fitness-chat'
  }
];

export default function FitnessScreen() {
  const renderCategory = (category: FitnessCategory) => {
    const IconComponent = category.icon;
    
    return (
      <TouchableOpacity
        key={category.id}
        style={styles.categoryCard}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={category.gradient}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <IconComponent size={24} color="white" />
            <ArrowRight size={18} color="white" style={styles.arrow} />
          </View>
        </LinearGradient>
        
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{category.title}</Text>
          <Text style={styles.cardDescription}>{category.description}</Text>
          
          <View style={styles.activitiesContainer}>
            {category.activities.slice(0, 4).map((activity, index) => (
              <View key={index} style={styles.activityTag}>
                <Text style={styles.activityText}>{activity}</Text>
              </View>
            ))}
            {category.activities.length > 4 && (
              <View style={styles.activityTag}>
                <Text style={styles.activityText}>+{category.activities.length - 4} more</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTool = (tool: Tool) => {
    const IconComponent = tool.icon;
    
    return (
      <TouchableOpacity
        key={tool.id}
        style={styles.toolCard}
        onPress={() => tool.route && router.push(tool.route as any)}
        activeOpacity={0.8}
      >
        <View style={[styles.toolIcon, { backgroundColor: tool.color + '20' }]}>
          <IconComponent size={24} color={tool.color} />
        </View>
        <View style={styles.toolContent}>
          <Text style={styles.toolTitle}>{tool.title}</Text>
          <Text style={styles.toolDescription}>{tool.description}</Text>
        </View>
        <ArrowRight size={16} color="#BDC3C7" />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Fitness & Sports',
          headerStyle: { backgroundColor: '#FF7675' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.heroSection}>
            <LinearGradient
              colors={['#FF7675', '#E17055']}
              style={styles.heroGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Dumbbell size={48} color="white" />
              <Text style={styles.heroTitle}>Fitness & Sports</Text>
              <Text style={styles.heroSubtitle}>
                Complete athletic performance and sports training platform
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fitness Tools</Text>
            <Text style={styles.sectionSubtitle}>Essential tools for your fitness journey</Text>
            
            <View style={styles.toolsGrid}>
              {fitnessTools.map(renderTool)}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sports Categories</Text>
            <Text style={styles.sectionSubtitle}>Explore different types of athletic activities</Text>
            
            <View style={styles.categoriesGrid}>
              {fitnessCategories.map(renderCategory)}
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroSection: {
    marginBottom: 32,
  },
  heroGradient: {
    paddingHorizontal: 24,
    paddingVertical: 48,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 20,
  },
  toolsGrid: {
    gap: 12,
  },
  toolCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  toolContent: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  toolDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 18,
  },
  categoriesGrid: {
    gap: 16,
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardGradient: {
    height: 70,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  arrow: {
    opacity: 0.8,
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 16,
  },
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  activityTag: {
    backgroundColor: '#F1F3F4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activityText: {
    fontSize: 12,
    color: '#5D6D7E',
    fontWeight: '500',
  },
});