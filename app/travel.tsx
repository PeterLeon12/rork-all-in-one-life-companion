import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  MapPin, 
  Camera, 
  Globe, 
  Plane, 
  MessageCircle, 
  TrendingUp,
  Calendar,
  Star,
  Users,
  Book
} from 'lucide-react-native';
import { Stack } from 'expo-router';
import { useCategoryData } from '@/contexts/CategoryContext';

interface TravelFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  route?: string;
}

const travelFeatures: TravelFeature[] = [
  {
    id: 'planning',
    title: 'Trip Planning',
    description: 'Plan your perfect adventure with detailed itineraries',
    icon: Calendar,
    color: '#FF9500',
  },
  {
    id: 'cultural',
    title: 'Cultural Exploration',
    description: 'Discover local cultures and traditions',
    icon: Globe,
    color: '#FF5722',
  },
  {
    id: 'photography',
    title: 'Travel Photography',
    description: 'Capture and share your travel memories',
    icon: Camera,
    color: '#4CAF50',
  },
  {
    id: 'language',
    title: 'Language Learning',
    description: 'Learn local languages for better experiences',
    icon: Book,
    color: '#2196F3',
  },
  {
    id: 'social',
    title: 'Travel Community',
    description: 'Connect with fellow travelers and locals',
    icon: Users,
    color: '#9C27B0',
  },
  {
    id: 'experiences',
    title: 'Local Experiences',
    description: 'Find unique activities and hidden gems',
    icon: Star,
    color: '#FF6B6B',
  }
];

export default function TravelScreen() {
  const { score, weeklyImprovement } = useCategoryData('travel');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [travelGoal, setTravelGoal] = useState('');

  const renderFeatureCard = (feature: TravelFeature) => {
    const IconComponent = feature.icon;
    const isSelected = selectedFeature === feature.id;
    
    return (
      <TouchableOpacity
        key={feature.id}
        style={[styles.featureCard, isSelected && styles.selectedCard]}
        onPress={() => setSelectedFeature(isSelected ? null : feature.id)}
        activeOpacity={0.8}
      >
        <View style={[styles.iconContainer, { backgroundColor: feature.color + '20' }]}>
          <IconComponent size={24} color={feature.color} />
        </View>
        <View style={styles.featureContent}>
          <Text style={styles.featureTitle}>{feature.title}</Text>
          <Text style={styles.featureDescription}>{feature.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Travel & Adventure',
          headerStyle: { backgroundColor: '#FF9500' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => (
            <TouchableOpacity>
              <MessageCircle size={24} color="white" />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Stats */}
        <LinearGradient
          colors={['#FF9500', '#FF5722']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MapPin size={24} color="white" />
              <Text style={styles.statValue}>{score}%</Text>
              <Text style={styles.statLabel}>Travel Score</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <TrendingUp size={24} color="white" />
              <Text style={styles.statValue}>+{weeklyImprovement}</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Travel Goal Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Set Your Travel Goal</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Where do you want to go next?"
              value={travelGoal}
              onChangeText={setTravelGoal}
              multiline
            />
          </View>
        </View>

        {/* Travel Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travel & Adventure Features</Text>
          <Text style={styles.sectionSubtitle}>
            Explore the world and create unforgettable memories
          </Text>
          
          <View style={styles.featuresContainer}>
            {travelFeatures.map(renderFeatureCard)}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity style={styles.quickAction}>
              <Plane size={20} color="#FF9500" />
              <Text style={styles.quickActionText}>Plan Trip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Camera size={20} color="#FF5722" />
              <Text style={styles.quickActionText}>Photo Journal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Globe size={20} color="#4CAF50" />
              <Text style={styles.quickActionText}>Explore Culture</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Travel Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travel Tips</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>🌍 Cultural Immersion</Text>
              <Text style={styles.tipText}>
                Learn basic phrases in the local language and try traditional foods
              </Text>
            </View>
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>📸 Memory Keeping</Text>
              <Text style={styles.tipText}>
                Document your journey with photos and journal entries
              </Text>
            </View>
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>🤝 Connect Locally</Text>
              <Text style={styles.tipText}>
                Engage with locals and fellow travelers for authentic experiences
              </Text>
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
  headerGradient: {
    padding: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 20,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 20,
    lineHeight: 20,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    fontSize: 16,
    color: '#2C3E50',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  featuresContainer: {
    gap: 12,
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#FF9500',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 12,
    color: '#2C3E50',
    marginTop: 8,
    textAlign: 'center',
  },
  tipsContainer: {
    gap: 12,
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
});