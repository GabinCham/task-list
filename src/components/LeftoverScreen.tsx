import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { LEFTOVER_COLOR, type LeftoverDay } from '../types';
import { formatDayLabel } from '../utils/dates';
import { PinnedSettingsModal } from './PinnedSettingsModal';
import { ScreenHeader } from './ScreenHeader';
import { SimpleListCard } from './SimpleListCard';

type Props = {
  leftoverDays: LeftoverDay[];
  onToggleTodo: (date: string, todoId: string) => void;
  onDeleteTodo: (date: string, todoId: string) => void;
  onResetAll: () => void;
};

export function LeftoverScreen({
  leftoverDays,
  onToggleTodo,
  onDeleteTodo,
  onResetAll,
}: Props) {
  const insets = useSafeAreaInsets();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { done, total } = useMemo(() => {
    const todos = leftoverDays.flatMap((day) => day.todos);
    return {
      total: todos.length,
      done: todos.filter((todo) => todo.completed).length,
    };
  }, [leftoverDays]);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <ScreenHeader
        kicker="NON FAIT"
        title="Fais pour"
        done={done}
        total={total}
        onSettings={() => setSettingsOpen(true)}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {leftoverDays.length === 0 ? (
          <SimpleListCard
            accent={LEFTOVER_COLOR}
            todos={[]}
            emptyText="À minuit, tout ce qui n’est pas coché dans Aujourd’hui arrive ici, classé par jour."
            onToggleTodo={() => undefined}
            onDeleteTodo={() => undefined}
          />
        ) : (
          leftoverDays.map((day) => (
            <View key={day.date}>
              <Text style={styles.dayLabel}>{formatDayLabel(day.date)}</Text>
              <SimpleListCard
                accent={LEFTOVER_COLOR}
                todos={day.todos}
                emptyText="Rien pour ce jour."
                onToggleTodo={(todoId) => onToggleTodo(day.date, todoId)}
                onDeleteTodo={(todoId) => onDeleteTodo(day.date, todoId)}
              />
            </View>
          ))
        )}
      </ScrollView>
      <PinnedSettingsModal
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onResetAll={onResetAll}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 28,
    paddingTop: 8,
  },
  dayLabel: {
    color: colors.inkMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
    marginLeft: 8,
  },
});
