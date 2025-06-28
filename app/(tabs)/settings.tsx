import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings as SettingsIcon, Type, Volume2, Bell, Shield, Moon, Globe, CircleHelp as HelpCircle, ChevronRight, User, Download, Heart } from 'lucide-react-native';
import { useTranscription } from '@/contexts/TranscriptionContext';
import { globalStyles, colors, gradients, spacing, borderRadius, getResponsiveFontSize } from '@/styles/globalStyles';

interface SettingSection {
  title: string;
  items: SettingItem[];
}

interface SettingItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function SettingsScreen() {
  const { transcriptionsEnabled, toggleTranscriptions, loading } = useTranscription();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [autoDownloadEnabled, setAutoDownloadEnabled] = useState(false);

  const handleTranscriptionToggle = async () => {
    await toggleTranscriptions();
  };

  const handleNotificationToggle = (value: boolean) => {
    setNotificationsEnabled(value);
    // In a real app, this would update notification permissions
  };

  const handleDarkModeToggle = (value: boolean) => {
    setDarkModeEnabled(value);
    // In a real app, this would update the theme
  };

  const handleAutoDownloadToggle = (value: boolean) => {
    setAutoDownloadEnabled(value);
  };

  const handleAccountPress = () => {
    Alert.alert('Account Settings', 'Account settings would open here');
  };

  const handlePrivacyPress = () => {
    Alert.alert('Privacy & Security', 'Privacy settings would open here');
  };

  const handleLanguagePress = () => {
    Alert.alert('Language', 'Language selection would open here');
  };

  const handleHelpPress = () => {
    Alert.alert('Help & Support', 'Help center would open here');
  };

  const settingSections: SettingSection[] = [
    {
      title: 'Audio & Transcription',
      items: [
        {
          id: 'transcriptions',
          title: 'Show Transcriptions',
          description: 'Display text content below voice posts',
          icon: <Type size={20} color={colors.accent} />,
          type: 'toggle',
          value: transcriptionsEnabled,
          onToggle: handleTranscriptionToggle,
        },
        {
          id: 'auto_download',
          title: 'Auto-Download for Offline',
          description: 'Automatically download posts for offline listening',
          icon: <Download size={20} color={colors.download} />,
          type: 'toggle',
          value: autoDownloadEnabled,
          onToggle: handleAutoDownloadToggle,
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'notifications',
          title: 'Push Notifications',
          description: 'Receive notifications for new echoes and interactions',
          icon: <Bell size={20} color={colors.warning} />,
          type: 'toggle',
          value: notificationsEnabled,
          onToggle: handleNotificationToggle,
        },
      ],
    },
    {
      title: 'Appearance',
      items: [
        {
          id: 'dark_mode',
          title: 'Dark Mode',
          description: 'Use dark theme throughout the app',
          icon: <Moon size={20} color={colors.info} />,
          type: 'toggle',
          value: darkModeEnabled,
          onToggle: handleDarkModeToggle,
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          id: 'account',
          title: 'Account Settings',
          description: 'Manage your profile and account preferences',
          icon: <User size={20} color={colors.textMuted} />,
          type: 'navigation',
          onPress: handleAccountPress,
        },
        {
          id: 'privacy',
          title: 'Privacy & Security',
          description: 'Control your privacy settings and security options',
          icon: <Shield size={20} color={colors.success} />,
          type: 'navigation',
          onPress: handlePrivacyPress,
        },
      ],
    },
    {
      title: 'General',
      items: [
        {
          id: 'language',
          title: 'Language',
          description: 'Choose your preferred language',
          icon: <Globe size={20} color={colors.textMuted} />,
          type: 'navigation',
          onPress: handleLanguagePress,
        },
        {
          id: 'help',
          title: 'Help & Support',
          description: 'Get help and contact support',
          icon: <HelpCircle size={20} color={colors.textMuted} />,
          type: 'navigation',
          onPress: handleHelpPress,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    return (
      <View key={item.id} style={styles.settingItem}>
        <View style={styles.settingContent}>
          <View style={styles.settingIcon}>
            {item.icon}
          </View>
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { fontSize: getResponsiveFontSize(16) }]}>
              {item.title}
            </Text>
            {item.description && (
              <Text style={[styles.settingDescription, { fontSize: getResponsiveFontSize(14) }]}>
                {item.description}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.settingControl}>
          {item.type === 'toggle' && (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: colors.borderSecondary, true: colors.accent }}
              thumbColor={item.value ? colors.textPrimary : colors.textMuted}
              ios_backgroundColor={colors.borderSecondary}
              disabled={loading && item.id === 'transcriptions'}
            />
          )}
          {item.type === 'navigation' && (
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={item.onPress}
              accessibilityLabel={`Open ${item.title}`}
              accessibilityRole="button">
              <ChevronRight size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={gradients.background} style={globalStyles.container}>
      <SafeAreaView style={globalStyles.safeArea}>
        {/* Header */}
        <View style={globalStyles.header}>
          <Text style={globalStyles.headerTitle}>settings</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          
          {settingSections.map((section, sectionIndex) => (
            <View key={section.title} style={styles.section}>
              <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(18) }]}>
                {section.title}
              </Text>
              
              <View style={styles.sectionContent}>
                {section.items.map((item, itemIndex) => (
                  <View key={item.id}>
                    {renderSettingItem(item)}
                    {itemIndex < section.items.length - 1 && (
                      <View style={styles.itemSeparator} />
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}

          {/* App Version */}
          <View style={styles.versionSection}>
            <Text style={[styles.versionText, { fontSize: getResponsiveFontSize(12) }]}>
              Echo v1.0.0
            </Text>
            <Text style={[styles.versionSubtext, { fontSize: getResponsiveFontSize(11) }]}>
              Built with ❤️ for voice lovers
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxxl,
  },
  section: {
    marginBottom: spacing.xxxl,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  sectionContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    minHeight: 72,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
    lineHeight: 20,
  },
  settingControl: {
    marginLeft: spacing.lg,
  },
  navigationButton: {
    padding: spacing.sm,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.lg + 40 + spacing.lg, // Align with text
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginTop: spacing.xl,
  },
  versionText: {
    fontFamily: 'Inter-Medium',
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  versionSubtext: {
    fontFamily: 'Inter-Regular',
    color: colors.textSubtle,
  },
});