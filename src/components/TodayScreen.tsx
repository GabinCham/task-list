import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TODAY_COLOR, type LeftoverDay, type Todo } from '../types';
import { todayHeaderLabel } from '../utils/dates';
import { PinnedSettingsModal } from './PinnedSettingsModal';
import { ScheduleTaskModal } from './ScheduleTaskModal';
import { ScreenHeader } from './ScreenHeader';
import { SimpleListCard } from './SimpleListCard';

type Props = {
  todos: Todo[];
  onAddTodo: (text: string) => void;
  onToggleTodo: (todoId: string) => void;
  onUpdateTodo: (todoId: string, text: string) => void;
  onDeleteTodo: (todoId: string) => void;
  onOpenLeftovers: () => void;
  onAddScheduledTodo: (date: string, text: string) => void;
  scheduledDays: LeftoverDay[];
  onResetAll: () => void;
};

export function TodayScreen({
  todos,
  onAddTodo,
  onToggleTodo,
  onUpdateTodo,
  onDeleteTodo,
  onOpenLeftovers,
  onAddScheduledTodo,
  scheduledDays,
  onResetAll,
}: Props) {
  const insets = useSafeAreaInsets();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const done = todos.filter((todo) => todo.completed).length;

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <ScreenHeader
        kicker={todayHeaderLabel()}
        title="Aujourd’hui"
        done={done}
        total={todos.length}
        onSettings={() => setSettingsOpen(true)}
        onCalendar={() => setScheduleOpen(true)}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SimpleListCard
          accent={TODAY_COLOR}
          todos={todos}
          emptyText="Rien pour aujourd’hui. Ajoute ce que tu veux faire, peu importe le thème."
          onAddTodo={onAddTodo}
          onToggleTodo={onToggleTodo}
          onUpdateTodo={onUpdateTodo}
          onDeleteTodo={onDeleteTodo}
        />
        {todos.length === 0 ? (
          <View style={styles.emptyActions}>
            <Pressable
              onPress={onOpenLeftovers}
              style={styles.leftoversButton}
              accessibilityLabel="Voir les tâches non faites"
            >
              <Text style={styles.leftoversButtonText}>Voir les tâches non faites de la veille →</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
      <PinnedSettingsModal
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onResetAll={onResetAll}
      />
      <ScheduleTaskModal
        visible={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        onAdd={onAddScheduledTodo}
        scheduledDays={scheduledDays}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 28,
    paddingTop: 8,
  },
  leftoversButton: {
    alignSelf: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(184, 146, 255, 0.55)',
    backgroundColor: 'rgba(184, 146, 255, 0.12)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftoversButtonText: {
    color: '#c9adff',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyActions: {
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },
});
