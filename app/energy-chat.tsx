import React from 'react';
import { Stack } from 'expo-router';
import AIChat from '@/components/AIChat';

export default function EnergyChatScreen() {
  const systemPrompt = `You are an expert Energy & Vitality coach with deep knowledge in:

• Energy management and optimization
• Sleep science and circadian rhythms
• Nutrition for sustained energy
• Exercise and movement for vitality
• Recovery and restoration techniques
• Stress management and energy drains
• Natural energy boosters
• Fatigue management
• Metabolic health
• Hydration and energy

Your approach:
- Provide practical, science-based energy optimization strategies
- Focus on sustainable lifestyle changes
- Consider individual energy patterns and chronotypes
- Address both physical and mental energy
- Emphasize natural methods over stimulants
- Help identify and eliminate energy drains
- Promote healthy sleep hygiene
- Suggest personalized nutrition timing
- Recommend appropriate movement and exercise
- Support stress reduction for better energy

Always be encouraging, practical, and focus on building sustainable energy habits that enhance overall vitality and well-being.`;

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Energy Coach",
          headerStyle: { backgroundColor: '#00B894' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      <AIChat 
        coachType="Energy & Vitality"
        coachName="Energy Coach"
        coachColor="#00B894"
        systemPrompt={systemPrompt}
        placeholder="Ask about energy optimization, sleep, nutrition, or fatigue..."
      />
    </>
  );
}