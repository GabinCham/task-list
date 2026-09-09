import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import type { Todo } from '../types';

type Props = {
  todo: Todo;
  accent: string;
  isFirst: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

export function TodoItem({
  todo,
  accent,
  isFirst,
  onToggle,
  onDelete,
}: Props) {
  return (
    <View style={[styles.row, !isFirst && styles.divider]}>
      <Pressable
        onPress={onToggle}
        style={[
          styles.check,
          todo.completed
            ? { backgroundColor: accent, borderColor: accent }
            : styles.checkIdle,
        ]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: todo.completed }}
        accessibilityLabel={todo.completed ? 'Marquer à faire' : 'Marquer terminée'}
      >
        {todo.completed ? <Text style={styles.checkMark}>✓</Text> : null}
      </Pressable>
      <Text
        style={[styles.text, todo.completed && styles.textDone]}
        numberOfLines={3}
      >
        {todo.text}
      </Text>
      <Pressable
        onPress={onDelete}
        style={styles.deleteBtn}
        accessibilityLabel="Supprimer la tâche"
      >
        <Text style={styles.delete}>✕</Text>
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
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIdle: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'rgba(244, 246, 251, 0.25)',
  },
  checkMark: {
    color: colors.plus,
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },
  text: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.foreground,
  },
  textDone: {
    color: 'rgba(244, 246, 251, 0.4)',
    textDecorationLine: 'line-through',
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  delete: {
    color: 'rgba(244, 246, 251, 0.3)',
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '400',
  },
});
