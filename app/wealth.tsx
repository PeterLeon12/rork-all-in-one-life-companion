import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { 
  DollarSign, 
  TrendingUp, 
  PiggyBank, 
  Target,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Wallet
} from 'lucide-react-native';
import CategoryScreenLayout from '@/components/CategoryScreenLayout';
import { sharedStyles, colors, gradients } from '@/constants/styles';

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
    color: colors.wealth
  },
  {
    id: 2,
    title: 'Investment Portfolio',
    description: 'Diversified investments',
    progress: 34,
    target: 50000,
    current: 17000,
    color: colors.learning
  },
  {
    id: 3,
    title: 'Debt Payoff',
    description: 'Credit card debt',
    progress: 78,
    target: 3000,
    current: 660,
    color: colors.warning
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
    const trendColor = metric.trend === 'up' ? colors.success : colors.error;
    
    return (
      <View key={index} style={[sharedStyles.smallCard, sharedStyles.gridItem]}>
        <Text style={sharedStyles.caption}>{metric.label}</Text>
        <Text style={[sharedStyles.statValue, { marginBottom: 8 }]}>{metric.value}</Text>
        <View style={[sharedStyles.flexRow, { alignItems: 'center' }]}>
          <TrendIcon size={16} color={trendColor} />
          <Text style={[sharedStyles.caption, { color: trendColor, marginLeft: 4, fontWeight: '600' }]}>
            {metric.change}
          </Text>
        </View>
      </View>
    );
  };

  const renderGoal = (goal: typeof wealthGoals[0]) => {
    return (
      <TouchableOpacity 
        key={goal.id} 
        style={sharedStyles.card}
        onPress={() => Alert.alert(goal.title, `Current: ${formatCurrency(goal.current)}\nTarget: ${formatCurrency(goal.target)}`)}
        activeOpacity={0.8}
      >
        <View style={[sharedStyles.flexRow, sharedStyles.spaceBetween, { alignItems: 'flex-start', marginBottom: 16 }]}>
          <View style={[sharedStyles.flex1, { marginRight: 16 }]}>
            <Text style={sharedStyles.listItemTitle}>{goal.title}</Text>
            <Text style={[sharedStyles.bodyText, { marginBottom: 8 }]}>{goal.description}</Text>
            <Text style={sharedStyles.caption}>
              {formatCurrency(goal.current)} of {formatCurrency(goal.target)}
            </Text>
          </View>
          <Text style={sharedStyles.statValue}>{goal.progress}%</Text>
        </View>
        
        <View style={sharedStyles.progressBarContainer}>
          <View style={sharedStyles.progressBarBackground}>
            <View 
              style={[
                sharedStyles.progressBarFill, 
                { width: `${goal.progress}%`, backgroundColor: goal.color }
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
        case 'income': return colors.success;
        case 'expense': return colors.error;
        case 'investment': return colors.info;
        default: return colors.textSecondary;
      }
    };

    const IconComponent = getTransactionIcon();
    const color = getTransactionColor();
    const sign = transaction.amount > 0 ? '+' : '';
    
    return (
      <View key={transaction.id} style={sharedStyles.listItem}>
        <View style={[sharedStyles.smallIconContainer, { backgroundColor: color + '20' }]}>
          <IconComponent size={16} color={color} />
        </View>
        <View style={sharedStyles.flex1}>
          <Text style={sharedStyles.listItemTitle}>{transaction.description}</Text>
          <Text style={sharedStyles.listItemSubtitle}>{transaction.date}</Text>
        </View>
        <Text style={[sharedStyles.listItemTitle, { color }]}>
          {sign}{formatCurrency(transaction.amount)}
        </Text>
      </View>
    );
  };

  return (
    <CategoryScreenLayout
      categoryId="wealth"
      title="Wealth & Finance"
      headerColor={colors.wealth}
      headerGradient={gradients.wealth}
      icon={Wallet}
      chatRoute="/wealth-chat"
    >
      {/* Overview */}
      <View style={sharedStyles.section}>
        <Text style={sharedStyles.sectionTitle}>Overview</Text>
        <View style={sharedStyles.grid}>
          {financialMetrics.map(renderMetricCard)}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={sharedStyles.section}>
        <Text style={sharedStyles.sectionTitle}>Quick Actions</Text>
        <View style={sharedStyles.grid}>
          <TouchableOpacity 
            style={[sharedStyles.smallCard, sharedStyles.gridItem, sharedStyles.centerContent]} 
            onPress={() => handleQuickAction('Add Transaction')}
            activeOpacity={0.8}
          >
            <View style={[sharedStyles.iconContainer, { backgroundColor: colors.wealth + '20' }]}>
              <Plus size={24} color={colors.wealth} />
            </View>
            <Text style={sharedStyles.listItemTitle}>Add Transaction</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[sharedStyles.smallCard, sharedStyles.gridItem, sharedStyles.centerContent]} 
            onPress={() => handleQuickAction('View Budget')}
            activeOpacity={0.8}
          >
            <View style={[sharedStyles.iconContainer, { backgroundColor: colors.learning + '20' }]}>
              <Target size={24} color={colors.learning} />
            </View>
            <Text style={sharedStyles.listItemTitle}>Budget</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[sharedStyles.smallCard, sharedStyles.gridItem, sharedStyles.centerContent]} 
            onPress={() => handleQuickAction('Investments')}
            activeOpacity={0.8}
          >
            <View style={[sharedStyles.iconContainer, { backgroundColor: colors.warning + '20' }]}>
              <TrendingUp size={24} color={colors.warning} />
            </View>
            <Text style={sharedStyles.listItemTitle}>Investments</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[sharedStyles.smallCard, sharedStyles.gridItem, sharedStyles.centerContent]} 
            onPress={() => handleQuickAction('Savings')}
            activeOpacity={0.8}
          >
            <View style={[sharedStyles.iconContainer, { backgroundColor: colors.health + '20' }]}>
              <PiggyBank size={24} color={colors.health} />
            </View>
            <Text style={sharedStyles.listItemTitle}>Savings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Financial Goals */}
      <View style={sharedStyles.section}>
        <View style={sharedStyles.sectionHeader}>
          <Text style={sharedStyles.sectionTitle}>Financial Goals</Text>
          <TouchableOpacity style={sharedStyles.addButton} onPress={handleAddGoal}>
            <Plus size={20} color={colors.wealth} />
          </TouchableOpacity>
        </View>
        {goals.map(renderGoal)}
      </View>

      {/* Recent Activity */}
      <View style={sharedStyles.section}>
        <Text style={sharedStyles.sectionTitle}>Recent Activity</Text>
        <View style={sharedStyles.card}>
          {transactions.map(renderTransaction)}
        </View>
      </View>

      {/* Monthly Summary */}
      <View style={sharedStyles.section}>
        <Text style={sharedStyles.sectionTitle}>Monthly Summary</Text>
        <View style={sharedStyles.card}>
          <View style={[sharedStyles.flexRow, sharedStyles.marginBottom16]}>
            <TrendingUp size={24} color={colors.wealth} />
            <Text style={[sharedStyles.title, { marginLeft: 12 }]}>This Month</Text>
          </View>
          <Text style={[sharedStyles.bodyText, sharedStyles.marginBottom24]}>
            You&apos;re on track with your financial goals. Keep up the great work!
          </Text>
          <View style={sharedStyles.statsRow}>
            <View style={sharedStyles.centerContent}>
              <Text style={sharedStyles.statValue}>+18%</Text>
              <Text style={sharedStyles.statLabel}>Savings</Text>
            </View>
            <View style={sharedStyles.centerContent}>
              <Text style={sharedStyles.statValue}>$1,250</Text>
              <Text style={sharedStyles.statLabel}>Saved</Text>
            </View>
            <View style={sharedStyles.centerContent}>
              <Text style={sharedStyles.statValue}>85%</Text>
              <Text style={sharedStyles.statLabel}>Budget</Text>
            </View>
          </View>
        </View>
      </View>
    </CategoryScreenLayout>
  );
}