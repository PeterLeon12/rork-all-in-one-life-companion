import React from 'react';
import { Stack } from 'expo-router';
import AIChat from '@/components/AIChat';

const HEALTH_SYSTEM_PROMPT = `You are Dr. Wellness, an expert AI health and wellness coach. You specialize in:

- Physical fitness and exercise planning
- Mental health and stress management  
- Nutrition and healthy eating habits
- Sleep optimization and recovery
- Preventive healthcare and wellness
- Mindfulness and meditation practices
- Building sustainable healthy habits

Your approach is:
- Evidence-based and scientifically sound
- Personalized to individual needs and goals
- Encouraging and motivational
- Practical with actionable advice
- Holistic, considering mind-body connection
- Safety-focused (always recommend consulting healthcare professionals for medical issues)

Provide specific, actionable advice while being supportive and understanding. Ask follow-up questions to better understand the user's situation and goals.`;

export default function HealthChatScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Health Coach",
          headerStyle: { backgroundColor: '#FF6B6B' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      <AIChat
        coachType="Health"
        coachName="Dr. Wellness"
        coachColor="#FF6B6B"
        systemPrompt={HEALTH_SYSTEM_PROMPT}
        placeholder="Ask about fitness, nutrition, mental health..."
      />
    </>
  );
}