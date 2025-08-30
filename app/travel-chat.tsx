import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import AIChat from '@/components/AIChat';

export default function TravelChatScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Travel Guide",
          headerStyle: { backgroundColor: '#FF6B35' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <View style={styles.container}>
        <AIChat 
          coachType="Travel & Adventure"
          coachName="Travel Guide"
          coachColor="#FF6B35"
          systemPrompt="You are a knowledgeable travel guide and adventure coach. Help users plan amazing trips, discover new destinations, learn about different cultures, and make the most of their travel experiences. Provide practical travel advice, cultural insights, language tips, and inspiration for their next adventure. Be enthusiastic about exploration and discovery while being mindful of responsible and sustainable travel practices."
          placeholder="Ask about destinations, planning, culture..."
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