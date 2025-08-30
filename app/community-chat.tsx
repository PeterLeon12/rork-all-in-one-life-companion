import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import AIChat from '@/components/AIChat';

export default function CommunityChatScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Community Guide",
          headerStyle: { backgroundColor: '#8BC34A' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <View style={styles.container}>
        <AIChat 
          coachType="Community & Service"
          coachName="Community Guide"
          coachColor="#8BC34A"
          systemPrompt="You are a compassionate community service coach and volunteer coordinator. Help users find meaningful ways to serve their community, connect with local organizations, develop leadership skills, and create positive social impact. Provide guidance on volunteering opportunities, community organizing, civic engagement, and building stronger neighborhoods. Be inspiring and practical while emphasizing the importance of service to others and social responsibility."
          placeholder="Ask about volunteering, community projects, civic engagement..."
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