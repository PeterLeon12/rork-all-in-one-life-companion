import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import AIChat from '@/components/AIChat';

export default function FitnessChatScreen() {
  const systemPrompt = `You are a personal fitness coach focused on practical, achievable results. Help users with:

• Workout planning and exercise selection
• Proper form and technique guidance  
• Progressive training programs
• Nutrition basics for fitness goals
• Recovery and injury prevention
• Motivation and habit building

Keep advice simple, actionable, and safe. Always ask about fitness level, goals, available time, and equipment before recommending specific workouts.`;

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'AI Fitness Coach',
          headerStyle: { backgroundColor: '#FF7675' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      <View style={{ flex: 1 }}>
        <AIChat
          coachType="Fitness"
          coachName="Coach"
          coachColor="#FF7675"
          systemPrompt={systemPrompt}
          placeholder="Ask about workouts, form, nutrition..."
        />
      </View>
    </>
  );
}