import { StyleSheet, View, type DimensionValue } from 'react-native';
import { PROGRESS_STOPS } from '../theme/colors';

type Props = {
  progress: number;
  height?: number;
};

export function GradientProgressBar({ progress, height = 6 }: Props) {
  const clamped = Math.min(1, Math.max(0, progress));
  const remaining = `${(1 - clamped) * 100}%` as DimensionValue;

  return (
    <View style={[styles.track, { height, borderRadius: height }]}>
      <View style={styles.gradient}>
        {PROGRESS_STOPS.map((stop) => (
          <View key={stop} style={[styles.stop, { backgroundColor: stop }]} />
        ))}
      </View>
      {clamped < 1 ? (
        <View style={[styles.mask, { width: remaining, height }]} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
    backgroundColor: '#2A2A32',
    width: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
  },
  stop: {
    flex: 1,
  },
  mask: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#2A2A32',
  },
});
