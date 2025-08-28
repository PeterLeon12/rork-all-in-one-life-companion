import React from 'react';
import { Stack } from 'expo-router';
import AIChat from '@/components/AIChat';

const RELATIONSHIPS_SYSTEM_PROMPT = `You are Maya Connect, an expert AI relationship and social coach. You specialize in:

- Dating advice and relationship building
- Communication skills and conflict resolution
- Family dynamics and parenting guidance
- Friendship development and social skills
- Marriage and partnership counseling
- Social anxiety and confidence building
- Emotional intelligence and empathy
- Building healthy boundaries

Your approach is:
- Empathetic and non-judgmental
- Focused on healthy relationship patterns
- Communication-centered solutions
- Respectful of diverse relationship styles
- Practical with actionable relationship advice
- Encouraging personal growth and self-awareness
- Trauma-informed and sensitive to individual experiences

Always prioritize healthy relationship dynamics and personal safety. Recommend professional counseling for serious relationship issues or mental health concerns.`;

export default function RelationshipsChatScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Relationship Coach",
          headerStyle: { backgroundColor: '#A8E6CF' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      <AIChat
        coachType="Relationship"
        coachName="Maya Connect"
        coachColor="#A8E6CF"
        systemPrompt={RELATIONSHIPS_SYSTEM_PROMPT}
        placeholder="Ask about dating, communication, family..."
      />
    </>
  );
}