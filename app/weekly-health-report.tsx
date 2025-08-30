import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { 
  TrendingUp, 
  Calendar, 
  Award, 
  ChevronLeft, 
  ChevronRight,
  Target,
  Activity,
  Brain,
  Moon,
  Droplets,
  Utensils,
  ArrowLeft
} from 'lucide-react-native';
import { trpc } from '@/lib/trpc';



interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  totalGoalsCompleted: number;
  averageDailyCompletion: number;
  bestDay: string;
  categories: { [key: string]: number };
  insights: string[];
  dailyBreakdown: { date: string; completed: number }[];
}

export default function WeeklyReportScreen() {
  const [weekOffset, setWeekOffset] = useState(-1); // Start with last week
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: weeklyReport, isLoading, refetch } = trpc.health.getWeeklyReport.useQuery(
    { weekOffset },
    { enabled: true }
  );

  useEffect(() => {
    if (weeklyReport) {
      setReport(weeklyReport as WeeklyReport);
      setLoading(false);
    }
  }, [weeklyReport]);

  useEffect(() => {
    refetch();
  }, [weekOffset, refetch]);

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      movement: Activity,
      nutrition: Utensils,
      mindfulness: Brain,
      sleep: Moon,
      hydration: Droplets
    };
    return icons[category] || Target;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      movement: '#FF6B6B',
      nutrition: '#27AE60',
      mindfulness: '#FFD93D',
      sleep: '#6C5CE7',
      hydration: '#4ECDC4'
    };
    return colors[category] || '#95A5A6';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getWeekTitle = () => {
    if (weekOffset === 0) return 'This Week';
    if (weekOffset === -1) return 'Last Week';
    return `${Math.abs(weekOffset)} Weeks Ago`;
  };

  if (loading || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Generating your weekly report...</Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to load weekly report</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Weekly Health Report",
          headerStyle: { backgroundColor: '#FF6B6B' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
          )
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
              
              {/* Week Navigation */}
              <View style={styles.weekNavigation}>
                <TouchableOpacity 
                  style={styles.navButton}
                  onPress={() => setWeekOffset(prev => prev - 1)}
                >
                  <ChevronLeft size={24} color="#2C3E50" />
                </TouchableOpacity>
                
                <View style={styles.weekInfo}>
                  <Text style={styles.weekTitle}>{getWeekTitle()}</Text>
                  <Text style={styles.weekDates}>
                    {formatDate(report.weekStart)} - {formatDate(report.weekEnd)}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  style={[styles.navButton, weekOffset >= 0 && styles.navButtonDisabled]}
                  onPress={() => setWeekOffset(prev => prev + 1)}
                  disabled={weekOffset >= 0}
                >
                  <ChevronRight size={24} color={weekOffset >= 0 ? "#BDC3C7" : "#2C3E50"} />
                </TouchableOpacity>
              </View>

              {/* Summary Cards */}
              <View style={styles.summaryGrid}>
                <View style={styles.summaryCard}>
                  <View style={styles.summaryIcon}>
                    <Target size={24} color="#27AE60" />
                  </View>
                  <Text style={styles.summaryValue}>{report.totalGoalsCompleted}</Text>
                  <Text style={styles.summaryLabel}>Goals Completed</Text>
                </View>
                
                <View style={styles.summaryCard}>
                  <View style={styles.summaryIcon}>
                    <TrendingUp size={24} color="#FF6B6B" />
                  </View>
                  <Text style={styles.summaryValue}>{report.averageDailyCompletion}%</Text>
                  <Text style={styles.summaryLabel}>Daily Average</Text>
                </View>
              </View>

              {/* Daily Breakdown Chart */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Daily Progress</Text>
                <View style={styles.chartCard}>
                  <View style={styles.chartContainer}>
                    {report.dailyBreakdown.map((day, index) => {
                      const maxCompleted = Math.max(...report.dailyBreakdown.map(d => d.completed));
                      const height = maxCompleted > 0 ? (day.completed / maxCompleted) * 120 : 0;
                      const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
                      
                      return (
                        <View key={index} style={styles.chartBar}>
                          <View style={styles.barContainer}>
                            <View 
                              style={[
                                styles.bar, 
                                { 
                                  height: Math.max(height, 4),
                                  backgroundColor: day.completed > 0 ? '#27AE60' : '#E9ECEF'
                                }
                              ]} 
                            />
                          </View>
                          <Text style={styles.barValue}>{day.completed}</Text>
                          <Text style={styles.barLabel}>{dayName}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>

              {/* Category Breakdown */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Category Performance</Text>
                <View style={styles.categoryCard}>
                  {Object.entries(report.categories).map(([category, count]) => {
                    const IconComponent = getCategoryIcon(category);
                    const color = getCategoryColor(category);
                    const percentage = report.totalGoalsCompleted > 0 ? 
                      Math.round((count / report.totalGoalsCompleted) * 100) : 0;
                    
                    return (
                      <View key={category} style={styles.categoryItem}>
                        <View style={styles.categoryHeader}>
                          <View style={[styles.categoryIcon, { backgroundColor: color + '20' }]}>
                            <IconComponent size={20} color={color} />
                          </View>
                          <View style={styles.categoryInfo}>
                            <Text style={styles.categoryName}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </Text>
                            <Text style={styles.categoryCount}>{count} goals</Text>
                          </View>
                          <Text style={styles.categoryPercentage}>{percentage}%</Text>
                        </View>
                        <View style={styles.categoryProgressBar}>
                          <View 
                            style={[
                              styles.categoryProgressFill,
                              { 
                                width: `${percentage}%`,
                                backgroundColor: color
                              }
                            ]}
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Insights */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Weekly Insights</Text>
                <View style={styles.insightsCard}>
                  {report.insights.map((insight, index) => (
                    <View key={index} style={styles.insightItem}>
                      <View style={styles.insightIcon}>
                        <Award size={16} color="#FFD93D" />
                      </View>
                      <Text style={styles.insightText}>{insight}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Best Day Highlight */}
              {report.bestDay && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Best Performance Day</Text>
                  <View style={styles.bestDayCard}>
                    <View style={styles.bestDayIcon}>
                      <Calendar size={24} color="#FFD93D" />
                    </View>
                    <View style={styles.bestDayInfo}>
                      <Text style={styles.bestDayDate}>
                        {new Date(report.bestDay).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </Text>
                      <Text style={styles.bestDayDescription}>
                        Your most productive day this week!
                      </Text>
                    </View>
                  </View>
                </View>
              )}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  weekInfo: {
    alignItems: 'center',
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  weekDates: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  summaryGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: 16,
    gap: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  chartCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 120,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    minHeight: 4,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 10,
    color: '#7F8C8D',
  },
  categoryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryItem: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  categoryPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  categoryProgressBar: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  insightsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  insightIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD93D20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
  bestDayCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bestDayIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFD93D20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bestDayInfo: {
    flex: 1,
  },
  bestDayDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  bestDayDescription: {
    fontSize: 14,
    color: '#7F8C8D',
  },
});