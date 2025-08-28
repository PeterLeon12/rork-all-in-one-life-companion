import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Heart, 
  DollarSign, 
  Users, 
  Shield, 
  BookOpen, 
  Target, 
  Brain, 
  Palette,
  Home as HomeIcon,
  Zap,
  ChevronRight,
  Dumbbell,
  ShieldCheck,
  MapPin,
  HandHeart
} from 'lucide-react-native';
import { router } from 'expo-router';

interface Category {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: [string, string];
  features: string[];
  route: string;
}

const categories: Category[] = [
  {
    id: 'health',
    title: 'Health & Wellness',
    description: 'Complete mind and body wellness toolkit',
    icon: Heart,
    gradient: ['#FF6B6B', '#FF8E8E'],
    features: ['Mental Health', 'Sleep Optimization', 'Nutrition', 'Stress Management', 'Medical Care', 'Preventive Health'],
    route: '/health'
  },
  {
    id: 'fitness',
    title: 'Fitness & Sports',
    description: 'Athletic performance, outdoor activities, and sports training',
    icon: Dumbbell,
    gradient: ['#FF7675', '#E17055'],
    features: ['Workout Plans', 'Sports Training', 'Outdoor Activities', 'Athletic Performance', 'Team Sports', 'Adventure Sports'],
    route: '/fitness'
  },
  {
    id: 'wealth',
    title: 'Wealth & Career',
    description: 'Build financial freedom, career success, and entrepreneurship',
    icon: DollarSign,
    gradient: ['#4ECDC4', '#44A08D'],
    features: ['Personal Finance', 'Investment Tracking', 'Career Growth', 'Entrepreneurship', 'Business Development', 'Professional Skills'],
    route: '/wealth'
  },
  {
    id: 'relationships',
    title: 'Relationships & Family',
    description: 'Strengthen connections, family bonds, and parenting skills',
    icon: Users,
    gradient: ['#A8E6CF', '#7FCDCD'],
    features: ['Dating Advice', 'Family Dynamics', 'Parenting Skills', 'Communication Skills', 'Social Skills', 'Friendship Building'],
    route: '/relationships'
  },
  {
    id: 'confidence',
    title: 'Confidence & Security',
    description: 'Build unshakeable self-confidence and inner strength',
    icon: Shield,
    gradient: ['#FFD93D', '#FF9F43'],
    features: ['Self-Confidence', 'Body Image', 'Social Anxiety', 'Impostor Syndrome'],
    route: '/confidence'
  },
  {
    id: 'learning',
    title: 'Learning & Education',
    description: 'Continuous skill development, education, and personal growth',
    icon: BookOpen,
    gradient: ['#6C5CE7', '#A29BFE'],
    features: ['Skill Development', 'Online Courses', 'Certifications', 'Academic Learning', 'Professional Development', 'Language Learning'],
    route: '/learning'
  },
  {
    id: 'productivity',
    title: 'Productivity & Goals',
    description: 'Master time management and achieve your dreams',
    icon: Target,
    gradient: ['#FD79A8', '#E84393'],
    features: ['Goal Setting', 'Habit Tracking', 'Time Management', 'Focus Techniques'],
    route: '/productivity'
  },
  {
    id: 'mindfulness',
    title: 'Mindfulness & Spirit',
    description: 'Find inner peace, spiritual growth, and philosophical wisdom',
    icon: Brain,
    gradient: ['#74B9FF', '#0984E3'],
    features: ['Meditation', 'Journaling', 'Gratitude Practice', 'Spiritual Growth', 'Philosophy', 'Religious Practice'],
    route: '/mindfulness'
  },
  {
    id: 'creativity',
    title: 'Creativity & Arts',
    description: 'Unleash creativity through arts, music, writing, and entertainment',
    icon: Palette,
    gradient: ['#FD79A8', '#FDCB6E'],
    features: ['Art & Design', 'Writing', 'Music', 'Crafts', 'Photography', 'Entertainment'],
    route: '/creativity'
  },
  {
    id: 'lifestyle',
    title: 'Home & Lifestyle',
    description: 'Create a beautiful, organized home and optimized lifestyle',
    icon: HomeIcon,
    gradient: ['#55A3FF', '#003D82'],
    features: ['Home Organization', 'Cooking', 'Interior Design', 'Home Improvement', 'Gardening', 'Life Optimization'],
    route: '/lifestyle'
  },
  {
    id: 'energy',
    title: 'Energy & Vitality',
    description: 'Boost your energy and live with vitality',
    icon: Zap,
    gradient: ['#00B894', '#00CEC9'],
    features: ['Energy Management', 'Nutrition', 'Exercise', 'Recovery'],
    route: '/energy'
  },
  {
    id: 'break-free',
    title: 'Break Free',
    description: 'Break free from unwanted habits and build positive ones',
    icon: ShieldCheck,
    gradient: ['#00B894', '#55A3FF'],
    features: ['Habit Breaking', 'Behavioral Change', 'Support Groups', 'Positive Habits'],
    route: '/break-free'
  },
  {
    id: 'travel',
    title: 'Travel & Adventure',
    description: 'Explore the world and embrace new adventures',
    icon: MapPin,
    gradient: ['#FF9500', '#FF5722'],
    features: ['Travel Planning', 'Cultural Exploration', 'Adventure Activities', 'Language Immersion', 'Photography', 'Local Experiences'],
    route: '/travel'
  },
  {
    id: 'community',
    title: 'Community & Service',
    description: 'Give back to community and make a positive impact',
    icon: HandHeart,
    gradient: ['#8BC34A', '#4CAF50'],
    features: ['Volunteering', 'Community Service', 'Social Impact', 'Charity Work', 'Environmental Action', 'Civic Engagement'],
    route: '/community'
  }
];

export default function CategoriesScreen() {
  const renderCategory = (category: Category) => {
    const IconComponent = category.icon;
    
    return (
      <TouchableOpacity
        key={category.id}
        style={styles.categoryCard}
        onPress={() => router.push(category.route as any)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={category.gradient}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <IconComponent size={28} color="white" />
            <ChevronRight size={20} color="white" style={styles.chevron} />
          </View>
        </LinearGradient>
        
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{category.title}</Text>
          <Text style={styles.cardDescription}>{category.description}</Text>
          
          <View style={styles.featuresContainer}>
            {category.features.slice(0, 3).map((feature, index) => (
              <View key={index} style={styles.featureTag}>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
            {category.features.length > 3 && (
              <View style={styles.featureTag}>
                <Text style={styles.featureText}>+{category.features.length - 3} more</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.backgroundContainer}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.backgroundOverlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Life Categories</Text>
              <Text style={styles.subtitle}>Explore all areas of personal growth</Text>
            </View>
            
            <ScrollView 
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {categories.map(renderCategory)}
            </ScrollView>
          </View>
        </View>
      </LinearGradient>
    </View>
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  categoryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardGradient: {
    height: 80,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  chevron: {
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
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureTag: {
    backgroundColor: '#F1F3F4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 12,
    color: '#5D6D7E',
    fontWeight: '500',
  },
});