import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native';
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
  Lock
} from 'lucide-react-native';

interface MenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ComponentType<any>;
  type: 'navigation' | 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
}

const profileStats = [
  { label: 'Goals Completed', value: '47', icon: Target, color: '#4ECDC4' },
  { label: 'Day Streak', value: '28', icon: Calendar, color: '#FF6B6B' },
  { label: 'Achievements', value: '12', icon: Award, color: '#FFD93D' }
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
        type: 'navigation'
      },
      {
        id: 'achievements',
        title: 'Achievements',
        subtitle: 'View your accomplishments',
        icon: Award,
        type: 'navigation'
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
        value: true
      },
      {
        id: 'dark-mode',
        title: 'Dark Mode',
        subtitle: 'Switch to dark theme',
        icon: Moon,
        type: 'toggle',
        value: false
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
        type: 'navigation'
      },
      {
        id: 'security',
        title: 'Security',
        subtitle: 'Manage your account security',
        icon: Lock,
        type: 'navigation'
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
        type: 'navigation'
      },
      {
        id: 'rate',
        title: 'Rate the App',
        subtitle: 'Share your feedback',
        icon: Star,
        type: 'action'
      }
    ]
  }
];

export default function ProfileScreen() {
  const [toggleStates, setToggleStates] = React.useState<Record<string, boolean>>({
    notifications: true,
    'dark-mode': false
  });

  const handleToggle = (id: string) => {
    setToggleStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
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
            <IconComponent size={20} color="#7F8C8D" />
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
              value={toggleStates[item.id] || false}
              onValueChange={() => handleToggle(item.id)}
              trackColor={{ false: '#E9ECEF', true: '#667eea' }}
              thumbColor={toggleStates[item.id] ? '#ffffff' : '#ffffff'}
            />
          ) : (
            <ChevronRight size={20} color="#BDC3C7" />
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

  return (
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
              
              <Text style={styles.userName}>John Doe</Text>
              <Text style={styles.userEmail}>john.doe@example.com</Text>
              <Text style={styles.joinDate}>Member since January 2024</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
    backgroundColor: 'white',
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
    color: '#2C3E50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  menuSection: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
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
    backgroundColor: '#F8F9FA',
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
    color: '#2C3E50',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
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
    color: '#BDC3C7',
  },
});