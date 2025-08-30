import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { 
  Palette, 
  Pen, 
  Brush,
  Plus,
  MessageCircle,
  ChevronRight
} from 'lucide-react-native';

const creativityStats = [
  { label: 'Projects', value: '12', color: '#E67E22' },
  { label: 'Hours', value: '42', color: '#9B59B6' }
];

const activeProjects = [
  {
    title: 'Digital Art Portfolio',
    type: 'Visual Art',
    progress: 78,
    color: '#E67E22',
    icon: Brush
  },
  {
    title: 'Short Story Collection',
    type: 'Writing',
    progress: 45,
    color: '#9B59B6',
    icon: Pen
  }
];

const creativePrompts = [
  {
    category: 'Visual Art',
    prompt: 'Create a piece inspired by your favorite childhood memory',
    timeEstimate: '2-3 hours'
  },
  {
    category: 'Writing',
    prompt: 'Write a story that begins with "The last person on Earth..."',
    timeEstimate: '1-2 hours'
  }
];

export default function CreativityScreen() {
  const [selectedTab, setSelectedTab] = useState<'projects' | 'prompts'>('projects');

  const renderStatCard = (stat: any, index: number) => {
    return (
      <View key={index} style={styles.statCard}>
        <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
        <Text style={styles.statLabel}>{stat.label}</Text>
      </View>
    );
  };

  const renderProject = (project: any, index: number) => {
    const IconComponent = project.icon;
    
    return (
      <TouchableOpacity key={index} style={styles.projectCard}>
        <View style={styles.projectHeader}>
          <View style={[styles.projectIcon, { backgroundColor: project.color + '15' }]}>
            <IconComponent size={20} color={project.color} />
          </View>
          <View style={styles.projectInfo}>
            <Text style={styles.projectTitle}>{project.title}</Text>
            <Text style={styles.projectType}>{project.type}</Text>
          </View>
          <ChevronRight size={20} color="#C7C7CC" />
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${project.progress}%`, backgroundColor: project.color }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{project.progress}%</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPrompt = (prompt: any, index: number) => {
    return (
      <TouchableOpacity key={index} style={styles.promptCard}>
        <View style={styles.promptHeader}>
          <Text style={styles.promptCategory}>{prompt.category}</Text>
          <Text style={styles.timeEstimate}>{prompt.timeEstimate}</Text>
        </View>
        <Text style={styles.promptText}>{prompt.prompt}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Creativity",
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: '#000000',
          headerTitleStyle: { fontWeight: '600' },
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => router.push('/creativity-chat')}
              style={styles.chatButton}
            >
              <MessageCircle size={24} color="#E67E22" />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Palette size={28} color="#E67E22" />
            <Text style={styles.headerTitle}>Creative Journey</Text>
            <Text style={styles.headerSubtitle}>Express your unique vision</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {creativityStats.map(renderStatCard)}
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'projects' && styles.activeTab]}
            onPress={() => setSelectedTab('projects')}
          >
            <Text style={[styles.tabText, selectedTab === 'projects' && styles.activeTabText]}>
              Projects
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'prompts' && styles.activeTab]}
            onPress={() => setSelectedTab('prompts')}
          >
            <Text style={[styles.tabText, selectedTab === 'prompts' && styles.activeTabText]}>
              Prompts
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {selectedTab === 'projects' ? (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Active Projects</Text>
                <TouchableOpacity style={styles.addButton}>
                  <Plus size={20} color="#E67E22" />
                </TouchableOpacity>
              </View>
              {activeProjects.map(renderProject)}
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Creative Prompts</Text>
              {creativePrompts.map(renderPrompt)}
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  chatButton: {
    marginRight: 16,
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 2,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'white',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#1C1C1E',
  },
  content: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E67E22',
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  projectInfo: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  projectType: {
    fontSize: 14,
    color: '#8E8E93',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  promptCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  promptCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E67E22',
  },
  timeEstimate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  promptText: {
    fontSize: 16,
    color: '#1C1C1E',
    lineHeight: 22,
  },
});