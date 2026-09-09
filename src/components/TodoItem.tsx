import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import type { Todo } from '../types';

type Props = {
  todo: Todo;
  accent: string;
  showDivider: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

export function TodoItem({
  todo,
  accent,
  showDivider,
  onToggle,
  onDelete,
}: Props) {
  return (
    <View style={[styles.row, showDivider && styles.divider]}>
      <Pressable
        onPress={onToggle}
        style={[
          styles.check,
          { borderColor: todo.completed ? accent : colors.checkIdle },
          todo.completed && { backgroundColor: accent },
        ]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: todo.completed }}
        hitSlop={8}
      >
        {todo.completed ? <Text style={styles.checkMark}>✓</Text> : null}
      </Pressable>
      <Text
        style={[styles.text, todo.completed && styles.textDone]}
        numberOfLines={3}
      >
        {todo.text}
      </Text>
      <Pressable onPress={onDelete} hitSlop={10} accessibilityLabel="Supprimer">
        <Text style={styles.delete}>×</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkMark: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    marginTop: -1,
  },
  text: {
    flex: 1,
    color: colors.white,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  textDone: {
    color: colors.completed,
    textDecorationLine: 'line-through',
  },
  delete: {
    color: colors.inkMuted,
    fontSize: 20,
    lineHeight: 20,
    paddingHorizontal: 4,
  },
});
