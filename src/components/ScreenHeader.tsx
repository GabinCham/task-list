import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { GradientProgressBar } from './GradientProgressBar';

type Props = {
  kicker: string;
  title: string;
  done: number;
  total: number;
  onSettings: () => void;
};

export function ScreenHeader({ kicker, title, done, total, onSettings }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <Text style={styles.date}>{kicker}</Text>
        <Pressable
          onPress={onSettings}
          style={styles.settingsBtn}
          accessibilityRole="button"
          accessibilityLabel="Paramètres"
        >
          <Ionicons name="settings-outline" size={20} color={colors.inkMuted} />
        </Pressable>
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
    fontSize: 12,
    fontWeight: '700',
    color: colors.inkMuted,
    letterSpacing: 1.4,
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 16,
  },
  tabName: {
    flex: 1,
    fontSize: 34,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -1,
  },
  counter: {
    alignItems: 'flex-end',
  },
  counterValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.8,
  },
  counterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.inkMuted,
    marginTop: -2,
  },
});
