import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { TODAY_COLOR, type Todo } from '../types';
import { todayHeaderLabel } from '../utils/dates';
import { PinnedSettingsModal } from './PinnedSettingsModal';
import { ScreenHeader } from './ScreenHeader';
import { SimpleListCard } from './SimpleListCard';

type Props = {
  todos: Todo[];
  onAddTodo: (text: string) => void;
  onToggleTodo: (todoId: string) => void;
  onDeleteTodo: (todoId: string) => void;
  onResetAll: () => void;
};

export function TodayScreen({
  todos,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onResetAll,
}: Props) {
  const insets = useSafeAreaInsets();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const done = todos.filter((todo) => todo.completed).length;

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <ScreenHeader
        kicker={todayHeaderLabel()}
        title="Aujourd’hui"
        done={done}
        total={todos.length}
        onSettings={() => setSettingsOpen(true)}
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
          onDeleteTodo={onDeleteTodo}
        />
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
});
