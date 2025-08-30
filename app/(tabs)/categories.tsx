import React, { useState, useMemo, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput, Platform } from 'react-native';
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
  HandHeart,
  Search,
  Filter,
  X
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useCategories } from '@/contexts/CategoryContext';
import * as Haptics from 'expo-haptics';

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
    title: 'Health & Fitness',
    description: 'Complete physical wellness: health, fitness, nutrition, and energy',
    icon: Heart,
    gradient: ['#FF6B6B', '#FF8E8E'],
    features: ['Mental Health', 'Fitness Training', 'Nutrition', 'Sleep Optimization', 'Energy Management', 'Sports & Activities'],
    route: '/health'
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
    title: 'Confidence & Freedom',
    description: 'Build self-confidence and break free from limiting habits',
    icon: Shield,
    gradient: ['#FFD93D', '#FF9F43'],
    features: ['Self-Confidence', 'Break Bad Habits', 'Overcome Fears', 'Personal Empowerment', 'Behavioral Change'],
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
    title: 'Mindfulness & Creativity',
    description: 'Inner peace, spiritual growth, and creative self-expression',
    icon: Brain,
    gradient: ['#74B9FF', '#0984E3'],
    features: ['Meditation', 'Creative Arts', 'Journaling', 'Music & Writing', 'Spiritual Growth', 'Artistic Expression'],
    route: '/mindfulness'
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
    id: 'travel',
    title: 'Travel & Community',
    description: 'Explore the world, connect with others, and make positive impact',
    icon: MapPin,
    gradient: ['#FF9500', '#FF5722'],
    features: ['Travel Planning', 'Cultural Exploration', 'Community Service', 'Volunteering', 'Social Impact', 'Global Connections'],
    route: '/travel'
  }
];

export default function CategoriesScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const { getCategoryProgress } = useCategories();
  
  const filters = [
    { id: 'all', label: 'All Categories', color: '#667eea' },
    { id: 'high-progress', label: 'High Progress', color: '#00B894' },
    { id: 'needs-attention', label: 'Needs Attention', color: '#FF6B6B' },
    { id: 'wellness', label: 'Wellness', color: '#FF6B6B' },
    { id: 'growth', label: 'Growth', color: '#6C5CE7' },
    { id: 'lifestyle', label: 'Lifestyle', color: '#4ECDC4' }
  ];
  
  const filteredCategories = useMemo(() => {
    let filtered = categories;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(category => 
        category.title.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query) ||
        category.features.some(feature => feature.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (selectedFilter !== 'all') {
      switch (selectedFilter) {
        case 'high-progress':
          filtered = filtered.filter(category => getCategoryProgress(category.id) >= 70);
          break;
        case 'needs-attention':
          filtered = filtered.filter(category => getCategoryProgress(category.id) < 30);
          break;
        case 'wellness':
          filtered = filtered.filter(category => 
            ['health', 'mindfulness'].includes(category.id)
          );
          break;
        case 'growth':
          filtered = filtered.filter(category => 
            ['learning', 'confidence', 'productivity', 'mindfulness'].includes(category.id)
          );
          break;
        case 'lifestyle':
          filtered = filtered.filter(category => 
            ['wealth', 'relationships', 'lifestyle', 'travel'].includes(category.id)
          );
          break;
      }
    }
    
    return filtered;
  }, [searchQuery, selectedFilter, getCategoryProgress]);
  
  const handleFilterPress = useCallback(async (filterId: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedFilter(filterId);
  }, []);
  
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);
  
  const renderFilterChip = useCallback((filter: any) => {
    const isSelected = selectedFilter === filter.id;
    
    return (
      <TouchableOpacity
        key={filter.id}
        style={[
          styles.filterChip,
          isSelected && { backgroundColor: filter.color }
        ]}
        onPress={() => handleFilterPress(filter.id)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.filterChipText,
          isSelected && styles.filterChipTextSelected
        ]}>
          {filter.label}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedFilter, handleFilterPress]);
  
  const renderCategory = useCallback((category: Category) => {
    const IconComponent = category.icon;
    const progress = getCategoryProgress(category.id);
    
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
            <View style={styles.progressBadge}>
              <Text style={styles.progressText}>{progress}%</Text>
            </View>
          </View>
        </LinearGradient>
        
        <View style={styles.cardContent}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>{category.title}</Text>
            <ChevronRight size={16} color="#BDC3C7" />
          </View>
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
  }, [getCategoryProgress]);

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
              
              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                  <Search size={20} color="#7F8C8D" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search categories, features..."
                    placeholderTextColor="#95A5A6"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                      <X size={18} color="#7F8C8D" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              
              {/* Filter Chips */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.filtersScroll}
                contentContainerStyle={styles.filtersContainer}
              >
                {filters.map(renderFilterChip)}
              </ScrollView>
            </View>
            
            <ScrollView 
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {filteredCategories.length > 0 ? (
                filteredCategories.map(renderCategory)
              ) : (
                <View style={styles.emptyState}>
                  <Filter size={48} color="#BDC3C7" />
                  <Text style={styles.emptyStateTitle}>No categories found</Text>
                  <Text style={styles.emptyStateText}>
                    {searchQuery.trim() 
                      ? `No categories match "${searchQuery}"`
                      : 'No categories match the selected filter'
                    }
                  </Text>
                </View>
              )}
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
  searchContainer: {
    marginTop: 20,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
  },
  clearButton: {
    padding: 4,
  },
  filtersScroll: {
    marginBottom: 8,
  },
  filtersContainer: {
    paddingRight: 24,
  },
  filterChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7F8C8D',
  },
  filterChipTextSelected: {
    color: 'white',
  },
  progressBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7F8C8D',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#95A5A6',
    textAlign: 'center',
    lineHeight: 20,
  },
});