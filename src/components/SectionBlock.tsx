import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type DimensionValue,
} from 'react-native';
import { colors, SECTION_THEMES, withAlpha } from '../theme/colors';
import type { Section } from '../types';
import { TodoItem } from './TodoItem';

type Props = {
  section: Section;
  index: number;
  onRename: (title: string) => void;
  onAddTodo: (text: string) => void;
  onToggleTodo: (todoId: string) => void;
  onDeleteTodo: (todoId: string) => void;
};

export function SectionBlock({
  section,
  index,
  onRename,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
}: Props) {
  const accent = SECTION_THEMES[index % SECTION_THEMES.length].accent;
  const [draft, setDraft] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(section.title);

  useEffect(() => {
    setTitleDraft(section.title);
  }, [section.title]);

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

  const total = section.todos.length;
  const done = section.todos.filter((todo) => todo.completed).length;
  const progress = total === 0 ? 0 : done / total;

  return (
    <View
      style={[
        styles.block,
        {
          borderColor: withAlpha(accent, 0.22),
          shadowColor: accent,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.dot, { backgroundColor: accent }]} />
        {editingTitle ? (
          <TextInput
            value={titleDraft}
            onChangeText={setTitleDraft}
            onBlur={commitTitle}
            onSubmitEditing={commitTitle}
            autoFocus
            style={styles.titleInput}
            maxLength={48}
            placeholder="Nom de la section"
            placeholderTextColor={colors.inkMuted}
          />
        ) : (
          <Pressable
            onLongPress={() => setEditingTitle(true)}
            style={styles.titleWrap}
            accessibilityHint="Appui long pour renommer"
          >
            <Text style={styles.title} numberOfLines={2}>
              {section.title}
            </Text>
          </Pressable>
        )}
        <Text style={styles.count}>
          {done}/{total}
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progress * 100}%` as DimensionValue,
              backgroundColor: accent,
            },
          ]}
        />
      </View>

      {section.todos.map((todo, todoIndex) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          accent={accent}
          showDivider={todoIndex < section.todos.length - 1}
          onToggle={() => onToggleTodo(todo.id)}
          onDelete={() => onDeleteTodo(todo.id)}
        />
      ))}

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.2,
  },
  titleInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    paddingVertical: 0,
  },
  count: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.inkMuted,
  },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: '#2A2A32',
    marginTop: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
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
