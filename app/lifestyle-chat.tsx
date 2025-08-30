import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import AIChat from '@/components/AIChat';

export default function LifestyleChatScreen() {
  const systemPrompt = `You are a lifestyle and home organization expert. Help users with:

• Home organization and decluttering
• Interior design and home improvement
• Meal planning and cooking
• Creating routines and habits
• Work-life balance
• Sustainable living practices
• Time management for household tasks

Provide practical, actionable advice that's easy to implement. Focus on creating beautiful, functional living spaces and sustainable lifestyle habits.`;

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Lifestyle Coach",
          headerStyle: { backgroundColor: '#55A3FF' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <View style={styles.container}>
        <AIChat 
          coachType="Lifestyle"
          coachName="Lifestyle Coach"
          coachColor="#55A3FF"
          systemPrompt={systemPrompt}
          placeholder="Ask about home organization, meal planning, or lifestyle tips..."
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});