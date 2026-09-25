import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { GradientProgressBar } from './GradientProgressBar';

type Props = {
  kicker: string;
  title: string;
  done: number;
  total: number;
  onSettings: () => void;
  onCalendar?: () => void;
};

export function ScreenHeader({ kicker, title, done, total, onSettings, onCalendar }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <Text style={styles.date}>{kicker}</Text>
        <View style={styles.headerActions}>
          {onCalendar ? (
            <Pressable
              onPress={onCalendar}
              style={[styles.settingsBtn, styles.calendarBtn]}
              accessibilityRole="button"
              accessibilityLabel="Planifier une tâche"
            >
              <Ionicons name="calendar" size={22} color={colors.now} />
            </Pressable>
          ) : null}
          <Pressable
            onPress={onSettings}
            style={styles.settingsBtn}
            accessibilityRole="button"
            accessibilityLabel="Paramètres"
          >
            <Ionicons name="settings-outline" size={20} color={colors.inkMuted} />
          </Pressable>
        </View>
      </View>
      <View style={styles.titleRow}>
        <Text style={styles.tabName}>{title}</Text>
        <View style={styles.counter}>
          <Text style={styles.counterValue}>
            {done}/{total}
          </Text>
          <Text style={styles.counterLabel}>tâches</Text>
        </View>
      </View>
      <GradientProgressBar progress={total === 0 ? 0 : done / total} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 22,
    paddingBottom: 16,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    color: 'rgba(244, 246, 251, 0.5)',
    letterSpacing: 1.4,
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarBtn: {
    backgroundColor: 'rgba(255, 122, 92, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 122, 92, 0.5)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 16,
  },
  tabName: {
    flex: 1,
    fontFamily: fonts.displayBold,
    fontSize: 34,
    color: colors.foreground,
    letterSpacing: -1,
  },
  counter: {
    alignItems: 'flex-end',
  },
  counterValue: {
    fontFamily: fonts.displayBold,
    fontSize: 28,
    color: colors.foreground,
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.8,
  },
  counterLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(244, 246, 251, 0.5)',
    marginTop: -2,
  },
});
