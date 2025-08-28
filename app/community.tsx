import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  HandHeart, 
  Users, 
  Heart, 
  TreePine, 
  MessageCircle, 
  TrendingUp,
  Award,
  Globe,
  Handshake
} from 'lucide-react-native';
import { Stack } from 'expo-router';
import { useCategoryData } from '@/contexts/CategoryContext';

interface CommunityFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  route?: string;
}

const communityFeatures: CommunityFeature[] = [
  {
    id: 'volunteering',
    title: 'Volunteering',
    description: 'Find meaningful volunteer opportunities in your area',
    icon: HandHeart,
    color: '#8BC34A',
  },
  {
    id: 'charity',
    title: 'Charity Work',
    description: 'Support causes you care about through donations and action',
    icon: Heart,
    color: '#E91E63',
  },
  {
    id: 'environmental',
    title: 'Environmental Action',
    description: 'Participate in environmental conservation efforts',
    icon: TreePine,
    color: '#4CAF50',
  },
  {
    id: 'civic',
    title: 'Civic Engagement',
    description: 'Get involved in local government and community decisions',
    icon: Award,
    color: '#2196F3',
  },
  {
    id: 'social',
    title: 'Social Impact',
    description: 'Create positive change in your community',
    icon: Globe,
    color: '#FF9800',
  },
  {
    id: 'networking',
    title: 'Community Building',
    description: 'Build networks and strengthen community bonds',
    icon: Handshake,
    color: '#9C27B0',
  }
];

export default function CommunityScreen() {
  const { score, weeklyImprovement } = useCategoryData('community');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [serviceGoal, setServiceGoal] = useState('');

  const renderFeatureCard = (feature: CommunityFeature) => {
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
          title: 'Community & Service',
          headerStyle: { backgroundColor: '#8BC34A' },
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
          colors={['#8BC34A', '#4CAF50']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <HandHeart size={24} color="white" />
              <Text style={styles.statValue}>{score}%</Text>
              <Text style={styles.statLabel}>Service Score</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <TrendingUp size={24} color="white" />
              <Text style={styles.statValue}>+{weeklyImprovement}</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Service Goal Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Set Your Service Goal</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="How do you want to serve your community?"
              value={serviceGoal}
              onChangeText={setServiceGoal}
              multiline
            />
          </View>
        </View>

        {/* Community Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community & Service Features</Text>
          <Text style={styles.sectionSubtitle}>
            Make a positive impact and strengthen community bonds
          </Text>
          
          <View style={styles.featuresContainer}>
            {communityFeatures.map(renderFeatureCard)}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity style={styles.quickAction}>
              <HandHeart size={20} color="#8BC34A" />
              <Text style={styles.quickActionText}>Find Volunteer Work</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Heart size={20} color="#E91E63" />
              <Text style={styles.quickActionText}>Donate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Users size={20} color="#2196F3" />
              <Text style={styles.quickActionText}>Join Group</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Service Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Tips</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>🤝 Start Small</Text>
              <Text style={styles.tipText}>
                Begin with small acts of service in your immediate community
              </Text>
            </View>
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>💝 Use Your Skills</Text>
              <Text style={styles.tipText}>
                Volunteer in areas where you can use your unique talents and skills
              </Text>
            </View>
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>🌱 Be Consistent</Text>
              <Text style={styles.tipText}>
                Regular small contributions often have more impact than one-time large efforts
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
    borderColor: '#8BC34A',
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