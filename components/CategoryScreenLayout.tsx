import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import { useCategoryData } from '@/contexts/CategoryContext';

interface CategoryScreenLayoutProps {
  categoryId: string;
  title: string;
  headerColor: string;
  headerGradient: [string, string];
  icon: React.ComponentType<any>;
  chatRoute?: string;
  children: React.ReactNode;
}

export default function CategoryScreenLayout({
  categoryId,
  title,
  headerColor,
  headerGradient,
  icon: IconComponent,
  chatRoute,
  children
}: CategoryScreenLayoutProps) {
  const { score, weeklyImprovement } = useCategoryData(categoryId);

  return (
    <>
      <Stack.Screen 
        options={{ 
          title,
          headerStyle: { backgroundColor: headerColor },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.backgroundOverlay}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
              {/* Header Card */}
              <View style={styles.headerCard}>
                <LinearGradient
                  colors={headerGradient}
                  style={styles.headerGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.headerContent}>
                    <IconComponent size={32} color="white" />
                    <Text style={styles.headerTitle}>{title}</Text>
                    <Text style={styles.headerScore}>{score}/100</Text>
                    <Text style={styles.headerSubtitle}>
                      {weeklyImprovement > 0 ? `+${weeklyImprovement} this week` : `Keep building ${title.toLowerCase()} habits`}
                    </Text>
                    
                    {chatRoute && (
                      <TouchableOpacity 
                        style={styles.aiChatButton}
                        onPress={() => router.push(chatRoute as any)}
                        activeOpacity={0.8}
                      >
                        <MessageCircle size={20} color="white" />
                        <Text style={styles.aiChatButtonText}>AI Coach</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </LinearGradient>
              </View>

              {children}
            </ScrollView>
          </View>
        </LinearGradient>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  backgroundOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerCard: {
    margin: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  headerGradient: {
    padding: 24,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  headerScore: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 8,
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
    marginTop: 4,
    textAlign: 'center',
  },
  aiChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 16,
  },
  aiChatButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});