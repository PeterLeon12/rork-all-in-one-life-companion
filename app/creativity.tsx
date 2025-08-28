import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { 
  Palette, 
  Pen, 
  Music, 
  Camera,
  Brush,
  Lightbulb,
  Star,
  Play,
  Plus,
  Award,
  TrendingUp,
  Clock,
  Eye
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const creativityMetrics = [
  { label: 'Projects Created', value: '18', icon: Palette, color: '#FD79A8' },
  { label: 'Creative Hours', value: '42h', icon: Clock, color: '#FDCB6E' },
  { label: 'Skills Learned', value: '6', icon: Lightbulb, color: '#6C5CE7' },
  { label: 'Inspiration Saved', value: '127', icon: Star, color: '#74B9FF' }
];

const creativeProjects = [
  {
    title: 'Digital Art Portfolio',
    type: 'Visual Art',
    progress: 78,
    timeSpent: '12h',
    lastWorked: '2 days ago',
    color: '#FD79A8',
    icon: Brush
  },
  {
    title: 'Short Story Collection',
    type: 'Writing',
    progress: 45,
    timeSpent: '8h',
    lastWorked: 'Yesterday',
    color: '#FDCB6E',
    icon: Pen
  },
  {
    title: 'Music Composition',
    type: 'Music',
    progress: 62,
    timeSpent: '15h',
    lastWorked: '3 days ago',
    color: '#6C5CE7',
    icon: Music
  },
  {
    title: 'Photography Series',
    type: 'Photography',
    progress: 89,
    timeSpent: '20h',
    lastWorked: 'Today',
    color: '#74B9FF',
    icon: Camera
  }
];

const creativePrompts = [
  {
    category: 'Visual Art',
    prompt: 'Create a piece inspired by your favorite childhood memory',
    difficulty: 'Medium',
    timeEstimate: '2-3 hours'
  },
  {
    category: 'Writing',
    prompt: 'Write a story that begins with "The last person on Earth sat alone in a room..."',
    difficulty: 'Hard',
    timeEstimate: '1-2 hours'
  },
  {
    category: 'Music',
    prompt: 'Compose a melody that represents the sound of rain',
    difficulty: 'Easy',
    timeEstimate: '30-60 minutes'
  },
  {
    category: 'Photography',
    prompt: 'Capture the beauty in something ordinary',
    difficulty: 'Medium',
    timeEstimate: '1 hour'
  }
];

const inspirationGallery = [
  { title: 'Minimalist Design Trends', category: 'Design', views: '2.3k', saved: true },
  { title: 'Color Psychology in Art', category: 'Art Theory', views: '1.8k', saved: false },
  { title: 'Storytelling Techniques', category: 'Writing', views: '3.1k', saved: true },
  { title: 'Portrait Photography Tips', category: 'Photography', views: '1.5k', saved: false }
];

const achievements = [
  { title: 'First Creation', description: 'Completed your first creative project', earned: true, icon: '🎨' },
  { title: 'Consistent Creator', description: 'Created something for 7 days straight', earned: true, icon: '🔥' },
  { title: 'Multi-talented', description: 'Worked on 3 different creative mediums', earned: false, icon: '🌟' },
  { title: 'Master Creator', description: 'Spent 100 hours creating', earned: false, icon: '👑' }
];

export default function CreativityScreen() {
  const renderMetricCard = (metric: any, index: number) => {
    const IconComponent = metric.icon;
    
    return (
      <View key={index} style={styles.metricCard}>
        <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
          <IconComponent size={20} color={metric.color} />
        </View>
        <Text style={styles.metricValue}>{metric.value}</Text>
        <Text style={styles.metricLabel}>{metric.label}</Text>
      </View>
    );
  };

  const renderProject = (project: any, index: number) => {
    const IconComponent = project.icon;
    const progressWidth = (width - 72) * (project.progress / 100);
    
    return (
      <View key={index} style={styles.projectCard}>
        <View style={styles.projectHeader}>
          <View style={[styles.projectIcon, { backgroundColor: project.color + '20' }]}>
            <IconComponent size={20} color={project.color} />
          </View>
          <View style={styles.projectInfo}>
            <Text style={styles.projectTitle}>{project.title}</Text>
            <Text style={styles.projectType}>{project.type}</Text>
            <Text style={styles.projectMeta}>
              {project.timeSpent} spent • Last worked {project.lastWorked}
            </Text>
          </View>
          <TouchableOpacity style={[styles.continueButton, { backgroundColor: project.color }]}>
            <Play size={16} color="white" fill="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: progressWidth, backgroundColor: project.color }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{project.progress}%</Text>
        </View>
      </View>
    );
  };

  const renderPrompt = (prompt: any, index: number) => {
    const getDifficultyColor = (difficulty: string) => {
      switch (difficulty.toLowerCase()) {
        case 'easy': return '#27AE60';
        case 'medium': return '#F39C12';
        case 'hard': return '#E74C3C';
        default: return '#7F8C8D';
      }
    };

    const difficultyColor = getDifficultyColor(prompt.difficulty);
    
    return (
      <View key={index} style={styles.promptCard}>
        <View style={styles.promptHeader}>
          <Text style={styles.promptCategory}>{prompt.category}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor + '20' }]}>
            <Text style={[styles.difficultyText, { color: difficultyColor }]}>
              {prompt.difficulty}
            </Text>
          </View>
        </View>
        <Text style={styles.promptText}>{prompt.prompt}</Text>
        <View style={styles.promptFooter}>
          <Text style={styles.timeEstimate}>⏱️ {prompt.timeEstimate}</Text>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Start Creating</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderInspirationItem = (item: any, index: number) => {
    return (
      <View key={index} style={styles.inspirationCard}>
        <View style={styles.inspirationInfo}>
          <Text style={styles.inspirationTitle}>{item.title}</Text>
          <Text style={styles.inspirationCategory}>{item.category}</Text>
          <View style={styles.inspirationMeta}>
            <View style={styles.viewsContainer}>
              <Eye size={12} color="#7F8C8D" />
              <Text style={styles.viewsText}>{item.views} views</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={[styles.saveButton, item.saved && styles.savedButton]}>
          <Star size={16} color={item.saved ? '#FFD93D' : '#BDC3C7'} fill={item.saved ? '#FFD93D' : 'none'} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderAchievement = (achievement: any, index: number) => {
    return (
      <View key={index} style={[styles.achievementCard, !achievement.earned && styles.lockedAchievement]}>
        <Text style={styles.achievementIcon}>{achievement.icon}</Text>
        <View style={styles.achievementContent}>
          <Text style={[styles.achievementTitle, !achievement.earned && styles.lockedText]}>
            {achievement.title}
          </Text>
          <Text style={[styles.achievementDescription, !achievement.earned && styles.lockedText]}>
            {achievement.description}
          </Text>
        </View>
        {achievement.earned && (
          <View style={styles.earnedBadge}>
            <Award size={16} color="#FFD93D" />
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Creativity & Hobbies",
          headerStyle: { backgroundColor: '#FD79A8' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Stats */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={['#FD79A8', '#FDCB6E']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <Palette size={32} color="white" />
              <Text style={styles.headerTitle}>Creative Level</Text>
              <Text style={styles.headerScore}>Artist</Text>
              <Text style={styles.headerSubtitle}>Expressing your unique vision</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Creativity Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Creative Journey</Text>
          <View style={styles.metricsGrid}>
            {creativityMetrics.map(renderMetricCard)}
          </View>
        </View>

        {/* Active Projects */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Projects</Text>
            <TouchableOpacity style={styles.addButton}>
              <Plus size={20} color="#667eea" />
            </TouchableOpacity>
          </View>
          {creativeProjects.map(renderProject)}
        </View>

        {/* Creative Prompts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Creative Prompts</Text>
          {creativePrompts.map(renderPrompt)}
        </View>

        {/* Inspiration Gallery */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inspiration Gallery</Text>
          <View style={styles.inspirationContainer}>
            {inspirationGallery.map(renderInspirationItem)}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Creative Achievements</Text>
          {achievements.map(renderAchievement)}
        </View>

        {/* Weekly Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week's Creativity</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <TrendingUp size={24} color="#FD79A8" />
              <Text style={styles.progressTitle}>Creative Flow</Text>
            </View>
            <Text style={styles.progressText}>
              Amazing creative week! You spent 12 hours creating across 3 different mediums and completed 2 projects. Your artistic skills are flourishing!
            </Text>
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>12h</Text>
                <Text style={styles.progressStatLabel}>Creative Time</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>3</Text>
                <Text style={styles.progressStatLabel}>Mediums Used</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>2</Text>
                <Text style={styles.progressStatLabel}>Projects Done</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerCard: {
    margin: 24,
    borderRadius: 16,
    overflow: 'hidden',
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
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: 'white',
    width: (width - 60) / 2,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  metricIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  projectCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  projectIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  projectInfo: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  projectType: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  projectMeta: {
    fontSize: 12,
    color: '#95A5A6',
  },
  continueButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  promptCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  promptCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  promptText: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 22,
    marginBottom: 16,
  },
  promptFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeEstimate: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  startButton: {
    backgroundColor: '#FD79A8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  startButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  inspirationContainer: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inspirationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  inspirationInfo: {
    flex: 1,
  },
  inspirationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
    marginBottom: 4,
  },
  inspirationCategory: {
    fontSize: 12,
    color: '#667eea',
    marginBottom: 4,
  },
  inspirationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  saveButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedButton: {
    backgroundColor: '#FFD93D20',
  },
  achievementCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lockedAchievement: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 18,
  },
  lockedText: {
    color: '#BDC3C7',
  },
  earnedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFD93D20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 12,
  },
  progressText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 20,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  progressStatLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
    textAlign: 'center',
  },
});