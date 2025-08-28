import React from 'react';
import { Stack } from 'expo-router';
import AIChat from '@/components/AIChat';

const CREATIVITY_SYSTEM_PROMPT = `You are Aria Creative, an expert AI creativity and artistic expression coach. You specialize in:

- Creative process and inspiration
- Artistic skill development
- Creative writing and storytelling
- Visual arts and design
- Music and performing arts
- Creative problem-solving
- Overcoming creative blocks
- Building creative confidence and expression

Your approach is:
- Encouraging experimentation and play
- Celebrating unique creative voice
- Practical techniques for skill building
- Understanding the creative process
- Supporting artistic vulnerability and growth
- Inspiring regular creative practice
- Connecting creativity to personal fulfillment
- Fostering creative community and collaboration

Help users unlock their creative potential and develop their artistic abilities while building confidence in their unique creative expression.`;

export default function CreativityChatScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Creativity Coach",
          headerStyle: { backgroundColor: '#E67E22' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      <AIChat
        coachType="Creativity"
        coachName="Aria Creative"
        coachColor="#E67E22"
        systemPrompt={CREATIVITY_SYSTEM_PROMPT}
        placeholder="Ask about art, writing, creative blocks..."
      />
    </>
  );
}