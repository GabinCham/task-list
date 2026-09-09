import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import type { Todo } from '../types';

type Props = {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
};

export function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={onToggle}
        style={[styles.check, todo.completed && styles.checkDone]}
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
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  checkDone: {
    backgroundColor: colors.accent,
  },
  checkMark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    marginTop: -1,
  },
  text: {
    flex: 1,
    color: colors.ink,
    fontSize: 16,
    lineHeight: 22,
  },
  textDone: {
    color: colors.completed,
    textDecorationLine: 'line-through',
  },
  delete: {
    color: colors.danger,
    fontSize: 26,
    lineHeight: 26,
    paddingHorizontal: 4,
  },
});
