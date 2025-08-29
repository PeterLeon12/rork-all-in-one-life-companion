import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { 
  Dumbbell,
  Heart,
  Target,
  TrendingUp,
  MessageCircle,
  ArrowRight
} from 'lucide-react-native';
import { router, Stack } from 'expo-router';

interface FitnessOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  route?: string;
}

const fitnessOptions: FitnessOption[] = [
  {
    id: 'strength',
    title: 'Strength Training',
    description: 'Build muscle and increase power',
    icon: Dumbbell,
    color: '#FF7675'
  },
  {
    id: 'cardio',
    title: 'Cardio & Endurance',
    description: 'Improve cardiovascular health',
    icon: Heart,
    color: '#FF6B6B'
  },
  {
    id: 'sports',
    title: 'Sports Training',
    description: 'Sport-specific performance',
    icon: Target,
    color: '#74B9FF'
  },
  {
    id: 'progress',
    title: 'Track Progress',
    description: 'Monitor your fitness journey',
    icon: TrendingUp,
    color: '#6C5CE7'
  },
  {
    id: 'ai-coach',
    title: 'AI Fitness Coach',
    description: 'Get personalized guidance',
    icon: MessageCircle,
    color: '#FD79A8',
    route: '/fitness-chat'
  }
];

export default function FitnessScreen() {
  const renderOption = (option: FitnessOption) => {
    const IconComponent = option.icon;
    
    return (
      <TouchableOpacity
        key={option.id}
        style={styles.optionCard}
        onPress={() => option.route && router.push(option.route as any)}
        activeOpacity={0.7}
      >
        <View style={[styles.optionIcon, { backgroundColor: option.color + '15' }]}>
          <IconComponent size={28} color={option.color} />
        </View>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>{option.title}</Text>
          <Text style={styles.optionDescription}>{option.description}</Text>
        </View>
        <ArrowRight size={20} color="#C7C7CC" />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Fitness',
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
          <View style={styles.header}>
            <Text style={styles.title}>Fitness</Text>
            <Text style={styles.subtitle}>Your personal training companion</Text>
          </View>

          <View style={styles.optionsContainer}>
            {fitnessOptions.map(renderOption)}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 34,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 17,
    color: '#8E8E93',
    fontWeight: '400',
  },
  optionsContainer: {
    paddingHorizontal: 20,
    gap: 1,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 58,
    height: 58,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 15,
    color: '#8E8E93',
    lineHeight: 20,
  },
});