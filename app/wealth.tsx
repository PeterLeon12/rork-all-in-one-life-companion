import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { 
  DollarSign, 
  TrendingUp, 
  PiggyBank, 
  CreditCard,
  Target,
  Briefcase,
  BookOpen,
  Award,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  MessageCircle
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const financialMetrics = [
  { label: 'Net Worth', value: '$45,230', change: '+12.5%', trend: 'up', color: '#4ECDC4' },
  { label: 'Monthly Savings', value: '$1,250', change: '+8.2%', trend: 'up', color: '#FFD93D' },
  { label: 'Investment Portfolio', value: '$28,450', change: '-2.1%', trend: 'down', color: '#FF6B6B' },
  { label: 'Emergency Fund', value: '$8,500', change: '+15.3%', trend: 'up', color: '#6C5CE7' }
];

const quickActions = [
  { title: 'Add Expense', icon: CreditCard, color: '#FF6B6B', description: 'Track spending' },
  { title: 'Investment', icon: TrendingUp, color: '#4ECDC4', description: 'Portfolio update' },
  { title: 'Budget Review', icon: Target, color: '#FFD93D', description: 'Monthly check' },
  { title: 'Career Goals', icon: Briefcase, color: '#6C5CE7', description: 'Plan growth' }
];

const wealthPrograms = [
  {
    title: 'Emergency Fund Builder',
    description: 'Build 6 months of expenses in savings',
    progress: 68,
    target: '$12,000',
    current: '$8,160',
    color: '#4ECDC4'
  },
  {
    title: 'Investment Mastery',
    description: 'Learn to build a diversified portfolio',
    progress: 34,
    lessons: '12/35 lessons',
    color: '#6C5CE7'
  },
  {
    title: 'Debt Freedom Plan',
    description: 'Pay off all consumer debt',
    progress: 78,
    remaining: '$2,400',
    color: '#FFD93D'
  }
];

const recentTransactions = [
  { type: 'income', description: 'Salary Deposit', amount: '+$4,200', date: 'Today', category: 'Income' },
  { type: 'expense', description: 'Grocery Shopping', amount: '-$127.50', date: 'Yesterday', category: 'Food' },
  { type: 'investment', description: 'S&P 500 ETF', amount: '-$500', date: '2 days ago', category: 'Investment' },
  { type: 'income', description: 'Freelance Project', amount: '+$850', date: '3 days ago', category: 'Side Income' }
];

export default function WealthScreen() {
  const renderMetricCard = (metric: any, index: number) => {
    const TrendIcon = metric.trend === 'up' ? ArrowUpRight : ArrowDownRight;
    const trendColor = metric.trend === 'up' ? '#27AE60' : '#E74C3C';
    
    return (
      <View key={index} style={styles.metricCard}>
        <Text style={styles.metricLabel}>{metric.label}</Text>
        <Text style={styles.metricValue}>{metric.value}</Text>
        <View style={styles.metricTrend}>
          <TrendIcon size={16} color={trendColor} />
          <Text style={[styles.metricChange, { color: trendColor }]}>{metric.change}</Text>
        </View>
      </View>
    );
  };

  const renderQuickAction = (action: any, index: number) => {
    const IconComponent = action.icon;
    
    return (
      <TouchableOpacity key={index} style={styles.quickActionCard} activeOpacity={0.8}>
        <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
          <IconComponent size={24} color={action.color} />
        </View>
        <Text style={styles.quickActionTitle}>{action.title}</Text>
        <Text style={styles.quickActionDescription}>{action.description}</Text>
      </TouchableOpacity>
    );
  };

  const renderProgram = (program: any, index: number) => {
    const progressWidth = (width - 72) * (program.progress / 100);
    
    return (
      <View key={index} style={styles.programCard}>
        <View style={styles.programHeader}>
          <View style={styles.programInfo}>
            <Text style={styles.programTitle}>{program.title}</Text>
            <Text style={styles.programDescription}>{program.description}</Text>
            <View style={styles.programDetails}>
              {program.target && (
                <Text style={styles.programDetail}>Target: {program.target}</Text>
              )}
              {program.current && (
                <Text style={styles.programDetail}>Current: {program.current}</Text>
              )}
              {program.lessons && (
                <Text style={styles.programDetail}>{program.lessons}</Text>
              )}
              {program.remaining && (
                <Text style={styles.programDetail}>Remaining: {program.remaining}</Text>
              )}
            </View>
          </View>
          <View style={styles.programProgress}>
            <Text style={styles.progressPercentage}>{program.progress}%</Text>
          </View>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: progressWidth, backgroundColor: program.color }
              ]} 
            />
          </View>
        </View>
      </View>
    );
  };

  const renderTransaction = (transaction: any, index: number) => {
    const getTransactionIcon = () => {
      switch (transaction.type) {
        case 'income': return ArrowUpRight;
        case 'expense': return ArrowDownRight;
        case 'investment': return TrendingUp;
        default: return DollarSign;
      }
    };

    const getTransactionColor = () => {
      switch (transaction.type) {
        case 'income': return '#27AE60';
        case 'expense': return '#E74C3C';
        case 'investment': return '#3498DB';
        default: return '#7F8C8D';
      }
    };

    const IconComponent = getTransactionIcon();
    const color = getTransactionColor();
    
    return (
      <View key={index} style={styles.transactionItem}>
        <View style={[styles.transactionIcon, { backgroundColor: color + '20' }]}>
          <IconComponent size={16} color={color} />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>{transaction.description}</Text>
          <Text style={styles.transactionCategory}>{transaction.category} • {transaction.date}</Text>
        </View>
        <Text style={[styles.transactionAmount, { color }]}>{transaction.amount}</Text>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Wealth & Finance",
          headerStyle: { backgroundColor: '#4ECDC4' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Stats */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={['#4ECDC4', '#44A08D']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <DollarSign size={32} color="white" />
              <Text style={styles.headerTitle}>Financial Health Score</Text>
              <Text style={styles.headerScore}>78/100</Text>
              <Text style={styles.headerSubtitle}>Good progress towards your goals</Text>
              
              <TouchableOpacity 
                style={styles.aiChatButton}
                onPress={() => router.push('/wealth-chat')}
                activeOpacity={0.8}
              >
                <MessageCircle size={20} color="white" />
                <Text style={styles.aiChatButtonText}>Chat with AI Wealth Coach</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Financial Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Overview</Text>
          <View style={styles.metricsGrid}>
            {financialMetrics.map(renderMetricCard)}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Active Programs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Goals</Text>
            <TouchableOpacity style={styles.addButton}>
              <Plus size={20} color="#667eea" />
            </TouchableOpacity>
          </View>
          {wealthPrograms.map(renderProgram)}
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <View style={styles.transactionsCard}>
            {recentTransactions.map(renderTransaction)}
          </View>
        </View>

        {/* Monthly Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Month's Insights</Text>
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <TrendingUp size={24} color="#4ECDC4" />
              <Text style={styles.insightTitle}>Spending Analysis</Text>
            </View>
            <Text style={styles.insightText}>
              You've saved 18% more than last month! Your biggest expense category was dining out at $340.
            </Text>
            <View style={styles.insightStats}>
              <View style={styles.insightStat}>
                <Text style={styles.insightStatValue}>+18%</Text>
                <Text style={styles.insightStatLabel}>Savings Rate</Text>
              </View>
              <View style={styles.insightStat}>
                <Text style={styles.insightStatValue}>$340</Text>
                <Text style={styles.insightStatLabel}>Top Expense</Text>
              </View>
              <View style={styles.insightStat}>
                <Text style={styles.insightStatValue}>85%</Text>
                <Text style={styles.insightStatLabel}>Budget Used</Text>
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
    fontSize: 36,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricChange: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  quickActionCard: {
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
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionDescription: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  programCard: {
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
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  programInfo: {
    flex: 1,
    marginRight: 16,
  },
  programTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  programDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 8,
  },
  programDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  programDetail: {
    fontSize: 12,
    color: '#95A5A6',
  },
  programProgress: {
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  transactionsCard: {
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
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  insightCard: {
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
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 20,
  },
  insightStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  insightStat: {
    alignItems: 'center',
  },
  insightStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  insightStatLabel: {
    fontSize: 12,
    color: '#7F8C8D',
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