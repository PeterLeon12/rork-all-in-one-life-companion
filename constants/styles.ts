import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const sharedStyles = StyleSheet.create({
  // Section styles
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },

  // Card styles
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  smallCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  // Button styles
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
  primaryButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Progress bar styles
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

  // Grid styles
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (width - 60) / 2,
    marginBottom: 12,
  },
  gridItemFull: {
    width: width - 48,
    marginBottom: 12,
  },

  // Text styles
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 4,
  },
  bodyText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    color: '#95A5A6',
  },

  // Icon styles
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  smallIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  // List styles
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  listItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },

  // Stats styles
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 80,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7F8C8D',
    marginTop: 2,
  },

  // Input styles
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  inputFocused: {
    borderColor: '#667eea',
    borderWidth: 2,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  modalCloseButton: {
    padding: 4,
  },

  // Utility styles
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  flexRow: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  marginBottom16: {
    marginBottom: 16,
  },
  marginBottom24: {
    marginBottom: 24,
  },
  paddingHorizontal24: {
    paddingHorizontal: 24,
  },
});

export const colors = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#27AE60',
  error: '#E74C3C',
  warning: '#F39C12',
  info: '#3498DB',
  text: '#2C3E50',
  textSecondary: '#7F8C8D',
  textLight: '#95A5A6',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  border: '#E9ECEF',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Category colors
  health: '#FF6B6B',
  fitness: '#FF7675',
  wealth: '#4ECDC4',
  relationships: '#A8E6CF',
  confidence: '#FFD93D',
  learning: '#6C5CE7',
  productivity: '#FD79A8',
  mindfulness: '#74B9FF',
  creativity: '#FD79A8',
  energy: '#00B894',
  lifestyle: '#55A3FF',
  breakFree: '#00B894',
  travel: '#FF9500',
  community: '#8BC34A',
};

export const gradients = {
  health: ['#FF6B6B', '#FF8E8E'] as [string, string],
  fitness: ['#FF7675', '#E17055'] as [string, string],
  wealth: ['#4ECDC4', '#44A08D'] as [string, string],
  relationships: ['#A8E6CF', '#7FCDCD'] as [string, string],
  confidence: ['#FFD93D', '#FF9F43'] as [string, string],
  learning: ['#6C5CE7', '#A29BFE'] as [string, string],
  productivity: ['#FD79A8', '#E84393'] as [string, string],
  mindfulness: ['#74B9FF', '#0984E3'] as [string, string],
  creativity: ['#FD79A8', '#FDCB6E'] as [string, string],
  energy: ['#00B894', '#00CEC9'] as [string, string],
  lifestyle: ['#55A3FF', '#003D82'] as [string, string],
  breakFree: ['#00B894', '#55A3FF'] as [string, string],
  travel: ['#FF9500', '#FF5722'] as [string, string],
  community: ['#8BC34A', '#4CAF50'] as [string, string],
  primary: ['#667eea', '#764ba2'] as [string, string],
  background: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'],
};