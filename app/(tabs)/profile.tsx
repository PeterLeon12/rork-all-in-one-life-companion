import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Switch, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  Star,
  ChevronRight,
  Edit3,
  Award,
  Target,
  Calendar,
  Moon,
  Smartphone,
  Lock,
  LogOut
} from 'lucide-react-native';
import { useUser, useUserAchievements } from '@/contexts/UserContext';
import { useCategories } from '@/contexts/CategoryContext';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

interface MenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ComponentType<any>;
  type: 'navigation' | 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
}





export default function ProfileScreen() {
  const { user, updatePreferences, signOut, getJoinDuration } = useUser();
  const { unlockedAchievements, totalAchievements } = useUserAchievements();
  const { activities } = useCategories();
  const { theme, isDarkMode, toggleTheme } = useTheme();

  const profileStats = [
    { label: 'Goals Completed', value: user.stats.goalsCompleted.toString(), icon: Target, color: '#4ECDC4' },
    { label: 'Day Streak', value: user.stats.currentStreak.toString(), icon: Calendar, color: '#FF6B6B' },
    { label: 'Achievements', value: unlockedAchievements.length.toString(), icon: Award, color: '#FFD93D' }
  ];

  const menuSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'edit-profile',
          title: 'Edit Profile',
          subtitle: 'Update your personal information',
          icon: Edit3,
          type: 'navigation',
          onPress: () => handleEditProfile()
        },
        {
          id: 'achievements',
          title: 'Achievements',
          subtitle: `${unlockedAchievements.length}/${totalAchievements} unlocked`,
          icon: Award,
          type: 'navigation',
          onPress: () => handleViewAchievements()
        }
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Push Notifications',
          subtitle: 'Get reminders and updates',
          icon: Bell,
          type: 'toggle',
          value: user.preferences.notifications,
          onPress: () => handleToggle('notifications')
        },
        {
          id: 'dark-mode',
          title: 'Dark Mode',
          subtitle: 'Switch to dark theme',
          icon: Moon,
          type: 'toggle',
          value: isDarkMode,
          onPress: () => handleToggle('darkMode')
        }
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          id: 'privacy',
          title: 'Privacy Settings',
          subtitle: 'Control your data and privacy',
          icon: Shield,
          type: 'navigation',
          onPress: () => handlePrivacySettings()
        },
        {
          id: 'security',
          title: 'Security',
          subtitle: 'Manage your account security',
          icon: Lock,
          type: 'navigation',
          onPress: () => handleSecuritySettings()
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          icon: HelpCircle,
          type: 'navigation',
          onPress: () => handleHelpSupport()
        },
        {
          id: 'rate',
          title: 'Rate the App',
          subtitle: 'Share your feedback',
          icon: Star,
          type: 'action',
          onPress: () => handleRateApp()
        },
        {
          id: 'sign-out',
          title: 'Sign Out',
          subtitle: 'Sign out of your account',
          icon: LogOut,
          type: 'action',
          onPress: () => handleSignOut()
        }
      ]
    }
  ];

  const handleToggle = (preference: keyof typeof user.preferences) => {
    if (preference === 'darkMode') {
      toggleTheme();
      updatePreferences({
        [preference]: !user.preferences[preference]
      });
    } else {
      updatePreferences({
        [preference]: !user.preferences[preference]
      });
    }
  };

  const handleEditProfile = () => {
    Alert.alert(
      'Edit Profile',
      'Profile editing feature coming soon!',
      [{ text: 'OK' }]
    );
  };

  const handleViewAchievements = () => {
    Alert.alert(
      'Achievements',
      `You've unlocked ${unlockedAchievements.length} out of ${totalAchievements} achievements!\n\nRecent achievements:\n${unlockedAchievements.slice(0, 3).map(a => `${a.icon} ${a.title}`).join('\n')}`,
      [{ text: 'Awesome!' }]
    );
  };

  const handlePrivacySettings = () => {
    Alert.alert(
      'Privacy Settings',
      'Privacy settings feature coming soon!',
      [{ text: 'OK' }]
    );
  };

  const handleSecuritySettings = () => {
    Alert.alert(
      'Security Settings',
      'Security settings feature coming soon!',
      [{ text: 'OK' }]
    );
  };

  const handleHelpSupport = () => {
    Alert.alert(
      'Help & Support',
      'Need help? Contact us at support@lifemastery.app',
      [{ text: 'OK' }]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate Life Mastery',
      'Thank you for using Life Mastery! Your feedback helps us improve.',
      [
        { text: 'Maybe Later', style: 'cancel' },
        { text: 'Rate Now', onPress: () => console.log('Opening app store...') }
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? Your progress will be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/auth');
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        }
      ]
    );
  };

  const renderProfileStat = (stat: any, index: number) => {
    const IconComponent = stat.icon;
    
    return (
      <View key={index} style={styles.statItem}>
        <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
          <IconComponent size={20} color={stat.color} />
        </View>
        <Text style={styles.statValue}>{stat.value}</Text>
        <Text style={styles.statLabel}>{stat.label}</Text>
      </View>
    );
  };

  const renderMenuItem = (item: any) => {
    const IconComponent = item.icon;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.menuItem}
        onPress={item.onPress}
        activeOpacity={0.7}
      >
        <View style={styles.menuItemLeft}>
          <View style={styles.menuIcon}>
            <IconComponent size={20} color={theme.textSecondary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>{item.title}</Text>
            {item.subtitle && (
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            )}
          </View>
        </View>
        
        <View style={styles.menuItemRight}>
          {item.type === 'toggle' ? (
            <Switch
              value={item.value || false}
              onValueChange={item.onPress}
              trackColor={{ 
                false: isDarkMode ? '#333333' : '#E9ECEF', 
                true: theme.primary 
              }}
              thumbColor={item.value ? '#ffffff' : '#ffffff'}
            />
          ) : (
            <ChevronRight size={20} color={theme.textSecondary} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderMenuSection = (section: any, index: number) => (
    <View key={index} style={styles.menuSection}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionContent}>
        {section.items.map(renderMenuItem)}
      </View>
    </View>
  );

  const styles = createStyles(theme, isDarkMode);

  return (
    <View style={[styles.backgroundContainer, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={isDarkMode 
          ? ['#1a1a2e', '#16213e', '#0f3460'] 
          : ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']
        }
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.backgroundOverlay, { backgroundColor: isDarkMode ? 'rgba(18, 18, 18, 0.85)' : 'rgba(255, 255, 255, 0.85)' }]}>
          <View style={styles.container}>
            <ScrollView 
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <User size={32} color="white" />
                </View>
                <TouchableOpacity style={styles.editButton}>
                  <Edit3 size={16} color="#667eea" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.joinDate}>Member for {getJoinDuration()}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Profile Stats */}
        <View style={styles.statsContainer}>
          {profileStats.map(renderProfileStat)}
        </View>

        {/* Menu Sections */}
        {menuSections.map(renderMenuSection)}

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Life Mastery v1.0.0</Text>
        </View>
            </ScrollView>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const createStyles = (theme: any, isDarkMode: boolean) => StyleSheet.create({
  backgroundContainer: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  backgroundOverlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  profileHeader: {
    marginBottom: 24,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  menuSection: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: theme.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: isDarkMode ? 0.4 : 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  menuItemRight: {
    marginLeft: 16,
  },
  versionContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 16,
  },
  versionText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
});