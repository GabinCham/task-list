import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, withAlpha } from '../theme/colors';
import type { Todo } from '../types';
import { TodoItem } from './TodoItem';

type Props = {
  accent: string;
  todos: Todo[];
  emptyText: string;
  onAddTodo?: (text: string) => void;
  onToggleTodo: (todoId: string) => void;
  onDeleteTodo: (todoId: string) => void;
};

export function SimpleListCard({
  accent,
  todos,
  emptyText,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
}: Props) {
  const [draft, setDraft] = useState('');

  const submitTodo = () => {
    if (!onAddTodo) return;
    onAddTodo(draft);
    setDraft('');
  };

  return (
    <View
      style={[
        styles.block,
        { borderColor: withAlpha(accent, 0.22), shadowColor: accent },
      ]}
    >
      {todos.length === 0 ? (
        <Text style={styles.empty}>{emptyText}</Text>
      ) : (
        todos.map((todo, index) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            accent={accent}
            showDivider={index < todos.length - 1}
            onToggle={() => onToggleTodo(todo.id)}
            onDelete={() => onDeleteTodo(todo.id)}
          />
        ))
      )}

      {onAddTodo ? (
        <View style={styles.addRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={submitTodo}
            placeholder="Nouvelle tâche…"
            placeholderTextColor={colors.inkMuted}
            style={styles.input}
            returnKeyType="done"
          />
          <Pressable
            onPress={submitTodo}
            style={[
              styles.addBtn,
              { backgroundColor: accent },
              !draft.trim() && styles.addBtnDisabled,
            ]}
            disabled={!draft.trim()}
            accessibilityRole="button"
            accessibilityLabel="Ajouter"
          >
            <Ionicons name="add" size={26} color={colors.plus} />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.surface,
    borderRadius: 32,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
  },
  empty: {
    color: colors.inkMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  addRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  input: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.white,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDisabled: {
    opacity: 0.4,
  },
});
