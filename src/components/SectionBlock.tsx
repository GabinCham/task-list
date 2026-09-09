import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import type { Section } from '../types';
import { TodoItem } from './TodoItem';

type Props = {
  section: Section;
  onRename: (title: string) => void;
  onAddTodo: (text: string) => void;
  onToggleTodo: (todoId: string) => void;
  onDeleteTodo: (todoId: string) => void;
};

export function SectionBlock({
  section,
  onRename,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
}: Props) {
  const [draft, setDraft] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(section.title);

  const submitTodo = () => {
    onAddTodo(draft);
    setDraft('');
  };

  const commitTitle = () => {
    const next = titleDraft.trim() || section.title;
    setTitleDraft(next);
    onRename(next);
    setEditingTitle(false);
  };

  return (
    <View style={styles.block}>
      {editingTitle ? (
        <TextInput
          value={titleDraft}
          onChangeText={setTitleDraft}
          onBlur={commitTitle}
          onSubmitEditing={commitTitle}
          autoFocus
          style={styles.titleInput}
          maxLength={40}
          placeholder="Nom de la section"
          placeholderTextColor={colors.inkMuted}
        />
      ) : (
        <Pressable onLongPress={() => setEditingTitle(true)}>
          <Text style={styles.title}>{section.title}</Text>
          <Text style={styles.hint}>Appui long pour renommer</Text>
        </Pressable>
      )}

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
          style={[styles.addBtn, !draft.trim() && styles.addBtnDisabled]}
          disabled={!draft.trim()}
        >
          <Text style={styles.addBtnText}>Ajouter</Text>
        </Pressable>
      </View>

      {section.todos.length === 0 ? (
        <Text style={styles.empty}>Aucune tâche pour l’instant.</Text>
      ) : (
        section.todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => onToggleTodo(todo.id)}
            onDelete={() => onDeleteTodo(todo.id)}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -0.3,
  },
  hint: {
    marginTop: 2,
    marginBottom: 12,
    fontSize: 12,
    color: colors.inkMuted,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.ink,
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
    marginBottom: 12,
    paddingVertical: 4,
  },
  addRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addBtn: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  addBtnDisabled: {
    opacity: 0.45,
  },
  addBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  empty: {
    marginTop: 8,
    color: colors.inkMuted,
    fontSize: 14,
  },
});
