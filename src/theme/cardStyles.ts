import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { fonts } from './fonts';

export const cardMetrics = {
  radius: 24,
  padding: 16,
  gap: 12,
  dot: 10,
  ring: 4,
  check: 24,
  delete: 32,
  add: 44,
  inputRadius: 12,
};

export const cardStyles = StyleSheet.create({
  block: {
    borderRadius: cardMetrics.radius,
    padding: cardMetrics.padding,
    marginBottom: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dotHalo: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  titleWrap: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 18,
    letterSpacing: -0.45,
    color: colors.foreground,
  },
  titleInput: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 18,
    letterSpacing: -0.45,
    color: colors.foreground,
    paddingVertical: 0,
  },
  count: {
    marginLeft: 'auto',
    fontFamily: fonts.display,
    fontSize: 14,
    fontVariant: ['tabular-nums'],
    color: 'rgba(244, 246, 251, 0.5)',
  },
  progressTrack: {
    marginTop: 12,
    height: 4,
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  list: {
    marginTop: 12,
  },
  addRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 4,
  },
  input: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.foreground,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  addBtnText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 24,
    color: colors.plus,
    marginTop: -2,
  },
  empty: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(244, 246, 251, 0.4)',
    paddingVertical: 4,
  },
});
