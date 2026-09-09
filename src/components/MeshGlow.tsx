import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, withAlpha } from '../theme/colors';

type Props = {
  accent: string;
};

const blur = (amount: number): ViewStyle | undefined =>
  Platform.OS === 'web'
    ? ({ filter: `blur(${amount}px)` } as ViewStyle)
    : undefined;

const webFade =
  Platform.OS === 'web'
    ? ({
        transitionProperty: 'background-color',
        transitionDuration: '420ms',
      } as ViewStyle)
    : undefined;

function mixTowardBlack(hex: string, amount: number): string {
  const raw = hex.replace('#', '');
  if (raw.length !== 6) return colors.background;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  const mix = (channel: number) =>
    Math.round(channel * (1 - amount) + 11 * amount);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

export function MeshGlow({ accent }: Props) {
  return (
    <View pointerEvents="none" style={styles.wrap}>
      <LinearGradient
        colors={[mixTowardBlack(accent, 0.55), colors.background, '#08090e']}
        locations={[0, 0.42, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          styles.orb,
          styles.orbMain,
          { backgroundColor: withAlpha(accent, 0.42) },
          webFade,
          blur(90),
        ]}
      />
      <View
        style={[
          styles.orb,
          styles.orbMid,
          { backgroundColor: withAlpha(accent, 0.16) },
          webFade,
          blur(80),
        ]}
      />
      <View
        style={[
          styles.orb,
          styles.orbSoft,
          { backgroundColor: withAlpha(accent, 0.12) },
          webFade,
          blur(100),
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  orbMain: {
    top: -110,
    left: -90,
    width: 380,
    height: 320,
  },
  orbMid: {
    top: 120,
    right: -140,
    width: 260,
    height: 260,
  },
  orbSoft: {
    bottom: -40,
    left: 40,
    width: 280,
    height: 280,
  },
});
