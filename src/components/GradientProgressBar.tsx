import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type DimensionValue } from 'react-native';
import { PROGRESS_STOPS } from '../theme/colors';

type Props = {
  progress: number;
  height?: number;
};

export function GradientProgressBar({ progress, height = 8 }: Props) {
  const clamped = Math.min(1, Math.max(0, progress));

  return (
    <View style={[styles.track, { height, borderRadius: height }]}>
      {clamped > 0 ? (
        <LinearGradient
          colors={[
            PROGRESS_STOPS[0],
            PROGRESS_STOPS[1],
            PROGRESS_STOPS[2],
            PROGRESS_STOPS[3],
          ]}
          locations={[0, 0.28, 0.62, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[
            styles.fill,
            {
              width: `${Math.round(clamped * 1000) / 10}%` as DimensionValue,
              height,
              borderRadius: height,
            },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    width: '100%',
  },
  fill: {
    shadowColor: '#ff7a5c',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.65,
    shadowRadius: 8,
  },
});
