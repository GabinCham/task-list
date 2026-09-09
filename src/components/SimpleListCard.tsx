import { useState } from 'react';
import {
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  type ViewStyle,
} from 'react-native';
import { cardStyles } from '../theme/cardStyles';
import { withAlpha } from '../theme/colors';
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

const webBlur = (
  Platform.OS === 'web'
    ? {
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }
    : undefined
) as ViewStyle | undefined;

export function SimpleListCard({
  accent,
  todos,
  emptyText,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
}: Props) {
  const [draft, setDraft] = useState('');
  const [focused, setFocused] = useState(false);

  const submitTodo = () => {
    if (!onAddTodo) return;
    onAddTodo(draft);
    setDraft('');
  };

  return (
    <View
      style={[
        cardStyles.block,
        {
          backgroundColor: withAlpha(accent, 0.08),
          borderColor: withAlpha(accent, 0.15),
        },
        webBlur,
      ]}
    >
      {todos.length === 0 ? (
        <Text style={cardStyles.empty}>{emptyText}</Text>
      ) : (
        <View style={cardStyles.list}>
          {todos.map((todo, index) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              accent={accent}
              isFirst={index === 0}
              onToggle={() => onToggleTodo(todo.id)}
              onDelete={() => onDeleteTodo(todo.id)}
            />
          ))}
        </View>
      )}

      {onAddTodo ? (
        <View style={cardStyles.addRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={submitTodo}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Nouvelle tâche…"
            placeholderTextColor="rgba(244, 246, 251, 0.35)"
            style={[
              cardStyles.input,
              focused && {
                borderWidth: 1,
                borderColor: withAlpha(accent, 0.6),
              },
            ]}
            returnKeyType="done"
          />
          <Pressable
            onPress={submitTodo}
            style={[cardStyles.addBtn, { backgroundColor: accent }]}
            accessibilityRole="button"
            accessibilityLabel="Ajouter"
          >
            <Text style={cardStyles.addBtnText}>+</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
