import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import type { Todo } from '../types';

type Props = {
  todo: Todo;
  accent: string;
  isFirst: boolean;
  onToggle: () => void;
  onEdit?: (text: string) => void;
  onMoveToToday?: () => void;
  onDelete: () => void;
};

function isUppercaseWord(value: string) {
  const letters = value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, '');
  return letters.length > 0 && letters === letters.toUpperCase() && letters !== letters.toLowerCase();
}

function TodoText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\s+)/).map((part, index) => (
        <Text key={`${part}-${index}`} style={isUppercaseWord(part) ? styles.uppercaseWord : undefined}>
          {part}
        </Text>
      ))}
    </>
  );
}

export function TodoItem({
  todo,
  accent,
  isFirst,
  onToggle,
  onEdit,
  onMoveToToday,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);

  useEffect(() => {
    setDraft(todo.text);
  }, [todo.text]);

  const commitEdit = () => {
    const next = draft.trim() || todo.text;
    setDraft(next);
    onEdit?.(next);
    setEditing(false);
  };

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
      {editing ? (
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onBlur={commitEdit}
          onSubmitEditing={commitEdit}
          autoFocus
          selectTextOnFocus
          returnKeyType="done"
          style={[styles.text, styles.textInput, todo.completed && styles.textDone]}
          accessibilityLabel="Modifier la tâche"
        />
      ) : (
        <Pressable
          onPress={() => onEdit && setEditing(true)}
          style={styles.text}
          disabled={!onEdit}
          accessibilityHint={onEdit ? 'Appuyez pour modifier' : undefined}
        >
          <Text style={[styles.text, todo.completed && styles.textDone]} numberOfLines={3}>
            <TodoText text={todo.text} />
          </Text>
        </Pressable>
      )}
      {onMoveToToday ? (
        <Pressable
          onPress={onMoveToToday}
          style={[styles.moveBtn, { borderColor: accent }]}
          accessibilityLabel="Remettre dans Aujourd’hui"
        >
          <Text style={[styles.moveText, { color: accent }]}>Aujourd’hui</Text>
        </Pressable>
      ) : null}
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
  textInput: {
    padding: 0,
    minHeight: 22,
  },
  uppercaseWord: {
    color: colors.danger,
  },
  moveBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexShrink: 0,
  },
  moveText: {
    fontFamily: fonts.bodySemi,
    fontSize: 11,
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
