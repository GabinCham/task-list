import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { TabIconName, TabList } from '../types';
import { todayHeaderLabel } from '../utils/dates';
import { CustomizeTabModal } from './CustomizeTabModal';
import { ScreenHeader } from './ScreenHeader';
import { SectionBlock } from './SectionBlock';

type Props = {
  tab: TabList;
  canDelete: boolean;
  onUpdateTab: (updates: {
    name?: string;
    icon?: TabIconName;
    color?: string;
  }) => void;
  onUpdateSectionTitle: (sectionId: string, title: string) => void;
  onAddTodo: (sectionId: string, text: string) => void;
  onToggleTodo: (sectionId: string, todoId: string) => void;
  onDeleteTodo: (sectionId: string, todoId: string) => void;
  onResetAll: () => void;
  onDeleteTab: () => void;
};

export function TabScreen({
  tab,
  canDelete,
  onUpdateTab,
  onUpdateSectionTitle,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onResetAll,
  onDeleteTab,
}: Props) {
  const insets = useSafeAreaInsets();
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const { done, total } = useMemo(() => {
    const todos = tab.sections.flatMap((section) => section.todos);
    return {
      total: todos.length,
      done: todos.filter((todo) => todo.completed).length,
    };
  }, [tab.sections]);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <ScreenHeader
        kicker={todayHeaderLabel()}
        title={tab.name}
        done={done}
        total={total}
        onSettings={() => setCustomizeOpen(true)}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {tab.sections.map((section, index) => (
          <SectionBlock
            key={section.id}
            section={section}
            index={index}
            onRename={(title) => onUpdateSectionTitle(section.id, title)}
            onAddTodo={(text) => onAddTodo(section.id, text)}
            onToggleTodo={(todoId) => onToggleTodo(section.id, todoId)}
            onDeleteTodo={(todoId) => onDeleteTodo(section.id, todoId)}
          />
        ))}
      </ScrollView>

      <CustomizeTabModal
        tab={tab}
        visible={customizeOpen}
        canDelete={canDelete}
        onClose={() => setCustomizeOpen(false)}
        onSave={onUpdateTab}
        onResetAll={onResetAll}
        onDeleteTab={onDeleteTab}
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
});
