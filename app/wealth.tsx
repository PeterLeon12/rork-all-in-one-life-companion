import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { 
  DollarSign, 
  TrendingUp, 
  PiggyBank, 
  Target,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  MessageCircle,
  Wallet
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const financialMetrics = [
  { label: 'Net Worth', value: '$45,230', change: '+12.5%', trend: 'up' as const },
  { label: 'Monthly Savings', value: '$1,250', change: '+8.2%', trend: 'up' as const },
  { label: 'Investments', value: '$28,450', change: '-2.1%', trend: 'down' as const },
  { label: 'Emergency Fund', value: '$8,500', change: '+15.3%', trend: 'up' as const }
];

const wealthGoals = [
  {
    id: 1,
    title: 'Emergency Fund',
    description: '6 months of expenses',
    progress: 68,
    target: 12000,
    current: 8160,
    color: '#4ECDC4'
  },
  {
    id: 2,
    title: 'Investment Portfolio',
    description: 'Diversified investments',
    progress: 34,
    target: 50000,
    current: 17000,
    color: '#6C5CE7'
  },
  {
    id: 3,
    title: 'Debt Payoff',
    description: 'Credit card debt',
    progress: 78,
    target: 3000,
    current: 660,
    color: '#FFD93D'
  }
];

const recentTransactions = [
  { id: 1, type: 'income', description: 'Salary Deposit', amount: 4200, date: 'Today' },
  { id: 2, type: 'expense', description: 'Grocery Shopping', amount: -127.50, date: 'Yesterday' },
  { id: 3, type: 'investment', description: 'S&P 500 ETF', amount: -500, date: '2 days ago' },
  { id: 4, type: 'income', description: 'Freelance Project', amount: 850, date: '3 days ago' }
];

export default function WealthScreen() {
  const [goals] = useState(wealthGoals);
  const [transactions] = useState(recentTransactions);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const handleAddGoal = () => {
    Alert.alert(
      'Add New Goal',
      'This feature would allow you to create a new financial goal.',
      [{ text: 'OK' }]
    );
  };

  const handleQuickAction = (action: string) => {
    Alert.alert(
      action,
      `This would open the ${action.toLowerCase()} feature.`,
      [{ text: 'OK' }]
    );
  };

  const renderMetricCard = (metric: typeof financialMetrics[0], index: number) => {
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

  const renderGoal = (goal: typeof wealthGoals[0], index: number) => {
    const progressWidth = (width - 72) * (goal.progress / 100);
    
    return (
      <TouchableOpacity 
        key={goal.id} 
        style={styles.goalCard}
        onPress={() => Alert.alert(goal.title, `Current: ${formatCurrency(goal.current)}\nTarget: ${formatCurrency(goal.target)}`)}
        activeOpacity={0.8}
      >
        <View style={styles.goalHeader}>
          <View style={styles.goalInfo}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalDescription}>{goal.description}</Text>
            <Text style={styles.goalDetail}>
              {formatCurrency(goal.current)} of {formatCurrency(goal.target)}
            </Text>
          </View>
          <Text style={styles.progressPercentage}>{goal.progress}%</Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: progressWidth, backgroundColor: goal.color }
              ]} 
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTransaction = (transaction: typeof recentTransactions[0]) => {
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
    const sign = transaction.amount > 0 ? '+' : '';
    
    return (
      <View key={transaction.id} style={styles.transactionItem}>
        <View style={[styles.transactionIcon, { backgroundColor: color + '20' }]}>
          <IconComponent size={16} color={color} />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>{transaction.description}</Text>
          <Text style={styles.transactionDate}>{transaction.date}</Text>
        </View>
        <Text style={[styles.transactionAmount, { color }]}>
          {sign}{formatCurrency(transaction.amount)}
        </Text>
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
      
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.backgroundOverlay}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <LinearGradient
            colors={['#4ECDC4', '#44A08D']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <Wallet size={32} color="white" />
              <Text style={styles.headerTitle}>Wealth Overview</Text>
              <Text style={styles.headerScore}>$45,230</Text>
              <Text style={styles.headerSubtitle}>Net Worth</Text>
              
              <TouchableOpacity 
                style={styles.aiChatButton}
                onPress={() => router.push('/wealth-chat')}
                activeOpacity={0.8}
              >
                <MessageCircle size={20} color="white" />
                <Text style={styles.aiChatButtonText}>Financial Coach</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.metricsGrid}>
            {financialMetrics.map(renderMetricCard)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard} 
              onPress={() => handleQuickAction('Add Transaction')}
              activeOpacity={0.8}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#4ECDC4' + '20' }]}>
                <Plus size={24} color="#4ECDC4" />
              </View>
              <Text style={styles.quickActionTitle}>Add Transaction</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard} 
              onPress={() => handleQuickAction('View Budget')}
              activeOpacity={0.8}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#6C5CE7' + '20' }]}>
                <Target size={24} color="#6C5CE7" />
              </View>
              <Text style={styles.quickActionTitle}>Budget</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard} 
              onPress={() => handleQuickAction('Investments')}
              activeOpacity={0.8}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FFD93D' + '20' }]}>
                <TrendingUp size={24} color="#FFD93D" />
              </View>
              <Text style={styles.quickActionTitle}>Investments</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard} 
              onPress={() => handleQuickAction('Savings')}
              activeOpacity={0.8}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FF6B6B' + '20' }]}>
                <PiggyBank size={24} color="#FF6B6B" />
              </View>
              <Text style={styles.quickActionTitle}>Savings</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Financial Goals</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
              <Plus size={20} color="#4ECDC4" />
            </TouchableOpacity>
          </View>
          {goals.map(renderGoal)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.transactionsCard}>
            {transactions.map(renderTransaction)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <TrendingUp size={24} color="#4ECDC4" />
              <Text style={styles.summaryTitle}>This Month</Text>
            </View>
            <Text style={styles.summaryText}>
              You&apos;re on track with your financial goals. Keep up the great work!
            </Text>
            <View style={styles.summaryStats}>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatValue}>+18%</Text>
                <Text style={styles.summaryStatLabel}>Savings</Text>
              </View>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatValue}>$1,250</Text>
                <Text style={styles.summaryStatLabel}>Saved</Text>
              </View>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatValue}>85%</Text>
                <Text style={styles.summaryStatLabel}>Budget</Text>
              </View>
            </View>
          </View>
        </View>
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
    textAlign: 'center',
  },
  goalCard: {
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
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  goalInfo: {
    flex: 1,
    marginRight: 16,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 8,
  },
  goalDetail: {
    fontSize: 12,
    color: '#95A5A6',
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
  transactionDate: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  summaryCard: {
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
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 12,
  },
  summaryText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 20,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  summaryStatLabel: {
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