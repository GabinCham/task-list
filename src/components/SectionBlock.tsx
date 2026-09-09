import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  type DimensionValue,
  type ViewStyle,
} from 'react-native';
import { cardStyles } from '../theme/cardStyles';
import { SECTION_THEMES, withAlpha } from '../theme/colors';
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

const webBlur = (
  Platform.OS === 'web'
    ? {
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }
    : undefined
) as ViewStyle | undefined;

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
  const [focused, setFocused] = useState(false);
  const rise = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTitleDraft(section.title);
  }, [section.title]);

  useEffect(() => {
    Animated.timing(rise, {
      toValue: 1,
      duration: 420,
      delay: 60 * (index + 1),
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: false,
    }).start();
  }, [index, rise]);

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
    <Animated.View
      style={{
        opacity: rise,
        transform: [
          {
            translateY: rise.interpolate({
              inputRange: [0, 1],
              outputRange: [18, 0],
            }),
          },
          {
            scale: rise.interpolate({
              inputRange: [0, 1],
              outputRange: [0.98, 1],
            }),
          },
        ],
      }}
    >
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
        <View style={cardStyles.header}>
          <View
            style={[
              cardStyles.dotHalo,
              { backgroundColor: withAlpha(accent, 0.15) },
            ]}
          >
            <View style={[cardStyles.dot, { backgroundColor: accent }]} />
          </View>
          {editingTitle ? (
            <TextInput
              value={titleDraft}
              onChangeText={setTitleDraft}
              onBlur={commitTitle}
              onSubmitEditing={commitTitle}
              autoFocus
              style={cardStyles.titleInput}
              maxLength={48}
              placeholder="Nom de la section"
              placeholderTextColor="rgba(244, 246, 251, 0.35)"
            />
          ) : (
            <Pressable
              onLongPress={() => setEditingTitle(true)}
              style={cardStyles.titleWrap}
              accessibilityHint="Appui long pour renommer"
            >
              <Text style={cardStyles.title} numberOfLines={2}>
                {section.title}
              </Text>
            </Pressable>
          )}
          <Text style={cardStyles.count}>
            {done}/{total}
          </Text>
        </View>

        <View style={cardStyles.progressTrack}>
          <View
            style={[
              cardStyles.progressFill,
            {
              width: `${progress * 100}%` as DimensionValue,
              backgroundColor: accent,
              ...(Platform.OS === 'web'
                ? { transitionProperty: 'width', transitionDuration: '500ms' }
                : null),
            },
            ]}
          />
        </View>

        {section.todos.length > 0 ? (
          <View style={cardStyles.list}>
            {section.todos.map((todo, todoIndex) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                accent={accent}
                isFirst={todoIndex === 0}
                onToggle={() => onToggleTodo(todo.id)}
                onDelete={() => onDeleteTodo(todo.id)}
              />
            ))}
          </View>
        ) : null}

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
            accessibilityLabel={`Nouvelle tâche dans ${section.title}`}
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
      </View>
    </Animated.View>
  );
}
